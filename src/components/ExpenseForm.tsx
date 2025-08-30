
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface ExpenseFormProps {
  onAddExpense: (expenseData: any) => Promise<void>;
  onClose: () => void;
}

const expenseCategories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Personal Care',
  'Groceries',
  'Rent',
  'Insurance',
  'Investments',
  'Other'
];

export const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAddExpense, onClose }) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Number(formData.amount) > 0 && formData.category) {
      setIsSubmitting(true);
      try {
        const newExpense = {
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.notes || 'Expense',
          notes: formData.notes,
          date: formData.date
        };
        await onAddExpense(newExpense);
        onClose(); // Close the form after successful submission
      } catch (error) {
        console.error('Error adding expense:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const isValid = Number(formData.amount) > 0 && formData.category;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border-card-bg">
        <DialogHeader>
          <DialogTitle className="text-charcoal flex items-center gap-2">
            💰 Add New Expense
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ 
                ...formData, 
                amount: e.target.value
              })}
              className="bg-input-bg border-card-bg focus:border-pink-600"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData({ ...formData, category: value })}
              required
            >
              <SelectTrigger className="bg-input-bg border-card-bg focus:border-pink-600">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-card-bg z-50">
                {expenseCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="What did you spend on?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="bg-input-bg border-card-bg focus:border-pink-600 resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-input-bg border-card-bg focus:border-pink-600"
              required
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid || isSubmitting}
              className="flex-1 bg-pink-800 hover:bg-pink-900 text-white disabled:opacity-50"
            >
              {isSubmitting ? 'Adding...' : 'Add Expense'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
