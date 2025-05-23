
import { useExercises } from "../context/ExerciseContext";

function Workout({ workouts }) {
    const allExercises = useExercises();
    console.log(workouts);
    return (
        <div>
            <h2 className="text-xl font-bold mb-4 text-white">Here are your Workouts</h2>
            <div className="grid grid-cols-1 gap-4">
                {Array.isArray(workouts) &&  workouts.map((workout, index) => (
                    <div key={index} className="bg-gray-800 p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold text-white">{allExercises[workout.exerciseID].name}</h3>
                        <p className="text-gray-400">Date: {new Date(workout.date).toLocaleDateString()}</p>
                        <p className="text-gray-400">Repetitions: {workout.repetitions}</p>
                        <p className="text-gray-400">Sets: {workout.sets}</p>
                        <p className="text-gray-400">Weight: {workout.weight} kg</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Workout;