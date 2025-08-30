
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { User } from '@/types/database';

interface OnboardingFlowProps {
  onComplete: (user: User) => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState<Partial<User>>({});

  const totalSteps = 3;
  const progress = (step / totalSteps) * 100;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      // Complete onboarding - create full user object
      const completeUser: User = {
        id: '',
        name: userData.name || '',
        email: userData.email || '',
        employment_category: userData.employment_category || userData.employmentCategory || 'working',
        employmentCategory: userData.employmentCategory || userData.employment_category || 'working',
        monthly_income: userData.monthly_income || userData.monthlyIncome,
        monthlyIncome: userData.monthlyIncome || userData.monthly_income,
        created_at: ''
      };
      onComplete(completeUser);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return userData.name && userData.email;
      case 2:
        return userData.employment_category || userData.employmentCategory;
      case 3:
        return true; // Income is optional
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen gradient-main flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white/95 backdrop-blur-sm border-card-bg shadow-xl">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 gradient-warm rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl">🌸</span>
          </div>
          <CardTitle className="text-2xl font-bold text-main">
            Welcome to Your Financial Journey
          </CardTitle>
          <p className="text-muted-foreground">
            Let's set up your personalized budgeting experience
          </p>
          <div className="mt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-xs text-muted-foreground mt-2">
              Step {step} of {totalSteps}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-main">Tell us about yourself</h3>
                <p className="text-sm text-muted-foreground">Basic information to get started</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Enter your full name"
                  value={userData.name || ''}
                  onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  className="bg-input-bg border-card-bg focus:border-header-cta"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={userData.email || ''}
                  onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  className="bg-input-bg border-card-bg focus:border-header-cta"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-charcoal">What describes you best?</h3>
                <p className="text-sm text-muted-foreground">This helps us personalize your experience</p>
              </div>
              
              <div className="space-y-2">
                <Label>Employment Category</Label>
                <Select
                  value={userData.employment_category || userData.employmentCategory}
                  onValueChange={(value: 'working' | 'student' | 'non-working' | 'entrepreneur') => 
                    setUserData({ 
                      ...userData, 
                      employment_category: value,
                      employmentCategory: value
                    })
                  }
                >
                  <SelectTrigger className="border-rose-200 focus:border-rose-400">
                    <SelectValue placeholder="Select your category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="working">Working Woman 👩‍💼</SelectItem>
                    <SelectItem value="student">Student 🎓</SelectItem>
                    <SelectItem value="non-working">Non-working Woman 🏠</SelectItem>
                    <SelectItem value="entrepreneur">Entrepreneur 🚀</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-rose-50 p-4 rounded-lg border border-rose-200">
                <h4 className="font-medium text-rose-700 mb-2">
                  {(userData.employment_category || userData.employmentCategory) === 'working' && "Great! We'll help you manage your salary and build wealth."}
                  {(userData.employment_category || userData.employmentCategory) === 'student' && "Perfect! We'll help you budget scholarships and part-time income."}
                  {(userData.employment_category || userData.employmentCategory) === 'non-working' && "Wonderful! We'll focus on household budgeting and reverse budgeting."}
                  {(userData.employment_category || userData.employmentCategory) === 'entrepreneur' && "Amazing! We'll help you manage business and personal finances."}
                </h4>
                <p className="text-sm text-rose-600">
                  Your personalized AI suggestions will be tailored to your lifestyle.
                </p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="text-center mb-4">
                <h3 className="text-lg font-semibold text-charcoal">Monthly Income</h3>
                <p className="text-sm text-muted-foreground">This helps us provide better suggestions (optional)</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="income">Monthly Income (₹)</Label>
                <Input
                  id="income"
                  type="number"
                  placeholder="Enter your monthly income"
                  value={userData.monthly_income || userData.monthlyIncome || ''}
                  onChange={(e) => {
                    const value = e.target.value ? Number(e.target.value) : undefined;
                    setUserData({ 
                      ...userData, 
                      monthly_income: value,
                      monthlyIncome: value
                    });
                  }}
                  className="border-rose-200 focus:border-rose-400"
                />
              </div>

              <div className="bg-gradient-rose p-4 rounded-lg">
                <h4 className="font-medium text-rose-700 mb-2">🎉 You're all set!</h4>
                <p className="text-sm text-rose-600">
                  We'll create a personalized dashboard with AI-powered insights, 
                  savings suggestions, and budgeting tips tailored just for you.
                </p>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 border-card-bg text-header-cta hover:bg-card-bg"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!isStepValid()}
              className={`${step === 1 ? 'w-full' : 'flex-1'} bg-header-cta hover:bg-header-cta/90 text-white disabled:opacity-50`}
            >
              {step === totalSteps ? 'Start My Journey 🌸' : 'Continue'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
