import { useState, useEffect, useCallback } from 'react';
import { FinancialGoal } from '../models/FinancialGoal';
import { Account } from '../models/Account';
import { useAccounts } from './useAccounts';
import initialGoals from '../../app/goals/data/goals.json'; // Assuming this path is correct

export const useFinancialGoals = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const { accounts } = useAccounts();

  // Load initial goals
  useEffect(() => {
    const goalsWithDates = initialGoals.map(goal => ({
      ...goal,
      // Ensure date strings are correctly handled if they need to be Date objects
      // For now, the model defines them as strings, so direct assignment is fine.
    }));
    setGoals(goalsWithDates as FinancialGoal[]); // Type assertion if initialGoals is not strictly FinancialGoal[]
  }, []);

  const calculateCurrentAmountForGoal = useCallback((linkedAccountIds?: string[]): number => {
    if (!linkedAccountIds || linkedAccountIds.length === 0) {
      return 0;
    }
    return linkedAccountIds.reduce((sum, accountId) => {
      const account = accounts.find(acc => acc.id === accountId);
      return sum + (account?.balance || 0);
    }, 0);
  }, [accounts]);

  // Recalculate current amounts when accounts change
  useEffect(() => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.linkedAccountIds && goal.linkedAccountIds.length > 0) {
          return {
            ...goal,
            currentAmount: calculateCurrentAmountForGoal(goal.linkedAccountIds),
            updatedAt: new Date().toISOString(),
          };
        }
        return goal;
      })
    );
  }, [accounts, calculateCurrentAmountForGoal]);


  const addGoal = (newGoalData: Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt' | 'currentAmount'> & { currentAmount?: number }) => {
    const now = new Date().toISOString();
    const currentAmount = newGoalData.linkedAccountIds
      ? calculateCurrentAmountForGoal(newGoalData.linkedAccountIds)
      : (newGoalData.currentAmount !== undefined ? newGoalData.currentAmount : 0);

    const newGoal: FinancialGoal = {
      ...newGoalData,
      id: Math.random().toString(36).substr(2, 9), // Simple ID generation
      createdAt: now,
      updatedAt: now,
      currentAmount: currentAmount,
    };
    setGoals(prevGoals => [...prevGoals, newGoal]);
  };

  const updateGoal = (goalId: string, updates: Partial<Omit<FinancialGoal, 'id' | 'createdAt' | 'updatedAt'>>) => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.id === goalId) {
          const updatedGoal = { ...goal, ...updates, updatedAt: new Date().toISOString() };

          // Recalculate currentAmount if linkedAccountIds change or if currentAmount is explicitly provided in updates
          if (updates.linkedAccountIds || updates.currentAmount !== undefined) {
             updatedGoal.currentAmount = updates.currentAmount !== undefined
                ? updates.currentAmount
                : calculateCurrentAmountForGoal(updates.linkedAccountIds || goal.linkedAccountIds);
          } else if (updates.linkedAccountIds === null) { // handles case where linked accounts are removed
             updatedGoal.currentAmount = 0;
          }

          return updatedGoal;
        }
        return goal;
      })
    );
  };

  const updateGoalCurrentAmount = (goalId: string, newCurrentAmount: number) => {
     setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === goalId
        ? { ...goal, currentAmount: newCurrentAmount, updatedAt: new Date().toISOString() }
        : goal
      )
    );
  };


  const deleteGoal = (goalId: string) => {
    setGoals(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
  };

  const recalculateCurrentAmounts = useCallback(() => {
    setGoals(prevGoals =>
      prevGoals.map(goal => {
        if (goal.linkedAccountIds && goal.linkedAccountIds.length > 0) {
          return {
            ...goal,
            currentAmount: calculateCurrentAmountForGoal(goal.linkedAccountIds),
            // No need to update updatedAt here unless it's a specific user action
          };
        }
        return goal;
      })
    );
  }, [calculateCurrentAmountForGoal]);


  return {
    goals,
    addGoal,
    updateGoal,
    deleteGoal,
    recalculateCurrentAmounts,
    updateGoalCurrentAmount, // If manual update of only current amount is needed
  };
};
