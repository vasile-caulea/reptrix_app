import express from 'express';
import cors from 'cors';

import {
    getWorkoutsController,
    createWorkoutController,
    getWorkoutDatesController,
    updateWorkoutController,
    deleteWorkoutController
} from './controllers/workoutController.js';
import { verifyTokenMiddleware } from './middlewares/auth.js';

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());
app.get('/users/:userId/workouts', verifyTokenMiddleware, getWorkoutsController);
app.get('/users/:userId/workouts/dates', verifyTokenMiddleware, getWorkoutDatesController);
app.post('/users/:userId/workouts', verifyTokenMiddleware, createWorkoutController);
app.patch('/users/:userId/workouts/:workoutId', verifyTokenMiddleware, updateWorkoutController);
app.delete('/users/:userId/workouts/:workoutId', verifyTokenMiddleware, deleteWorkoutController);

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});

// import serverlessExpress from '@vendia/serverless-express';
// export const handler = serverlessExpress({ app });
