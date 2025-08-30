
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ExtraIncome } from '@/types/database';

interface ExtraIncomeFormProps {
  onAddIncome: (incomeData: any) => Promise<void>;
}

export const ExtraIncomeForm: React.FC<ExtraIncomeFormProps> = ({ onAddIncome }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    source: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.source && formData.amount > 0) {
      await onAddIncome(formData);
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const isValid = formData.source && formData.amount > 0;

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md bg-white border-rose-200">
        <DialogHeader>
          <DialogTitle className="text-charcoal flex items-center gap-2">
            💰 Add Extra Income
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source">Income Source</Label>
            <Input
              id="source"
              placeholder="e.g., Freelance work, Bonus, Side business"
              value={formData.source}
              onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              className="border-rose-200 focus:border-rose-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.amount || ''}
              onChange={(e) => setFormData({ 
                ...formData, 
                amount: e.target.value ? Number(e.target.value) : 0 
              })}
              className="border-rose-200 focus:border-rose-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="border-rose-200 focus:border-rose-400"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional details..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="border-rose-200 focus:border-rose-400 resize-none"
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={handleClose}
              variant="outline"
              className="flex-1 border-rose-300 text-rose-700 hover:bg-rose-50"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isValid}
              className="flex-1 bg-rose-600 hover:bg-rose-700 text-white disabled:opacity-50"
            >
              Add Income
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
