import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { getWorkoutsForMonth, getAllWorkouts, updateWorkout, deleteWorkout } from "../services/WorkoutManagement";
import { daysOfWeek, getFormattedDate, monthNames, getDaysInMonth, getFirstDayOfMonth } from "../services/Utils";
import WorkoutExercises from "./WorkoutExercises";

const WorkoutCalendar = () => {
    const today = new Date();
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth());
    const [workoutDates, setWorkoutDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [exercisesForDay, setExercisesForDay] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isNextMonthDisabled, setIsNextMonthDisabled] = useState(today.getMonth() === month);

    useEffect(() => {
        async function fetchWorkoutDates() {
            setLoading(true);
            try {
                const dates = await getWorkoutsForMonth(year, month + 1);
                setWorkoutDates(dates.data.map(date => date.date.split('T')[0]));
            } catch (err) {
                console.error("Error fetching workout dates:", err);
                if (err.response && err.response.status === 401) {
                    window.location.href = "/login";
                }
            } finally {
                setLoading(false);
                setSelectedDate(null);
                setExercisesForDay([]);
            }
        }
        fetchWorkoutDates();
    }, [year, month]);

    const calendarCells = [];
    for (let i = 0; i < getFirstDayOfMonth(year, month); i++) {
        calendarCells.push(<div key={`empty-${i}`} className="text-white"> </div>);
    }

    for (let day = 1; day <= getDaysInMonth(year, month); day++) {
        const dateStr = getFormattedDate(year, month, day);
        const hasWorkout = workoutDates.includes(dateStr);
        calendarCells.push(
            <div
                key={day}
                disabled={hasWorkout}
                className={`p-2 text-center rounded 
                    ${hasWorkout ? "bg-blue-600 cursor-pointer hover:bg-blue-500" : "bg-gray-700 cursor-default"} ${selectedDate === dateStr ? "ring-2 ring-blue-400" : ""}`}
                onClick={() => { if (!hasWorkout) return; handleDayClick(day); }}
            >
                {day}
            </div>
        );
    }

    const handlePrevMonth = () => {
        setIsNextMonthDisabled(false);
        setMonth((prev) => (prev === 0 ? 11 : prev - 1));
        if (month === 0) setYear((y) => y - 1);
    };

    const handleNextMonth = () => {
        setMonth((prev) => (prev === 11 ? 0 : prev + 1));
        if (month >= today.getMonth() - 1 && year >= today.getFullYear()) {
            setIsNextMonthDisabled(true);
        }
        if (month === 11) setYear((y) => y + 1);
    };

    const handleMonthChange = (value) => {
        if (value > today.getMonth() && year === today.getFullYear()) return;
        setMonth(value);
    }

    const handleYearChange = (value) => {
        if (value === today.getFullYear() && month > today.getMonth()) {
            setMonth(today.getMonth());
        }
        setYear(value);
    }

    const handleDayClick = async (day) => {
        setExercisesForDay([]);
        const formatted = getFormattedDate(year, month, day);
        setSelectedDate(formatted);
        try {
            setLoading(true);
            const data = await getAllWorkouts({ startDate: formatted });
            setExercisesForDay(data.data);
        } catch (err) {
            console.error("Error fetching exercises:", err);
        } finally {
            setLoading(false);
        }
    };

    const lUpdateWorkout = (workoutId, updatedData) => {
        toast.promise(
            updateWorkout(workoutId, updatedData),
            {
                loading: "Updating workout...",
                success: () => {
                    toast.success("Workout updated successfully!");
                    setExercisesForDay(prev =>
                        prev.map(w => w.id === workoutId ? { ...w, ...updatedData } : w)
                    );
                },
                error: (error) => {
                    console.error("Error updating workout:", error);
                    return "Failed to update workout. Please try again.";
                }
            }
        );
    }

    const ldeleteWorkout = (workoutId) => {
        const confirmed = window.confirm("Are you sure you want to delete this workout?");
        if (confirmed) {
            toast.promise(
                deleteWorkout(workoutId),
                {
                    loading: "Deleting workout...",
                    success: () => {
                        setExercisesForDay(prev => prev.filter(w => w.id !== workoutId));
                        if (exercisesForDay.length === 0) {
                            setSelectedDate(null);
                        }
                        return "Workout deleted successfully!";
                    },
                    error: (error) => {
                        console.error("Error deleting workout:", error);
                        return "Failed to delete workout. Please try again.";
                    }
                }
            );
        }
    }

    return (
        <div className="bg-gray-900 p-6 rounded-2xl shadow-2xl max-w-2xl mx-auto">
            <h2 className="text-white text-2xl font-bold text-center mb-4">
                {monthNames[month]} {year}
            </h2>

            <div className="flex justify-between items-center mb-4 gap-4">
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded" onClick={handlePrevMonth}>Prev</button>

                <div className="flex items-center space-x-2">
                    <select className="bg-gray-800 text-white p-2 rounded" value={month} onChange={(e) => handleMonthChange(e.target.value)}>
                        {monthNames.map((name, idx) => (
                            <option key={idx} value={idx}>{name}</option>
                        ))}
                    </select>

                    <input type="number" className="bg-gray-800 text-white p-2 rounded w-20" value={year} onChange={(e) => handleYearChange(e.target.value)} />
                </div>

                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded disabled:bg-gray-500" disabled={isNextMonthDisabled}
                    onClick={handleNextMonth}>Next</button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-white text-sm font-semibold text-center mb-2">
                {daysOfWeek.map((day, idx) => (
                    <div key={day} className={`${idx === 0 || idx === 6 ? "text-lime-400" : ""}`}>{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {calendarCells}
            </div>

            {loading ? (
                <p className="text-white mt-4">Loading...</p>
            ) : (
                selectedDate && (
                    <div className="mt-6 text-white">
                        <h1 className="font-bold mb-2 text-xl">Exercises on {selectedDate}</h1>
                        {
                            exercisesForDay.length > 0 ? (
                                <WorkoutExercises workouts={exercisesForDay} updateWorkout={lUpdateWorkout} deleteWorkout={ldeleteWorkout} />
                            ) : (
                                <p>No exercises found for this day.</p>
                            )
                        }
                    </div>
                )
            )}
        </div>
    );
};

export default WorkoutCalendar;
