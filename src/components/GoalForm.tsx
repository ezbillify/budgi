
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

interface GoalFormProps {
  onAddGoal: (goalData: any) => Promise<void>;
  onClose?: () => void;
}

export const GoalForm: React.FC<GoalFormProps> = ({ onAddGoal, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly',
    deadline: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.target_amount) return;

    setIsSubmitting(true);
    try {
      const amount = Number(formData.target_amount);
      const goalData: any = {
        name: formData.name,
        target_amount: amount,
        frequency: formData.frequency,
        current_savings: 0,
        goal_type: 'general'
      };

      // Only add deadline if it's provided
      if (formData.deadline) {
        goalData.deadline = formData.deadline;
      }

      await onAddGoal(goalData);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        target_amount: '',
        frequency: 'monthly',
        deadline: ''
      });
      
      // Close the form if onClose is provided
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-pink-800">Create Savings Goal</CardTitle>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Goal Name</Label>
              <Input
                id="name"
                placeholder="e.g., Vacation Fund"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-input-bg border-card-bg focus:border-pink-600"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="target_amount">Target Amount (₹)</Label>
              <Input
                id="target_amount"
                type="number"
                min="1"
                placeholder="Enter target amount"
                value={formData.target_amount}
                onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                className="bg-input-bg border-card-bg focus:border-pink-600"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Saving Frequency</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                  setFormData({ ...formData, frequency: value })
                }
              >
                <SelectTrigger className="bg-input-bg border-card-bg focus:border-pink-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white border-card-bg z-50">
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Target Date (Optional)</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="bg-input-bg border-card-bg focus:border-pink-600"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !formData.name || !formData.target_amount}
                className="flex-1 bg-pink-800 hover:bg-pink-900 text-white disabled:opacity-50"
              >
                {isSubmitting ? 'Creating...' : 'Create Goal'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
