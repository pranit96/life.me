export async function POST(request: Request) {
  try {
    // Check if the required environment variable is defined
    if (!process.env.EXPO_PUBLIC_NEON_DATABASE_URL) {
      return new Response(JSON.stringify({ 
        error: 'Database URL not configured. Please set EXPO_PUBLIC_NEON_DATABASE_URL environment variable.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.EXPO_PUBLIC_NEON_DATABASE_URL);

    // Create tables with proper error handling
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          telegram_id VARCHAR(255) UNIQUE NOT NULL,
          username VARCHAR(255),
          first_name VARCHAR(255),
          last_name VARCHAR(255),
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS expenses (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          amount DECIMAL(10, 2) NOT NULL,
          category VARCHAR(100) NOT NULL,
          description TEXT,
          date DATE NOT NULL,
          created_at TIMESTAMP DEFAULT NOW()
        )
      `;

      await sql`
        CREATE TABLE IF NOT EXISTS goals (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(255) NOT NULL,
          description TEXT,
          target_amount DECIMAL(10, 2) NOT NULL,
          current_amount DECIMAL(10, 2) DEFAULT 0,
          category VARCHAR(100) NOT NULL,
          deadline DATE NOT NULL,
          status VARCHAR(50) DEFAULT 'active',
          ai_insights TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `;

      // Create indexes
      await sql`CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id)`;
      await sql`CREATE INDEX IF NOT EXISTS idx_users_telegram_id ON users(telegram_id)`;

      return Response.json({ message: 'Database initialized successfully' });
    } catch (dbError) {
      console.error('Database operation error:', dbError);
      return new Response(JSON.stringify({ 
        error: 'Database operation failed',
        details: dbError instanceof Error ? dbError.message : 'Unknown database error'
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Database initialization error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database initialization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}