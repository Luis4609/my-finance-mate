import { AVAILABLE_ACCOUNT_TYPES } from "@/shared/constants/accountTypes"; // Import available types
import { Account } from "@/shared/models/Account";
import { generateRandomHSLColor } from "@/shared/utils/colorUtils"; // Import the color utility
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { AccountType } from "../models/AccountType";

// Custom hook for managing accounts state and logic
export const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);

  // Inside useAccounts hook, replace the first useEffect
  useEffect(() => {
    const fetchMockAccounts = async () => {
      try {
        const response = await fetch("/src/app/accounts/accounts.json"); // Adjust path if needed
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        // You might still want to add the type fallback here
        const accountsWithTypes = data.map((account: Partial<Account>) => ({
          ...account,
          type:
            account.type ||
            AVAILABLE_ACCOUNT_TYPES.find((t) => t.name === "OTHER") ||
            AVAILABLE_ACCOUNT_TYPES[0],
        }));
        setAccounts(accountsWithTypes);
      } catch (error) {
        console.error("Failed to fetch mock accounts:", error);
        setAccounts([]);
      }
    };

    fetchMockAccounts();
  }, []);

  // // Load accounts from local storage on initial load
  // useEffect(() => {
  //   const storedAccounts = localStorage.getItem("financialAccounts");
  //   if (storedAccounts) {
  //     try {
  //       const parsedAccounts = JSON.parse(storedAccounts) as Account[];
  //       // Ensure loaded accounts have a valid type (handle potential old data without type)
  //       const accountsWithTypes = parsedAccounts.map((account) => ({
  //         ...account,
  //         type:
  //           typeof account.type === "string"
  //             ? account.type
  //             : AVAILABLE_ACCOUNT_TYPES.find((t) => t.name === "OTHER")?.name ||
  //               AVAILABLE_ACCOUNT_TYPES[0].name, // Ensure type is always a string
  //       }));
  //       setAccounts(accountsWithTypes);
  //     } catch (error) {
  //       console.error("Failed to parse accounts from localStorage:", error);
  //       // Optionally clear invalid data
  //       // localStorage.removeItem('financialAccounts');
  //     }
  //   }
  // }, []);

  // Save accounts to local storage whenever the accounts state changes
  useEffect(() => {
    try {
      localStorage.setItem("financialAccounts", JSON.stringify(accounts));
    } catch (error) {
      console.error("Failed to save accounts to localStorage:", error);
    }
  }, [accounts]);

  // Handler to add a new account
  const addAccount = (
    newAccountData: Omit<Account, "id" | "lastUpdated" | "color"> & {
      typeId: string;
    }
  ) => {
    const selectedType = AVAILABLE_ACCOUNT_TYPES.find(
      (type) => type.id === newAccountData.typeId
    );
    if (!selectedType) {
      console.error(`Invalid account type ID: ${newAccountData.typeId}`);
      return; // Prevent adding account with invalid type
    }

    const accountToAdd: Account = {
      ...newAccountData,
      id: uuidv4(),
      lastUpdated: new Date().toLocaleString(),
      color: generateRandomHSLColor(),
      type: selectedType.name as unknown as AccountType, // Assign the name of the selected type
    };
    setAccounts([...accounts, accountToAdd]);
  };

  // Handler to update an account's balance or name
  const updateAccount = (
    id: string,
    updatedFields: Partial<Omit<Account, "id" | "lastUpdated">>
  ) => {
    setAccounts(
      accounts.map((account) =>
        account.id === id
          ? {
              ...account,
              ...updatedFields, // Apply updated fields (name, balance, type)
              lastUpdated:
                Object.keys(updatedFields).length > 0
                  ? new Date().toLocaleString()
                  : account.lastUpdated, // Update timestamp only if fields changed
            }
          : account
      )
    );
  };

  // Handler to delete an account
  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter((account) => account.id !== id));
  };

  // Return the accounts state and the handler functions
  return {
    accounts,
    addAccount,
    updateAccount,
    deleteAccount,
  };
};
