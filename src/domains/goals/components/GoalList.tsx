import React from 'react';
import { useFinancialGoals } from '../../../shared/hooks/useFinancialGoals';
import { FinancialGoal } from '../../../shared/models/FinancialGoal';
import { Button } from '../../../components/ui/button';
import { Progress } from '../../../components/ui/progress'; // For showing goal progress
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';

interface GoalListProps {
  onEditGoal: (goal: FinancialGoal) => void; // Callback to open form for editing
}

const GoalList: React.FC<GoalListProps> = ({ onEditGoal }) => {
  const { goals, deleteGoal } = useFinancialGoals();

  const calculateProgress = (current: number, target: number): number => {
    if (target <= 0) return 0;
    return Math.min((current / target) * 100, 100); // Cap progress at 100%
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (goals.length === 0) {
    return <p>No financial goals set yet. Add one to get started!</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Target Amount</TableHead>
          <TableHead>Current Amount</TableHead>
          <TableHead>Progress</TableHead>
          <TableHead>Dates (Start/Target)</TableHead>
          <TableHead>Status / Days Left</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {goals.map((goal) => {
          const progress = calculateProgress(goal.currentAmount, goal.targetAmount);

          let statusText = '';
          const today = new Date();
          today.setHours(0,0,0,0); // Normalize today to start of day
          const targetDate = new Date(goal.targetDate);
          targetDate.setHours(0,0,0,0); // Normalize targetDate to start of day

          if (goal.currentAmount >= goal.targetAmount) {
            statusText = 'Completed';
          } else {
            const diffTime = targetDate.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 0) {
              statusText = `${diffDays} day(s) remaining`;
            } else if (diffDays === 0) {
              statusText = 'Target date is today';
            }
             else {
              statusText = `${Math.abs(diffDays)} day(s) overdue`;
            }
          }

          return (
            <TableRow key={goal.id}>
              <TableCell>{goal.name}</TableCell>
              <TableCell>${goal.targetAmount.toFixed(2)}</TableCell>
              <TableCell>${goal.currentAmount.toFixed(2)}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <div className="flex items-center mb-1">
                    <Progress value={progress} className="w-[calc(100%-3.5em)] mr-2" />
                    <span className="text-xs font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div>Start: {formatDate(goal.startDate)}</div>
                <div>Target: {formatDate(goal.targetDate)}</div>
              </TableCell>
              <TableCell>{statusText}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  className="mr-2"
                  onClick={() => onEditGoal(goal)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteGoal(goal.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default GoalList;
