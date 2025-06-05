import { useState, useEffect } from 'react';
import { Transaction } from '../models/Budgeting';
import initialTransactions from '../../app/budgeting/data/transactions.json';

export const useTransactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    setTransactions(initialTransactions);
  }, []);

  const addTransaction = (transaction: Transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const updateTransaction = (updatedTransaction: Transaction) => {
    setTransactions(
      transactions.map((transaction) =>
        transaction.id === updatedTransaction.id ? updatedTransaction : transaction
      )
    );
  };

  const deleteTransaction = (transactionId: string) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== transactionId));
  };

  return { transactions, addTransaction, updateTransaction, deleteTransaction };
};
