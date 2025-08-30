import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Separator } from '@/components/ui/separator';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    employmentCategory: 'working' as 'working' | 'student' | 'non-working' | 'entrepreneur'
  });
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome back!",
          description: "You've successfully logged in to BUDGI.",
        });
        
        navigate('/');
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name: formData.name,
              employment_category: formData.employmentCategory
            }
          }
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          toast({
            title: "Account created!",
            description: "Please check your email to verify your account.",
          });
        } else {
          toast({
            title: "Account created!",
            description: "You can now log in to your BUDGI account.",
          });
          setIsLogin(true);
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      name: '',
      employmentCategory: 'working'
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen gradient-main flex items-center justify-center">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-main flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 flex items-center justify-center">
            <img 
              src="/lovable-uploads/a4f513a5-a15a-4f77-8c8b-f3e09826b37e.png" 
              alt="BUDGI Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">
            BUDGI
          </CardTitle>
          <p className="text-gray-600">
            {isLogin ? 'Welcome back!' : 'Start your financial journey'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                required
                minLength={6}
              />
            </div>

            {!isLogin && (
              <>
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-medium">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Employment Status</Label>
                  <Select
                    value={formData.employmentCategory}
                    onValueChange={(value: 'working' | 'student' | 'non-working' | 'entrepreneur') =>
                      setFormData({ ...formData, employmentCategory: value })
                    }
                  >
                    <SelectTrigger className="border-gray-300 focus:border-purple-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="working">Working Professional</SelectItem>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="non-working">Non-Working</SelectItem>
                      <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-700 hover:bg-indigo-800 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
              size="lg"
            >
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
          </form>

          <Separator />

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-3">
              {isLogin 
                ? "Don't have an account?" 
                : "Already have an account?"
              }
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={switchMode}
              className="w-full border-indigo-700 text-indigo-700 hover:bg-indigo-700 hover:text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200"
            >
              {isLogin 
                ? "Create New Account" 
                : "Sign In Instead"
              }
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 mt-4">
              By continuing, you agree to our Terms of Service and Privacy Policy
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;