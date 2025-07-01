import React, { useState, useEffect } from 'react';
import { FinancialGoal } from '../../../shared/models/FinancialGoal';
import { useFinancialGoals } from '../../../shared/hooks/useFinancialGoals';
import { useAccounts } from '../../../shared/hooks/useAccounts';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { Checkbox } from '../../../components/ui/checkbox';
// import { Textarea } from '../../../components/ui/textarea'; // Textarea not available

interface GoalFormProps {
  goalToEdit?: FinancialGoal | null;
  onClose: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ goalToEdit, onClose }) => {
  const { addGoal, updateGoal, calculateCurrentAmountForGoal } = useFinancialGoals(); // Assuming calculateCurrentAmountForGoal is exported if needed standalone
  const { accounts } = useAccounts();

  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState<number | string>('');
  const [currentAmount, setCurrentAmount] = useState<number | string>('');
  const [startDate, setStartDate] = useState('');
  const [targetDate, setTargetDate] = useState('');
  // const [description, setDescription] = useState(''); // Description field removed
  const [linkedAccountIds, setLinkedAccountIds] = useState<string[]>([]);
  // const [icon, setIcon] = useState(''); // Icon field if needed

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name);
      setTargetAmount(goalToEdit.targetAmount);
      setCurrentAmount(goalToEdit.currentAmount);
      setStartDate(goalToEdit.startDate.split('T')[0]); // Assuming ISO string, take date part
      setTargetDate(goalToEdit.targetDate.split('T')[0]); // Assuming ISO string, take date part
      // setDescription(goalToEdit.description || ''); // Description field removed
      setLinkedAccountIds(goalToEdit.linkedAccountIds || []);
      // setIcon(goalToEdit.icon || '');
    } else {
      // Reset form for new goal
      setName('');
      setTargetAmount('');
      setCurrentAmount(0); // Default to 0 for new goals unless accounts are linked
      setStartDate(new Date().toISOString().split('T')[0]);
      setTargetDate('');
      // setDescription(''); // Description field removed
      setLinkedAccountIds([]);
      // setIcon('');
    }
  }, [goalToEdit]);

  const handleAccountLinkToggle = (accountId: string) => {
    setLinkedAccountIds(prev => {
      const newLinkedAccountIds = prev.includes(accountId)
        ? prev.filter(id => id !== accountId)
        : [...prev, accountId];

      // Automatically update currentAmount based on linked accounts if not editing existing goal's currentAmount directly
      // or if user explicitly wants recalculation by toggling accounts.
      // For simplicity, if goalToEdit is present, we let manual currentAmount override,
      // otherwise, we auto-calculate.
      if (!goalToEdit || (goalToEdit && currentAmount === goalToEdit.currentAmount)) {
         // Need access to calculateCurrentAmountForGoal or re-implement logic here based on 'accounts'
         // This is a bit tricky as useFinancialGoals().calculateCurrentAmountForGoal is not directly available
         // Let's defer complex auto-recalc on form to the hook's internal logic post-submission for now,
         // or assume user will get currentAmount updated by the hook after linking.
         // For a truly dynamic form, the calculation logic would need to be accessible here.
      }
      return newLinkedAccountIds;
    });
  };

  // Effect to update currentAmount when linkedAccountIds change for a new goal
  useEffect(() => {
    if (!goalToEdit) { // Only for new goals
        let calculatedAmount = 0;
        if (linkedAccountIds.length > 0) {
            calculatedAmount = linkedAccountIds.reduce((sum, accId) => {
                const account = accounts.find(a => a.id === accId);
                return sum + (account?.balance || 0);
            }, 0);
        }
        setCurrentAmount(calculatedAmount);
    }
  }, [linkedAccountIds, accounts, goalToEdit]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const goalData = {
      name,
      targetAmount: parseFloat(targetAmount.toString()),
      currentAmount: parseFloat(currentAmount.toString()), // Current amount is managed by user or linking
      startDate: new Date(startDate).toISOString(),
      targetDate: new Date(targetDate).toISOString(),
      // description, // Description field removed
      linkedAccountIds,
      // icon,
    };

    if (goalToEdit) {
      updateGoal(goalToEdit.id, goalData);
    } else {
      // For addGoal, Omit 'id', 'createdAt', 'updatedAt' and 'currentAmount' (as it's derived or explicitly set)
      // The addGoal in the hook should handle setting currentAmount based on linkedAccountIds if not explicitly passed
      const { currentAmount: _currentAmount, ...restData } = goalData;
      addGoal({
        ...restData,
        // currentAmount is explicitly passed from form state, hook might recalculate if linked IDs are primary source of truth
        currentAmount: goalData.currentAmount
      });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="goalName">Goal Name</Label>
        <Input id="goalName" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="targetAmount">Target Amount</Label>
          <Input id="targetAmount" type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="currentAmount">Current Amount</Label>
          <Input id="currentAmount" type="number" value={currentAmount} onChange={(e) => setCurrentAmount(e.target.value)} required />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startDate">Start Date</Label>
          <Input id="startDate" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
        </div>
        <div>
          <Label htmlFor="targetDate">Target Date</Label>
          <Input id="targetDate" type="date" value={targetDate} onChange={(e) => setTargetDate(e.target.value)} required />
        </div>
      </div>
      {/* Description field removed
      <div>
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      */}
      <div>
        <Label>Link Accounts (Optional)</Label>
        <div className="space-y-2 mt-1">
          {accounts.length > 0 ? accounts.map(account => (
            <div key={account.id} className="flex items-center space-x-2">
              <Checkbox
                id={`account-${account.id}`}
                checked={linkedAccountIds.includes(account.id)}
                onCheckedChange={() => handleAccountLinkToggle(account.id)}
              />
              <Label htmlFor={`account-${account.id}`} className="font-normal">
                {account.name} (Balance: {account.balance.toFixed(2)})
              </Label>
            </div>
          )) : <p className="text-sm text-muted-foreground">No accounts available to link.</p>}
        </div>
      </div>
      {/* Icon field if needed:
      <div>
        <Label htmlFor="icon">Icon (Optional, e.g., emoji or SVG name)</Label>
        <Input id="icon" value={icon} onChange={(e) => setIcon(e.target.value)} />
      </div>
      */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        <Button type="submit">{goalToEdit ? 'Save Changes' : 'Add Goal'}</Button>
      </div>
    </form>
  );
};

export default GoalForm;
