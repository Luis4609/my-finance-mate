import React, { useState, useEffect } from 'react';
import { useBudgets } from '../../../shared/hooks/useBudgets';
import { useCategories } from '../../../shared/hooks/useCategories';
import { Budget, BudgetItem, Category } from '../../../shared/models/Budgeting';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';

interface BudgetFormProps {
  budgetToEdit?: Budget | null;
  onClose: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ budgetToEdit, onClose }) => {
  const { addBudget, updateBudget } = useBudgets();
  const { categories } = useCategories();

  const [id, setId] = useState(budgetToEdit?.id || Math.random().toString(36).substr(2, 9));
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [items, setItems] = useState<BudgetItem[]>([]);

  // States for adding a new budget item
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [allocatedAmount, setAllocatedAmount] = useState<number>(0);

  useEffect(() => {
    if (budgetToEdit) {
      setId(budgetToEdit.id);
      setName(budgetToEdit.name);
      setStartDate(new Date(budgetToEdit.startDate).toISOString().split('T')[0]);
      setEndDate(new Date(budgetToEdit.endDate).toISOString().split('T')[0]);
      setItems(budgetToEdit.items || []);
    } else {
      // Reset for new budget
      setId(Math.random().toString(36).substr(2, 9));
      setName('');
      setStartDate('');
      setEndDate('');
      setItems([]);
    }
  }, [budgetToEdit]);

  const handleAddBudgetItem = () => {
    if (!selectedCategoryId || allocatedAmount <= 0) {
      // Basic validation
      alert('Please select a category and enter a valid allocated amount.');
      return;
    }
    const newItem: BudgetItem = {
      id: Math.random().toString(36).substr(2, 9), // Temporary ID
      categoryId: selectedCategoryId,
      allocatedAmount: allocatedAmount,
      actualAmount: 0, // Default actual amount
    };
    setItems([...items, newItem]);
    setSelectedCategoryId('');
    setAllocatedAmount(0);
  };

  const handleRemoveBudgetItem = (itemId: string) => {
    setItems(items.filter(item => item.id !== itemId));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !startDate || !endDate) {
        alert('Please fill in all budget fields.');
        return;
    }
    const budgetData: Budget = {
      id,
      name,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      items,
    };

    if (budgetToEdit) {
      updateBudget(budgetData);
    } else {
      addBudget(budgetData);
    }
    onClose();
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="budgetName">Budget Name</Label>
        <Input
          id="budgetName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="startDate">Start Date</Label>
        <Input
          id="startDate"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <Label htmlFor="endDate">End Date</Label>
        <Input
          id="endDate"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-medium">Budget Items</h3>
        <div className="flex items-end gap-2">
          <div className="flex-grow">
            <Label htmlFor="category">Category</Label>
            <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="allocatedAmount">Allocated Amount</Label>
            <Input
              id="allocatedAmount"
              type="number"
              value={allocatedAmount}
              onChange={(e) => setAllocatedAmount(parseFloat(e.target.value))}
            />
          </div>
          <Button type="button" onClick={handleAddBudgetItem}>
            Add Item
          </Button>
        </div>
        {items.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Allocated</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{getCategoryName(item.categoryId)}</TableCell>
                  <TableCell>${item.allocatedAmount.toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemoveBudgetItem(item.id)}
                    >
                      Remove
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit">{budgetToEdit ? 'Save Changes' : 'Add Budget'}</Button>
      </div>
    </form>
  );
};

export default BudgetForm;
