
import { getAllExercises } from "../services/WorkoutManangement";
import { useEffect, useState } from "react";

function ExerciseSelector({ onSelectExercise }) {
    const [exerciseInput, setExerciseInput] = useState("");
    const [allExercises, setAllExercises] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        async function fetchExercises() {
            try {
                const data = await getAllExercises();
                setAllExercises(data);
            } catch (error) {
                console.error("Error fetching exercises:", error);
            }
        }
        fetchExercises();
    }, []);

    useEffect(() => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filteredExercises = allExercises.filter((exercise) => exercise.name.toLowerCase().includes(lowerQuery));
        setSuggestions(filteredExercises);

    }, [query, allExercises]);

    return (
        <div className="relative w-full">
            <input
                type="text"
                className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
                placeholder="Search for an exercise..."
                value={exerciseInput}
                onChange={(e) => { setQuery(e.target.value); setExerciseInput(e.target.value); }}
                required
            />
            {
                query && (
                    <ul className="absolute bg-gray-800 w-full border border-gray-600 rounded mt-1 overflow-y-auto">
                        {
                            suggestions.slice(0, 10).map((exercise) => (
                                <li
                                    key={exercise.id}
                                    className="p-2 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => {
                                        setExerciseInput(exercise.name);
                                        onSelectExercise(exercise);
                                        setQuery(null);
                                    }}
                                >
                                    {exercise.name}
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    );
}

export default ExerciseSelector;