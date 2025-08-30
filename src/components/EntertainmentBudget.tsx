
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Film, Music, Coffee } from 'lucide-react';

interface EntertainmentBudgetProps {
  monthlyIncome: number;
  entertainmentExpenses: number;
}

export const EntertainmentBudget: React.FC<EntertainmentBudgetProps> = ({
  monthlyIncome,
  entertainmentExpenses
}) => {
  const entertainmentBudget = monthlyIncome * 0.1; // 10% of income
  const usedPercentage = entertainmentBudget > 0 ? (entertainmentExpenses / entertainmentBudget) * 100 : 0;
  const remaining = Math.max(0, entertainmentBudget - entertainmentExpenses);

  return (
    <Card className="bg-white shadow-lg border border-card-bg">
      <CardHeader>
        <CardTitle className="text-main flex items-center gap-2">
          <Film className="w-5 h-5 text-icon-detail" />
          Entertainment Budget
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Monthly Budget (10% of income)</span>
            <span className="font-medium">₹{entertainmentBudget.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Spent This Month</span>
            <span className="font-medium text-red-600">₹{entertainmentExpenses.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Remaining</span>
            <span className="font-medium text-green-600">₹{remaining.toLocaleString()}</span>
          </div>
          <Progress value={Math.min(usedPercentage, 100)} className="h-2" />
        </div>

        {remaining > 0 && (
          <div className="p-3 bg-card-bg/30 rounded-lg">
            <p className="text-sm text-main font-medium mb-2">Suggested Activities:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Film className="w-3 h-3" />
                <span>Movie tickets: ₹200-400</span>
              </div>
              <div className="flex items-center gap-2">
                <Music className="w-3 h-3" />
                <span>Concert/Event: ₹500-1500</span>
              </div>
              <div className="flex items-center gap-2">
                <Coffee className="w-3 h-3" />
                <span>Cafe visit: ₹150-300</span>
              </div>
            </div>
          </div>
        )}

        {usedPercentage > 100 && (
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-sm text-red-700 font-medium">
              Over budget by ₹{(entertainmentExpenses - entertainmentBudget).toLocaleString()}
            </p>
            <p className="text-xs text-red-600 mt-1">
              Consider reducing entertainment spending this month.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
