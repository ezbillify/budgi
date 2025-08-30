
export interface User {
  id: string;
  name: string;
  email: string;
  employment_category: 'working' | 'student' | 'non-working' | 'entrepreneur';
  employmentCategory: 'working' | 'student' | 'non-working' | 'entrepreneur'; // Add this for compatibility
  monthly_income?: number;
  monthlyIncome?: number; // Add this for compatibility
  created_at: string;
}

export interface Expense {
  id: string;
  user_id: string;
  amount: number;
  category: string;
  date: string;
  notes?: string;
  description: string; // Make this required to match component expectations
  created_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  name: string;
  title: string; // Add this for compatibility
  target_amount: number;
  targetAmount: number; // Add this for compatibility
  current_savings: number;
  currentAmount: number; // Add this for compatibility
  frequency: 'daily' | 'weekly' | 'monthly';
  deadline?: string;
  is_emergency_fund: boolean;
  created_at: string;
}

export interface ExtraIncome {
  id: string;
  user_id: string;
  source: string;
  amount: number;
  date: string;
  notes?: string;
  created_at: string;
}

export interface Reminder {
  id: string;
  user_id: string;
  type: 'EMI' | 'SIP' | 'Recharge' | 'Insurance' | 'Utilities';
  title: string;
  amount?: number;
  due_date: string;
  is_recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  created_at: string;
}

export interface SavingsChallenge {
  id: string;
  user_id: string;
  title: string;
  target_amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  duration_weeks: number;
  current_streak: number;
  completed: boolean;
  created_at: string;
}
