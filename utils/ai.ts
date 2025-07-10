
export class AIService {
  private apiKey: string;
  private baseUrl = 'https://api.groq.com/openai/v1';
  private defaultTimeout = 10000; // 10s timeout
  private preferredInsightModel = 'llama3-70b-8192';
  private preferredCategorizationModel = 'llama3-8b-8192';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  /**
   * Call Groq's /v1/models and get the preferred model if available.
   */
  private async getAvailableModel(preferred: string): Promise<string> {
    try {
      const res = await fetch(`${this.baseUrl}/models`, {
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
        },
      });

      if (!res.ok) {
        console.error('Failed to fetch Groq models:', res.status);
        return preferred;
      }

      const data = await res.json();
      const models = data.data.map((m: any) => m.id);
      if (models.includes(preferred)) {
        return preferred;
      }

      console.warn(`Preferred model ${preferred} not available. Using fallback: ${models[0]}`);
      return models[0] || preferred;
    } catch (err) {
      console.error('Groq model fetch failed:', err);
      return preferred;
    }
  }

  /**
   * Core helper for POSTing chat completions.
   */
  private async postChatCompletion(payload: any): Promise<string> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.defaultTimeout);

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        console.error('Groq API Error:', response.status, response.statusText);
        return 'Sorry, AI service is currently unavailable.';
      }

      const data = await response.json();
      return data?.choices?.[0]?.message?.content?.trim() || 'No insight available.';
    } catch (error) {
      console.error('Groq request failed:', error);
      return 'Sorry, AI request failed.';
    }
  }

  /**
   * Generate insights for a goal + recent expenses.
   */
  async generateGoalInsights(goal: any, expenses: any[]): Promise<string> {
    const model = await this.getAvailableModel(this.preferredInsightModel);
    const recentExpenses = expenses.slice(0, 10).map(e => ({
      amount: e.amount,
      category: e.category,
    }));

    const payload = {
      model,
      messages: [
        {
          role: 'system',
          content: `You are a helpful financial advisor AI. Analyze the user's goal and spending, give clear practical insights.`,
        },
        {
          role: 'user',
          content: `Goal: ${goal.title}, Target: $${goal.targetAmount}, Current: $${goal.currentAmount}. Recent expenses: ${JSON.stringify(recentExpenses)}.`,
        },
      ],
      max_tokens: 200,
      temperature: 0.7,
    };

    return this.postChatCompletion(payload);
  }

  /**
   * Classify an expense description + amount into a category.
   */
  async categorizeExpense(description: string, amount: number): Promise<string> {
    const model = await this.getAvailableModel(this.preferredCategorizationModel);

    const payload = {
      model,
      messages: [
        {
          role: 'system',
          content:
            'Categorize this expense into one of: Food, Transportation, Entertainment, Shopping, Bills, Healthcare, Education, Other. Return only the category name.',
        },
        {
          role: 'user',
          content: `Expense: ${description} - $${amount}`,
        },
      ],
      max_tokens: 10,
      temperature: 0.3,
    };

    const category = await this.postChatCompletion(payload);

    return category.split(/\s+/)[0].trim();
  }

  /**
   * Generate general spending pattern insights.
   */
  async generateSpendingInsights(expenses: any[]): Promise<string> {
    const model = await this.getAvailableModel(this.preferredInsightModel);

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const categoryBreakdown = expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {});

    const payload = {
      model,
      messages: [
        {
          role: 'system',
          content: 'You are a personal finance advisor. Analyze spending and give short practical advice.',
        },
        {
          role: 'user',
          content: `Total spent: $${totalSpent}. Breakdown: ${JSON.stringify(categoryBreakdown)}. Give brief insights & 1-2 tips.`,
        },
      ],
      max_tokens: 150,
      temperature: 0.7,
    };

    return this.postChatCompletion(payload);
  }
}
