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

process.on('exit', () => {
  pool.end();
});
