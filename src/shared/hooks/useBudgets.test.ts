import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useBudgets } from './useBudgets';
import { Budget, BudgetItem } from '../models/Budgeting';

// Mock the budgets.json import
const mockBudgetsInitial: Budget[] = [
  {
    id: 'b1',
    name: 'Monthly Budget March',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-03-31'),
    items: [
      { id: 'bi1', categoryId: 'c1', allocatedAmount: 500, actualAmount: 0 },
      { id: 'bi2', categoryId: 'c2', allocatedAmount: 200, actualAmount: 0 },
    ],
  },
  {
    id: 'b2',
    name: 'Holiday Fund',
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    items: [{ id: 'bi3', categoryId: 'c3', allocatedAmount: 1000, actualAmount: 0 }],
  },
];

vi.mock('../../app/budgeting/data/budgets.json', () => ({
  default: JSON.parse(JSON.stringify(mockBudgetsInitial)), // Deep copy to ensure test isolation
}));

describe('useBudgets hook', () => {
  let initialBudgets: Budget[];

  beforeEach(async () => {
    // Re-import the mocked module to get a fresh copy of initialBudgets for each test
    const module = await import('../../app/budgeting/data/budgets.json');
    initialBudgets = module.default.map((b: Budget) => ({
      ...b,
      startDate: new Date(b.startDate), // Ensure dates are Date objects
      endDate: new Date(b.endDate),
    }));
  });

  it('should load initial budgets from JSON', () => {
    const { result } = renderHook(() => useBudgets());
    expect(result.current.budgets.length).toBe(initialBudgets.length);
    // Dates in JSON are strings, they become Date objects in the hook if processed,
    // or need to be compared carefully. The mock already provides Date objects.
    expect(result.current.budgets).toEqual(initialBudgets);
  });

  it('should add a new budget', () => {
    const { result } = renderHook(() => useBudgets());
    const newBudget: Budget = {
      id: 'b3',
      name: 'April Budget',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      items: [],
    };

    act(() => {
      result.current.addBudget(newBudget);
    });

    expect(result.current.budgets.length).toBe(initialBudgets.length + 1);
    expect(result.current.budgets).toContainEqual(newBudget);
  });

  it('should update an existing budget', () => {
    const { result } = renderHook(() => useBudgets());
    const budgetToUpdate = initialBudgets[0];
    const updatedBudgetItem: BudgetItem = { ...budgetToUpdate.items[0], allocatedAmount: 550 };
    const updatedBudget: Budget = {
      ...budgetToUpdate,
      name: 'Monthly Budget March (Revised)',
      items: [updatedBudgetItem, budgetToUpdate.items[1]],
    };

    act(() => {
      result.current.updateBudget(updatedBudget);
    });

    expect(result.current.budgets.length).toBe(initialBudgets.length);
    const foundBudget = result.current.budgets.find(b => b.id === budgetToUpdate.id);
    expect(foundBudget).toEqual(updatedBudget);
    expect(foundBudget?.items[0].allocatedAmount).toBe(550);
  });

  it('should not change budgets if updated budget id does not exist', () => {
    const { result } = renderHook(() => useBudgets());
    const nonExistingBudget: Budget = {
      id: 'non-existent-id',
      name: 'Ghost Budget',
      startDate: new Date(),
      endDate: new Date(),
      items: []
    };

    act(() => {
      result.current.updateBudget(nonExistingBudget);
    });

    expect(result.current.budgets.length).toBe(initialBudgets.length);
    expect(result.current.budgets).toEqual(initialBudgets);
  });

  it('should delete a budget', () => {
    const { result } = renderHook(() => useBudgets());
    const budgetToDelete = initialBudgets[0];

    act(() => {
      result.current.deleteBudget(budgetToDelete.id);
    });

    expect(result.current.budgets.length).toBe(initialBudgets.length - 1);
    expect(result.current.budgets).not.toContainEqual(budgetToDelete);
  });

  it('should not change budgets if deleted budget id does not exist', () => {
    const { result } = renderHook(() => useBudgets());

    act(() => {
      result.current.deleteBudget('non-existent-id');
    });

    expect(result.current.budgets.length).toBe(initialBudgets.length);
    expect(result.current.budgets).toEqual(initialBudgets);
  });
});
