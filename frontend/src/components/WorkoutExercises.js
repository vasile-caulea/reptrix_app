import { useState } from "react";
import { useExercises } from "../context/ExerciseContext";

function WorkoutExercises({ workouts, onEdit, onDelete }) {
    const allExercises = useExercises();
    const [editingWorkoutId, setEditingWorkoutId] = useState(null);
    const [editForm, setEditForm] = useState({
        repetitions: "",
        sets: "",
        weight: "",
    });

    const startEditing = (workout) => {
        setEditingWorkoutId(workout.id);
        setEditForm({
            repetitions: workout.repetitions,
            sets: workout.sets,
            weight: workout.weight,
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = (e, workout) => {
        e.preventDefault();
        const updatedWorkout = {
            ...workout,
            repetitions: Number(editForm.repetitions),
            sets: Number(editForm.sets),
            weight: Number(editForm.weight),
        };
        onEdit(updatedWorkout);
        setEditingWorkoutId(null);
    };

    const cancelEdit = () => {
        setEditingWorkoutId(null);
    };

    const editFormUI = (workout) => {
        return (
            <form onSubmit={(e) => handleEditSubmit(e, workout)} className="space-y-2">
                <h3 className="text-lg font-semibold text-white">
                    {allExercises[workout.exerciseID]?.name || "Unknown Exercise"}
                </h3>
                <input
                    type="number"
                    name="repetitions"
                    value={editForm.repetitions}
                    onChange={handleEditChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="Repetitions"
                    required
                />
                <input
                    type="number"
                    name="sets"
                    value={editForm.sets}
                    onChange={handleEditChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="Sets"
                    required
                />
                <input
                    type="number"
                    name="weight"
                    value={editForm.weight}
                    onChange={handleEditChange}
                    className="w-full p-2 rounded bg-gray-700 text-white"
                    placeholder="Weight (kg)"
                    required
                />
                <div className="flex justify-end space-x-2 pt-2">
                    <button type="submit" className="text-sm text-green-400 hover:underline">
                        Save
                    </button>
                    <button type="button" onClick={cancelEdit} className="text-sm text-red-400 hover:underline">
                        Cancel
                    </button>
                </div>
            </form>
        )
    }

    const workoutCard = (workout) => {
        return (
            <>
                <h3 className="text-lg font-semibold text-white">
                    {allExercises[workout.exerciseID]?.name || "Unknown Exercise"}
                </h3>
                <p className="text-gray-400">Repetitions: {workout.repetitions}</p>
                <p className="text-gray-400">Sets: {workout.sets}</p>
                <p className="text-gray-400">Weight: {workout.weight} kg</p>
                <div className="flex justify-end mt-2 space-x-2">
                    <button
                        onClick={() => startEditing(workout)}
                        className="text-sm text-blue-400 hover:underline"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(workout.id)}
                        className="text-sm text-red-400 hover:underline"
                    >
                        Delete
                    </button>
                </div>
            </>
        );
    }

    return (
        <div>
            <div className="grid grid-cols-1 gap-4">
                {Array.isArray(workouts) &&
                    workouts.map((workout, index) => {
                        const isEditing = editingWorkoutId === workout.id;
                        return (
                            <div key={workout.id || index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                                {isEditing ? (
                                    editFormUI(workout)
                                ) : (
                                    workoutCard(workout)
                                )}
                            </div>
                        );
                    })}
            </div >
        </div >
    );
}

export default WorkoutExercises;
