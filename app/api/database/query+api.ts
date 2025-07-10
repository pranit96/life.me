export async function POST(request: Request) {
  try {
    const { query, params } = await request.json();
    
    if (!process.env.EXPO_PUBLIC_NEON_DATABASE_URL) {
      return new Response(JSON.stringify({ 
        error: 'Database URL not configured' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    
    const { neon } = await import('@neondatabase/serverless');
    const sql = neon(process.env.EXPO_PUBLIC_NEON_DATABASE_URL);
    
    const result = await sql(query, params || []);
    
    return Response.json({ rows: result });
  } catch (error) {
    console.error('Database query error:', error);
    return new Response(JSON.stringify({ 
      error: 'Database query failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}