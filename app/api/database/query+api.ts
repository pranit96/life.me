import { neon } from '@neondatabase/serverless';

export async function POST(request: Request) {
  try {
    const { query, params } = await request.json();
    
    const sql = neon(process.env.EXPO_PUBLIC_NEON_DATABASE_URL);
    const result = await sql(query, params);
    
    return Response.json({ rows: result });
  } catch (error) {
    console.error('Database query error:', error);
    return new Response(JSON.stringify({ error: 'Database query failed' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}