import { StatusCodes } from 'http-status-codes';
import { buildResponse } from '../utils/utils.js';
import { verifyToken } from '../utils/auth.js';

export async function verify(requestBody) {
    if (!requestBody.token || !requestBody.user.id) {
        return buildResponse(StatusCodes.BAD_REQUEST, {
            message: 'Missing required fields'
        });
    }

    const token = requestBody.token;
    const userId = requestBody.user.id;

    const response = verifyToken(userId, token);
    if (!response.verified) {
        return buildResponse(StatusCodes.UNAUTHORIZED, {
            message: response.message
        });
    }

    return buildResponse(StatusCodes.OK, {
        message: 'Token is valid',
        verified: true,
        userId: userId,
        token: token
    });
}
