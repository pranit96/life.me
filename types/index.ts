export interface User {
  id: string;
  telegramId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  createdAt: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  category: string;
  deadline: string;
  status: 'active' | 'completed' | 'paused';
  aiInsights?: string;
  createdAt: string;
}

export interface Analytics {
  totalExpenses: number;
  monthlyExpenses: number;
  categoryBreakdown: { [key: string]: number };
  goalProgress: number;
  savingsRate: number;
  trends: {
    week: number[];
    month: number[];
  };
}

export interface AIInsight {
  type: 'goal' | 'expense' | 'savings';
  message: string;
  confidence: number;
  actionable: boolean;
  timestamp: string;
}