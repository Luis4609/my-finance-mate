import { useState, useEffect } from 'react';
import { Account } from '@/shared/models/Account';
import { v4 as uuidv4 } from 'uuid';
import { generateRandomHSLColor } from '@/shared/utils/colorUtils'; // Import the color utility

// Custom hook for managing accounts state and logic
export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Load accounts from local storage on initial load
  useEffect(() => {
    const storedAccounts = localStorage.getItem('financialAccounts');
    if (storedAccounts) {
      try {
        setAccounts(JSON.parse(storedAccounts));
      } catch (error) {
        console.error("Failed to parse accounts from localStorage:", error);
        // Optionally clear invalid data
        // localStorage.removeItem('financialAccounts');
      }
    }
  }, []);

  // Save accounts to local storage whenever the accounts state changes
  useEffect(() => {
    try {
      localStorage.setItem('financialAccounts', JSON.stringify(accounts));
    } catch (error) {
       console.error("Failed to save accounts to localStorage:", error);
    }
  }, [accounts]);

  // Handler to add a new account
  const addAccount = (newAccountData: Omit<Account, 'id' | 'lastUpdated' | 'color'>) => {
    const accountToAdd: Account = {
      ...newAccountData,
      id: uuidv4(),
      lastUpdated: new Date().toLocaleString(),
      color: generateRandomHSLColor(),
    };
    setAccounts([...accounts, accountToAdd]);
  };

  // Handler to update an account's balance
  const updateAccountBalance = (id: string, newBalance: number) => {
    setAccounts(accounts.map(account =>
      account.id === id ? { ...account, balance: newBalance, lastUpdated: new Date().toLocaleString() } : account
    ));
  };

  // Handler to delete an account
  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(account => account.id !== id));
  };

  // Return the accounts state and the handler functions
  return {
    accounts,
    addAccount,
    updateAccountBalance,
    deleteAccount,
  };
};