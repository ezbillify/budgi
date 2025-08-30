
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Target, Bell } from 'lucide-react';

interface AIInsightsProps {
  expenses: any[];
  goals: any[];
  userProfile: any;
}

export const AIInsights: React.FC<AIInsightsProps> = ({ userProfile, expenses, goals }) => {
  // Helper function to safely convert to number
  const toNumber = (value: any): number => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // Calculate totals with proper type conversion
  const totalExpenses = expenses?.reduce((sum, expense) => {
    return sum + toNumber(expense?.amount);
  }, 0) || 0;

  const monthlyIncome = toNumber(userProfile?.monthly_income);
  const savingsRate = monthlyIncome > 0 ? ((monthlyIncome - totalExpenses) / monthlyIncome) * 100 : 0;

  // Category analysis
  const categoryTotals = expenses?.reduce((acc, expense) => {
    const category = expense?.category || 'Other';
    acc[category] = (acc[category] || 0) + toNumber(expense?.amount);
    return acc;
  }, {} as Record<string, number>) || {};

  const topCategories = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => toNumber(b) - toNumber(a))
    .slice(0, 3);

  // Generate personalized insights based on user category
  const getPersonalizedInsights = () => {
    const insights = [];

    // Savings rate insight
    if (savingsRate > 20) {
      insights.push({
        type: 'positive',
        title: 'Excellent Savings Rate! 🌟',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. You're doing great!`,
        action: 'Consider increasing your investment allocation for long-term wealth building.'
      });
    } else if (savingsRate > 10) {
      insights.push({
        type: 'neutral',
        title: 'Good Savings Habit 👍',
        description: `You're saving ${savingsRate.toFixed(1)}% of your income. Try to reach 20% for optimal financial health.`,
        action: 'Look for areas to reduce expenses or increase income.'
      });
    } else {
      insights.push({
        type: 'warning',
        title: 'Improve Your Savings Rate 💪',
        description: `Your current savings rate is ${savingsRate.toFixed(1)}%. Aim for at least 20%.`,
        action: 'Review your expenses and identify areas to cut back.'
      });
    }

    // Category-specific insights
    if (topCategories.length > 0) {
      const [topCategory, topAmount] = topCategories[0];
      const categoryPercentage = totalExpenses > 0 ? (toNumber(topAmount) / totalExpenses) * 100 : 0;
      
      if (categoryPercentage > 30) {
        insights.push({
          type: 'warning',
          title: `High Spending on ${topCategory}`,
          description: `${categoryPercentage.toFixed(1)}% of your expenses go to ${topCategory}. Consider if this aligns with your priorities.`,
          action: 'Review this category and look for optimization opportunities.'
        });
      }
    }

    // Employment-specific insights
    const employmentCategory = userProfile?.employment_category;
    switch (employmentCategory) {
      case 'working':
        insights.push({
          type: 'info',
          title: 'Working Woman Financial Tips 💼',
          description: 'As a working woman, focus on building an emergency fund worth 6 months of expenses.',
          action: 'Consider starting a SIP in equity mutual funds for long-term wealth creation.'
        });
        break;
      case 'student':
        insights.push({
          type: 'info',
          title: 'Student Financial Strategy 🎓',
          description: 'Build good financial habits early. Even small savings now will compound over time.',
          action: 'Try the 50-30-20 rule: 50% needs, 30% wants, 20% savings.'
        });
        break;
      case 'entrepreneur':
        insights.push({
          type: 'info',
          title: 'Entrepreneur Money Management 🚀',
          description: 'Separate business and personal finances. Build both emergency funds.',
          action: 'Consider tax-saving investments like ELSS and PPF.'
        });
        break;
      case 'non-working':
        insights.push({
          type: 'info',
          title: 'Household Budget Optimization 🏠',
          description: 'Focus on maximizing household savings and smart spending.',
          action: 'Look into gold bonds and fixed deposits for secure investments.'
        });
        break;
    }

    return insights;
  };

  const insights = getPersonalizedInsights();

  const getRecommendedInvestments = () => {
    if (!monthlyIncome) return [];

    const investments = [];
    const availableForInvestment = Math.max(0, monthlyIncome - totalExpenses);

    if (availableForInvestment > 5000) {
      investments.push({
        name: 'Equity Mutual Funds (SIP)',
        allocation: '40%',
        amount: Math.round(availableForInvestment * 0.4),
        risk: 'Medium-High',
        description: 'Long-term wealth creation through diversified equity exposure'
      });
      investments.push({
        name: 'PPF (Public Provident Fund)',
        allocation: '30%',
        amount: Math.round(availableForInvestment * 0.3),
        risk: 'Low',
        description: 'Tax-free returns with 15-year lock-in period'
      });
      investments.push({
        name: 'Emergency Fund (Liquid)',
        allocation: '30%',
        amount: Math.round(availableForInvestment * 0.3),
        risk: 'Very Low',
        description: 'Instant access for emergencies'
      });
    } else if (availableForInvestment > 1000) {
      investments.push({
        name: 'SIP in Index Funds',
        allocation: '60%',
        amount: Math.round(availableForInvestment * 0.6),
        risk: 'Medium',
        description: 'Low-cost diversified market exposure'
      });
      investments.push({
        name: 'Emergency Fund',
        allocation: '40%',
        amount: Math.round(availableForInvestment * 0.4),
        risk: 'Very Low',
        description: 'Build your safety net first'
      });
    }

    return investments;
  };

  const recommendedInvestments = getRecommendedInvestments();

  return (
    <div className="space-y-6">
      {/* AI Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => (
          <Card key={index} className="bg-white/90 backdrop-blur-sm border-rose-200 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                {insight.type === 'positive' && <TrendingUp className="w-4 h-4 text-green-600" />}
                {insight.type === 'warning' && <TrendingDown className="w-4 h-4 text-orange-600" />}
                {insight.type === 'neutral' && <Target className="w-4 h-4 text-blue-600" />}
                {insight.type === 'info' && <Bell className="w-4 h-4 text-rose-600" />}
                {insight.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
              <p className="text-xs text-charcoal font-medium bg-rose-50 p-2 rounded border border-rose-200">
                💡 {insight.action}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Financial Health Score */}
      <Card className="bg-white/90 backdrop-blur-sm border-rose-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-charcoal">Financial Health Score</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Savings Rate</span>
              <span className="text-sm text-muted-foreground">{savingsRate.toFixed(1)}%</span>
            </div>
            <Progress 
              value={Math.min(Math.max(savingsRate, 0), 100)} 
              className="h-2"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Goal Progress</span>
              <span className="text-sm text-muted-foreground">
                {goals?.length || 0} active goals
              </span>
            </div>
            <div className="grid grid-cols-1 gap-2">
              {goals?.slice(0, 2).map((goal) => {
                const currentSavings = toNumber(goal?.current_savings);
                const targetAmount = toNumber(goal?.target_amount || 1);
                const progress = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 0;
                
                return (
                  <div key={goal?.id} className="text-xs">
                    <div className="flex justify-between mb-1">
                      <span>{goal?.name || 'Untitled Goal'}</span>
                      <span>{progress.toFixed(0)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(Math.max(progress, 0), 100)} 
                      className="h-1"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investment Recommendations */}
      {recommendedInvestments.length > 0 && (
        <Card className="bg-white/90 backdrop-blur-sm border-rose-200 shadow-lg">
          <CardHeader>
            <CardTitle className="text-charcoal">Recommended Investments</CardTitle>
            <p className="text-sm text-muted-foreground">
              Based on your available surplus of ₹{Math.max(0, monthlyIncome - totalExpenses).toLocaleString()}/month
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {recommendedInvestments.map((investment, index) => (
              <div key={index} className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-medium text-charcoal">{investment.name}</h4>
                    <p className="text-xs text-muted-foreground">{investment.description}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="bg-white border-rose-300 text-rose-700">
                      {investment.risk}
                    </Badge>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-rose-600">
                    ₹{investment.amount.toLocaleString()}/month
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {investment.allocation}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* No Data Message */}
      {(!expenses || expenses.length === 0) && (!goals || goals.length === 0) && (
        <Card className="bg-white/90 backdrop-blur-sm border-rose-200 shadow-lg">
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Start by adding some expenses and goals to get personalized AI insights!
            </p>
            <p className="text-sm text-rose-600">
              💡 The more data you add, the better our recommendations become.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
