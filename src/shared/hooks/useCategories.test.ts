import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCategories } from './useCategories';
import { Category } from '../models/Budgeting';

// Mock the categories.json import
vi.mock('../../app/budgeting/data/categories.json', () => ({
  default: [
    { id: '1', name: 'Groceries', description: 'Monthly groceries' },
    { id: '2', name: 'Utilities', description: 'Electricity, Water' },
  ],
}));

describe('useCategories hook', () => {
  let initialCategories: Category[];

  beforeEach(() => {
    // Resetting mock or re-importing can be done here if needed,
    // but the vi.mock at the top level should apply for all tests in this suite.
    // For simplicity, we'll rely on the top-level mock.
    // Dynamically re-importing the mocked module to get fresh data for each test.
    return import('../../app/budgeting/data/categories.json').then(module => {
      initialCategories = module.default;
    });
  });

  it('should load initial categories from JSON', () => {
    const { result } = renderHook(() => useCategories());
    expect(result.current.categories.length).toBe(initialCategories.length);
    expect(result.current.categories).toEqual(initialCategories);
  });

  it('should add a new category', () => {
    const { result } = renderHook(() => useCategories());
    const newCategory: Category = { id: '3', name: 'Transport', description: 'Bus fare' };

    act(() => {
      result.current.addCategory(newCategory);
    });

    expect(result.current.categories.length).toBe(initialCategories.length + 1);
    expect(result.current.categories).toContainEqual(newCategory);
  });

  it('should update an existing category', () => {
    const { result } = renderHook(() => useCategories());
    const categoryToUpdate: Category = initialCategories[0];
    const updatedCategory: Category = { ...categoryToUpdate, name: 'Supermarket Groceries' };

    act(() => {
      result.current.updateCategory(updatedCategory);
    });

    expect(result.current.categories.length).toBe(initialCategories.length);
    const foundCategory = result.current.categories.find(c => c.id === categoryToUpdate.id);
    expect(foundCategory).toEqual(updatedCategory);
  });

  it('should not change categories if updated category id does not exist', () => {
    const { result } = renderHook(() => useCategories());
    const nonExistingCategory: Category = { id: 'non-existent-id', name: 'Ghost Category' };

    act(() => {
      result.current.updateCategory(nonExistingCategory);
    });

    expect(result.current.categories.length).toBe(initialCategories.length);
    expect(result.current.categories).toEqual(initialCategories); // State should remain unchanged
  });


  it('should delete a category', () => {
    const { result } = renderHook(() => useCategories());
    const categoryToDelete: Category = initialCategories[0];

    act(() => {
      result.current.deleteCategory(categoryToDelete.id);
    });

    expect(result.current.categories.length).toBe(initialCategories.length - 1);
    expect(result.current.categories).not.toContainEqual(categoryToDelete);
  });

  it('should not change categories if deleted category id does not exist', () => {
    const { result } = renderHook(() => useCategories());

    act(() => {
      result.current.deleteCategory('non-existent-id');
    });

    expect(result.current.categories.length).toBe(initialCategories.length);
    expect(result.current.categories).toEqual(initialCategories); // State should remain unchanged
  });
});
