import { AIService } from '@/utils/ai';
import { DatabaseService } from '@/utils/database';

export async function POST(request: Request) {
  try {
    const { userId, type } = await request.json();
    
    if (!process.env.EXPO_PUBLIC_GROQ_API_KEY) {
      return new Response(JSON.stringify({ error: 'AI service not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const aiService = new AIService(process.env.EXPO_PUBLIC_GROQ_API_KEY);
    const expenses = await DatabaseService.getUserExpenses(userId, 50);
    
    let insights;
    if (type === 'spending') {
      insights = await aiService.generateSpendingInsights(expenses);
    } else {
      insights = 'No insights available for this type.';
    }

    return Response.json({ insights });
  } catch (error) {
    console.error('AI insights error:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate insights' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}