export async function executeQuery(query: string, params: any[] = []) {
  try {
    const response = await fetch('/api/database/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, params }),
    });

    if (!response.ok) {
      throw new Error(`Database query failed: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

export const DatabaseService = {
  async createUser(telegramId: string, userData: any) {
    const query = `
      INSERT INTO users (telegram_id, username, first_name, last_name, created_at)
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
    const query = 'SELECT * FROM users WHERE telegram_id = $1';
    const result = await executeQuery(query, [telegramId]);
    return result.rows[0];
  },

  async getUserExpenses(userId: string, limit = 50) {
    const query = `
      SELECT * FROM expenses 
      WHERE user_id = $1 
      ORDER BY date DESC, created_at DESC 
      LIMIT $2
    `;
    const result = await executeQuery(query, [userId, limit]);
    return result.rows;
  },

  async addExpense(userId: string, expense: any) {
    const query = `
      INSERT INTO expenses (user_id, amount, category, description, date, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING *
    `;
    
    const params = [
      userId,
      expense.amount,
      expense.category,
      expense.description,
      expense.date,
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
      INSERT INTO goals (user_id, title, description, target_amount, current_amount, category, deadline, status, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
      RETURNING *
    `;
    
    const params = [
      userId,
      goal.title,
      goal.description,
      goal.targetAmount,
      goal.currentAmount || 0,
      goal.category,
      goal.deadline,
      goal.status || 'active',
    ];

    const result = await executeQuery(query, params);
    return result.rows[0];
  },

  async updateGoal(goalId: string, updates: any) {
    const setClause = Object.keys(updates)
      .map((key, index) => `${key} = $${index + 2}`)
      .join(', ');
    
    const query = `
      UPDATE goals 
      SET ${setClause}, updated_at = NOW()
      WHERE id = $1 
      RETURNING *
    `;
    
    const params = [goalId, ...Object.values(updates)];
    const result = await executeQuery(query, params);
    return result.rows[0];
  },
};