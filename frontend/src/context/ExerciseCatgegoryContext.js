import { createContext, useState, useEffect, useContext } from "react";
import { getAllExerciseCategories } from "../services/WorkoutManagement";

const ExerciseCategoryContext = createContext();

export function ExerciseCategoryProvider({ children }) {

    const [exerciseCategories, setExerciseCategories] = useState({});

    useEffect(() => {
        async function fetchExerciseCategories() {
            try {
                const data = await getAllExerciseCategories();
                setExerciseCategories(data);
            } catch (err) {
                console.error("Failed to fetch exercise categories", err);
            }
        }
        fetchExerciseCategories();
    }, []);

    return (
        <ExerciseCategoryContext.Provider value={exerciseCategories}>
            {children}
        </ExerciseCategoryContext.Provider>
    );
}

export function useExerciseCategories() {
    return useContext(ExerciseCategoryContext);
}
