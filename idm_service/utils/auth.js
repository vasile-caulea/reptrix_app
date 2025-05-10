import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export function generateToken(user) {
    return jwt.sign(user, JWT_SECRET, {
        expiresIn: '1h',
    });
}

export function verifyToken(userId, token) {
    return jwt.verify(token, JWT_SECRET, (err, response) => {
        if (err) {
            return {
                verified: false,
                message: 'Invalid token'
            }
        }
        if (response.sub !== userId) {
            return {
                verified: false,
                message: 'Invalid user'
            }
        }
        return {
            verified: true,
            message: 'Token is valid'
        }
    });
}