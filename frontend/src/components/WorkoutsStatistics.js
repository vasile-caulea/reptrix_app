import { useState, useMemo } from "react";
import { useExercises } from "../context/ExerciseContext";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
} from "recharts";

function generateColor() {
    const index = Math.floor(Math.random() * 360);
    const hue = (index * 137.508) % 360;
    return `hsl(${hue}, 90%, 45%)`;
}


function WorkoutStatistics({ workouts, displayTitle = true }) {
    const allExercises = useExercises();
    const [selectedExercise, setSelectedExercise] = useState("all");

    const allDates = useMemo(() => {
        const datesSet = new Set(workouts.map((w) => new Date(w.date).toISOString().split('T')[0]));
        return Array.from(datesSet).sort((a, b) => new Date(a) - new Date(b));
    }, [workouts]);

    const exerciseIds = useMemo(() => {
        return [...new Set(workouts.map((w) => w.exerciseID))];
    }, [workouts]);

    const colorMap = useMemo(() => {
        const map = {};
        exerciseIds.forEach((id) => {
            map[id] = generateColor();
        });
        return map;
    }, [exerciseIds]);

    const chartData = useMemo(() => {
        if (selectedExercise === "all") {
            const data = allDates.map((date) => ({ date }));
            exerciseIds.forEach((exId) => {
                data.forEach((workoutDate) => {
                    const found = workouts.find(
                        (w) =>
                            w.exerciseID === exId &&
                            new Date(w.date).toISOString().split('T')[0] === workoutDate.date
                    );
                    // for each date, set the weight of the exercise if found
                    workoutDate[exId] = found ? found.weight : null;
                });
            });
            return data;
        } else {
            return workouts
                .filter((w) => w.exerciseID.toString() === selectedExercise)
                .map((w) => ({
                    date: new Date(w.date).toISOString().split('T')[0],
                    weight: w.weight,
                }));
        }
    }, [selectedExercise, allDates, exerciseIds, workouts]);

    return (
        <div>
            {displayTitle && (
                <h2 className="text-white text-xl mb-4">Workout Statistics</h2>)}

            <select
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
                className="mb-4 p-2 rounded bg-gray-800 text-white border border-gray-600"
            >
                <option value="all">All Exercises</option>
                {exerciseIds.map((id) => (
                    <option key={id} value={id}>
                        {allExercises[id]?.name || `Exercise ${id}`}
                    </option>
                ))}
            </select>

            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    data={chartData}
                    margin={{ top: 20, right: 30, bottom: 5, left: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="date"
                        // ticks={
                        //     chartData.length > 1
                        //         ? [chartData[0]?.date, chartData[chartData.length - 1]?.date]
                        //         : undefined
                        // }
                    />
                    <YAxis
                        label={{
                            value: "Weight (kg)",
                            angle: -90,
                            position: "insideLeft",
                        }}
                    />
                    <Tooltip />

                    {selectedExercise === "all"
                        ? exerciseIds.map((exId) => (
                            <Line
                                key={exId}
                                type="monotone"
                                dataKey={exId}
                                name={allExercises[exId]?.name || `Exercise ${exId}`}
                                stroke={colorMap[exId]}
                                strokeWidth={2}
                                dot={{ r: 3 }}
                                connectNulls
                            />
                        ))
                        : (
                            <Line
                                type="monotone"
                                dataKey="weight"
                                name={allExercises[selectedExercise]?.name || `Exercise ${selectedExercise}`}
                                stroke={colorMap[selectedExercise]}
                                strokeWidth={2}
                                dot={{ r: 4 }}
                            />
                        )}
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default WorkoutStatistics;
