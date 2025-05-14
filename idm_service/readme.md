## IDM service

Setup

1. `npm init`
2. `npm install express`

Dependencies

```
npm install http-status-codes
npm install uuid
npm install bcrypt
npm install jsonwebtoken
npm install cors
```

For local run
```
npm install @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb
```

Enviornment variables to be set:
- USER_TABLE
- JWT_SECRET

How to run

```shell
npm start
```

