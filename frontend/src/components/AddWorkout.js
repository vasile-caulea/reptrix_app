import { useState } from "react";
import toast from "react-hot-toast";

import ExerciseSelector from "./ExerciseSelector";
import { addWorkout, updateWorkout, deleteWorkout } from "../services/WorkoutManagement";
import WorkoutExercises from "./WorkoutExercises";

function AddWorkout() {

    const [exerciseInput, setExerciseInput] = useState(null);
    const [formData, setFormData] = useState({
        date: new Date().toISOString().split('T')[0],
        exercise: null,
        repetitions: null,
        sets: null,
        weight: null
    });

    const [workouts, setWorkouts] = useState([]);

    const handleChange = ({ target }) => setFormData({ ...formData, [target.name]: target.value });

    const handleAddWorkout = async (e) => {
        e.preventDefault();

        if (!exerciseInput) {
            toast.error("Please select an exercise.");
            return;
        }

        if (!formData.date || !formData.repetitions || !formData.sets || !formData.weight) {
            toast.error("Please fill in all required fields.");
            return;
        }

        if (formData.repetitions <= 0 || formData.sets <= 0 || formData.weight < 0) {
            toast.error("Repetitions, sets must be greater than 0 and weight cannot be negative.");
            return;
        }

        try {
            toast.loading("Adding workout...");

            const result = await addWorkout({
                date: formData.date,
                exerciseId: exerciseInput.id,
                categoryId: exerciseInput.categoryID,
                repetitions: formData.repetitions,
                sets: formData.sets,
                weight: formData.weight
            });
            setWorkouts(prev => [...prev, result.data]);

            toast.dismiss();
            toast.success("Workout added successfully!");
        } catch (error) {
            if (error.response && error.response.status === 401) {
                window.location.href = "/login";
                return;
            }
            toast.dismiss();
            console.log("Error adding workout:", error);
            toast.error("Error adding workout. Please try again.");
        }
    }

    const lUpdateWorkout = (workoutId, updatedData) => {
        toast.promise(
            updateWorkout(workoutId, updatedData),
            {
                loading: "Updating workout...",
                success: () => {
                    toast.success("Workout updated successfully!");
                    setWorkouts(prev =>
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

    const ldeleteWorkout = async (workoutId) => {
        const confirmed = window.confirm("Are you sure you want to delete this workout?");
        if (!confirmed) return;

        const toastId = toast.loading("Deleting workout...");

        try {
            await deleteWorkout(workoutId);
            setWorkouts(prev => prev.filter(w => w.id !== workoutId));
            toast.success("Workout deleted successfully!", { id: toastId });
        } catch (error) {
            console.error("Error deleting workout:", error);
            toast.error("Failed to delete workout. Please try again.", { id: toastId });
        }
    };

    const inputStyleClass = "p-2 rounded bg-gray-700 border border-gray-600";

    return (
        <section className="bg-gray-800 p-6 rounded-xl shadow-xl mb-8">
            <h2 className="text-xl font-bold mb-4">Add an Workout</h2>
            <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={handleAddWorkout}>
                <input type="date" name="date" className={inputStyleClass} value={formData.date} onChange={handleChange} />

                <ExerciseSelector onSelectExercise={(exercise) => setExerciseInput(exercise)} />

                <input type="number" name="sets" onChange={handleChange} placeholder="Sets" className={inputStyleClass} required />
                <input type="number" name="repetitions" onChange={handleChange} placeholder="Repetitions" className={inputStyleClass} required />
                <input type="number" step="0.1" name="weight" onChange={handleChange} placeholder="Weight (kg)" className={inputStyleClass} required />
                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white rounded p-2">Add</button>
            </form>
            {
                workouts.length > 0 && (
                    <div className="mt-6 text-white">
                        <WorkoutExercises workouts={workouts} updateWorkout={lUpdateWorkout} deleteWorkout={ldeleteWorkout} />
                    </div>
                )
            }
        </section>
    );
}

export default AddWorkout;