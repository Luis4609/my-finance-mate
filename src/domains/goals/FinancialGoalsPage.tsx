import React, { useState } from 'react';
import GoalList from './components/GoalList';
import GoalForm from './components/GoalForm';
import { Button } from '../../components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../components/ui/sheet';
import { FinancialGoal } from '../../shared/models/FinancialGoal';

const FinancialGoalsPage: React.FC = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<FinancialGoal | null>(null);

  const handleOpenForm = (goal?: FinancialGoal) => {
    setEditingGoal(goal || null);
    setIsSheetOpen(true);
  };

  const handleCloseForm = () => {
    setIsSheetOpen(false);
    setEditingGoal(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Financial Goals</h1>
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button onClick={() => handleOpenForm()}>Add New Goal</Button>
          </SheetTrigger>
          <SheetContent className="sm:max-w-[500px]"> {/* Adjust width as needed */}
            <SheetHeader>
              <SheetTitle>{editingGoal ? 'Edit Financial Goal' : 'Add New Financial Goal'}</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <GoalForm goalToEdit={editingGoal} onClose={handleCloseForm} />
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <GoalList onEditGoal={handleOpenForm} />
    </div>
  );
};

export default FinancialGoalsPage;
