import { useState } from "react";
import toast from "react-hot-toast";
import { useExercises } from "../context/ExerciseContext";
import EditWorkoutModal from "./EditWorkoutModal";


function WorkoutExercises({ workouts, updateWorkout, deleteWorkout }) {
    const allExercises = useExercises();

    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);

    const handleEdit = (workout) => {
        setSelectedWorkout(workout);
        setModalOpen(true);
    };

    const handleSave = async (updatedData) => {
        const changedFields = {};

        for (const key in updatedData) {
            if (updatedData[key] !== selectedWorkout[key]) {
                changedFields[key] = updatedData[key];
            }
        }

        if (Object.keys(changedFields).length === 0) {
            toast.error("No changes made to the workout.");
            return;
        }

        setModalOpen(false);
        updateWorkout(updatedData.id, changedFields);
    };

    return (
        <div>
            <EditWorkoutModal
                isOpen={modalOpen}
                workout={selectedWorkout}
                onClose={() => setModalOpen(false)}
                onSave={handleSave}
            />

            <div className="grid grid-cols-1 gap-4">
                {Array.isArray(workouts) && workouts.map((workout, index) => (
                    workout &&
                    <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md relative">
                        <h3 className="text-lg font-semibold text-white">{allExercises[workout.exerciseID]?.name}</h3>
                        <p className="text-gray-400">Repetitions: {workout.repetitions}</p>
                        <p className="text-gray-400">Sets: {workout.sets}</p>
                        <p className="text-gray-400">Weight: {workout.weight} kg</p>

                        <div className="absolute top-2 right-2 flex gap-2">
                            <button
                                onClick={() => handleEdit(workout)}
                                className="text-sm px-2 py-1 rounded bg-yellow-600 hover:bg-yellow-500 text-white"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteWorkout(workout.id)}
                                className="text-sm px-2 py-1 rounded bg-red-600 hover:bg-red-500 text-white"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default WorkoutExercises;
