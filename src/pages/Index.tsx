import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/DashboardOverview";
import { ExpenseForm } from "@/components/ExpenseForm";
import { GoalForm } from "@/components/GoalForm";
import { ExtraIncomeForm } from "@/components/ExtraIncomeForm";
import { ReminderForm } from "@/components/ReminderForm";
import { UtilityPayments } from "@/components/UtilityPayments";
import { SavingsChallenge } from "@/components/SavingsChallenge";
import { StudentDashboard } from "@/components/StudentDashboard";
import { WeddingGoals } from "@/components/WeddingGoals";
import { InvestmentRecommendations } from "@/components/InvestmentRecommendations";
import { TensorFlowPredictions } from "@/components/TensorFlowPredictions";
import { FinancialNews } from "@/components/FinancialNews";
import { AIInsights } from "@/components/AIInsights";
import { EditMonthlyIncomeForm } from "@/components/EditMonthlyIncomeForm";
import { useSupabaseData } from "@/hooks/useSupabaseData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  PlusCircle, 
  Target, 
  IndianRupee, 
  Bell, 
  Receipt, 
  Trophy, 
  Heart, 
  TrendingUp,
  Brain,
  Newspaper,
  BarChart3,
  LogOut,
  Plus
} from "lucide-react";

const Index = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [showIncomeForm, setShowIncomeForm] = useState(false);
  
  const {
    expenses,
    goals,
    extraIncomes,
    reminders,
    userProfile,
    utilityPayments,
    savingsChallenges,
    notifications,
    loading: dataLoading,
    addExpense,
    addGoal,
    addExtraIncome,
    addReminder,
    addUtilityPayment,
    addSavingsChallenge,
    addChallengeProgress,
    refetch
  } = useSupabaseData();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddExpense = async (expenseData: any) => {
    await addExpense(expenseData);
    setShowExpenseForm(false);
    await refetch(); // Refresh data to show new expense
  };

  const handleAddGoal = async (goalData: any) => {
    console.log('Adding goal:', goalData);
    await addGoal(goalData);
    setShowGoalForm(false);
    await refetch(); // Refresh data to show new goal
  };

  const handleCloseGoalForm = () => {
    setShowGoalForm(false);
  };

  const handleCloseExpenseForm = () => {
    setShowExpenseForm(false);
  };

  const handleAddIncome = async (incomeData: any) => {
    await addExtraIncome(incomeData);
    setShowIncomeForm(false);
    await refetch(); // Refresh data to show new income
  };

  const allocateToEmergencyFund = async (amount: number) => {
    if (!user) return;

    try {
      // Find the emergency fund goal
      const emergencyFund = goals.find(goal => goal.is_emergency_fund);
      
      if (!emergencyFund) {
        toast({
          title: "No emergency fund found",
          description: "Please create an emergency fund goal first.",
          variant: "destructive",
        });
        return;
      }

      // Update the emergency fund with new allocation
      const newSavings = (emergencyFund.current_savings || 0) + amount;
      
      const { error } = await supabase
        .from('goals')
        .update({ 
          current_savings: newSavings,
          updated_at: new Date().toISOString()
        })
        .eq('id', emergencyFund.id);

      if (error) throw error;

      // Refresh data
      await refetch();
      
      toast({
        title: "Emergency fund updated! 💰",
        description: `₹${amount} allocated to your emergency fund.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating emergency fund",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const updateGoalProgress = async (goalId: string, amount: number) => {
    if (!user) return;

    try {
      const goal = goals.find(g => g.id === goalId);
      if (!goal) return;

      const newSavings = (goal.current_savings || 0) + amount;
      
      const { error } = await supabase
        .from('goals')
        .update({ 
          current_savings: newSavings,
          updated_at: new Date().toISOString()
        })
        .eq('id', goalId);

      if (error) throw error;

      await refetch();
      
      toast({
        title: "Goal updated! 🎯",
        description: `₹${amount} added to ${goal.name}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating goal",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen gradient-main flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen gradient-main flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-white mb-4">BUDGI</h1>
          <p className="text-white/80 mb-6">Please sign in to access your financial dashboard</p>
          <Button 
            onClick={() => navigate('/auth')}
            className="bg-white text-pink-800 hover:bg-white/90"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
  const totalExtraIncome = extraIncomes.reduce((sum, income) => sum + Number(income.amount), 0);
  const totalIncome = totalExtraIncome + (userProfile?.monthly_income || 0);

  const isStudent = userProfile?.employment_category === 'student';
  const emergencyFund = goals.find(goal => goal.is_emergency_fund);

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-card-bg bg-white">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <img 
                src="/lovable-uploads/a4f513a5-a15a-4f77-8c8b-f3e09826b37e.png" 
                alt="BUDGI Logo" 
                className="w-8 h-8 object-contain"
              />
              <h1 className="text-2xl font-bold text-pink-800">BUDGI</h1>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-sm text-muted-foreground">
                Welcome, {userProfile?.name || user.email}
              </p>
              <Button 
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Emergency Fund Quick Allocation */}
        {emergencyFund && (
          <div className="mb-6">
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-green-800">Emergency Fund</h3>
                    <p className="text-sm text-green-600">
                      ₹{Number(emergencyFund.current_savings || 0).toLocaleString()} / ₹{Number(emergencyFund.target_amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => allocateToEmergencyFund(500)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      +₹500
                    </Button>
                    <Button 
                      onClick={() => allocateToEmergencyFund(1000)}
                      size="sm"
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      +₹1000
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 bg-card-bg">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="add-expense" className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Expense</span>
            </TabsTrigger>
            <TabsTrigger value="goals" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Goals</span>
            </TabsTrigger>
            <TabsTrigger value="income" className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              <span className="hidden sm:inline">Income</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <Receipt className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="challenges" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Challenges</span>
            </TabsTrigger>
            <TabsTrigger value="wedding" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Wedding</span>
            </TabsTrigger>
            <TabsTrigger value="investments" className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              <span className="hidden sm:inline">Invest</span>
            </TabsTrigger>
            <TabsTrigger value="ai-insights" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              <span className="hidden sm:inline">AI</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {isStudent ? (
              <StudentDashboard 
                userProfile={userProfile}
                expenses={expenses}
                goals={goals}
                extraIncomes={extraIncomes}
                reminders={reminders}
                savingsChallenges={savingsChallenges}
                notifications={notifications}
              />
            ) : (
              <DashboardOverview 
                userProfile={userProfile}
                expenses={expenses}
                goals={goals}
                extraIncomes={extraIncomes}
                reminders={reminders}
                savingsChallenges={savingsChallenges}
                notifications={notifications}
              />
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <FinancialNews />
              <TensorFlowPredictions 
                expenses={expenses}
                income={totalIncome}
              />
            </div>
          </TabsContent>

          <TabsContent value="add-expense" className="space-y-6">
            <div className="flex justify-center mb-6">
              <Button
                onClick={() => setShowExpenseForm(true)}
                className="bg-pink-800 hover:bg-pink-900 text-white"
                size="lg"
              >
                <PlusCircle className="w-5 h-5 mr-2" />
                Add New Expense
              </Button>
            </div>
            
            {showExpenseForm && (
              <ExpenseForm 
                onAddExpense={handleAddExpense} 
                onClose={handleCloseExpenseForm}
              />
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Recent Expenses</CardTitle>
              </CardHeader>
              <CardContent>
                {expenses.length > 0 ? (
                  <div className="space-y-3">
                    {expenses.slice(0, 10).map((expense) => (
                      <div key={expense.id} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
                        <div>
                          <p className="font-semibold text-lg">{expense.category}</p>
                          <p className="text-sm text-muted-foreground">{expense.description || expense.notes}</p>
                          <p className="text-xs text-muted-foreground">{new Date(expense.date).toLocaleDateString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-600 text-lg">₹{Number(expense.amount).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg mb-4">No expenses recorded yet</p>
                    <p className="text-sm text-muted-foreground">Click the button above to add your first expense!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-6">
            <div className="flex justify-center mb-6">
              <Button
                onClick={() => setShowGoalForm(true)}
                className="bg-pink-800 hover:bg-pink-900 text-white"
                size="lg"
              >
                <Target className="w-5 h-5 mr-2" />
                Create New Goal
              </Button>
            </div>
            
            {showGoalForm && (
              <GoalForm 
                onAddGoal={handleAddGoal} 
                onClose={handleCloseGoalForm}
              />
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your Goals</CardTitle>
              </CardHeader>
              <CardContent>
                {goals.length > 0 ? (
                  <div className="space-y-6">
                    {goals.map((goal) => {
                      const progress = goal.target_amount > 0 ? ((goal.current_savings || 0) / goal.target_amount) * 100 : 0;
                      return (
                        <div key={goal.id} className="p-6 border rounded-lg bg-card">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">{goal.name}</h3>
                              {goal.is_emergency_fund && (
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Emergency Fund</span>
                              )}
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                onClick={() => updateGoalProgress(goal.id, 500)}
                                size="sm"
                                className="bg-pink-800 hover:bg-pink-900 text-white"
                              >
                                +₹500
                              </Button>
                              <Button 
                                onClick={() => updateGoalProgress(goal.id, 1000)}
                                size="sm"
                                className="bg-pink-800 hover:bg-pink-900 text-white"
                              >
                                +₹1000
                              </Button>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm font-medium">
                              <span>Progress</span>
                              <span>{progress.toFixed(1)}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-3">
                              <div 
                                className="bg-pink-600 h-3 rounded-full transition-all duration-300" 
                                style={{ width: `${Math.min(progress, 100)}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="font-semibold">₹{Number(goal.current_savings || 0).toLocaleString()}</span>
                              <span className="font-semibold">₹{Number(goal.target_amount).toLocaleString()}</span>
                            </div>
                            {goal.deadline && (
                              <p className="text-xs text-muted-foreground">Target Date: {new Date(goal.deadline).toLocaleDateString()}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg mb-4">No goals set yet</p>
                    <p className="text-sm text-muted-foreground">Click the button above to create your first savings goal!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income" className="space-y-6">
            <div className="flex justify-center mb-6">
              <Button
                onClick={() => setShowIncomeForm(true)}
                className="bg-pink-800 hover:bg-pink-900 text-white"
                size="lg"
              >
                <IndianRupee className="w-5 h-5 mr-2" />
                Add Extra Income
              </Button>
            </div>
            
            <div className="grid gap-6">
              <EditMonthlyIncomeForm 
                currentIncome={userProfile?.monthly_income || 0}
                onUpdate={refetch}
              />
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl">Extra Income Sources</CardTitle>
                </CardHeader>
                <CardContent>
                  {extraIncomes.length > 0 ? (
                    <div className="space-y-3">
                      {extraIncomes.slice(0, 10).map((income) => (
                        <div key={income.id} className="flex justify-between items-center p-4 bg-muted/50 rounded-lg border">
                          <div>
                            <p className="font-semibold text-lg">{income.source}</p>
                            <p className="text-sm text-muted-foreground">{income.notes}</p>
                            <p className="text-xs text-muted-foreground">{new Date(income.date).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600 text-lg">₹{Number(income.amount).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground text-lg mb-4">No extra income recorded yet</p>
                      <p className="text-sm text-muted-foreground">Click the button above to add your side income sources!</p>
                    </div>
                  )}
                  
                  {totalExtraIncome > 0 && (
                    <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-blue-800">Total Extra Income:</span>
                        <span className="font-bold text-blue-600 text-xl">₹{totalExtraIncome.toLocaleString()}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {showIncomeForm && <ExtraIncomeForm onAddIncome={handleAddIncome} />}
          </TabsContent>

          <TabsContent value="reminders">
            <ReminderForm 
              onAddReminder={addReminder}
              existingReminders={reminders}
            />
          </TabsContent>

          <TabsContent value="payments">
            <UtilityPayments 
              utilityPayments={utilityPayments}
              onAddPayment={addUtilityPayment}
            />
          </TabsContent>

          <TabsContent value="challenges">
            <SavingsChallenge 
              challenges={savingsChallenges}
              onCreateChallenge={addSavingsChallenge}
              onAddProgress={addChallengeProgress}
            />
          </TabsContent>

          <TabsContent value="wedding">
            <WeddingGoals 
              userProfile={userProfile}
              goals={goals} 
              onAddGoal={addGoal} 
            />
          </TabsContent>

          <TabsContent value="investments">
            <InvestmentRecommendations 
              user={userProfile}
              totalExpenses={totalExpenses}
              totalExtraIncome={totalExtraIncome}
            />
          </TabsContent>

          <TabsContent value="ai-insights">
            <AIInsights 
              expenses={expenses}
              goals={goals}
              userProfile={userProfile}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
