import express from 'express';
import cors from 'cors';

import { getWorkouts } from './service/database_op.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;
const IDM_API_URL = process.env.IDM_API_URL || 'http://localhost:3001';

async function verifyTokenMiddleware(req, res, next) {
    next();
    return;
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const response = await fetch(IDM_API_URL + '/verify', {
            method: 'POST',
            body: JSON.stringify({ token: token, user: { id: req.params.userId } }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            return res.status(500).json({ message: 'Token verification failed' });
        }

        const data = await response.json();
        if (!data.verified) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            next();
        }
    } catch (error) {
        console.log('Error verifying token:', error);
        return res.status(500).json({ message: 'Token verification failed' });
    }

}

function getValidatedQuery(query) {
    const { startDate, endDate, exerciseCatId, exerciseId } = query;

    // Validate and parse the query parameters
    const result = {};
    const isValidDate = (d) => !isNaN(new Date(d));

    if (!startDate && endDate) {
        throw new Error('End date provided without start date');
    }

    if (exerciseCatId && exerciseId) {
        throw new Error('Both exercise category ID and exercise ID provided');
    }

    if (startDate) {
        if (isValidDate(startDate)) {
            result.startDate = new Date(startDate);
        } else {
            throw new Error('Invalid start date');
        }
    }

    if (endDate) {
        if (isValidDate(endDate)) {
            result.endDate = new Date(endDate);
        } else {
            throw new Error('Invalid end date');
        }
    }

    if (exerciseCatId) {
        result.exerciseCatId = parseInt(exerciseCatId, 10);
    }

    if (exerciseId) {
        result.exerciseId = parseInt(exerciseId, 10);
    }
    return result;
}

app.get('/users/:userId/workouts', verifyTokenMiddleware, async (req, res) => {

    const userId = req.params.userId;

    let query;
    try {
        query = getValidatedQuery(req.query);
    } catch (error) {
        console.log('Error validating query:', error);
        return res.status(400).json({ message: 'Invalid query parameters' });
    }

    // get workouts for the user
    try {
        const workouts = await getWorkouts(userId, query);
        res.status(200).json(workouts);
    } catch (error) {
        console.log('Error getting workouts:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
