import React, { useState, useEffect } from 'react';
import { useTransactions } from '../../../shared/hooks/useTransactions';
import { useCategories } from '../../../shared/hooks/useCategories';
import { useAccounts } from '../../../shared/hooks/useAccounts'; // Ensure this path is correct
import { Transaction } from '../../../shared/models/Budgeting';
import { Account } from '../../../shared/models/Account'; // Assuming Account model exists
import { Category } from '../../../shared/models/Budgeting';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
// import { Textarea } from '../../../components/ui/textarea'; // Assuming Textarea exists
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';

interface TransactionFormProps {
  transactionToEdit?: Transaction | null;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transactionToEdit, onClose }) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const { categories } = useCategories();
  const { accounts } = useAccounts(); // Using accounts hook

  const [id, setId] = useState(transactionToEdit?.id || Math.random().toString(36).substr(2, 9));
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  const [categoryId, setCategoryId] = useState<string>('');
  // const [type, setType] = useState<'income' | 'expense'>('expense'); // Assuming 'type' is part of transaction
  const [accountId, setAccountId] = useState<string | undefined>(undefined);
  const [notes, setNotes] = useState('');
  const [payee, setPayee] = useState(''); // Added payee based on Transaction model

  useEffect(() => {
    if (transactionToEdit) {
      setId(transactionToEdit.id);
      setDescription(transactionToEdit.description || '');
      setAmount(transactionToEdit.amount);
      setDate(new Date(transactionToEdit.date).toISOString().split('T')[0]);
      setCategoryId(transactionToEdit.budgetItemId); // Assuming budgetItemId is categoryId
      // setType(transactionToEdit.amount >= 0 ? 'income' : 'expense'); // Infer type from amount
      setPayee(transactionToEdit.payee || '');
      // setAccountId(transactionToEdit.accountId); // If accountId exists on Transaction model
      // setNotes(transactionToEdit.notes || ''); // If notes exists on Transaction model
    } else {
      // Reset for new transaction
      setId(Math.random().toString(36).substr(2, 9));
      setDescription('');
      setAmount(0);
      setDate(new Date().toISOString().split('T')[0]);
      setCategoryId('');
      // setType('expense');
      setPayee('');
      setAccountId(undefined);
  // setNotes(''); // Textarea removed
    }
  }, [transactionToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description && !payee) {
        alert('Please enter a description or payee.');
        return;
    }
    if (!categoryId) {
        alert('Please select a category.');
        return;
    }

    const transactionData: Transaction = {
      id,
      budgetItemId: categoryId, // Mapping categoryId to budgetItemId
      date: new Date(date),
      payee: payee,
      description: description,
      amount: amount, // User inputs positive for income, negative for expense or handle via 'type'
      // accountId: accountId, // If used
      // notes: notes // Textarea removed, so notes field also removed
    };

    if (transactionToEdit) {
      updateTransaction(transactionData);
    } else {
      addTransaction(transactionData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="payee">Payee</Label>
        <Input
          id="payee"
          value={payee}
          onChange={(e) => setPayee(e.target.value)}
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(parseFloat(e.target.value))}
          required
        />
      </div>
      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={categoryId} onValueChange={setCategoryId} required>
          <SelectTrigger>
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category: Category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/*
      // Type field - can be explicit or inferred from amount sign
      <div>
        <Label htmlFor="type">Type</Label>
        <Select value={type} onValueChange={(value) => setType(value as 'income' | 'expense')}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expense</SelectItem>
          </SelectContent>
        </Select>
      </div>
      */}
      <div>
        <Label htmlFor="account">Account (Optional)</Label>
        <Select value={accountId} onValueChange={setAccountId}>
          <SelectTrigger>
            <SelectValue placeholder="Select an account" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value=""><em>None</em></SelectItem>
            {accounts.map((account: Account) => ( // Assuming Account model has id and name
              <SelectItem key={account.id} value={account.id}>
                {account.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/*
      // Textarea and notes field removed
      <div>
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>
      */}
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{transactionToEdit ? 'Save Changes' : 'Add Transaction'}</Button>
      </div>
    </form>
  );
};

export default TransactionForm;
