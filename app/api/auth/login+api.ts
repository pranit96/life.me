import { DatabaseService } from '@/utils/database';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { telegramId, username, firstName, lastName } = body;
    
    if (!telegramId) {
      return new Response(JSON.stringify({ error: 'Telegram ID is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate telegramId is numeric
    if (!/^\d+$/.test(telegramId)) {
      return new Response(JSON.stringify({ error: 'Invalid Telegram ID format' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await DatabaseService.createUser(telegramId, {
      username,
      firstName,
      lastName,
    });

    return Response.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: 'Login failed. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}