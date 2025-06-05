import React from 'react';
import { useBudgets } from '../../../shared/hooks/useBudgets';
import { useCategories } from '../../../shared/hooks/useCategories';
import { useTransactions } from '../../../shared/hooks/useTransactions';
import { Budget, BudgetItem, Category, Transaction } from '../../../shared/models/Budgeting';
import { Progress } from '../../../components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface BudgetVisualizationsProps {
  selectedBudget: Budget | null;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

const BudgetVisualizations: React.FC<BudgetVisualizationsProps> = ({ selectedBudget }) => {
  const { categories } = useCategories();
  const { transactions } = useTransactions();

  if (!selectedBudget) {
    return <p>Select a budget to see visualizations.</p>;
  }

  // Filter transactions for the selected budget's period
  const budgetTransactions = transactions.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate >= new Date(selectedBudget.startDate) && transactionDate <= new Date(selectedBudget.endDate);
  });

  // Calculate spending per category for the budget period
  const spendingByCategory: { [categoryId: string]: number } = {};
  budgetTransactions.forEach(t => {
    if (t.amount < 0) { // Assuming expenses are negative
      const categoryId = t.budgetItemId; // Assuming budgetItemId is categoryId
      spendingByCategory[categoryId] = (spendingByCategory[categoryId] || 0) + Math.abs(t.amount);
    }
  });

  const pieChartData = Object.keys(spendingByCategory).map(categoryId => {
    const category = categories.find(c => c.id === categoryId);
    return {
      name: category ? category.name : 'Unknown Category',
      value: spendingByCategory[categoryId],
    };
  }).filter(item => item.value > 0);


  // Prepare data for Budget vs. Actual Bar Chart
  const barChartData = selectedBudget.items.map(item => {
    const category = categories.find(c => c.id === item.categoryId);
    const spent = spendingByCategory[item.categoryId] || 0;
    return {
      name: category ? category.name : 'Unknown',
      allocated: item.allocatedAmount,
      spent: spent,
    };
  });

  return (
    <div className="mt-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Budget Progress: {selectedBudget.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {selectedBudget.items.length === 0 && <p>No items in this budget.</p>}
          {selectedBudget.items.map(item => {
            const category = categories.find(c => c.id === item.categoryId);
            const spent = spendingByCategory[item.categoryId] || 0;
            const progressPercentage = item.allocatedAmount > 0 ? (spent / item.allocatedAmount) * 100 : 0;
            return (
              <div key={item.id}>
                <div className="flex justify-between mb-1">
                  <span>{category ? category.name : 'Unknown Category'}</span>
                  <span>${spent.toFixed(2)} / ${item.allocatedAmount.toFixed(2)}</span>
                </div>
                <Progress value={progressPercentage} className="w-full" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {pieChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Spending by Category</CardTitle>
          </CardHeader>
          <CardContent style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {barChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Budget vs. Actual Spending</CardTitle>
          </CardHeader>
          <CardContent style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={barChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `$${value}`} />
                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                <Legend />
                <Bar dataKey="allocated" fill="#8884d8" name="Allocated" />
                <Bar dataKey="spent" fill="#82ca9d" name="Spent" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BudgetVisualizations;
