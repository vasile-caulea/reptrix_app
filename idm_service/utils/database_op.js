import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
    region: 'us-east-1'
});

const dynamoDB = DynamoDBDocumentClient.from(client);
// const userTable = process.env.USER_TABLE;
const userTable = 'users';

export async function getUser(email) {
    const params = {
        TableName: userTable,
        Key: {
            email: email
        }
    };

    try {
        const response = await dynamoDB.send(new GetCommand(params));
        return response.Item;
    } catch (error) {
        console.error('Error getting user:', error);
        return null;
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
        return false;
    }
}
