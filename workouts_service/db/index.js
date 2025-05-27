import pkg from 'pg';
import fs from 'fs';

const { Pool } = pkg;
const sslCert = fs.readFileSync('./db/global-bundle.pem');

export const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_USER_PASSWORD,
  port: 5432,
  ssl: {
    rejectUnauthorized: true,
    ca: sslCert,
  },
});

// const DB_USER = 'postgres_admin';
// const DB_USER_PASSWORD = 'Fc0cgOy9mog!';
// const DB_HOST = 'reptrix-app.crysi8sa0ibv.us-east-1.rds.amazonaws.com';
// const DB_NAME = 'reptrixDB';

// export const pool = new Pool({
//   user: DB_USER,
//   host: DB_HOST,
//   database: DB_NAME,
//   password: DB_USER_PASSWORD,
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: true,
//     ca: sslCert,
//   },
// });


process.on('exit', () => {
  pool.end();
});
