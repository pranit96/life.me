export class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateGoalInsights(goal: any, expenses: any[]): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: `You are a financial advisor AI. Analyze the user's goal and spending patterns to provide actionable insights. Be concise and practical.`,
            },
            {
              role: 'user',
              content: `Goal: ${goal.title} - Target: $${goal.targetAmount}, Current: $${goal.currentAmount}. Recent expenses: ${JSON.stringify(expenses.slice(0, 10))}. Provide a brief insight and recommendation.`,
            },
          ],
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Service Error:', error);
      return 'Unable to generate insights at this time.';
    }
  }

  async categorizeExpense(description: string, amount: number): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama3-8b-8192',
          messages: [
            {
              role: 'system',
              content: 'Categorize this expense into one of: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Education, Other. Return only the category name.',
            },
            {
              role: 'user',
              content: `Expense: ${description} - $${amount}`,
            },
          ],
          max_tokens: 10,
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content.trim();
    } catch (error) {
      console.error('AI Categorization Error:', error);
      return 'Other';
    }
  }

  async generateSpendingInsights(expenses: any[]): Promise<string> {
    try {
      const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
      const categories = expenses.reduce((acc, exp) => {
        acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
        return acc;
      }, {});

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [
            {
              role: 'system',
              content: 'You are a financial advisor. Analyze spending patterns and provide actionable advice. Be encouraging and practical.',
            },
            {
              role: 'user',
              content: `Total spent: $${totalSpent}. Category breakdown: ${JSON.stringify(categories)}. Provide brief insights and 1-2 actionable tips.`,
            },
          ],
          max_tokens: 150,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI Insights Error:', error);
      return 'Keep tracking your expenses to build better financial habits!';
    }
  }
}