
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Target, Calendar, Zap, Plus } from 'lucide-react';

interface SavingsChallengeProps {
  challenges: any[];
  onCreateChallenge: (challengeData: any) => Promise<void>;
  onAddProgress: (challengeId: string, amount: number) => Promise<void>;
}

export const SavingsChallenge: React.FC<SavingsChallengeProps> = ({
  challenges,
  onCreateChallenge,
  onAddProgress
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    target_amount: '',
    frequency: 'weekly',
    duration_weeks: '4'
  });
  const [progressAmounts, setProgressAmounts] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateChallenge = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.target_amount) return;

    setIsSubmitting(true);
    try {
      await onCreateChallenge({
        title: formData.title,
        target_amount: Number(formData.target_amount),
        frequency: formData.frequency,
        duration_weeks: Number(formData.duration_weeks)
      });

      // Reset form
      setFormData({
        title: '',
        target_amount: '',
        frequency: 'weekly',
        duration_weeks: '4'
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddProgress = async (challengeId: string) => {
    const amount = Number(progressAmounts[challengeId]);
    if (amount > 0) {
      await onAddProgress(challengeId, amount);
      setProgressAmounts({ ...progressAmounts, [challengeId]: '' });
    }
  };

  const activeChallenge = challenges.find(c => !c.completed);
  const completedChallenges = challenges.filter(c => c.completed);

  return (
    <div className="space-y-6">
      {/* Create Challenge Button - Always visible */}
      <div className="flex justify-center">
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-teal-700 hover:bg-teal-800 text-white"
          size="lg"
        >
          <Plus className="w-5 h-5 mr-2" />
          Start New Challenge
        </Button>
      </div>

      {/* Create Challenge Form */}
      {showCreateForm && (
        <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <CardTitle className="text-yellow-800 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Create New Savings Challenge
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateChallenge} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Challenge Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., 30-Day Savings Sprint"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white border-yellow-300 focus:border-yellow-500"
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
                    className="bg-white border-yellow-300 focus:border-yellow-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                  >
                    <SelectTrigger className="bg-white border-yellow-300 focus:border-yellow-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-yellow-300">
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration_weeks">Duration (weeks)</Label>
                  <Input
                    id="duration_weeks"
                    type="number"
                    min="1"
                    max="52"
                    value={formData.duration_weeks}
                    onChange={(e) => setFormData({ ...formData, duration_weeks: e.target.value })}
                    className="bg-white border-yellow-300 focus:border-yellow-500"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.title || !formData.target_amount}
                  className="flex-1 bg-teal-700 hover:bg-teal-800 text-white disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Start Challenge'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Active Challenge */}
      {activeChallenge && (
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {activeChallenge.title}
              </div>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                Active
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-800">₹{Number(activeChallenge.target_amount).toLocaleString()}</div>
                <div className="text-sm text-green-600">Target Amount</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg border border-green-200">
                <div className="text-2xl font-bold text-green-800">{activeChallenge.current_streak}</div>
                <div className="text-sm text-green-600">Current Streak</div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Challenge Progress</span>
                <span>{activeChallenge.frequency.charAt(0).toUpperCase() + activeChallenge.frequency.slice(1)}</span>
              </div>
              <Progress 
                value={(activeChallenge.current_streak / (activeChallenge.duration_weeks * 7)) * 100} 
                className="h-3"
              />
            </div>

            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Enter amount"
                value={progressAmounts[activeChallenge.id] || ''}
                onChange={(e) => setProgressAmounts({ 
                  ...progressAmounts, 
                  [activeChallenge.id]: e.target.value 
                })}
                className="bg-white border-green-300 focus:border-green-500"
              />
              <Button
                onClick={() => handleAddProgress(activeChallenge.id)}
                disabled={!progressAmounts[activeChallenge.id] || Number(progressAmounts[activeChallenge.id]) <= 0}
                className="bg-teal-700 hover:bg-teal-800 text-white"
              >
                Add Progress
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completed Challenges */}
      {completedChallenges.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-gray-700 flex items-center gap-2">
              <Trophy className="w-5 h-5" />
              Completed Challenges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {completedChallenges.map((challenge) => (
                <div key={challenge.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                  <div>
                    <h3 className="font-semibold">{challenge.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Target: ₹{Number(challenge.target_amount).toLocaleString()} • 
                      Final Streak: {challenge.current_streak}
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    ✓ Completed
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {challenges.length === 0 && !showCreateForm && (
        <Card className="text-center py-12">
          <CardContent>
            <Trophy className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Challenges Yet</h3>
            <p className="text-gray-500 mb-6">
              Start your first savings challenge to build better money habits!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
