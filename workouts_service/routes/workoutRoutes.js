
import express from 'express';
import { getWorkoutsController, createWorkoutController } from '../controllers/workoutController.js';
import { verifyTokenMiddleware } from '../middlewares/auth.js';

const workoutRoutes = express.Router();

workoutRoutes.get('/users/:userId/workouts', verifyTokenMiddleware, getWorkoutsController);
workoutRoutes.post('/users/:userId/workouts', verifyTokenMiddleware, createWorkoutController);

export default workoutRoutes;
