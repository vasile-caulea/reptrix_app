import { getWorkouts, createWorkout } from '../service/database_op.js';
import { getValidatedQuery, validateWorkoutData, handleDatabaseError } from '../utils/utils.js';

export async function getWorkoutsController(req, res) {
    const userId = req.params.userId;

    let query;
    try {
        query = getValidatedQuery(req.query);
    } catch (error) {
        console.error('Error validating query:', error);
        return res.status(400).json({ message: 'Invalid query parameters' });
    }

    try {
        const workouts = await getWorkouts(userId, query);
        res.status(200).json(workouts);
    } catch (error) {
        console.error('Error getting workouts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function createWorkoutController(req, res) {
    const userId = req.params.userId;

    let workoutData;
    try {
        workoutData = validateWorkoutData(req.body);
    } catch (error) {
        console.error('Error validating workout data:', error);
        return res.status(400).json({ message: 'Invalid workout data' });
    }

    try {
        const workout = await createWorkout(userId, workoutData);
        res.status(201).json({ message: workout });
    } catch (error) {
        if (error instanceof PrismaClientKnownRequestError) {
            return handleDatabaseError(error, res);
        } else {
            console.error('Error creating workout:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}
