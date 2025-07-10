import { DatabaseService } from '@/utils/database';

export async function GET(request: Request, { userId }: { userId: string }) {
  try {
    const expenses = await DatabaseService.getUserExpenses(userId);
    return Response.json(expenses);
  } catch (error) {
    console.error('Get expenses error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch expenses' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request, { userId }: { userId: string }) {
  try {
    const expenseData = await request.json();
    const expense = await DatabaseService.addExpense(userId, expenseData);
    return Response.json(expense);
  } catch (error) {
    console.error('Add expense error:', error);
    return new Response(JSON.stringify({ error: 'Failed to add expense' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}