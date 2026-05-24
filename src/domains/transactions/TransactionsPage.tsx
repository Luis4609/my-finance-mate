import React, { useState, useMemo } from "react";
import { Account } from "@/shared/models/Account";
import { Transaction, TransactionType } from "@/shared/models/Transaction";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import AddTransactionForm from "./components/AddTransactionForm";
import { formatCurrency } from "@/shared/utils/currencyUtils";
import { TRANSACTION_CATEGORIES } from "@/shared/constants/categories";

interface TransactionsPageProps {
  accounts: Account[];
  transactions: Transaction[];
  onAddTransaction: (tx: Omit<Transaction, "id">) => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionsPage: React.FC<TransactionsPageProps> = ({
  accounts,
  transactions,
  onAddTransaction,
  onDeleteTransaction,
}) => {
  // Filtering states
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [accountFilter, setAccountFilter] = useState<string>("ALL");
  const [categoryFilter, setCategoryFilter] = useState<string>("ALL");

  // Helper to map account ID to Name
  const getAccountName = (id: string) => {
    const acc = accounts.find((a) => a.id === id);
    return acc ? acc.name : "Unknown Account";
  };

  // Unique categories list for filters
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    Object.values(TRANSACTION_CATEGORIES).forEach((typeCats) => {
      typeCats.forEach((c) => cats.add(c));
    });
    return Array.from(cats);
  }, []);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchesType = typeFilter === "ALL" || tx.type === typeFilter;
      const matchesAccount =
        accountFilter === "ALL" ||
        tx.accountId === accountFilter ||
        tx.toAccountId === accountFilter;
      const matchesCategory =
        categoryFilter === "ALL" || tx.category === categoryFilter;

      return matchesType && matchesAccount && matchesCategory;
    });
  }, [transactions, typeFilter, accountFilter, categoryFilter]);

  // Style helper for badges based on transaction type
  const getTypeBadge = (type: TransactionType) => {
    switch (type) {
      case "INCOME":
        return <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Income</Badge>;
      case "EXPENSE":
        return <Badge className="bg-rose-500/20 text-rose-400 border-rose-500/30">Expense</Badge>;
      case "TRANSFER":
        return <Badge className="bg-sky-500/20 text-sky-400 border-sky-500/30">Transfer</Badge>;
      default:
        return <Badge variant="outline">Other</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6 flex flex-col gap-6">
      <h1 className="text-3xl font-bold text-white font-sans">Transactions</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Side: Create transaction form */}
        <div className="lg:col-span-1">
          <AddTransactionForm
            accounts={accounts}
            onAddTransaction={onAddTransaction}
          />
        </div>

        {/* Right Side: Ledger and Filter controls */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <Card className="w-full">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Filter Ledger</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="grid gap-1">
                <span className="text-xs text-muted-foreground font-medium">Type</span>
                <Select value={typeFilter} onValueChange={(val) => setTypeFilter(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="EXPENSE">Expense</SelectItem>
                    <SelectItem value="INCOME">Income</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <span className="text-xs text-muted-foreground font-medium">Account</span>
                <Select value={accountFilter} onValueChange={(val) => setAccountFilter(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Accounts" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Accounts</SelectItem>
                    {accounts.map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-1">
                <span className="text-xs text-muted-foreground font-medium">Category</span>
                <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Categories</SelectItem>
                    {allCategories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full flex-1">
            <CardHeader className="pb-3 flex flex-row items-center justify-between">
              <CardTitle>History</CardTitle>
              <span className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length}
              </span>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Account</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                          No transactions found matching the filters.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredTransactions.map((tx) => (
                        <TableRow key={tx.id}>
                          <TableCell className="text-xs font-mono text-muted-foreground">
                            {tx.date}
                          </TableCell>
                          <TableCell className="font-medium text-white">
                            {tx.description}
                          </TableCell>
                          <TableCell>{getTypeBadge(tx.type)}</TableCell>
                          <TableCell className="text-sm font-sans text-gray-300">
                            {tx.category}
                          </TableCell>
                          <TableCell className="text-xs text-gray-400">
                            {tx.type === "TRANSFER" ? (
                              <span>
                                {getAccountName(tx.accountId)} &rarr; {getAccountName(tx.toAccountId || "")}
                              </span>
                            ) : (
                              getAccountName(tx.accountId)
                            )}
                          </TableCell>
                          <TableCell className={`text-right font-semibold ${
                            tx.type === "INCOME" 
                              ? "text-emerald-400" 
                              : tx.type === "EXPENSE" 
                                ? "text-rose-400" 
                                : "text-sky-400"
                          }`}>
                            {tx.type === "EXPENSE" ? "-" : "+"}
                            {formatCurrency(tx.amount)}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDeleteTransaction(tx.id)}
                              className="text-rose-500 hover:text-rose-400 hover:bg-rose-500/10 h-8"
                            >
                              Delete
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
