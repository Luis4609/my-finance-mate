export type TransactionType = "INCOME" | "EXPENSE" | "TRANSFER";

export interface Transaction {
  id: string;
  date: string; // ISO date string
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
  accountId: string;       // Source account for EXPENSE/TRANSFER, target account for INCOME
  toAccountId?: string;     // Destination account for TRANSFER
}
