
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Bell, Plus, X } from 'lucide-react';

interface ReminderFormProps {
  onAddReminder: (reminderData: any) => Promise<void>;
  existingReminders?: any[];
}

export const ReminderForm: React.FC<ReminderFormProps> = ({ onAddReminder, existingReminders = [] }) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    amount: '',
    due_date: '',
    is_recurring: false,
    frequency: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reminderTypes = ['EMI', 'SIP', 'Recharge', 'Insurance', 'Utilities'];
  const frequencies = ['monthly', 'quarterly', 'yearly'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.type && formData.title && formData.due_date) {
      setIsSubmitting(true);
      try {
        await onAddReminder({
          ...formData,
          amount: formData.amount ? Number(formData.amount) : null,
          frequency: formData.is_recurring ? formData.frequency : null
        });
        setFormData({
          type: '',
          title: '',
          amount: '',
          due_date: '',
          is_recurring: false,
          frequency: ''
        });
        setShowForm(false);
      } catch (error) {
        console.error('Error adding reminder:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button
          onClick={() => setShowForm(true)}
          className="bg-header-cta hover:bg-header-cta/90 text-white"
          size="lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Reminder
        </Button>
      </div>

      {/* Display existing reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Your Reminders
          </CardTitle>
        </CardHeader>
        <CardContent>
          {existingReminders.length > 0 ? (
            <div className="space-y-3">
              {existingReminders.map((reminder) => (
                <div key={reminder.id} className="p-4 border rounded-lg bg-card">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{reminder.title}</h3>
                      <p className="text-sm text-gray-600">{reminder.type}</p>
                      <p className="text-xs text-gray-500">Due: {new Date(reminder.due_date).toLocaleDateString()}</p>
                      {reminder.is_recurring && (
                        <p className="text-xs text-blue-600">Recurring: {reminder.frequency}</p>
                      )}
                    </div>
                    {reminder.amount && (
                      <div className="text-right">
                        <p className="font-bold">₹{Number(reminder.amount).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No reminders set yet. Add your first reminder!</p>
          )}
        </CardContent>
      </Card>

      {/* Add Reminder Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md bg-white shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Add New Reminder</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setShowForm(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Reminder Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                    required
                  >
                    <SelectTrigger className="bg-input-bg border-card-bg focus:border-header-cta">
                      <SelectValue placeholder="Select reminder type" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-card-bg z-50">
                      {reminderTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Home Loan EMI"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-input-bg border-card-bg focus:border-header-cta"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (Optional)</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="bg-input-bg border-card-bg focus:border-header-cta"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="due_date">Due Date</Label>
                  <Input
                    id="due_date"
                    type="date"
                    value={formData.due_date}
                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    className="bg-input-bg border-card-bg focus:border-header-cta"
                    required
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_recurring"
                    checked={formData.is_recurring}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_recurring: checked })}
                  />
                  <Label htmlFor="is_recurring">Recurring Reminder</Label>
                </div>

                {formData.is_recurring && (
                  <div className="space-y-2">
                    <Label>Frequency</Label>
                    <Select
                      value={formData.frequency}
                      onValueChange={(value) => setFormData({ ...formData, frequency: value })}
                      required
                    >
                      <SelectTrigger className="bg-input-bg border-card-bg focus:border-header-cta">
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-card-bg z-50">
                        {frequencies.map((freq) => (
                          <SelectItem key={freq} value={freq}>
                            {freq.charAt(0).toUpperCase() + freq.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50 bg-white"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || !formData.type || !formData.title || !formData.due_date}
                    className="flex-1 bg-header-cta hover:bg-header-cta/90 text-white disabled:opacity-50"
                  >
                    {isSubmitting ? 'Adding...' : 'Add Reminder'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};
