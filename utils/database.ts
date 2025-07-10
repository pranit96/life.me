// lib/database.ts

import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Neon or any Postgres URL
  ssl: {
    rejectUnauthorized: false,
  },
});

export async function executeQuery(query: string, params: any[] = []) {
  const client = await pool.connect();
  try {
    const result = await client.query(query, params);
    return { rows: result.rows };
  } catch (error) {
    console.error('[Database Error]', error);
    throw error;
  } finally {
    client.release();
  }
}

export const DatabaseService = {
  async createUser(telegramId: string, userData: any) {
    const query = `
      INSERT INTO telegram_users (telegram_id, username, first_name, last_name, created_at)
      VALUES ($1, $2, $3, $4, NOW())
      ON CONFLICT (telegram_id) DO UPDATE SET
        username = EXCLUDED.username,
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name
      RETURNING *
    `;
    const params = [
      telegramId,
      userData.username || null,
      userData.firstName || null,
      userData.lastName || null,
    ];
    const result = await executeQuery(query, params);
    return result.rows[0];
  },

  async getUser(telegramId: string) {
    const query = `SELECT * FROM telegram_users WHERE telegram_id = $1`;
    const result = await executeQuery(query, [telegramId]);
    return result.rows[0];
  },

  async getUserExpenses(userId: string, limit = 50) {
    const query = `
      SELECT * FROM expenses
      WHERE user_id = $1
      ORDER BY expense_date DESC, created_at DESC
      LIMIT $2
    `;
    const result = await executeQuery(query, [userId, limit]);
    return result.rows;
  },

  async addExpense(userId: string, expense: any) {
    const query = `
      INSERT INTO expenses (user_id, amount, category, description, expense_date, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    const params = [
      userId,
      expense.amount,
      expense.category,
      expense.description,
      expense.expense_date,
    ];
    const result = await executeQuery(query, params);
    return result.rows[0];
  },

  async getUserGoals(userId: string) {
    const query = `
      SELECT * FROM goals
      WHERE user_id = $1
      ORDER BY created_at DESC
    `;
    const result = await executeQuery(query, [userId]);
    return result.rows;
  },

  async createGoal(userId: string, goal: any) {
    const query = `
      INSERT INTO goals (user_id, title, description, target_value, current_value, goal_category, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, NOW())
      RETURNING *
    `;
    const params = [
      userId,
      goal.title,
      goal.description,
      goal.target_value,
      goal.current_value || 0,
      goal.goal_category,
    ];
    const result = await executeQuery(query, params);
    return result.rows[0];
  },

  async updateGoal(goalId: string, updates: any) {
    const keys = Object.keys(updates);
    const setClause = keys
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');

    const query = `
      UPDATE goals
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
    const params = [goalId, ...keys.map((key) => updates[key])];
    const result = await executeQuery(query, params);
    return result.rows[0];
  },
};
