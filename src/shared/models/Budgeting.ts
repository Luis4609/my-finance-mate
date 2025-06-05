export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Budget {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  items: BudgetItem[];
}

export interface BudgetItem {
  id: string;
  categoryId: string;
  allocatedAmount: number;
  actualAmount: number;
}

export interface Transaction {
  id: string;
  budgetItemId: string;
  date: Date;
  payee: string;
  description?: string;
  amount: number;
}
