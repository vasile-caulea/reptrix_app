import { StatusCodes } from 'http-status-codes';
import bcrypt from 'bcrypt';

import { buildResponse } from '../utils/utils.js';
import { generateToken } from '../utils/auth.js';
import { getUserByEmail } from '../utils/database_op.js';

export async function signin(user) {
    const email = user.email;
    const password = user.password;

    if (!email || !password) {
        buildResponse(StatusCodes.BAD_REQUEST, {
            message: 'Missing required fields'
        });
    }

    let userDB;
    try {
        userDB = await getUserByEmail(email.trim());
    }
    catch (error) {
        if (error['$metadata'] && error['$metadata'].httpStatusCode === 404) {
            return buildResponse(StatusCodes.NOT_FOUND, {
                message: 'User does not exist'
            });
        }
        else {
            return buildResponse(StatusCodes.INTERNAL_SERVER_ERROR, {
                message: 'Could not retrieve user'
            });
        }
    }

    if (!userDB || !userDB.email) {
        return buildResponse(StatusCodes.NOT_FOUND, {
            message: 'User does not exist'
        });
    }

    if (!bcrypt.compareSync(password.trim(), userDB.password)) {
        return buildResponse(StatusCodes.UNAUTHORIZED, {
            message: 'Invalid password'
        });
    }

    const userInfo = {
        sub: userDB.id,
        email: userDB.email
    }

    const token = generateToken(userInfo);
    const response = {
        token: token,
        user: {
            id: userDB.id,
            firstName: userDB.firstName,
            lastName: userDB.lastName
        }
    }
    return buildResponse(StatusCodes.OK, response);
}
