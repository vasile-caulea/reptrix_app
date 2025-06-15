import { pool } from '../db/index.js';
import {normalizeDate} from '../utils/utils.js';

export async function getWorkouts(userId, query) {
  const { startDate, endDate, exerciseCatId, exerciseId } = query;

  let sql = 'SELECT * FROM "Workout" WHERE "userID" = $1';
  const values = [userId];
  let idx = 2;

  if (exerciseCatId) {
    sql += ` AND "categoryID" = $${idx++}`;
    values.push(exerciseCatId);
  }

  if (exerciseId) {
    sql += ` AND "exerciseID" = $${idx++}`;
    values.push(exerciseId);
  }

  if (startDate && endDate) {
    sql += ` AND date BETWEEN $${idx++} AND $${idx++}`;
    values.push(normalizeDate(startDate), normalizeDate(endDate));
  } else if (startDate) {
    sql += ` AND date = $${idx++}`;
    values.push(normalizeDate(startDate));
  }

  const res = await pool.query(sql, values);
  return res.rows;
}

export async function getWorkoutDates(userId, query) {
  const startDate = new Date(query.year, query.month - 1, 1);
  const endDate = new Date(query.year, query.month, 0);

  const res = await pool.query(
    `SELECT DISTINCT date FROM "Workout" 
     WHERE "userID" = $1 AND date BETWEEN $2 AND $3`,
    [userId, normalizeDate(startDate), normalizeDate(endDate)]
  );

  return res.rows;
}

export async function createWorkout(userId, workoutData) {
  const { date, exerciseId, categoryId, repetitions, sets, weight } = workoutData;

  const res = await pool.query(
    `INSERT INTO "Workout" ("userID", date, "exerciseID", "categoryID", repetitions, sets, weight)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [userId, date, exerciseId, categoryId, repetitions, sets, weight]
  );

  return res.rows[0];
}

export async function updateWorkout(userId, workoutId, updatedData) {
  const fields = [];
  const values = [];
  let idx = 1;

  for (const key of ['repetitions', 'sets', 'weight']) {
    if (updatedData[key] !== undefined) {
      fields.push(`${key} = $${idx++}`);
      values.push(updatedData[key]);
    }
  }

  if (fields.length === 0) return null;

  values.push(workoutId, userId);

  const sql = `UPDATE "Workout" SET ${fields.join(', ')} WHERE id = $${idx++} AND "userID" = $${idx}
               RETURNING *`;

  const res = await pool.query(sql, values);
  return res.rows[0];
}

export async function deleteWorkout(userId, workoutId) {
  const res = await pool.query(
    'DELETE FROM "Workout" WHERE id = $1 AND "userID" = $2 RETURNING *',
    [workoutId, userId]
  );

  return res.rows[0];
}
