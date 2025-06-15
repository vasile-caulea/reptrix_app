import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sqs = new SQSClient({});
const QUEUE_URL = process.env.QUEUE_URL;

async function validateToken(userId, token) {

  const response = await fetch(process.env.IDM_VALIDATE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: token,
      user: { id: userId }
    })
  });

  const data = await response.json();
  return data;
}

export const handler = async (event) => {
  const token = event.headers?.Authorization || event.headers?.authorization;
  const userId = event.pathParameters?.userId;
  if (!token || (token && token.split(' ')[1].trim() === '')) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Missing Authorization token" }),
    };
  }

  try {
    const result = await validateToken(userId, token.split(' ')[1].trim());
    console.log(result);
    if (!result.verified) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid token" }),
      };
    }
  } catch (err) {
    console.error("Token validation failed:", err);
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid token" }),
    };
  }

  try {
    const message = {
      userId: userId
    };

    const command = new SendMessageCommand({
      QueueUrl: QUEUE_URL,
      MessageBody: JSON.stringify(message),
    });

    await sqs.send(command);

    return {
      statusCode: 202,
      body: JSON.stringify({ message: "Your request is being processed." }),
    };

  } catch (err) {
    console.error("Failed to enqueue deletion:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Failed to queue user deletion." }),
    };
  }
};

