import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/utils/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { telegramId, username, firstName, lastName } = body;

    if (!telegramId) {
      return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
    }

    if (!/^\d+$/.test(telegramId)) {
      return NextResponse.json({ error: 'Invalid Telegram ID format' }, { status: 400 });
    }

    const user = await DatabaseService.createUser(telegramId, {
      username,
      firstName,
      lastName,
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Login failed. Please try again.' },
      { status: 500 }
    );
  }
}

export function GET() {
  return NextResponse.json({ error: 'Use POST' }, { status: 405 });
}
