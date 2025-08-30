
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RazorpayPayment } from '@/components/RazorpayPayment';
import { 
  Zap, 
  Wifi, 
  Smartphone, 
  Car, 
  Home, 
  Tv,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';

interface UtilityPaymentsProps {
  utilityPayments: any[];
  onAddPayment: (payment: any) => void;
}

const utilityTypes = [
  { value: 'electricity', label: 'Electricity', icon: Zap, color: 'bg-yellow-100 text-yellow-800' },
  { value: 'water', label: 'Water', icon: Home, color: 'bg-blue-100 text-blue-800' },
  { value: 'gas', label: 'Gas', icon: Car, color: 'bg-orange-100 text-orange-800' },
  { value: 'internet', label: 'Internet', icon: Wifi, color: 'bg-purple-100 text-purple-800' },
  { value: 'mobile', label: 'Mobile Recharge', icon: Smartphone, color: 'bg-green-100 text-green-800' },
  { value: 'dth', label: 'DTH/Cable', icon: Tv, color: 'bg-indigo-100 text-indigo-800' }
];

export const UtilityPayments: React.FC<UtilityPaymentsProps> = ({
  utilityPayments,
  onAddPayment
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    utility_type: '',
    provider_name: '',
    amount: '',
    due_date: '',
    notes: ''
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.utility_type || !formData.provider_name || !formData.amount) {
      return;
    }

    setShowPayment(true);
  };

  const handlePaymentSuccess = (paymentId: string) => {
    const paymentData = {
      ...formData,
      amount: Number(formData.amount),
      status: 'paid',
      razorpay_payment_id: paymentId
    };

    onAddPayment(paymentData);
    
    setFormData({
      utility_type: '',
      provider_name: '',
      amount: '',
      due_date: '',
      notes: ''
    });
    setIsOpen(false);
    setShowPayment(false);
  };

  const handlePaymentFailure = (error: any) => {
    console.error('Payment failed:', error);
    setShowPayment(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const totalPaidThisMonth = utilityPayments
    .filter(payment => {
      const paymentDate = new Date(payment.payment_date);
      const currentMonth = new Date();
      return paymentDate.getMonth() === currentMonth.getMonth() && 
             paymentDate.getFullYear() === currentMonth.getFullYear() &&
             payment.status === 'paid';
    })
    .reduce((sum, payment) => sum + Number(payment.amount), 0);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Utility Payments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div>
              <p className="text-2xl font-bold text-blue-900">₹{totalPaidThisMonth.toLocaleString()}</p>
              <p className="text-sm text-blue-600">Paid this month</p>
            </div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Pay Bill
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-blue-900">Pay Utility Bill</DialogTitle>
                </DialogHeader>
                
                {!showPayment ? (
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Utility Type</Label>
                      <Select
                        value={formData.utility_type}
                        onValueChange={(value) => setFormData({ ...formData, utility_type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select utility type" />
                        </SelectTrigger>
                        <SelectContent>
                          {utilityTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              <div className="flex items-center gap-2">
                                <type.icon className="w-4 h-4" />
                                {type.label}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="provider">Provider Name</Label>
                      <Input
                        id="provider"
                        placeholder="e.g., BSES, Airtel, Jio"
                        value={formData.provider_name}
                        onChange={(e) => setFormData({ ...formData, provider_name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount (₹)</Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="due_date">Due Date (Optional)</Label>
                      <Input
                        id="due_date"
                        type="date"
                        value={formData.due_date}
                        onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input
                        id="notes"
                        placeholder="Bill number, reference, etc."
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                      Proceed to Payment
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <RazorpayPayment
                      amount={Number(formData.amount)}
                      description={`${formData.provider_name} - ${formData.utility_type} bill payment`}
                      onSuccess={handlePaymentSuccess}
                      onFailure={handlePaymentFailure}
                    />
                    <Button
                      variant="outline"
                      onClick={() => setShowPayment(false)}
                      className="w-full"
                    >
                      Back to Bill Details
                    </Button>
                  </div>
                )}
              </DialogContent>
            </Dialog>
          </div>

          {/* Recent Payments */}
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-900">Recent Payments</h3>
            {utilityPayments.slice(0, 5).map((payment) => {
              const utilityType = utilityTypes.find(type => type.value === payment.utility_type);
              const IconComponent = utilityType?.icon || CreditCard;
              
              return (
                <div key={payment.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${utilityType?.color || 'bg-gray-100'}`}>
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{payment.provider_name}</p>
                      <p className="text-sm text-gray-600">{utilityType?.label || payment.utility_type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">₹{Number(payment.amount).toLocaleString()}</p>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(payment.status)}
                      <Badge variant="outline" className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
