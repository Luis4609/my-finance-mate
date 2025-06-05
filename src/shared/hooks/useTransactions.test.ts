import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useTransactions } from './useTransactions';
import { Transaction } from '../models/Budgeting';

// Mock the transactions.json import
const mockTransactionsInitial: Transaction[] = [
  {
    id: 't1',
    budgetItemId: 'bi1', // Links to a BudgetItem, implies a category
    date: new Date('2024-03-05'),
    payee: 'SuperMart',
    description: 'Groceries for week 1',
    amount: -75.50,
  },
  {
    id: 't2',
    budgetItemId: 'bi2',
    date: new Date('2024-03-10'),
    payee: 'Power Company',
    description: 'Electricity bill',
    amount: -120.00,
  },
];

vi.mock('../../app/budgeting/data/transactions.json', () => ({
  default: JSON.parse(JSON.stringify(mockTransactionsInitial)), // Deep copy
}));

describe('useTransactions hook', () => {
  let initialTransactions: Transaction[];

  beforeEach(async () => {
    const module = await import('../../app/budgeting/data/transactions.json');
    initialTransactions = module.default.map((t: Transaction) => ({
      ...t,
      date: new Date(t.date), // Ensure dates are Date objects
    }));
  });

  it('should load initial transactions from JSON', () => {
    const { result } = renderHook(() => useTransactions());
    expect(result.current.transactions.length).toBe(initialTransactions.length);
    expect(result.current.transactions).toEqual(initialTransactions);
  });

  it('should add a new transaction', () => {
    const { result } = renderHook(() => useTransactions());
    const newTransaction: Transaction = {
      id: 't3',
      budgetItemId: 'bi1',
      date: new Date('2024-03-15'),
      payee: 'Local Market',
      description: 'Fresh vegetables',
      amount: -25.00,
    };

    act(() => {
      result.current.addTransaction(newTransaction);
    });

    expect(result.current.transactions.length).toBe(initialTransactions.length + 1);
    expect(result.current.transactions).toContainEqual(newTransaction);
  });

  it('should update an existing transaction', () => {
    const { result } = renderHook(() => useTransactions());
    const transactionToUpdate = initialTransactions[0];
    const updatedTransaction: Transaction = {
      ...transactionToUpdate,
      amount: -80.00,
      description: 'Groceries for week 1 (updated)',
    };

    act(() => {
      result.current.updateTransaction(updatedTransaction);
    });

    expect(result.current.transactions.length).toBe(initialTransactions.length);
    const foundTransaction = result.current.transactions.find(t => t.id === transactionToUpdate.id);
    expect(foundTransaction).toEqual(updatedTransaction);
  });

  it('should not change transactions if updated transaction id does not exist', () => {
    const { result } = renderHook(() => useTransactions());
    const nonExistingTransaction: Transaction = {
      id: 'non-existent-id',
      budgetItemId: 'bi0',
      date: new Date(),
      payee: 'Phantom Store',
      amount: -10,
    };

    act(() => {
      result.current.updateTransaction(nonExistingTransaction);
    });

    expect(result.current.transactions.length).toBe(initialTransactions.length);
    expect(result.current.transactions).toEqual(initialTransactions);
  });

  it('should delete a transaction', () => {
    const { result } = renderHook(() => useTransactions());
    const transactionToDelete = initialTransactions[0];

    act(() => {
      result.current.deleteTransaction(transactionToDelete.id);
    });

    expect(result.current.transactions.length).toBe(initialTransactions.length - 1);
    expect(result.current.transactions).not.toContainEqual(transactionToDelete);
  });

  it('should not change transactions if deleted transaction id does not exist', () => {
    const { result } = renderHook(() => useTransactions());

    act(() => {
      result.current.deleteTransaction('non-existent-id');
    });

    expect(result.current.transactions.length).toBe(initialTransactions.length);
    expect(result.current.transactions).toEqual(initialTransactions);
  });
});
