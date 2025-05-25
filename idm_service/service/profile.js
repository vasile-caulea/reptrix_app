import { StatusCodes } from 'http-status-codes';
import { buildResponse } from '../utils/utils.js';
import { getUserById, getUserByEmail, updateUserPartialByUserId } from '../utils/database_op.js';
import bcrypt from 'bcrypt';

export async function getUser(userId) {
    try {
        const user = await getUserById(userId);
        if (!user) {
            return buildResponse(StatusCodes.NOT_FOUND, {
                message: "User not found"
            });
        }
        const { password, ...safeUser } = user;
        return buildResponse(StatusCodes.OK, safeUser);

    } catch (error) {
        console.error("Error retrieving user:", error);
        return buildResponse(StatusCodes.INTERNAL_SERVER_ERROR, {
            message: "Error retrieving user"
        });
    }
}

export async function updateUser(userId, updatedUserData) {
    const valuesToUpdate = {};
    if (updatedUserData.email) {
        const user = await getUserByEmail(updatedUserData.email);
        if (user) {
            return buildResponse(StatusCodes.CONFLICT, {
                message: "Another user uses this email already"
            });
        }
        valuesToUpdate.email = updatedUserData.email;
    }
    if (updatedUserData.lastName) {
        valuesToUpdate.lastName = updatedUserData.lastName;
    }
    if (updatedUserData.firstName) {
        valuesToUpdate.firstName = updatedUserData.firstName;
    }
    if (updatedUserData.password) {
        valuesToUpdate.password = updatedUserData.password;
    }

    if (Object.keys(valuesToUpdate).length === 0) {
        return buildResponse(StatusCodes.BAD_REQUEST, {
            message: "No valid fields to update"
        });
    }

    try {
        if (valuesToUpdate.password)
        {
            valuesToUpdate.password = bcrypt.hashSync(valuesToUpdate.password, 10);
        }
        updateUserPartialByUserId(userId, valuesToUpdate);
        return buildResponse(StatusCodes.NO_CONTENT, {});
    } catch (error) {
        console.error("Error updating user:", error);
        return buildResponse(StatusCodes.INTERNAL_SERVER_ERROR, {
            message: "Error updating user"
        });
    }
}
