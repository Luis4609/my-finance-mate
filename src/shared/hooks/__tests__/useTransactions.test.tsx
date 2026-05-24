import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTransactions } from "../useTransactions";
import { Account } from "@/shared/models/Account";

describe("useTransactions Hook", () => {
  let mockAccounts: Account[];
  let mockUpdateAccount: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    mockUpdateAccount = vi.fn();
    mockAccounts = [
      {
        id: "acc-1",
        name: "Test Bank",
        balance: 1000,
        lastUpdated: "",
        color: "",
        isActive: true,
        type: { id: "cash", name: "CASH", description: null },
      },
      {
        id: "acc-2",
        name: "Test Broker",
        balance: 500,
        lastUpdated: "",
        color: "",
        isActive: true,
        type: { id: "investment", name: "INVESTMENT", description: null },
      },
    ];
    localStorage.clear();
  });

  it("should initialize with seed transactions if localStorage is empty", () => {
    const { result } = renderHook(() =>
      useTransactions({ accounts: mockAccounts, updateAccount: mockUpdateAccount })
    );

    // Initial state should contain seed transactions
    expect(result.current.transactions.length).toBeGreaterThan(0);
  });

  it("should add an INCOME transaction and increase account balance", () => {
    const { result } = renderHook(() =>
      useTransactions({ accounts: mockAccounts, updateAccount: mockUpdateAccount })
    );

    act(() => {
      result.current.addTransaction({
        date: "2026-05-24",
        description: "Test Gift",
        amount: 200,
        type: "INCOME",
        category: "Gifts",
        accountId: "acc-1",
      });
    });

    // Check if updateAccount was called with correct arguments
    expect(mockUpdateAccount).toHaveBeenCalledWith("acc-1", { balance: 1200 });
  });

  it("should add an EXPENSE transaction and decrease account balance", () => {
    const { result } = renderHook(() =>
      useTransactions({ accounts: mockAccounts, updateAccount: mockUpdateAccount })
    );

    act(() => {
      result.current.addTransaction({
        date: "2026-05-24",
        description: "Grocery purchase",
        amount: 50,
        type: "EXPENSE",
        category: "Food & Groceries",
        accountId: "acc-1",
      });
    });

    expect(mockUpdateAccount).toHaveBeenCalledWith("acc-1", { balance: 950 });
  });

  it("should add a TRANSFER transaction and update source/destination balances", () => {
    const { result } = renderHook(() =>
      useTransactions({ accounts: mockAccounts, updateAccount: mockUpdateAccount })
    );

    act(() => {
      result.current.addTransaction({
        date: "2026-05-24",
        description: "Transfer to broker",
        amount: 100,
        type: "TRANSFER",
        category: "Transfer",
        accountId: "acc-1",
        toAccountId: "acc-2",
      });
    });

    expect(mockUpdateAccount).toHaveBeenCalledWith("acc-1", { balance: 900 });
    expect(mockUpdateAccount).toHaveBeenCalledWith("acc-2", { balance: 600 });
  });

  it("should reverse balances when deleting a transaction", () => {
    const { result } = renderHook(() =>
      useTransactions({ accounts: mockAccounts, updateAccount: mockUpdateAccount })
    );

    // Add a temporary transaction manually to the state first
    act(() => {
      result.current.addTransaction({
        date: "2026-05-24",
        description: "Rent Payment",
        amount: 300,
        type: "EXPENSE",
        category: "Housing",
        accountId: "acc-1",
      });
    });

    const addedTxId = result.current.transactions[0].id;
    mockUpdateAccount.mockClear();

    // Now delete this transaction
    act(() => {
      result.current.deleteTransaction(addedTxId);
    });

    // Deleting an expense of 300 should add 300 back to the account
    expect(mockUpdateAccount).toHaveBeenCalledWith("acc-1", { balance: 1300 });
  });
});
