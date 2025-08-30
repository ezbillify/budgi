
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  GraduationCap, 
  Home, 
  Coffee, 
  Target, 
  TrendingUp,
  Plus,
  DollarSign,
  Book,
  Users,
  Heart,
  LogOut
} from 'lucide-react';

interface StudentDashboardProps {
  userProfile: any;
  expenses: any[];
  goals: any[];
  extraIncomes: any[];
  reminders: any[];
  savingsChallenges: any[];
  notifications: any[];
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  userProfile,
  expenses,
  goals,
  extraIncomes,
  reminders,
  savingsChallenges,
  notifications
}) => {
  const totalScholarship = Number(userProfile?.scholarship_amount || 0);
  const totalExtraIncome = extraIncomes.reduce((sum, income) => sum + Number(income.amount), 0);
  const totalIncome = totalScholarship + (userProfile?.monthly_income || 0) + totalExtraIncome;
  
  const monthlyExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  
  // Student-specific budget categories - Fixed mapping
  const tuitionExpenses = expenses.filter(e => 
    e.category === 'Education' || e.category === 'Bills & Utilities'
  ).reduce((sum, e) => sum + Number(e.amount), 0);
  
  const accommodationExpenses = expenses.filter(e => 
    e.category === 'Rent' || e.category === 'Housing'
  ).reduce((sum, e) => sum + Number(e.amount), 0);
  
  const entertainmentExpenses = expenses.filter(e => 
    e.category === 'Entertainment'
  ).reduce((sum, e) => sum + Number(e.amount), 0);
  
  const foodExpenses = expenses.filter(e => 
    e.category === 'Food & Dining' || e.category === 'Groceries' || e.category === 'Food'
  ).reduce((sum, e) => sum + Number(e.amount), 0);
  
  // Suggested budget allocation for students
  const suggestedBudget = {
    tuition: totalIncome * 0.4, // 40% for education
    accommodation: totalIncome * 0.3, // 30% for housing
    food: totalIncome * 0.15, // 15% for food
    entertainment: totalIncome * 0.1, // 10% for entertainment
    savings: totalIncome * 0.05 // 5% for savings
  };

  const getBudgetStatus = (actual: number, suggested: number) => {
    const percentage = suggested > 0 ? (actual / suggested) * 100 : 0;
    if (percentage <= 80) return { status: 'good', color: 'text-green-600' };
    if (percentage <= 100) return { status: 'warning', color: 'text-yellow-600' };
    return { status: 'over', color: 'text-red-600' };
  };

  return (
    <div className="space-y-6">
      {/* Student Finance Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">₹{totalIncome.toLocaleString()}</div>
            <p className="text-xs text-blue-600">
              Monthly: ₹{(userProfile?.monthly_income || 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
              <Book className="w-4 h-4" />
              Education Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900">₹{tuitionExpenses.toLocaleString()}</div>
            <p className="text-xs text-green-600">
              Budget: ₹{Math.round(suggestedBudget.tuition).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Living Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900">₹{accommodationExpenses.toLocaleString()}</div>
            <p className="text-xs text-indigo-700">
              Budget: ₹{Math.round(suggestedBudget.accommodation).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-orange-800 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Savings Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900">{goals.length}</div>
            <p className="text-xs text-orange-600">Active goals</p>
          </CardContent>
        </Card>
      </div>

      {/* Student Budget Breakdown */}
      <Card className="bg-white shadow-lg border border-card-bg">
        <CardHeader>
          <CardTitle className="text-charcoal flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Student Budget Breakdown
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Smart budgeting tips for students based on your income
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Education Budget */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Book className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">Education (40%)</span>
                </div>
                <span className={`text-sm font-medium ${getBudgetStatus(tuitionExpenses, suggestedBudget.tuition).color}`}>
                  ₹{tuitionExpenses.toLocaleString()} / ₹{Math.round(suggestedBudget.tuition).toLocaleString()}
                </span>
              </div>
              <Progress 
                value={Math.min((tuitionExpenses / suggestedBudget.tuition) * 100, 100)}
                className="h-2"
              />
            </div>

            {/* Accommodation Budget */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4 text-indigo-700" />
                  <span className="font-medium">Housing (30%)</span>
                </div>
                <span className={`text-sm font-medium ${getBudgetStatus(accommodationExpenses, suggestedBudget.accommodation).color}`}>
                  ₹{accommodationExpenses.toLocaleString()} / ₹{Math.round(suggestedBudget.accommodation).toLocaleString()}
                </span>
              </div>
              <Progress 
                value={Math.min((accommodationExpenses / suggestedBudget.accommodation) * 100, 100)}
                className="h-2"
              />
            </div>

            {/* Food Budget */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-green-600" />
                  <span className="font-medium">Food (15%)</span>
                </div>
                <span className={`text-sm font-medium ${getBudgetStatus(foodExpenses, suggestedBudget.food).color}`}>
                  ₹{foodExpenses.toLocaleString()} / ₹{Math.round(suggestedBudget.food).toLocaleString()}
                </span>
              </div>
              <Progress 
                value={Math.min((foodExpenses / suggestedBudget.food) * 100, 100)}
                className="h-2"
              />
            </div>

            {/* Entertainment Budget */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span className="font-medium">Fun (10%)</span>
                </div>
                <span className={`text-sm font-medium ${getBudgetStatus(entertainmentExpenses, suggestedBudget.entertainment).color}`}>
                  ₹{entertainmentExpenses.toLocaleString()} / ₹{Math.round(suggestedBudget.entertainment).toLocaleString()}
                </span>
              </div>
              <Progress 
                value={Math.min((entertainmentExpenses / suggestedBudget.entertainment) * 100, 100)}
                className="h-2"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Student Tips */}
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-teal-800 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Student Money Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-pink-200">
              <h3 className="font-semibold text-teal-700 mb-2">💡 Save Smart</h3>
              <p className="text-sm text-pink-700">
                Try to save at least 5% of your income. Even ₹{Math.round(suggestedBudget.savings).toLocaleString()}/month builds good habits!
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-pink-200">
              <h3 className="font-semibold text-teal-700 mb-2">🍕 Budget Meals</h3>
              <p className="text-sm text-pink-700">
                Cook with friends! Share grocery costs and make it fun while staying within budget.
              </p>
            </div>
            <div className="p-4 bg-white rounded-lg border border-pink-200">
              <h3 className="font-semibold text-teal-700 mb-2">📱 Track Daily</h3>
              <p className="text-sm text-pink-700">
                Use this app daily to track small expenses. They add up quickly!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
