
import express from 'express';
import {
    getWorkoutsController,
    createWorkoutController,
    getWorkoutDatesController,
    updateWorkoutController,
    deleteWorkoutController
} from '../controllers/workoutController.js';
import { verifyTokenMiddleware } from '../middlewares/auth.js';

const workoutRoutes = express.Router();

workoutRoutes.get('/users/:userId/workouts', verifyTokenMiddleware, getWorkoutsController);
workoutRoutes.get('/users/:userId/workouts/dates', verifyTokenMiddleware, getWorkoutDatesController);
workoutRoutes.post('/users/:userId/workouts', verifyTokenMiddleware, createWorkoutController);
workoutRoutes.patch('/users/:userId/workouts/:workoutId', verifyTokenMiddleware, updateWorkoutController);
workoutRoutes.delete('/users/:userId/workouts/:workoutId', verifyTokenMiddleware, deleteWorkoutController);

export default workoutRoutes;
