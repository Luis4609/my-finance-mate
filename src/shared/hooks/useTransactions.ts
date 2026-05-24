import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { Transaction } from "@/shared/models/Transaction";
import { Account } from "@/shared/models/Account";

interface UseTransactionsProps {
  accounts: Account[];
  updateAccount: (id: string, fields: Partial<Omit<Account, "id" | "lastUpdated">>) => void;
}

export const useTransactions = ({ accounts, updateAccount }: UseTransactionsProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // Load from localStorage or seed initial mock data
  useEffect(() => {
    const stored = localStorage.getItem("financialTransactions");
    if (stored) {
      try {
        setTransactions(JSON.parse(stored));
        return;
      } catch (e) {
        console.error("Failed to parse transactions from localStorage:", e);
      }
    }

    // Seed mock transactions matching accounts in accounts.json
    // La Caixa (acc-12345), Trade Republic (acc-67890), Bit2Me (acc-abcde), Trading 212 (acc-fghij)
    const seedTransactions: Transaction[] = [
      {
        id: "tx-1",
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 2 days ago
        description: "Monthly Salary",
        amount: 2500,
        type: "INCOME",
        category: "Salary",
        accountId: "acc-12345",
      },
      {
        id: "tx-2",
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: "Supermarket Purchase",
        amount: 85.5,
        type: "EXPENSE",
        category: "Food & Groceries",
        accountId: "acc-12345",
      },
      {
        id: "tx-3",
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: "Investment Savings Deposit",
        amount: 500,
        type: "TRANSFER",
        category: "Transfer",
        accountId: "acc-12345",
        toAccountId: "acc-67890",
      },
      {
        id: "tx-4",
        date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: "Bitcoin Investment",
        amount: 150,
        type: "TRANSFER",
        category: "Transfer",
        accountId: "acc-12345",
        toAccountId: "acc-abcde",
      },
      {
        id: "tx-5",
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        description: "Netflix Subscription",
        amount: 17.99,
        type: "EXPENSE",
        category: "Leisure & Entertainment",
        accountId: "acc-12345",
      }
    ];

    setTransactions(seedTransactions);
    localStorage.setItem("financialTransactions", JSON.stringify(seedTransactions));
  }, []);

  // Save transactions to localStorage
  const saveTransactions = (newTransactions: Transaction[]) => {
    setTransactions(newTransactions);
    try {
      localStorage.setItem("financialTransactions", JSON.stringify(newTransactions));
    } catch (e) {
      console.error("Failed to save transactions to localStorage:", e);
    }
  };

  // Add a new transaction and update associated account balances
  const addTransaction = (txData: Omit<Transaction, "id">) => {
    const newTx: Transaction = {
      ...txData,
      id: uuidv4(),
    };

    // Update balances
    if (newTx.type === "INCOME") {
      const account = accounts.find((a) => a.id === newTx.accountId);
      if (account) {
        updateAccount(newTx.accountId, { balance: account.balance + newTx.amount });
      }
    } else if (newTx.type === "EXPENSE") {
      const account = accounts.find((a) => a.id === newTx.accountId);
      if (account) {
        updateAccount(newTx.accountId, { balance: account.balance - newTx.amount });
      }
    } else if (newTx.type === "TRANSFER" && newTx.toAccountId) {
      const sourceAcc = accounts.find((a) => a.id === newTx.accountId);
      const destAcc = accounts.find((a) => a.id === newTx.toAccountId);
      if (sourceAcc) {
        updateAccount(newTx.accountId, { balance: sourceAcc.balance - newTx.amount });
      }
      if (destAcc) {
        updateAccount(newTx.toAccountId, { balance: destAcc.balance + newTx.amount });
      }
    }

    saveTransactions([newTx, ...transactions]);
  };

  // Delete a transaction and reverse its effect on account balances
  const deleteTransaction = (id: string) => {
    const tx = transactions.find((t) => t.id === id);
    if (!tx) return;

    // Reverse balance updates
    if (tx.type === "INCOME") {
      const account = accounts.find((a) => a.id === tx.accountId);
      if (account) {
        updateAccount(tx.accountId, { balance: account.balance - tx.amount });
      }
    } else if (tx.type === "EXPENSE") {
      const account = accounts.find((a) => a.id === tx.accountId);
      if (account) {
        updateAccount(tx.accountId, { balance: account.balance + tx.amount });
      }
    } else if (tx.type === "TRANSFER" && tx.toAccountId) {
      const sourceAcc = accounts.find((a) => a.id === tx.accountId);
      const destAcc = accounts.find((a) => a.id === tx.toAccountId);
      if (sourceAcc) {
        updateAccount(tx.accountId, { balance: sourceAcc.balance + tx.amount });
      }
      if (destAcc) {
        updateAccount(tx.toAccountId, { balance: destAcc.balance - tx.amount });
      }
    }

    saveTransactions(transactions.filter((t) => t.id !== id));
  };

  return {
    transactions,
    addTransaction,
    deleteTransaction,
  };
};
