import { DatabaseService } from '@/utils/database';
import { AIService } from '@/utils/ai';

export async function GET(request: Request, { userId }: { userId: string }) {
  try {
    const goals = await DatabaseService.getUserGoals(userId);
    return Response.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    return new Response(JSON.stringify({ error: 'Failed to fetch goals' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function POST(request: Request, { userId }: { userId: string }) {
  try {
    const goalData = await request.json();
    const goal = await DatabaseService.createGoal(userId, goalData);
    
    // Generate AI insights for the new goal
    if (process.env.EXPO_PUBLIC_GROQ_API_KEY) {
      const aiService = new AIService(process.env.EXPO_PUBLIC_GROQ_API_KEY);
      const expenses = await DatabaseService.getUserExpenses(userId, 20);
      const insights = await aiService.generateGoalInsights(goal, expenses);
      
      await DatabaseService.updateGoal(goal.id, { ai_insights: insights });
    }
    
    return Response.json(goal);
  } catch (error) {
    console.error('Create goal error:', error);
    return new Response(JSON.stringify({ error: 'Failed to create goal' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}