import { getWorkouts, createWorkout, getWorkoutDates, updateWorkout, deleteWorkout } from '../service/database_op.js';
import { getValidatedQuery, validateWorkoutData, validateUpdateWorkoutData, handleDatabaseError } from '../utils/utils.js';

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
        console.log('Workouts:', workouts);
        res.status(200).json(workouts);
    } catch (error) {
        console.error('Error getting workouts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function getWorkoutDatesController(req, res) {
    const userId = req.params.userId;
    let query = {};
    try {
        const year = req.query.year;
        const month = req.query.month;
        if (!year || !month) {
            return res.status(400).json({ message: 'Year and month are required' });
        }
        query = {
            year: parseInt(year, 10),
            month: parseInt(month, 10)
        };
    } catch (error) {
        console.error('Error validating query:', error);
        return res.status(400).json({ message: 'Invalid query parameters' });
    }

    try {
        const workouts = await getWorkoutDates(userId, query);
        res.status(200).json(workouts);
    } catch (error) {
        return handleDatabaseError(error, res);
    }
}


export async function createWorkoutController(req, res) {
    const userId = req.params.userId;

    let workoutData;
    try {
        console.log('Request body:', req.body);
        workoutData = validateWorkoutData(req.body);
    } catch (error) {
        console.error('Error validating workout data:', error);
        return res.status(400).json({ message: 'Invalid workout data' });
    }

    try {
        const workout = await createWorkout(userId, workoutData);
        res.status(201).json(workout);
    } catch (error) {
        return handleDatabaseError(error, res);
    }
}

export async function updateWorkoutController(req, res) {
    let workoutId;
    try {
        workoutId = parseInt(req.params.workoutId, 10);
    } catch (error) {
        console.error('Error parsing workout ID:', error);
        return res.status(400).json({ message: 'Invalid workout ID' });
    }

    let workoutData;
    try {
        workoutData = validateUpdateWorkoutData(req.body);
    } catch (error) {
        console.error('Error validating workout data:', error);
        return res.status(400).json({ message: 'Invalid workout data' });
    }

    const userId = req.params.userId;
    try {
        const updatedWorkout = await updateWorkout(userId, workoutId, workoutData);
        res.status(200).json({ message: updatedWorkout });
    } catch (error) {
        return handleDatabaseError(error, res);
    }
}

export async function deleteWorkoutController(req, res) {
    let workoutId;
    try {
        workoutId = parseInt(req.params.workoutId, 10);
    } catch (error) {
        console.error('Error parsing workout ID:', error);
        return res.status(400).json({ message: 'Invalid workout ID' });
    }

    const userId = req.params.userId;
    try {
        await deleteWorkout(userId, workoutId);
        res.status(204).send();
    } catch (error) {
        return handleDatabaseError(error, res);
    }
}
