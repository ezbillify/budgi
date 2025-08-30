
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import { CreditCard } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayPaymentProps {
  amount: number;
  description: string;
  onSuccess?: (paymentId: string) => void;
  onFailure?: (error: any) => void;
}

export const RazorpayPayment: React.FC<RazorpayPaymentProps> = ({
  amount,
  description,
  onSuccess,
  onFailure
}) => {
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    name: '',
    email: '',
    phone: ''
  });

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    if (!paymentData.name || !paymentData.email || !paymentData.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        toast({
          title: "Payment Error",
          description: "Failed to load payment gateway. Please try again.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const options = {
        key: 'rzp_test_9WBK2gOakAVZjq', // Replace with your Razorpay key
        amount: amount * 100, // Razorpay expects amount in paise
        currency: 'INR',
        name: 'Women\'s Budget 🌸',
        description: description,
        image: '/placeholder.svg',
        handler: function (response: any) {
          toast({
            title: "Payment Successful! 🎉",
            description: `Payment ID: ${response.razorpay_payment_id}`,
          });
          
          if (onSuccess) {
            onSuccess(response.razorpay_payment_id);
          }
          
          setLoading(false);
        },
        prefill: {
          name: paymentData.name,
          email: paymentData.email,
          contact: paymentData.phone
        },
        notes: {
          address: 'Women\'s Budget App'
        },
        theme: {
          color: '#8B5CF6'
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process",
              variant: "destructive"
            });
          }
        }
      };

      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response: any) {
        toast({
          title: "Payment Failed",
          description: response.error.description,
          variant: "destructive"
        });
        
        if (onFailure) {
          onFailure(response.error);
        }
        
        setLoading(false);
      });

      paymentObject.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
      <CardHeader>
        <CardTitle className="text-purple-900 flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Payment Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="flex justify-between items-center">
            <span className="font-medium">Amount to Pay:</span>
            <span className="text-2xl font-bold text-purple-600">₹{amount.toLocaleString()}</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              placeholder="Enter your full name"
              value={paymentData.name}
              onChange={(e) => setPaymentData({ ...paymentData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={paymentData.email}
              onChange={(e) => setPaymentData({ ...paymentData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Enter your phone number"
              value={paymentData.phone}
              onChange={(e) => setPaymentData({ ...paymentData, phone: e.target.value })}
              required
            />
          </div>
        </div>

        <Button
          onClick={handlePayment}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3"
          size="lg"
        >
          {loading ? 'Processing...' : `Pay ₹${amount.toLocaleString()} with Razorpay`}
        </Button>

        <div className="text-center">
          <p className="text-xs text-muted-foreground">
            Secure payments powered by Razorpay
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
