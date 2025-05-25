import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    region: 'us-east-1',

});

const dynamoDB = DynamoDBDocumentClient.from(client);
const userTable = 'reptrix-users';

export async function getUserByEmail(email) {
    const params = {
        TableName: userTable,
        IndexName: "email-index",
        KeyConditionExpression: "email = :emailValue",
        ExpressionAttributeValues: {
            ":emailValue": email,
        },
        Limit: 1,
    };

    try {
        const response = await dynamoDB.send(new QueryCommand(params));
        return response.Items && response.Items.length > 0 ? response.Items[0] : null;
    } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
    }
}

export async function saveUser(user) {
    const params = {
        TableName: userTable,
        Item: user
    };

    try {
        await dynamoDB.send(new PutCommand(params));
        return true;
    } catch (error) {
        console.error('There was an error saving the user:', error);
        throw error;
    }
}

export async function getUserById(userId) {
    const params = {
        TableName: userTable,
        Key: {
            id: userId
        }
    };

    try {
        const response = await dynamoDB.send(new GetCommand(params));
        return response.Item || null;
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
}


export async function updateUserPartialByUserId(userId, updateFields) {
    try {
        let UpdateExpression = "SET ";
        const ExpressionAttributeNames = {};
        const ExpressionAttributeValues = {};
        let prefix = "";

        for (const key in updateFields) {
            UpdateExpression += `${prefix}#${key} = :${key}`;
            ExpressionAttributeNames[`#${key}`] = key;
            ExpressionAttributeValues[`:${key}`] = updateFields[key];
            prefix = ", ";
        }

        const updateParams = {
            TableName: userTable,
            Key: { id: userId },
            UpdateExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        };

        const updateResponse = await dynamoDB.send(new UpdateCommand(updateParams));
        return;

    } catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
}
