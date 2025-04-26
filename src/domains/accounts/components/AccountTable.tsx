import React from "react";
import { Account } from '@/shared/models/Account';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Assuming shadcn Card is available
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button"; 
import { formatCurrency } from '@/shared/utils/currencyUtils';

interface AccountTableProps {
  accounts: Account[];
  onUpdateBalance: (id: string, newBalance: number) => void;
  onDeleteAccount: (id: string) => void;
}

const AccountTable: React.FC<AccountTableProps> = ({
  accounts,
  onUpdateBalance,
  onDeleteAccount,
}) => {
  // Simple handler for balance update (could be a modal or inline editing later)
  const handleUpdateClick = (account: Account) => {
    const newBalanceString = prompt(
      `Enter new balance for ${account.name}:`,
      account.balance.toFixed(2)
    );
    if (newBalanceString !== null) {
      const newBalance = parseFloat(newBalanceString);
      if (!isNaN(newBalance)) {
        onUpdateBalance(account.id, newBalance);
      } else {
        alert("Invalid balance entered.");
      }
    }
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Your Accounts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Name</TableHead>
                <TableHead>Balance</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.name}</TableCell>
                  <TableCell>{formatCurrency(account.balance)}</TableCell>
                  <TableCell>{account.lastUpdated}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUpdateClick(account)}
                    >
                      Update Balance
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDeleteAccount(account.id)}
                      className="ml-2"
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountTable;
