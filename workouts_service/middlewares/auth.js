
// const IDM_API_URL = process.env.IDM_API_URL || 'http://localhost:3001';
const IDM_API_URL = 'https://cg0ssf2fsb.execute-api.us-east-1.amazonaws.com';

export async function verifyTokenMiddleware(req, res, next) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({ message: 'Missing Authorization header' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    try {
        const response = await fetch(`${IDM_API_URL}/verify`, {
            method: 'POST',
            body: JSON.stringify({ token: token, user: { id: req.params.userId } }),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status === 401) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        if (response.status === 400 || !response.ok) {
            return res.status(500).json({ message: 'Token verification failed' });
        }

        const data = await response.json();
        if (!data.verified) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        next();
    } catch (error) {
        console.error('Error verifying token:', error.cause);
        return res.status(500).json({ message: 'Token verification failed' });
    }
}
