import { useState } from "react";

import ExerciseSelector from "./ExerciseSelector";
import { addWorkout } from "../services/WorkoutManangement";

function AddWorkout() {

    const [exerciseInput, setExerciseInput] = useState(null);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        exercise: null,
        repetitions: null,
        sets: null,
        weight: null
    });

    const handleChange = ({ target }) => setFormData({ ...formData, [target.name]: target.value });

    const handleAddWorkout = async (e) => {
        e.preventDefault();
        console.log(exerciseInput);

        if (!exerciseInput) {
            alert("Please select an exercise.");
            return;
        }

        if (!formData.date || !formData.repetitions || !formData.sets) {
            alert("Please fill in all required fields.");
            return;
        }

        try {
            const response = await addWorkout({
                date: formData.date,
                exercise: exerciseInput[0],
                repetitions: formData.repetitions,
                sets: formData.sets,
                weight: formData.weight
            });

            if (response.status === 201) {
                console.log("Workout added successfully:", response.data);
                alert("Workout added successfully!");
            } else {
                console.error("Error adding workout:", response.statusText);
                alert("Error adding workout. Please try again.");
            }

        } catch (error) {
            console.error("Error adding workout:", error);
            alert(error.message);
        }
    }

    const inputStyleClass = "p-2 rounded bg-gray-700 border border-gray-600";

    return (
        <section className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
            <h2 className="text-xl font-bold mb-4">Add an Workout</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleAddWorkout}>
                <input type="date" name="date" className={inputStyleClass} value={formData.date} onChange={handleChange} />

                <ExerciseSelector onSelectExercise={(exercise) => setExerciseInput(exercise)} />

                <input type="number" name="sets" onChange={handleChange} placeholder="Sets" className={inputStyleClass} required />
                <input type="number" name="repetitions" onChange={handleChange} placeholder="Repetitions" className={inputStyleClass} required />
                <input type="number" name="weight" onChange={handleChange} placeholder="Weight (kg)" className={inputStyleClass} />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2">Add</button>
            </form>
        </section>
    );
}

export default AddWorkout;