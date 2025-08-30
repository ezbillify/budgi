
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Edit, Check, X } from 'lucide-react';

interface EditMonthlyIncomeFormProps {
  currentIncome: number;
  onUpdate: () => void;
}

export const EditMonthlyIncomeForm: React.FC<EditMonthlyIncomeFormProps> = ({
  currentIncome,
  onUpdate
}) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [newIncome, setNewIncome] = useState(currentIncome.toString());
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const incomeValue = parseFloat(newIncome) || 0;

      const { error } = await supabase
        .from('profiles')
        .update({ monthly_income: incomeValue })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Monthly income updated! 💰",
        description: `Your monthly income has been set to ₹${incomeValue.toLocaleString()}`,
      });

      setIsEditing(false);
      onUpdate();
    } catch (error: any) {
      toast({
        title: "Error updating income",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setNewIncome(currentIncome.toString());
    setIsEditing(false);
  };

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-green-800 text-lg flex items-center justify-between">
          Monthly Base Salary
          {!isEditing && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-green-700 border-green-300 hover:bg-green-100"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="monthly-income" className="text-green-700">
                Enter your monthly income
              </Label>
              <Input
                id="monthly-income"
                type="number"
                value={newIncome}
                onChange={(e) => setNewIncome(e.target.value)}
                placeholder="Enter amount"
                className="mt-1"
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="w-4 h-4 mr-1" />
                Save
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                size="sm"
                className="border-gray-300"
              >
                <X className="w-4 h-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-3xl font-bold text-green-600">
              ₹{Number(currentIncome).toLocaleString()}
            </p>
            <p className="text-sm text-green-700 mt-1">
              {currentIncome > 0 ? 'Your current monthly income' : 'Click Edit to set your monthly income'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
