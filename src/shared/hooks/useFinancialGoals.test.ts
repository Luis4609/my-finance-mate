import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useFinancialGoals } from './useFinancialGoals';
import { FinancialGoal } from '../models/FinancialGoal';
import { Account } from '../models/Account';
import { useAccounts } from './useAccounts';

// Mock the goals.json import
const mockInitialGoals: FinancialGoal[] = [
  {
    id: 'g1',
    name: 'Vacation Fund',
    targetAmount: 1000,
    currentAmount: 100,
    startDate: new Date('2024-01-01').toISOString(),
    targetDate: new Date('2024-12-31').toISOString(),
    linkedAccountIds: ['acc1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'g2',
    name: 'New Laptop',
    targetAmount: 1500,
    currentAmount: 300,
    startDate: new Date('2024-03-01').toISOString(),
    targetDate: new Date('2025-02-28').toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

vi.mock('../../app/goals/data/goals.json', () => ({
  default: JSON.parse(JSON.stringify(mockInitialGoals)), // Deep copy for isolation
}));

// Mock useAccounts hook
const mockAccounts: Account[] = [
  { id: 'acc1', name: 'Savings Account', balance: 500, type: 'savings', currency: 'USD', main:true, userId:'1' },
  { id: 'acc2', name: 'Checking Account', balance: 250, type: 'checking', currency: 'USD', main:false, userId:'1' },
  { id: 'acc3', name: 'Investment Account', balance: 2000, type: 'investment', currency: 'USD', main:false, userId:'1' },
];

// This variable will hold the current state of accounts for dynamic testing
let currentMockAccounts = [...mockAccounts];

vi.mock('./useAccounts', () => ({
  useAccounts: vi.fn(() => ({
    accounts: currentMockAccounts,
    // Mock other functions if useFinancialGoals directly calls them, e.g., getAccountById
  })),
}));


describe('useFinancialGoals hook', () => {
  beforeEach(() => {
    // Reset accounts to initial mock state before each test
    currentMockAccounts = JSON.parse(JSON.stringify(mockAccounts));
    // Ensure the mock implementation is updated if it captures state at definition time (it does)
    (useAccounts as vi.Mock).mockImplementation(() => ({ accounts: currentMockAccounts }));
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks to prevent interference between tests
  });

  describe('Initial State', () => {
    it('should load initial goals from JSON and calculate currentAmount for linked accounts', () => {
      const { result } = renderHook(() => useFinancialGoals());
      // g1 is linked to acc1 (balance 500)
      // g2 is not linked, currentAmount should remain 300
      const g1 = result.current.goals.find(g => g.id === 'g1');
      const g2 = result.current.goals.find(g => g.id === 'g2');

      expect(result.current.goals.length).toBe(mockInitialGoals.length);
      expect(g1?.currentAmount).toBe(500); // Recalculated based on acc1
      expect(g2?.currentAmount).toBe(300); // Stays as defined in mock if not linked
    });
  });

  describe('addGoal', () => {
    it('should add a goal with no linked accounts', () => {
      const { result } = renderHook(() => useFinancialGoals());
      const newGoalData = {
        name: 'Emergency Fund',
        targetAmount: 5000,
        startDate: new Date().toISOString(),
        targetDate: new Date('2025-12-31').toISOString(),
        // currentAmount will be default 0 as no linked accounts and not specified
      };
      act(() => {
        result.current.addGoal(newGoalData);
      });
      const addedGoal = result.current.goals.find(g => g.name === 'Emergency Fund');
      expect(addedGoal).toBeDefined();
      expect(addedGoal?.currentAmount).toBe(0);
      expect(result.current.goals.length).toBe(mockInitialGoals.length + 1);
    });

    it('should add a goal with linked accounts and calculate currentAmount', () => {
      const { result } = renderHook(() => useFinancialGoals());
      const newGoalData = {
        name: 'Down Payment',
        targetAmount: 20000,
        startDate: new Date().toISOString(),
        targetDate: new Date('2026-12-31').toISOString(),
        linkedAccountIds: ['acc1', 'acc2'], // 500 + 250 = 750
      };
      act(() => {
        result.current.addGoal(newGoalData);
      });
      const addedGoal = result.current.goals.find(g => g.name === 'Down Payment');
      expect(addedGoal).toBeDefined();
      expect(addedGoal?.currentAmount).toBe(750);
    });

    it('should add a goal with specified currentAmount and no linked accounts', () => {
      const { result } = renderHook(() => useFinancialGoals());
      const newGoalData = {
        name: 'New Phone',
        targetAmount: 800,
        startDate: new Date().toISOString(),
        targetDate: new Date('2024-12-31').toISOString(),
        currentAmount: 150, // Explicitly set
      };
      act(() => {
        result.current.addGoal(newGoalData);
      });
      const addedGoal = result.current.goals.find(g => g.name === 'New Phone');
      expect(addedGoal).toBeDefined();
      expect(addedGoal?.currentAmount).toBe(150);
    });
  });

  describe('updateGoal', () => {
    it('should update goal properties like name and targetAmount', () => {
      const { result } = renderHook(() => useFinancialGoals());
      const updates = { name: 'Updated Vacation Fund', targetAmount: 1200 };
      act(() => {
        result.current.updateGoal('g1', updates);
      });
      const updatedGoal = result.current.goals.find(g => g.id === 'g1');
      expect(updatedGoal?.name).toBe('Updated Vacation Fund');
      expect(updatedGoal?.targetAmount).toBe(1200);
    });

    it('should update linkedAccountIds and recalculate currentAmount', () => {
      const { result } = renderHook(() => useFinancialGoals());
      // Initially g1 is linked to acc1 (500)
      const updates = { linkedAccountIds: ['acc1', 'acc3'] }; // 500 + 2000 = 2500
      act(() => {
        result.current.updateGoal('g1', updates);
      });
      const updatedGoal = result.current.goals.find(g => g.id === 'g1');
      expect(updatedGoal?.currentAmount).toBe(2500);
      expect(updatedGoal?.linkedAccountIds).toEqual(['acc1', 'acc3']);
    });

    it('should update linkedAccountIds to empty and set currentAmount to 0', () => {
      const { result } = renderHook(() => useFinancialGoals());
      // Initially g1 is linked to acc1 (500)
      const updates = { linkedAccountIds: [] };
      act(() => {
        result.current.updateGoal('g1', updates);
      });
      const updatedGoal = result.current.goals.find(g => g.id === 'g1');
      expect(updatedGoal?.currentAmount).toBe(0);
      expect(updatedGoal?.linkedAccountIds).toEqual([]);
    });

    it('should allow manual update of currentAmount via updateGoal', () => {
      const { result } = renderHook(() => useFinancialGoals());
      // g2 is not linked, initial currentAmount 300
      const updates = { currentAmount: 350 };
      act(() => {
        result.current.updateGoal('g2', updates);
      });
      const updatedGoal = result.current.goals.find(g => g.id === 'g2');
      expect(updatedGoal?.currentAmount).toBe(350);
    });
  });

  describe('deleteGoal', () => {
    it('should remove the goal from the state', () => {
      const { result } = renderHook(() => useFinancialGoals());
      act(() => {
        result.current.deleteGoal('g1');
      });
      expect(result.current.goals.find(g => g.id === 'g1')).toBeUndefined();
      expect(result.current.goals.length).toBe(mockInitialGoals.length - 1);
    });
  });

  describe('updateGoalCurrentAmount', () => {
    it('should directly update the currentAmount of a goal', () => {
      const { result } = renderHook(() => useFinancialGoals());
      // g2 currentAmount is 300
      act(() => {
        result.current.updateGoalCurrentAmount('g2', 450);
      });
      const updatedGoal = result.current.goals.find(g => g.id === 'g2');
      expect(updatedGoal?.currentAmount).toBe(450);
    });
  });

  describe('Automatic Recalculation on Account Change', () => {
    it('should recalculate currentAmount for linked goals when account balances change', () => {
      const { result, rerender } = renderHook(() => useFinancialGoals());
      // g1 is linked to acc1 (initial balance 500)
      const initialG1 = result.current.goals.find(g => g.id === 'g1');
      expect(initialG1?.currentAmount).toBe(500);

      // Simulate account balance change
      act(() => {
        currentMockAccounts = currentMockAccounts.map(acc =>
          acc.id === 'acc1' ? { ...acc, balance: 700 } : acc
        );
        // This mock update is crucial for the hook to see the new values
        (useAccounts as vi.Mock).mockImplementation(() => ({ accounts: currentMockAccounts }));
      });

      rerender(); // Rerender the hook to trigger useEffect based on new accounts state

      const updatedG1 = result.current.goals.find(g => g.id === 'g1');
      expect(updatedG1?.currentAmount).toBe(700);
    });
  });

  describe('recalculateCurrentAmounts (manual trigger)', () => {
    it('should update currentAmount for all linked goals when manually triggered', () => {
      const { result } = renderHook(() => useFinancialGoals());
      // g1 linked to acc1 (500). Let's simulate its state being out of sync.
      act(() => {
        result.current.updateGoalCurrentAmount('g1', 50); // Manually set to something different
      });
      let g1 = result.current.goals.find(g => g.id === 'g1');
      expect(g1?.currentAmount).toBe(50);

      // Now, simulate acc1 balance is still 500 from the mock, and trigger recalculate
      act(() => {
        result.current.recalculateCurrentAmounts();
      });

      g1 = result.current.goals.find(g => g.id === 'g1');
      expect(g1?.currentAmount).toBe(500); // Should revert to sum of linked accounts
    });
  });
});
