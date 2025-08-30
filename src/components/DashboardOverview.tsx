
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  TrendingUp, 
  Target, 
  AlertCircle, 
  Calendar,
  Lightbulb,
  Heart,
  Coins,
  Trophy,
  Shield
} from 'lucide-react';

interface DashboardOverviewProps {
  userProfile: any;
  expenses: any[];
  goals: any[];
  extraIncomes: any[];
  reminders: any[];
  savingsChallenges: any[];
  notifications: any[];
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  userProfile,
  expenses,
  goals,
  extraIncomes,
  reminders,
  savingsChallenges,
  notifications
}) => {
  // Calculate totals
  const monthlyIncome = userProfile?.monthly_income || 0;
  const extraIncomeTotal = extraIncomes.reduce((sum, income) => sum + Number(income.amount), 0);
  const totalIncome = monthlyIncome + extraIncomeTotal;
  
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const currentMonth = new Date();
      return expenseDate.getMonth() === currentMonth.getMonth() && 
             expenseDate.getFullYear() === currentMonth.getFullYear();
    })
    .reduce((sum, expense) => sum + Number(expense.amount), 0);

  const totalSavings = goals.reduce((sum, goal) => sum + Number(goal.current_savings || 0), 0);
  const emergencyFund = goals.find(goal => goal.goal_type === 'emergency');
  const activeChallenge = savingsChallenges.find(challenge => !challenge.completed);

  // Get daily motivation quote
  const motivationalQuotes = [
    "💝 Every rupee saved today builds tomorrow's dreams",
    "🌸 Small steps, big financial victories",
    "✨ Your future self will thank you for saving today",
    "🎯 Progress, not perfection, leads to prosperity",
    "💪 Financial independence is your superpower"
  ];
  
  const todayQuote = motivationalQuotes[new Date().getDay() % motivationalQuotes.length];

  const getPersonalizedGreeting = () => {
    const hour = new Date().getHours();
    const name = userProfile?.name?.split(' ')[0] || 'there';
    
    if (hour < 12) return `Good morning, ${name}! ☀️`;
    if (hour < 17) return `Good afternoon, ${name}! 🌤️`;
    return `Good evening, ${name}! 🌙`;
  };

  return (
    <div className="space-y-6">
      {/* Personalized Greeting */}
      <Card className="bg-gradient-to-r from-rose-50 to-pink-50 border-rose-200">
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-rose-900 mb-2">{getPersonalizedGreeting()}</h1>
          <p className="text-rose-700 flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            {todayQuote}
          </p>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-green-50 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">₹{totalIncome.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              Monthly: ₹{monthlyIncome.toLocaleString()} + Extra: ₹{extraIncomeTotal.toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 border-red-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-red-800">Monthly Expenses</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-900">₹{monthlyExpenses.toLocaleString()}</div>
            <p className="text-xs text-red-600">
              {monthlyExpenses > monthlyIncome ? 'Over budget!' : 'Within budget'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">Total Savings</CardTitle>
            <Coins className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">₹{totalSavings.toLocaleString()}</div>
            <p className="text-xs text-blue-600">
              Across {goals.length} goals
            </p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">Available to Save</CardTitle>
            <Target className="h-4 w-4 text-indigo-700" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">
              ₹{Math.max(0, totalIncome - monthlyExpenses).toLocaleString()}
            </div>
            <p className="text-xs text-indigo-700">This month</p>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Fund Status */}
      {emergencyFund && (
        <Card className="bg-orange-50 border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-800 flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Emergency Fund Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-orange-700">
                ₹{Number(emergencyFund.current_savings || 0).toLocaleString()} of ₹{Number(emergencyFund.target_amount).toLocaleString()}
              </span>
              <Badge variant="outline" className="bg-orange-100 text-orange-800">
                {Math.round((Number(emergencyFund.current_savings || 0) / Number(emergencyFund.target_amount)) * 100)}%
              </Badge>
            </div>
            <Progress 
              value={(Number(emergencyFund.current_savings || 0) / Number(emergencyFund.target_amount)) * 100} 
              className="h-3"
            />
            <p className="text-xs text-orange-600">
              Auto-allocating {emergencyFund.auto_allocation_percentage}% of monthly income
            </p>
          </CardContent>
        </Card>
      )}

      {/* Active Savings Challenge */}
      {activeChallenge && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Active Challenge: {activeChallenge.title}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-yellow-700">
                Target: ₹{Number(activeChallenge.target_amount).toLocaleString()}
              </span>
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Streak: {activeChallenge.current_streak}
              </Badge>
            </div>
            <p className="text-xs text-yellow-600">
              {activeChallenge.frequency.charAt(0).toUpperCase() + activeChallenge.frequency.slice(1)} challenge
            </p>
          </CardContent>
        </Card>
      )}

      {/* Upcoming Reminders */}
      {reminders.length > 0 && (
        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-800 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {reminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex justify-between items-center p-2 bg-indigo-100 rounded">
                  <div>
                    <p className="text-sm font-medium text-indigo-900">{reminder.title}</p>
                    <p className="text-xs text-indigo-600">{reminder.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-indigo-700">{new Date(reminder.due_date).toLocaleDateString()}</p>
                    {reminder.amount && (
                      <p className="text-xs text-indigo-600">₹{Number(reminder.amount).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reverse Budgeting for Non-working */}
      {userProfile?.employment_category === 'non-working' && (
        <Card className="bg-rose-50 border-rose-200">
          <CardHeader>
            <CardTitle className="text-rose-800 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Reverse Budgeting Suggestion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-rose-700 mb-4">
              As a non-working individual, consider saving first and spending what's left. 
              We suggest saving at least 20% of any income you receive.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-rose-100 rounded">
                <p className="font-medium text-rose-800">Suggested Savings</p>
                <p className="text-rose-600">₹{Math.round(totalIncome * 0.2).toLocaleString()}</p>
              </div>
              <div className="p-3 bg-rose-100 rounded">
                <p className="font-medium text-rose-800">Available for Expenses</p>
                <p className="text-rose-600">₹{Math.round(totalIncome * 0.8).toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
