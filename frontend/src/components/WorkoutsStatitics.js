

function WorkoutsStatitics({ workouts }) {
    const totalWorkouts = workouts.length;
    const totalDuration = workouts.reduce((acc, workout) => acc + workout.duration, 0);
    const averageDuration = totalWorkouts ? (totalDuration / totalWorkouts).toFixed(2) : 0;

    return (
        <div>
            <h2>Workout Statistics</h2>
            <p>Total Workouts: {totalWorkouts}</p>
            <p>Total Duration: {totalDuration} minutes</p>
            <p>Average Duration: {averageDuration} minutes</p>
        </div>
    );
}

export default WorkoutsStatitics;