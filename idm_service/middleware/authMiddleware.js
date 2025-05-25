
import { verifyToken } from '../utils/auth.js';
import { StatusCodes } from 'http-status-codes';

export function authenticateToken(req, res, next) {
    const userId = req.params.userId;
    
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing Authorization header' });
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ message: 'Token missing' });
    }

    const verification = verifyToken(userId, token);
    if (!verification.verified) {
        return res.status(StatusCodes.UNAUTHORIZED).send({ message: verification.message });
    }

    next();
}
