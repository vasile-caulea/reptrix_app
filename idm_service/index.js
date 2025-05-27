import express from 'express';
import { signup } from './service/register.js';
import { signin } from './service/signin.js';
import { verify } from './service/verify.js';
import { getUser, updateUser } from './service/profile.js';
import {authenticateToken} from './middleware/authMiddleware.js';
import cors from 'cors';

const app = express();
app.use(cors())
app.use(express.json());

const port = 3001;


app.post('/signup', async (req, res) => {
    console.log('Request Body:', req.body);
    const reqBody = req.body;
    const response = await signup(reqBody);
    console.log('Response:', response);
    res.status(response.statusCode.valueOf()).send(response.body);
});

app.post('/signin', async (req, res) => {
    console.log('Request Body:', req.body);
    const reqBody = req.body;
    try {
        const response = await signin(reqBody);
        res.status(response.statusCode).send(response.body);
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.post('/verify', async (req, res) => {
    console.log('Request Body:', req.body);
    const reqBody = req.body;
    const response = await verify(reqBody);
    res.status(response.statusCode).send(response.body);
});

app.get('/users/:userId',  authenticateToken, async (req, res) => {
    const userId = req.params.userId;
    try {
        const response = await getUser(userId);
        res.status(response.statusCode).send(response.body);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

app.patch('/users/:userId', authenticateToken, async (req, res) => {
    const userId = req.params.userId;
    try {
        const response = await updateUser(userId, req.body);
        res.status(response.statusCode).send(response.body);
    } catch (error) {
        res.status(500).send({ message: 'Internal server error' });
    }
});

import serverlessExpress from '@vendia/serverless-express';
export const handler = serverlessExpress({ app });
