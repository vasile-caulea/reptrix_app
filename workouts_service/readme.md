# Workouts service

This service is responsible for managing user workouts. It provides endpoints for creating, retrieving, updating, and deleting workout data, and communicates with a PostgreSQL database.

## API Endpoints

All endpoints require a valid JWT token in the `Authorization` header as a Bearer token.

| Method | Endpoint                             | Description                      |
| ------ | ------------------------------------ | -------------------------------- |
| GET    | [ `/users/:userId/workouts` ](#get-usersuseridworkouts)                          | Retrieve all workouts for a user          |
| GET    | `/users/:userId/workouts/dates`                                                  | Retrieve only workout dates for the user  |
| POST   | [ `/users/:userId/workouts` ](#post-usersuseridworkouts)                         | Create a new workout                      |
| PATCH  | [ `/users/:userId/workouts/:workoutId` ](#patch-usersuseridworkoutsworkoutid)    | Update an existing workout                |
| DELETE | `/users/:userId/workouts/:workoutId`                                             | Delete a specific workout for the user    |


## Setup

1. `npm install`

## Dependencies

This service uses the following main packages:
- express - Web Framework for handling API routes.
- cors - Middleware for enabling Cross-Origin Resource Sharing.
- pg - PostgreSQL client for Node.js.

## Environment variables to be set:
- IDM_API_URL - URL of the Identity Management service (used for token verification)
- PORT - The port on which the server will run (required only for local run)
- DB_USER - Database username
- DB_HOST - Database host
- DB_NAME - Name of the PostgreSQL database
- DB_USER_PASSWORD - Password for the database user

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

## API Endpoint Details

### GET `/users/:userId/workouts`

Retrieves all workouts for the specified user. You can apply optional filters using query parameters.

| Parameter       | Description                                                        |
| --------------- | ------------------------------------------------------------------ |
| `startDate`     | Filter workouts starting from this date (ISO format: `YYYY-MM-DD`) |
| `endDate`       | Filter workouts up to this date (requires `startDate`)             |
| `exerciseCatId` | Filter by exercise category ID                                     |
| `exerciseId`    | Filter by specific exercise ID                                     |

Validation Rules:
- `endDate` requires `startDate`
- Cannot specify both exerciseCatId and exerciseId in the same request
- Dates must be valid ISO format

### POST `/users/:userId/workouts`

Creates a new workout for the user.

Required JSON Body:

```json
{
  "date": "2024-06-10",
  "exerciseId": 42,
  "categoryId": 3,
  "repetitions": 10,
  "sets": 3,
  "weight": 60.5
}
```

Validation Rules:
- All fields are required
- `date` must be a valid `date`
- `repetitions`, `sets` must be integers
- `weight` must be a number

### PATCH `/users/:userId/workouts/:workoutId`

Updates an existing workout. Partial updates are supported.

Allowed JSON Body Fields:
- `repetitions`: Integer
- `sets`: Integer
- `weight`: Float

You must provide at least one of these fields.

