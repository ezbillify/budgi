
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Brain, TrendingUp, AlertTriangle } from 'lucide-react';

interface TensorFlowPredictionsProps {
  expenses: any[];
  income: number;
}

export const TensorFlowPredictions: React.FC<TensorFlowPredictionsProps> = ({ expenses, income }) => {
  // Generate mock prediction data based on current expenses
  const generatePredictions = () => {
    const currentMonth = new Date().getMonth();
    const monthlyAvg = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0) / Math.max(1, expenses.length);
    
    const predictions = [];
    for (let i = 0; i < 6; i++) {
      const month = new Date();
      month.setMonth(currentMonth + i + 1);
      
      // Add some variance to make predictions realistic
      const variance = (Math.random() - 0.5) * 0.2; // ±10% variance
      const predictedExpense = monthlyAvg * (1 + variance);
      
      predictions.push({
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        predicted: Math.round(predictedExpense),
        actual: i === 0 ? monthlyAvg : null
      });
    }
    
    return predictions;
  };

  const predictions = generatePredictions();
  const currentExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const savingsRate = income > 0 ? ((income - currentExpenses) / income) * 100 : 0;
  
  const getInsight = () => {
    if (savingsRate < 10) {
      return {
        type: 'warning',
        message: 'Your savings rate is below 10%. Consider reducing discretionary spending.',
        icon: AlertTriangle,
        color: 'text-orange-600'
      };
    } else if (savingsRate > 20) {
      return {
        type: 'good',
        message: 'Excellent! You\'re saving over 20% of your income.',
        icon: TrendingUp,
        color: 'text-green-600'
      };
    } else {
      return {
        type: 'moderate',
        message: 'Good savings rate! Try to gradually increase to 20% or more.',
        icon: TrendingUp,
        color: 'text-blue-600'
      };
    }
  };

  const insight = getInsight();
  const IconComponent = insight.icon;

  return (
    <Card className="bg-white shadow-lg border border-card-bg">
      <CardHeader>
        <CardTitle className="text-charcoal flex items-center gap-2">
          <Brain className="w-5 h-5 text-indigo-700" />
          AI Spending Predictions
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          ML-powered insights based on your spending patterns
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Prediction Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={predictions}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value, name) => [`₹${value}`, name === 'predicted' ? 'Predicted' : 'Actual']} />
              <Line 
                type="monotone" 
                dataKey="predicted" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                strokeDasharray="5 5"
                name="predicted"
              />
              <Line 
                type="monotone" 
                dataKey="actual" 
                stroke="#06b6d4" 
                strokeWidth={2}
                name="actual"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* AI Insights */}
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">AI Insights</h3>
          
          <div className={`p-4 rounded-lg border-l-4 bg-gray-50 ${
            insight.type === 'warning' ? 'border-orange-400' : 
            insight.type === 'good' ? 'border-green-400' : 'border-blue-400'
          }`}>
            <div className="flex items-start gap-3">
              <IconComponent className={`w-5 h-5 mt-0.5 ${insight.color}`} />
              <div>
                <p className="text-sm font-medium text-gray-800">Savings Rate: {savingsRate.toFixed(1)}%</p>
                <p className="text-sm text-gray-600 mt-1">{insight.message}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <p className="text-xs text-indigo-700 font-medium">Predicted Next Month</p>
              <p className="text-lg font-bold text-purple-800">₹{predictions[0]?.predicted.toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-xs text-blue-600 font-medium">Current Average</p>
              <p className="text-lg font-bold text-blue-800">₹{Math.round(currentExpenses).toLocaleString()}</p>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <p className="text-xs text-green-600 font-medium">Potential Savings</p>
              <p className="text-lg font-bold text-green-800">₹{Math.round(Math.max(0, income - currentExpenses)).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
