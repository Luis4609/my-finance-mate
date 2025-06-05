import { useState, useEffect } from 'react';
import { Budget } from '../models/Budgeting';
import initialBudgets from '../../app/budgeting/data/budgets.json';

export const useBudgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);

  useEffect(() => {
    setBudgets(initialBudgets);
  }, []);

  const addBudget = (budget: Budget) => {
    setBudgets([...budgets, budget]);
  };

  const updateBudget = (updatedBudget: Budget) => {
    setBudgets(
      budgets.map((budget) =>
        budget.id === updatedBudget.id ? updatedBudget : budget
      )
    );
  };

  const deleteBudget = (budgetId: string) => {
    setBudgets(budgets.filter((budget) => budget.id !== budgetId));
  };

  return { budgets, addBudget, updateBudget, deleteBudget };
};
