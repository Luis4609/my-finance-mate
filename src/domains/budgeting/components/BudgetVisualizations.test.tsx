import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import BudgetVisualizations from './BudgetVisualizations';
import { Budget, Category, Transaction } from '../../../shared/models/Budgeting';
import { useCategories } from '../../../shared/hooks/useCategories';
import { useTransactions } from '../../../shared/hooks/useTransactions';

// Mock hooks
vi.mock('../../../shared/hooks/useCategories');
vi.mock('../../../shared/hooks/useTransactions');

const mockCategories: Category[] = [
  { id: 'cat1', name: 'Food', description: 'Groceries, Dining out' },
  { id: 'cat2', name: 'Transport', description: 'Gas, Public transport' },
  { id: 'cat3', name: 'Entertainment', description: 'Movies, Concerts' },
];

const mockAllTransactions: Transaction[] = [
  // Transactions for selectedBudget1
  { id: 't1', budgetItemId: 'cat1', date: new Date('2024-03-05'), payee: 'Grocery Store', amount: -50 }, // Food
  { id: 't2', budgetItemId: 'cat1', date: new Date('2024-03-10'), payee: 'Restaurant', amount: -30 },    // Food
  { id: 't3', budgetItemId: 'cat2', date: new Date('2024-03-15'), payee: 'Gas Station', amount: -40 },   // Transport
  // Transaction outside selectedBudget1's date range
  { id: 't4', budgetItemId: 'cat1', date: new Date('2024-02-20'), payee: 'Old Grocery', amount: -20 },
  // Transaction for a different budget or category not in selectedBudget1's items
  { id: 't5', budgetItemId: 'cat3', date: new Date('2024-03-20'), payee: 'Cinema', amount: -25 }, // Entertainment (may or may not be in budget items)
  // Income transaction (should be ignored by spending calculations)
  { id: 't6', budgetItemId: 'cat1', date: new Date('2024-03-22'), payee: 'Refund', amount: 10 },
];

const selectedTestBudget: Budget = {
  id: 'b1',
  name: 'March Budget',
  startDate: new Date('2024-03-01'),
  endDate: new Date('2024-03-31'),
  items: [
    { id: 'bi1', categoryId: 'cat1', allocatedAmount: 200, actualAmount: 0 }, // Food
    { id: 'bi2', categoryId: 'cat2', allocatedAmount: 100, actualAmount: 0 }, // Transport
  ],
};

describe('BudgetVisualizations Data Processing', () => {
  beforeEach(() => {
    (useCategories as vi.Mock).mockReturnValue({ categories: mockCategories });
    (useTransactions as vi.Mock).mockReturnValue({ transactions: mockAllTransactions });
  });

  // Helper to extract chart data - This is tricky as data is processed internally.
  // We'll check rendered output or console.logs for now if directly accessing processed data isn't feasible
  // without refactoring the component. For this example, we'll infer based on what the component *should* calculate.

  it('should correctly calculate total spending per category for the selected budget period', () => {
    // This test infers the internal calculation by checking expected values.
    // Render the component (even if just to trigger calculations)
    const { rerender, getByText } = render(<BudgetVisualizations selectedBudget={selectedTestBudget} />);

    // Expected spending for cat1 (Food) in March: 50 + 30 = 80
    // Expected spending for cat2 (Transport) in March: 40
    // t4 is out of date range. t5 is for cat3 which might not be in this budget's items for progress bar, but could be in pie chart.
    // t6 is income.

    // Check progress bar outputs (most direct way to see per-category spending)
    // For Food (cat1):
    expect(getByText('$80.00 / $200.00')).toBeInTheDocument();
    // For Transport (cat2):
    expect(getByText('$40.00 / $100.00')).toBeInTheDocument();


    // For Pie Chart data (more indirect to assert without direct access or complex selectors)
    // We know `pieChartData` should be:
    // { name: 'Food', value: 80 }
    // { name: 'Transport', value: 40 }
    // { name: 'Entertainment', value: 25 } (if t5 is included based on transactions within period)
    // This part is harder to test without refactoring or more specific selectors for chart elements.
    // We can check if the legend items appear if they are simple enough.
    expect(getByText('Food')).toBeInTheDocument(); // From legend or labels
    expect(getByText('Transport')).toBeInTheDocument(); // From legend or labels
    // If cat3 (Entertainment) transaction t5 is within budget period, it should also be in pie chart
    const cat3Transaction = mockAllTransactions.find(t=>t.id === 't5')!;
    const budgetStartDate = new Date(selectedTestBudget.startDate);
    const budgetEndDate = new Date(selectedTestBudget.endDate);
    if (new Date(cat3Transaction.date) >= budgetStartDate && new Date(cat3Transaction.date) <= budgetEndDate) {
        expect(getByText('Entertainment')).toBeInTheDocument();
    }


    // For Bar Chart data (also indirect)
    // Bar chart items are derived from budget.items and then spending is added.
    // Item 1 (Food): allocated 200, spent 80
    // Item 2 (Transport): allocated 100, spent 40
    // Recharts renders these graphically. We've already checked the text for progress bars which is similar.
    // We can check for the XAxis labels if they are simple category names.
    // Note: The exact text might depend on Recharts rendering.
  });

  it('should return "Select a budget" message if no budget is selected', () => {
    const { getByText } = render(<BudgetVisualizations selectedBudget={null} />);
    expect(getByText('Select a budget to see visualizations.')).toBeInTheDocument();
  });

  it('should handle budgets with no items gracefully', () => {
    const budgetWithNoItems: Budget = {
      ...selectedTestBudget,
      name: "Empty Budget",
      items: []
    };
    const { getByText, queryByText } = render(<BudgetVisualizations selectedBudget={budgetWithNoItems} />);
    expect(getByText('Budget Progress: Empty Budget')).toBeInTheDocument();
    expect(getByText('No items in this budget.')).toBeInTheDocument();
    // Ensure charts that depend on items might not render or show empty state (depends on component's logic)
    // For example, the bar chart might not appear if there are no items.
    // The pie chart might still appear if there are transactions in the period, even if not tied to specific budget *items*.
  });

  it('should filter transactions correctly based on budget date range', () => {
    const budgetWithDifferentDates: Budget = {
      ...selectedTestBudget,
      id: 'b_alt_date',
      name: 'April Budget',
      startDate: new Date('2024-04-01'),
      endDate: new Date('2024-04-30'),
      items: [{ id: 'bi_apr1', categoryId: 'cat1', allocatedAmount: 100, actualAmount: 0 }],
    };
     // No transactions in mockAllTransactions fall into April 2024
    (useTransactions as vi.Mock).mockReturnValue({ transactions: mockAllTransactions });

    const { getByText } = render(<BudgetVisualizations selectedBudget={budgetWithDifferentDates} />);
    // For Food (cat1) in April budget: expected spent $0.00
    expect(getByText('$0.00 / $100.00')).toBeInTheDocument();
  });

});
