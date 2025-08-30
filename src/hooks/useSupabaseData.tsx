
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from '@/hooks/use-toast';

export const useSupabaseData = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<any[]>([]);
  const [goals, setGoals] = useState<any[]>([]);
  const [extraIncomes, setExtraIncomes] = useState<any[]>([]);
  const [reminders, setReminders] = useState<any[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [utilityPayments, setUtilityPayments] = useState<any[]>([]);
  const [savingsChallenges, setSavingsChallenges] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [investmentPreferences, setInvestmentPreferences] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      console.log('Fetching user data for:', user.email);

      // First, try to get the user profile
      let { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      // If no profile exists, create one from the user metadata
      if (!profile) {
        console.log('No profile found, creating one...');
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            name: user.user_metadata?.name || user.email,
            email: user.email,
            employment_category: user.user_metadata?.employment_category || 'working',
            monthly_income: user.user_metadata?.monthly_income || 0
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
        } else {
          profile = newProfile;
          console.log('Profile created:', profile);
        }
      }

      if (profile) {
        setUserProfile(profile);
        console.log('User profile loaded:', profile);
        
        // Auto-create emergency fund if not exists and user has income
        if (profile.monthly_income && profile.monthly_income > 0) {
          await createEmergencyFundIfNeeded(profile);
        }
      }

      // Fetch all existing data
      const [
        { data: expensesData },
        { data: goalsData },
        { data: incomeData },
        { data: remindersData },
        { data: paymentsData },
        { data: challengesData },
        { data: notificationsData },
        { data: investmentData }
      ] = await Promise.all([
        supabase.from('expenses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('extra_income').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('reminders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('utility_payments').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('savings_challenges').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('investment_preferences').select('*').eq('user_id', user.id).maybeSingle()
      ]);

      setExpenses(expensesData || []);
      setGoals(goalsData || []);
      setExtraIncomes(incomeData || []);
      setReminders(remindersData || []);
      setUtilityPayments(paymentsData || []);
      setSavingsChallenges(challengesData || []);
      setNotifications(notificationsData || []);
      setInvestmentPreferences(investmentData);

      console.log('All data loaded successfully');

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const createEmergencyFundIfNeeded = async (profile: any) => {
    const { data: existingEmergencyFund } = await supabase
      .from('goals')
      .select('id')
      .eq('user_id', user!.id)
      .eq('goal_type', 'emergency')
      .maybeSingle();

    if (!existingEmergencyFund && profile.monthly_income) {
      const emergencyTarget = profile.monthly_income * 6; // 6 months emergency fund
      const autoAllocation = profile.employment_category === 'working' ? 15 : 10; // 15% for working, 10% for others

      await supabase.from('goals').insert({
        user_id: user!.id,
        name: 'Medical Emergency Fund',
        target_amount: emergencyTarget,
        goal_type: 'emergency',
        frequency: 'monthly',
        auto_allocation_percentage: autoAllocation,
        is_emergency_fund: true
      });

      // Update profile with emergency fund target
      await supabase
        .from('profiles')
        .update({ emergency_fund_target: emergencyTarget })
        .eq('id', user!.id);
    }
  };

  const addExpense = async (expenseData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('expenses')
        .insert([{ ...expenseData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setExpenses(prev => [data, ...prev]);
      toast({
        title: "Expense added successfully! 💰",
        description: `₹${expenseData.amount} added to ${expenseData.category}`,
      });
    } catch (error: any) {
      console.error('Error adding expense:', error);
      toast({
        title: "Error adding expense",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addGoal = async (goalData: any) => {
    if (!user) return;

    try {
      // Ensure required fields are present
      const cleanGoalData = {
        user_id: user.id,
        name: goalData.name,
        target_amount: Number(goalData.target_amount),
        frequency: goalData.frequency || 'monthly',
        current_savings: Number(goalData.current_savings) || 0,
        goal_type: goalData.goal_type || 'general',
        is_emergency_fund: goalData.is_emergency_fund || false,
        ...(goalData.deadline && { deadline: goalData.deadline }),
        ...(goalData.auto_allocation_percentage && { auto_allocation_percentage: goalData.auto_allocation_percentage })
      };

      const { data, error } = await supabase
        .from('goals')
        .insert([cleanGoalData])
        .select()
        .single();

      if (error) {
        console.error('Database error:', error);
        throw error;
      }

      setGoals(prev => [data, ...prev]);
      toast({
        title: "Goal created! 🎯",
        description: `Your ${goalData.name} goal is now being tracked.`,
      });
    } catch (error: any) {
      console.error('Error creating goal:', error);
      toast({
        title: "Error creating goal",
        description: error.message || 'Failed to create goal. Please try again.',
        variant: "destructive",
      });
    }
  };

  const addExtraIncome = async (incomeData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('extra_income')
        .insert([{ ...incomeData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setExtraIncomes(prev => [data, ...prev]);
      toast({
        title: "Extra income added! 💰",
        description: `₹${incomeData.amount} from ${incomeData.source}`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding income",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addReminder = async (reminderData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('reminders')
        .insert([{ ...reminderData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setReminders(prev => [data, ...prev]);
      toast({
        title: "Reminder added! 🔔",
        description: `${reminderData.title} reminder set for ${reminderData.due_date}`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding reminder",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addUtilityPayment = async (paymentData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('utility_payments')
        .insert([{ ...paymentData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setUtilityPayments(prev => [data, ...prev]);
      toast({
        title: "Payment recorded! 💳",
        description: `₹${paymentData.amount} ${paymentData.utility_type} payment added`,
      });
    } catch (error: any) {
      toast({
        title: "Error recording payment",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addSavingsChallenge = async (challengeData: any) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('savings_challenges')
        .insert([{ ...challengeData, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;

      setSavingsChallenges(prev => [data, ...prev]);
      toast({
        title: "Challenge started! 🎯",
        description: `Your ${challengeData.title} challenge is now active`,
      });
    } catch (error: any) {
      toast({
        title: "Error creating challenge",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addChallengeProgress = async (challengeId: string, amount: number) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('challenge_progress')
        .insert([{ challenge_id: challengeId, amount }]);

      if (error) throw error;

      // Update challenge streak
      const { data: challenge } = await supabase
        .from('savings_challenges')
        .select('current_streak, target_amount')
        .eq('id', challengeId)
        .single();

      if (challenge) {
        const newStreak = challenge.current_streak + 1;
        await supabase
          .from('savings_challenges')
          .update({ current_streak: newStreak })
          .eq('id', challengeId);

        // Refresh challenges data
        fetchUserData();
      }

      toast({
        title: "Progress added! 🎉",
        description: `₹${amount} added to your challenge`,
      });
    } catch (error: any) {
      toast({
        title: "Error adding progress",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  return {
    expenses,
    goals,
    extraIncomes,
    reminders,
    userProfile,
    utilityPayments,
    savingsChallenges,
    notifications,
    investmentPreferences,
    loading,
    addExpense,
    addGoal,
    addExtraIncome,
    addReminder,
    addUtilityPayment,
    addSavingsChallenge,
    addChallengeProgress,
    refetch: fetchUserData
  };
};
