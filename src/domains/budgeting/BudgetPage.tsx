import React, { useState } from 'react';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';
import BudgetList from './components/BudgetList';
import BudgetForm from './components/BudgetForm';
import TransactionList from './components/TransactionList';
import TransactionForm from './components/TransactionForm';
import BudgetVisualizations from './components/BudgetVisualizations';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'; // Added for budget selection
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { Category, Budget, Transaction } from '../../shared/models/Budgeting';
import { useBudgets } from '../../shared/hooks/useBudgets'; // Added to get budgets for selection

const BudgetPage: React.FC = () => {
  const { budgets } = useBudgets(); // Get all budgets
  const [selectedBudgetId, setSelectedBudgetId] = useState<string | null>(null);

  const [isCategorySheetOpen, setIsCategorySheetOpen] = useState(false);
  const [isBudgetSheetOpen, setIsBudgetSheetOpen] = useState(false);
  const [isTransactionSheetOpen, setIsTransactionSheetOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  useEffect(() => { // Auto-select first budget if available
    if (budgets.length > 0 && !selectedBudgetId) {
      setSelectedBudgetId(budgets[0].id);
    }
  }, [budgets, selectedBudgetId]);

  const selectedBudget = budgets.find(b => b.id === selectedBudgetId) || null;

  const handleOpenCategoryForm = (category?: Category) => {
    setEditingCategory(category || null);
    setIsCategorySheetOpen(true);
  };

  const handleCloseCategoryForm = () => {
    setIsCategorySheetOpen(false);
    setEditingCategory(null);
  };

  const handleOpenBudgetForm = (budget?: Budget) => {
    setEditingBudget(budget || null);
    setIsBudgetSheetOpen(true);
  };

  const handleCloseBudgetForm = () => {
    setIsBudgetSheetOpen(false);
    setEditingBudget(null);
  };

  const handleOpenTransactionForm = (transaction?: Transaction) => {
    setEditingTransaction(transaction || null);
    setIsTransactionSheetOpen(true);
  };

  const handleCloseTransactionForm = () => {
    setIsTransactionSheetOpen(false);
    setEditingTransaction(null);
  };

  // Note: The edit buttons in CategoryList/BudgetList/TransactionList would need to call
  // handleOpenCategoryForm(category) or handleOpenBudgetForm(budget) respectively.
  // This will require passing down these handler functions as props to those components.
  // For this subtask, I am focusing on the structure and basic modal opening.

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Budgeting Dashboard</h1>

      <div className="mb-6">
        <Sheet open={isCategorySheetOpen} onOpenChange={setIsCategorySheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => handleOpenCategoryForm()}>Add New Category</Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</SheetTitle>
            </SheetHeader>
            <CategoryForm
              categoryToEdit={editingCategory}
              onClose={handleCloseCategoryForm}
            />
          </SheetContent>
        </Sheet>
      </div>

      <CategoryList />
      {/* Placeholder for edit button functionality in CategoryList */}
      {/* To implement edit:
          1. Modify CategoryList to accept onEdit prop: (category: Category) => void
          2. In CategoryList, call props.onEdit(category) for the edit button.
          3. Here, pass handleOpenCategoryForm to CategoryList: <CategoryList onEdit={handleOpenCategoryForm} />
      */}


      <div className="my-6">
        <Sheet open={isBudgetSheetOpen} onOpenChange={setIsBudgetSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => handleOpenBudgetForm()}>Add New Budget</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[600px]"> {/* Example: wider sheet for budget form */}
            <SheetHeader>
              <SheetTitle>{editingBudget ? 'Edit Budget' : 'Add New Budget'}</SheetTitle>
            </SheetHeader>
            <BudgetForm
              budgetToEdit={editingBudget}
              onClose={handleCloseBudgetForm}
            />
          </SheetContent>
        </Sheet>
      </div>

      <BudgetList />
      {/* Placeholder for edit button functionality in BudgetList */}
      {/* Similar to CategoryList, pass handleOpenBudgetForm to BudgetList for edit functionality */}

      <div className="my-6">
        <Sheet open={isTransactionSheetOpen} onOpenChange={setIsTransactionSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => handleOpenTransactionForm()}>Add New Transaction</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[600px]">
            <SheetHeader>
              <SheetTitle>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</SheetTitle>
            </SheetHeader>
            <TransactionForm
              transactionToEdit={editingTransaction}
              onClose={handleCloseTransactionForm}
            />
          </SheetContent>
        </Sheet>
      </div>

      <TransactionList />
      {/* Placeholder for edit button functionality in TransactionList */}
      {/* Similar to CategoryList, pass handleOpenTransactionForm to TransactionList for edit functionality */}

      <div className="my-8">
        <h2 className="text-xl font-semibold mb-4">Budget Visualizations</h2>
        {budgets.length > 0 ? (
          <>
            <Select
              value={selectedBudgetId || ''}
              onValueChange={(value) => setSelectedBudgetId(value)}
            >
              <SelectTrigger className="w-[280px] mb-4">
                <SelectValue placeholder="Select a budget to visualize" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((budget) => (
                  <SelectItem key={budget.id} value={budget.id}>
                    {budget.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <BudgetVisualizations selectedBudget={selectedBudget} />
          </>
        ) : (
          <p>No budgets available to visualize. Please add a budget first.</p>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
