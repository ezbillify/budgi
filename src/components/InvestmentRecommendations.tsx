
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Coins, Building } from 'lucide-react';
import { User } from '@/types/database';

interface InvestmentRecommendationsProps {
  user: User;
  totalExpenses: number;
  totalExtraIncome: number;
}

export const InvestmentRecommendations: React.FC<InvestmentRecommendationsProps> = ({
  user,
  totalExpenses,
  totalExtraIncome
}) => {
  const monthlyIncome = (user.monthly_income || user.monthlyIncome || 0) + totalExtraIncome;
  const monthlyExpenses = totalExpenses;
  const surplus = monthlyIncome - monthlyExpenses;
  const employmentCategory = user.employment_category || user.employmentCategory;

  const getRecommendations = () => {
    const baseRecommendations = [
      {
        title: 'Systematic Investment Plan (SIP)',
        description: 'Start with equity mutual funds for long-term wealth creation',
        suggestedAmount: Math.max(1000, surplus * 0.3),
        risk: 'Medium',
        icon: <TrendingUp className="w-5 h-5" />,
        timeframe: '5+ years'
      },
      {
        title: 'Public Provident Fund (PPF)',
        description: 'Tax-saving instrument with 15-year lock-in period',
        suggestedAmount: Math.min(150000, Math.max(500, surplus * 0.2)),
        risk: 'Low',
        icon: <Shield className="w-5 h-5" />,
        timeframe: '15 years'
      },
      {
        title: 'Emergency Fund',
        description: 'Liquid savings for unexpected expenses',
        suggestedAmount: monthlyExpenses * 6,
        risk: 'Very Low',
        icon: <Building className="w-5 h-5" />,
        timeframe: 'Immediate access'
      }
    ];

    if (employmentCategory === 'student') {
      return [
        {
          title: 'Recurring Deposit (RD)',
          description: 'Small, regular savings with guaranteed returns',
          suggestedAmount: Math.max(500, surplus * 0.5),
          risk: 'Very Low',
          icon: <Coins className="w-5 h-5" />,
          timeframe: '1-5 years'
        },
        ...baseRecommendations.slice(0, 2)
      ];
    }

    if (employmentCategory === 'entrepreneur') {
      return [
        ...baseRecommendations,
        {
          title: 'Gold Bonds/ETF',
          description: 'Hedge against inflation and market volatility',
          suggestedAmount: Math.max(1000, surplus * 0.1),
          risk: 'Medium',
          icon: <Coins className="w-5 h-5" />,
          timeframe: '3+ years'
        }
      ];
    }

    return baseRecommendations;
  };

  const recommendations = getRecommendations();

  return (
    <div className="space-y-4">
      <Card className="bg-white shadow-lg border border-card-bg">
        <CardHeader>
          <CardTitle className="text-main">Investment Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-card-bg/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Monthly Income</p>
              <p className="text-xl font-bold text-main">₹{monthlyIncome.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-card-bg/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Monthly Expenses</p>
              <p className="text-xl font-bold text-main">₹{monthlyExpenses.toLocaleString()}</p>
            </div>
            <div className="text-center p-4 bg-card-bg/30 rounded-lg">
              <p className="text-sm text-muted-foreground">Available for Investment</p>
              <p className={`text-xl font-bold ${surplus > 0 ? 'text-green-600' : 'text-red-600'}`}>
                ₹{surplus.toLocaleString()}
              </p>
            </div>
          </div>
          
          {surplus <= 0 && (
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                💡 Focus on reducing expenses before investing. Track your spending to identify areas for savings.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg border border-card-bg">
        <CardHeader>
          <CardTitle className="text-main">Recommended Investments</CardTitle>
          <p className="text-sm text-muted-foreground">
            Based on your profile: {employmentCategory?.charAt(0).toUpperCase() + employmentCategory?.slice(1)}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.map((investment, index) => (
              <div key={index} className="p-4 border border-card-bg rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-3">
                    <div className="text-icon-detail">
                      {investment.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-main">{investment.title}</h3>
                      <p className="text-sm text-muted-foreground">{investment.description}</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-card-bg border-card-bg text-header-cta">
                    {investment.risk} Risk
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Suggested Amount: </span>
                    <span className="font-medium text-main">₹{investment.suggestedAmount.toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Timeframe: </span>
                    <span className="font-medium text-main">{investment.timeframe}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {surplus > 0 && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                💡 Start with small amounts and gradually increase your investments as you become more comfortable.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
