import { AVAILABLE_ACCOUNT_TYPES } from "@/shared/constants/accountTypes";
import { Account } from "@/shared/models/Account";
import { generateRandomHSLColor } from "@/shared/utils/colorUtils";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

// Custom hook for managing accounts state and logic
export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Load accounts from localStorage, falling back to mock JSON
  useEffect(() => {
    const loadAccounts = async () => {
      try {
        const stored = localStorage.getItem("financialAccounts");
        if (stored) {
          const parsed = JSON.parse(stored) as Account[];
          if (parsed && parsed.length > 0) {
            // Map legacy string types or partial types to full objects
            const accountsWithTypes = parsed.map((account) => {
              let resolvedType = account.type;
              const rawType = account.type as unknown;
              if (typeof rawType === "string") {
                resolvedType = AVAILABLE_ACCOUNT_TYPES.find(
                  (t) => t.name === rawType || t.id === rawType
                ) || AVAILABLE_ACCOUNT_TYPES.find((t) => t.name === "OTHER") || AVAILABLE_ACCOUNT_TYPES[0];
              }
              return {
                ...account,
                type: resolvedType,
                isActive: account.isActive ?? true,
                color: account.color || generateRandomHSLColor(),
              };
            });
            setAccounts(accountsWithTypes);
            return;
          }
        }
      } catch (error) {
        console.error("Failed to parse accounts from localStorage:", error);
      }

      // Fallback: Fetch mock accounts
      try {
        const response = await fetch("/src/app/accounts/accounts.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const accountsWithTypes = data.map((account: Partial<Account>) => ({
          ...account,
          type:
            account.type ||
            AVAILABLE_ACCOUNT_TYPES.find((t) => t.name === "OTHER") ||
            AVAILABLE_ACCOUNT_TYPES[0],
          isActive: account.isActive ?? true,
          color: account.color || generateRandomHSLColor(),
        }));
        setAccounts(accountsWithTypes);
      } catch (error) {
        console.error("Failed to fetch mock accounts:", error);
        setAccounts([]);
      }
    };

    loadAccounts();
  }, []);

  // Save accounts to localStorage on state changes
  useEffect(() => {
    if (accounts.length > 0) {
      try {
        localStorage.setItem("financialAccounts", JSON.stringify(accounts));
      } catch (error) {
        console.error("Failed to save accounts to localStorage:", error);
      }
    }
  }, [accounts]);

  // Handler to add a new account
  const addAccount = (newAccountData: {
    name: string;
    balance: number;
    typeId: string;
  }) => {
    const selectedType = AVAILABLE_ACCOUNT_TYPES.find(
      (type) => type.id === newAccountData.typeId
    );
    if (!selectedType) {
      console.error(`Invalid account type ID: ${newAccountData.typeId}`);
      return;
    }

    const accountToAdd: Account = {
      id: uuidv4(),
      name: newAccountData.name,
      balance: newAccountData.balance,
      lastUpdated: new Date().toLocaleString(),
      color: generateRandomHSLColor(),
      type: selectedType,
      isActive: true,
    };
    setAccounts((prev) => [...prev, accountToAdd]);
  };

  // Handler to update an account's properties
  const updateAccount = (
    id: string,
    updatedFields: Partial<Omit<Account, "id" | "lastUpdated">>
  ) => {
    setAccounts((prev) =>
      prev.map((account) =>
        account.id === id
          ? {
              ...account,
              ...updatedFields,
              lastUpdated: new Date().toLocaleString(),
            }
          : account
      )
    );
  };

  // Handler to delete an account
  const deleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((account) => account.id !== id));
  };

  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
};
