import { createContext, useState, useEffect, useContext } from "react";
import { getAllExercises } from "../services/WorkoutManangement";

const ExerciseContext = createContext(null);

export function ExerciseProvider({ children }) {
    const [exercises, setExercises] = useState({});

    useEffect(() => {
        async function fetchExercises() {
            try {
                const data = await getAllExercises();
                const dict = data.reduce((acc, exercise) => {
                    acc[exercise.id] = exercise.name;
                    return acc;
                }, {});
                setExercises(dict);
            } catch (err) {
                console.error("Failed to fetch exercises", err);
            }
        }
        fetchExercises();
    }, []);

    return (
        <ExerciseContext.Provider value={exercises}>
            {children}
        </ExerciseContext.Provider>
    );
}

export function useExercises() {
    return useContext(ExerciseContext);
}
