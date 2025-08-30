
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Heart, Baby, Gift, Sparkles, Target, Plus } from 'lucide-react';

interface WeddingGoalsProps {
  userProfile: any;
  goals: any[];
  onAddGoal: (goal: any) => void;
}

export const WeddingGoals: React.FC<WeddingGoalsProps> = ({
  userProfile,
  goals,
  onAddGoal
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [goalType, setGoalType] = useState<'wedding' | 'maternity'>('wedding');
  const [formData, setFormData] = useState({
    name: '',
    target_amount: '',
    deadline: '',
    frequency: 'monthly' as 'daily' | 'weekly' | 'monthly'
  });

  const weddingGoalTemplates = [
    { name: 'Wedding Dress & Jewelry', amount: 150000, icon: Sparkles },
    { name: 'Wedding Venue & Catering', amount: 300000, icon: Gift },
    { name: 'Photography & Videography', amount: 80000, icon: Calendar },
    { name: 'Honeymoon Fund', amount: 200000, icon: Heart },
    { name: 'Wedding Decorations', amount: 100000, icon: Sparkles }
  ];

  const maternityGoalTemplates = [
    { name: 'Baby Essentials Fund', amount: 75000, icon: Baby },
    { name: 'Maternity Care & Hospital', amount: 150000, icon: Heart },
    { name: 'Baby Room Setup', amount: 100000, icon: Gift },
    { name: 'Childcare Emergency Fund', amount: 200000, icon: Target },
    { name: 'Baby Education Fund', amount: 500000, icon: Sparkles }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.target_amount) {
      onAddGoal({
        ...formData,
        target_amount: Number(formData.target_amount),
        goal_type: goalType,
        current_savings: 0
      });
      setFormData({
        name: '',
        target_amount: '',
        deadline: '',
        frequency: 'monthly'
      });
      setIsOpen(false);
    }
  };

  const startTemplateGoal = (template: typeof weddingGoalTemplates[0]) => {
    onAddGoal({
      name: template.name,
      target_amount: template.amount,
      goal_type: goalType,
      frequency: 'monthly',
      current_savings: 0
    });
  };

  const weddingGoals = goals.filter(g => g.goal_type === 'wedding');
  const maternityGoals = goals.filter(g => g.goal_type === 'maternity');

  const calculateMonthsToGoal = (target: number, currentSavings: number, monthlyIncome: number) => {
    const remaining = target - currentSavings;
    const monthlySavings = monthlyIncome * 0.1; // Assume 10% savings rate
    return monthlySavings > 0 ? Math.ceil(remaining / monthlySavings) : 0;
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
        <CardHeader>
          <CardTitle className="text-pink-900 flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Life Milestone Goals
          </CardTitle>
          <p className="text-pink-700">
            Plan for your special moments with dedicated savings goals 💕
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Button
              variant={goalType === 'wedding' ? 'default' : 'outline'}
              onClick={() => setGoalType('wedding')}
              className={goalType === 'wedding' ? 'bg-pink-600 hover:bg-pink-700' : 'border-pink-300 text-pink-700 hover:bg-pink-50'}
            >
              <Heart className="w-4 h-4 mr-2" />
              Wedding Goals
            </Button>
            <Button
              variant={goalType === 'maternity' ? 'default' : 'outline'}
              onClick={() => setGoalType('maternity')}
              className={goalType === 'maternity' ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-300 text-blue-700 hover:bg-blue-50'}
            >
              <Baby className="w-4 h-4 mr-2" />
              Maternity Goals
            </Button>
          </div>

          {/* Goal Templates */}
          <div className="grid gap-4 mb-6">
            <h3 className="font-semibold text-gray-800">
              {goalType === 'wedding' ? '💒 Wedding' : '👶 Maternity'} Goal Templates
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(goalType === 'wedding' ? weddingGoalTemplates : maternityGoalTemplates).map((template, index) => {
                const IconComponent = template.icon;
                return (
                  <div key={index} className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-full ${goalType === 'wedding' ? 'bg-pink-100' : 'bg-blue-100'}`}>
                          <IconComponent className={`w-4 h-4 ${goalType === 'wedding' ? 'text-pink-600' : 'text-blue-600'}`} />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{template.name}</h4>
                          <p className="text-sm text-gray-600">₹{template.amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => startTemplateGoal(template)}
                        className={goalType === 'wedding' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700'}
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Custom Goal Creation */}
          <div className="border-t border-gray-200 pt-4">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Custom {goalType === 'wedding' ? 'Wedding' : 'Maternity'} Goal
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {goalType === 'wedding' ? <Heart className="w-5 h-5 text-pink-600" /> : <Baby className="w-5 h-5 text-blue-600" />}
                    Create {goalType === 'wedding' ? 'Wedding' : 'Maternity'} Goal
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="goal-name">Goal Name</Label>
                    <Input
                      id="goal-name"
                      placeholder={goalType === 'wedding' ? 'Dream Wedding Fund' : 'Baby Preparation Fund'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="target-amount">Target Amount (₹)</Label>
                    <Input
                      id="target-amount"
                      type="number"
                      min="1000"
                      placeholder="500000"
                      value={formData.target_amount}
                      onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deadline">Target Date (Optional)</Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Savings Frequency</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                        setFormData({ ...formData, frequency: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    type="submit" 
                    className={`w-full ${goalType === 'wedding' ? 'bg-pink-600 hover:bg-pink-700' : 'bg-blue-600 hover:bg-blue-700'}`}
                  >
                    Create Goal
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Active Wedding Goals */}
      {weddingGoals.length > 0 && (
        <Card className="bg-white shadow-lg border border-card-bg">
          <CardHeader>
            <CardTitle className="text-pink-900 flex items-center gap-2">
              <Heart className="w-5 h-5" />
              Wedding Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weddingGoals.map((goal) => {
                const progress = (Number(goal.current_savings) / Number(goal.target_amount)) * 100;
                const monthsToGoal = calculateMonthsToGoal(
                  Number(goal.target_amount), 
                  Number(goal.current_savings), 
                  Number(userProfile.monthly_income || 0)
                );
                
                return (
                  <div key={goal.id} className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-pink-900">{goal.name}</h3>
                      <Badge variant="outline" className="bg-pink-100 text-pink-800">
                        {Math.round(progress)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>₹{Number(goal.current_savings).toLocaleString()} / ₹{Number(goal.target_amount).toLocaleString()}</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-xs text-pink-600">
                        <span>Frequency: {goal.frequency}</span>
                        {monthsToGoal > 0 && <span>Est. {monthsToGoal} months to goal</span>}
                        {goal.deadline && <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Active Maternity Goals */}
      {maternityGoals.length > 0 && (
        <Card className="bg-white shadow-lg border border-card-bg">
          <CardHeader>
            <CardTitle className="text-blue-900 flex items-center gap-2">
              <Baby className="w-5 h-5" />
              Maternity Goals Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {maternityGoals.map((goal) => {
                const progress = (Number(goal.current_savings) / Number(goal.target_amount)) * 100;
                const monthsToGoal = calculateMonthsToGoal(
                  Number(goal.target_amount), 
                  Number(goal.current_savings), 
                  Number(userProfile.monthly_income || 0)
                );
                
                return (
                  <div key={goal.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-blue-900">{goal.name}</h3>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {Math.round(progress)}%
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>₹{Number(goal.current_savings).toLocaleString()} / ₹{Number(goal.target_amount).toLocaleString()}</span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <div className="flex justify-between text-xs text-blue-600">
                        <span>Frequency: {goal.frequency}</span>
                        {monthsToGoal > 0 && <span>Est. {monthsToGoal} months to goal</span>}
                        {goal.deadline && <span>Due: {new Date(goal.deadline).toLocaleDateString()}</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
