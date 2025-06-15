## IDM service

The Identity Management (IDM) service handles user authentication, registration, and authorization using JWT tokens. It connects to a DynamoDB table to store user data securely.
It is implemented using `Express` framework.

## API Endpoints

| Method | Endpoint                               | Description                    |
| ------ | -------------------------------------- | ------------------------------ |
| POST   | [`/signup`](#post-signup)              | Create a new user account      |
| POST   | [`/signin`](#post-signin)              | Sign in to an existing account |
| POST   | [`/verify`](#post-verify)              | Verify the token               |
| GET    | [`/users/:userId`](#get-usersuserid)   | Get user details               |
| PATCH  | [`/users/:userId`](#patch-usersuserid) | Update user information        |


## Setup

Install all required dependencies:
```shell
npm install
```

## Dependencies

This service uses the following main packages:

- `express` - Web Framework for handling API routes.
- `http-status-codes` - Clean and descriptive HTTP status codes.
- `uuid` - Generate unique user IDs.
- `bcrypt` - Secure password hashing.
- `jsonwebtoken` - JWT generation and verification.
- `cors` - Middleware for enabling Cross-Origin Resource Sharing.

For local development with DynamoDB:
```
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

## Environment variables
- `JWT_SECRET` - Secret used to sign and verify JWT tokens.

## Running the service

```shell
npm start
```

## Deploying to AWS Lambda

To deploy this Express app as a Lambda function using API Gateway + Lambda, you'll need the `@vendia/serverless-express` package.

1. Install the package
```shell
npm install @vendia/serverless-express
```

2. Update `index.js` (or create a separate lambda.js)

```js
import serverlessExpress from '@vendia/serverless-express';
export const handler = serverlessExpress({ app });
```


## API Endpoints Details

### POST `/signup`

Creates a new user account.

Required Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

Validation:

- All fields are required
- Email must be unique

Responses:

- `201 Created` – User created successfully
- `400 Bad Request` – Missing fields
- `409 Conflict` – User with the email already exists
- `503 Service Unavailable` – Internal DB failure

### POST `/signin`

Required Request Body:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

Responses:

- `200 OK` – Authentication successful

```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "user-uuid",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```
- `400 Bad Request` – Missing fields
- `404 Not Found` – User not found
- `401 Unauthorized` – Invalid password
- `500 Internal Server Error` – Retrieval failure

### POST `/verify`

Verifies the validity of a JWT token.

Required Request Body:
```json
{
  "token": "JWT_TOKEN",
  "user": {
    "id": "user-uuid"
  }
}
```

Responses:

- `200 OK`
```json
{
  "message": "Token is valid",
  "verified": true,
  "userId": "user-uuid",
  "token": "JWT_TOKEN"
}
``` 
- `400 Bad Request` – Missing fields
- `401 Unauthorized` – Invalid or expired token


### GET `/users/:userId`

Retrieves user details by ID.

Headers:
```
Authorization: Bearer <JWT_TOKEN>
```

Responses:

- `200 OK`
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "createdAt": "2025-06-15T14:52:00Z"
}
```
- `404 Not Found` – User does not exist
- `500 Internal Server Error` – Retrieval error

### PATCH `/users/:userId`

Updates a user's profile data.

Headers:
```
Authorization: Bearer <JWT_TOKEN>
```
Required Request Body (any combination of):
```json
{
  "email": "new@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "password": "newPassword123"
}
```

- At least one valid field is required

Responses:

- `204 No Content` – Update successful
- `400 Bad Request` – No valid fields to update
- `409 Conflict` – Email already taken
- `500 Internal Server Error` – Update error
