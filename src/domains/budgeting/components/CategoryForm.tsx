import React, { useState, useEffect } from 'react';
import { useCategories } from '../../../shared/hooks/useCategories';
import { Category } from '../../../shared/models/Budgeting';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
// Assuming Dialog or Sheet might be used here, but the form logic is independent for now
// import { DialogFooter, DialogHeader, DialogTitle } from '../../../components/ui/dialog';

interface CategoryFormProps {
  categoryToEdit?: Category | null;
  onClose: () => void; // Function to close the form (e.g., close dialog)
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryToEdit, onClose }) => {
  const { addCategory, updateCategory } = useCategories();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  // In a real app, generate unique IDs properly
  const [id, setId] = useState(categoryToEdit?.id || Math.random().toString(36).substr(2, 9));

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setDescription(categoryToEdit.description || '');
      setId(categoryToEdit.id);
    } else {
      // Reset for new category
      setName('');
      setDescription('');
      setId(Math.random().toString(36).substr(2, 9));
    }
  }, [categoryToEdit]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const categoryData: Category = { id, name, description };

    if (categoryToEdit) {
      updateCategory(categoryData);
    } else {
      addCategory(categoryData);
    }
    onClose(); // Close the form after submission
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* This structure assumes it might be part of a Dialog */}
      {/* <DialogHeader><DialogTitle>{categoryToEdit ? 'Edit Category' : 'Add Category'}</DialogTitle></DialogHeader> */}
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3"
          />
        </div>
      </div>
      {/* <DialogFooter> */}
        <Button type="button" variant="outline" onClick={onClose} className="mr-2">
          Cancel
        </Button>
        <Button type="submit">{categoryToEdit ? 'Save Changes' : 'Add Category'}</Button>
      {/* </DialogFooter> */}
    </form>
  );
};

export default CategoryForm;
