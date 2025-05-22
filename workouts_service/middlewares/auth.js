
const IDM_API_URL = process.env.IDM_API_URL || 'http://localhost:3001';

export async function verifyTokenMiddleware(req, res, next) {
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