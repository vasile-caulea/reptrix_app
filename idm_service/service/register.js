import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';

import { buildResponse } from '../utils/utils.js';
import { getUserByEmail, saveUser } from '../utils/database_op.js';

export async function signup(userInfo) {

    const email = userInfo.email;
    const password = userInfo.password;
    const firstName = userInfo.firstName;
    const lastName = userInfo.lastName;

    if (!email || !password || !firstName || !lastName) {
        return buildResponse(StatusCodes.BAD_REQUEST, {
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
                message: 'Error creating user. Please try again later.'
            });
        }
    }
    
    if (userDB && userDB.email) {
        return buildResponse(StatusCodes.CONFLICT, {
            message: 'User already exists with this email'
        });
    }

    const hashedPassword = bcrypt.hashSync(password.trim(), 10);
    const user = {
        id: uuidv4(),
        email: email.trim(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        createdAt: new Date().toISOString()
    }

    const saveUserResponse = await saveUser(user);
    if (!saveUserResponse) {
        return buildResponse(StatusCodes.SERVICE_UNAVAILABLE, {
            message: 'Error creating user. Please try again later.'
        });
    }

    return buildResponse(StatusCodes.CREATED, {
        message: 'User created successfully.'
    });
}
