import { useEffect, useState } from "react";
import { useExerciseCategories } from "../context/ExerciseCatgegoryContext";


function ExerciseCategorySelector({ onSelectExerciseCategory }) {

    const allExercises = useExerciseCategories();
    const [exerciseInput, setExerciseInput] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        if (!query) {
            setSuggestions([]);
            if (!exerciseInput) {
                onSelectExerciseCategory(null);
            }
            return;
        }
        const lowerQuery = query.toLowerCase();
        const filteredExercises = Object.entries(allExercises).filter(([key, value]) => value.name.toLowerCase().includes(lowerQuery));
        setSuggestions(filteredExercises);
    }, [query, allExercises]);

    return (
        <div className="relative w-full">
            <input
                type="text"
                className="p-2 rounded bg-gray-700 border border-gray-600 w-full"
                placeholder="Search for an exercise category..."
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
                                    key={exercise[0].id}
                                    className="p-2 hover:bg-gray-600 cursor-pointer"
                                    onClick={() => {
                                        setExerciseInput(exercise[1].name);
                                        onSelectExerciseCategory(exercise[1]);
                                        setQuery(null);
                                    }}
                                >
                                    {exercise[1].name}
                                </li>
                            ))
                        }
                    </ul>
                )
            }
        </div>
    );
}

export default ExerciseCategorySelector;