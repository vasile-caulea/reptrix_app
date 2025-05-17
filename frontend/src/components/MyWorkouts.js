
import { useState } from "react";
import Workout from "./Workout";
import WorkoutStatistics from "./WorkoutsStatitics";
import { getAllWorkouts } from "../services/WorkoutManangement";

function MyWorkouts() {

    const [allTimeFilter, setAllTimeFilter] = useState(false);
    const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
    const [workoutData, setWorkoutData] = useState([]);
    const [dataLoaded, setDataLoaded] = useState(false);
    const [onlyOneDate, setOnlyOneDate] = useState(false);

    const handleDateChange = (e) => {
        setDateRange({ ...dateRange, [e.target.name]: e.target.value });
    };

    const clearFilters = () => {
        setAllTimeFilter(false);
        setDateRange({ startDate: "", endDate: "" });
        setWorkoutData([]);
        setDataLoaded(false);
        setOnlyOneDate(false);
    }

    const handleFilter = async () => {
        if (!allTimeFilter && !dateRange.startDate) {
            alert("Please select a date range.");
            return;
        }

        try {
            if (allTimeFilter) {
                alert("Showing all time statistics.");
                const allTimeData = await getAllWorkouts();
                setWorkoutData(allTimeData);
                setDataLoaded(true);
            } else {
                console.log(dateRange);
                if (dateRange.startDate && dateRange.endDate) {
                    setOnlyOneDate(false);
                }
                if (!onlyOneDate && (dateRange.startDate > dateRange.endDate)) {
                    alert("Start date cannot be later than end date.");
                    return;
                }
                alert(`Showing statistics from ${dateRange.startDate} to ${dateRange.endDate}`);


            }
        } catch (error) {
            console.error("Error fetching workout data:", error);
            alert("Error fetching workout data. Please try again.");
        }
    }

    return (
        <section className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
            <h2 className="text-xl font-bold mb-4 text-white">Here are your Workouts</h2>

            <div className="flex gap-4 mb-4">
                <label htmlFor="allTime" className="text-white">Statistics for all time</label>
                <input
                    type="checkbox" name="allTime" id="allTime" className="text-white"
                    checked={allTimeFilter} onChange={e => setAllTimeFilter(e.target.checked)} />
            </div>

            <div className="flex gap-4 mb-4 items-center">
                <label htmlFor="startDate" className="text-white">Start date:</label>
                <input type="date" name="startDate" id="startDate"
                    value={dateRange.startDate}
                    onChange={handleDateChange}
                    className={`p-2 rounded border border-gray-600 bg-gray-700 ${allTimeFilter ? 'text-gray-400 cursor-not-allowed' : ' text-white'}`}
                    disabled={allTimeFilter} />

                <label htmlFor="endDate" className="text-white">End date:</label>
                <input type="date" name="endDate" id="endDate"
                    value={dateRange.endDate}
                    onChange={handleDateChange}
                    className={`p-2 rounded border border-gray-600 bg-gray-700 ${allTimeFilter ? 'text-gray-400 cursor-not-allowed' : ' text-white'}`}
                    disabled={allTimeFilter} />

                <button onClick={handleFilter} className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2">Show</button>
                <button onClick={clearFilters} className="bg-red-600 hover:bg-red-700 text-white rounded p-2">Clear Filter</button>
            </div>

            {
                dataLoaded && (
                    workoutData.length === 0 ? (
                        <p className="text-white">No workouts found for the selected date range.</p>
                    ) : (
                        onlyOneDate ? (
                            <Workout workoutData/>
                        ) : (
                            <WorkoutStatistics workoutData/>
                        )
                    )
                )
            }
        </section >
    )
}

export default MyWorkouts;
