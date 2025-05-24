import { useState, useCallback } from "react";
import WorkoutStatistics from "./WorkoutsStatistics";
import { getAllWorkouts } from "../services/WorkoutManagement";
import ExerciseSelector from "./ExerciseSelector";
import ExerciseCategorySelector from "./ExerciseCategorySelector";
import { useAuthContext } from "../context/AuthContext";

function MyWorkouts() {

    const [isFetching, setIsFetching] = useState(false);
    const { logout } = useAuthContext();

    const [filters, setFilters] = useState({
        allTime: false,
        dateRange: { startDate: "", endDate: "" },
        type: "exercise",
        exercise: null,
        category: null,
    });

    const [state, setState] = useState({
        workouts: [],
        dataLoaded: false,
    });

    const handleDateChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            dateRange: { ...prev.dateRange, [name]: value },
        }));
    };

    const clearFilters = () => {
        setFilters({
            allTime: false,
            dateRange: { startDate: "", endDate: "" },
            type: "exercise",
            exercise: null,
            category: null,
        });
        setState({ workouts: [], dataLoaded: false });
    };

    const handleFilter = useCallback(async () => {

        const { allTime, dateRange, type, exercise, category } = filters;
        const { startDate, endDate } = dateRange;

        if (!allTime && (!startDate || !endDate)) {
            alert("Please select both start and end dates.");
            return;
        }

        try {

            if (!allTime && startDate > endDate) {
                alert("Start date cannot be later than end date.");
                return;
            }

            const params = {
                startDate,
                endDate,
            };

            if (type === "exercise") {
                params.exercise = exercise;
            } else {
                params.exerciseCategory = category;
            }
            setIsFetching(true);
            const allData = await getAllWorkouts(params);
            setState({
                workouts: allData.data,
                dataLoaded: true
            });
            setIsFetching(false);
        } catch (err) {
            setIsFetching(false);
            if (err.response.status === 401) {
                alert("Session expired. Please log in again.");
                await logout();
                return;
            }
            console.error("Error fetching workout data:", err);
            alert("Something went wrong... Please try again.");
        }
    }, [filters]);

    const renderResults = () => {
        if (!state.dataLoaded) return null;

        if (state.workouts.length === 0) {
            return <p className="text-white">No workouts found for the selected filters.</p>;
        }
        return <WorkoutStatistics workouts={state.workouts} />
    };

    return (
        <section className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
            <h2 className="text-xl font-bold mb-6 text-white">Here are your workout statistics &#128200;</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-6">

                <div className="bg-gray-700 p-4 rounded-lg shadow flex flex-col gap-2">
                    <label className="flex items-center gap-2 text-white">
                        <input
                            type="checkbox"
                            checked={filters.allTime}
                            onChange={(e) => setFilters({ ...filters, allTime: e.target.checked })}
                            className="accent-blue-500"
                        />
                        Show statistics for all time
                    </label>

                    {!filters.allTime && (
                        <div className="flex flex-col gap-2 mt-2">
                            {["startDate", "endDate"].map((field) => (
                                <label key={field} className="text-sm text-white">
                                    {field === "startDate" ? "Start date:" : "End date:"}
                                    <input
                                        type="date"
                                        name={field}
                                        value={filters.dateRange[field]}
                                        onChange={handleDateChange}
                                        className="w-full mt-1 p-2 rounded bg-gray-800 text-white border border-gray-600"
                                    />
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow flex flex-col gap-2">
                    <label className="text-white text-sm">Filter type:</label>
                    <select
                        value={filters.type}
                        onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        className="bg-gray-800 p-2 rounded border border-gray-600 text-white"
                    >
                        <option value="exercise">Exercise</option>
                        <option value="exerciseCategory">Exercise Category</option>
                    </select>
                </div>

                <div className="bg-gray-700 p-4 rounded-lg shadow flex flex-col gap-2">
                    <label className="text-white text-sm">
                        {filters.type === "exerciseCategory" ? "Choose category:" : "Choose exercise:"}
                    </label>
                    {filters.type === "exerciseCategory" ? (
                        <ExerciseCategorySelector
                            onSelectExerciseCategory={(category) =>
                                setFilters((prev) => ({ ...prev, category }))
                            }
                        />
                    ) : (
                        <ExerciseSelector
                            onSelectExercise={(exercise) =>
                                setFilters((prev) => ({ ...prev, exercise }))
                            }
                        />
                    )}
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <button
                    onClick={handleFilter}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-semibold"
                >
                    Show Statistics
                </button>
                <button
                    onClick={clearFilters}
                    className="bg-red-600 hover:bg-red-700 text-white rounded px-4 py-2 font-semibold"
                >
                    Reset Filters
                </button>
            </div>

            {isFetching ? <div>Fetching data...</div> : renderResults()}
        </section>
    );
}

export default MyWorkouts;
