import { useState, useEffect } from 'react';
import { Category } from '../models/Budgeting';
import initialCategories from '../../app/budgeting/data/categories.json';

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    setCategories(initialCategories);
  }, []);

  const addCategory = (category: Category) => {
    setCategories([...categories, category]);
  };

  const updateCategory = (updatedCategory: Category) => {
    setCategories(
      categories.map((category) =>
        category.id === updatedCategory.id ? updatedCategory : category
      )
    );
  };

  const deleteCategory = (categoryId: string) => {
    setCategories(categories.filter((category) => category.id !== categoryId));
  };

  return { categories, addCategory, updateCategory, deleteCategory };
};
