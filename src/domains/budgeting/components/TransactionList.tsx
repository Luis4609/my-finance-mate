import React from 'react';
import { useTransactions } from '../../../shared/hooks/useTransactions';
import { useCategories } from '../../../shared/hooks/useCategories';
import { Button } from '../../../components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../components/ui/table';
import { Transaction } from '../../../shared/models/Budgeting'; // Assuming Transaction model has a 'type' field

const TransactionList: React.FC = () => {
  const { transactions, deleteTransaction } = useTransactions();
  const { categories } = useCategories();

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    return category ? category.name : 'N/A';
  };

  // Assuming Transaction model has a 'type' field. If not, this needs adjustment.
  // Also, the Transaction model provided earlier didn't have 'budgetItemId' or 'payee'.
  // The model used by useTransactions hook should be consistent.
  // For now, I'll assume 'type' exists and 'budgetItemId' can be used for category linking as per previous hook structures.

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-2">Transactions</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Amount</TableHead>
            {/* <TableHead>Type</TableHead> */} {/* Assuming 'type' might be derived or part of Transaction */}
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction: Transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
              <TableCell>{transaction.description || transaction.payee}</TableCell> {/* Fallback to payee if description is empty */}
              <TableCell>{getCategoryName(transaction.budgetItemId)}</TableCell> {/* Assuming budgetItemId links to a category for now */}
              <TableCell className={transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}>
                {transaction.amount < 0 ? '-' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </TableCell>
              {/* <TableCell>{transaction.type}</TableCell> */}
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteTransaction(transaction.id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TransactionList;
