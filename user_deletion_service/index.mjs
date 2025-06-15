import { DynamoDBClient, DeleteItemCommand, GetItemCommand } from "@aws-sdk/client-dynamodb";
import pkg from 'pg';
import fs from 'fs';
import { sendUserDeletedEmail, sendUserDeletionFailedEmail } from './mailjet-handler.mjs';


const { Client } = pkg;
const ddbClient = new DynamoDBClient({});
const sslCert = fs.readFileSync('./global-bundle.pem');
const IDM_VALIDATE_URL = process.env.IDM_VALIDATE_URL;


export const handler = async (event) => {
  for (const record of event.Records) {
    const msg = JSON.parse(record.body);
    const userId = msg.userId;
    let userEmail = null;
    try {
      const getUserResult = await ddbClient.send(
        new GetItemCommand({
          TableName: process.env.IDM_USERS_TABLE_NAME,
          Key: {
            id: { S: userId },
          },
          ProjectionExpression: "email"
        })
      );

      if (!getUserResult.Item || !getUserResult.Item.email?.S) {
        throw new Error("User not found or email missing");
      }
      userEmail = getUserResult.Item.email.S;
    } catch (err) {
      console.error("Failed to get user email:", err);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: "Could not retrieve user email" }),
      };
    }

    const pgClient = new Client({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      port: 5432,
      ssl: {
        rejectUnauthorized: true,
        ca: sslCert,
      },
    });

    try {
      await ddbClient.send(
        new DeleteItemCommand({
          TableName: process.env.IDM_USERS_TABLE_NAME,
          Key: {
            id: { S: userId },
          },
        })
      );

      await pgClient.connect();
      await pgClient.query('DELETE FROM "Workout" WHERE "userID" = $1', [userId]);
      await pgClient.end();

      const response = await sendUserDeletedEmail(userEmail);
      console.log(response);

    } catch (error) {
      console.error("Deletion error:", error);
      const response = await sendUserDeletionFailedEmail(userEmail);
      console.log(response);
    }
  }
};
