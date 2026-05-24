import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Account } from "@/shared/models/Account";
import { TransactionType } from "@/shared/models/Transaction";
import { TRANSACTION_CATEGORIES } from "@/shared/constants/categories";

interface AddTransactionFormProps {
  accounts: Account[];
  onAddTransaction: (tx: {
    date: string;
    description: string;
    amount: number;
    type: TransactionType;
    category: string;
    accountId: string;
    toAccountId?: string;
  }) => void;
}

const AddTransactionForm: React.FC<AddTransactionFormProps> = ({
  accounts,
  onAddTransaction,
}) => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<TransactionType>("EXPENSE");
  const [category, setCategory] = useState("");
  const [accountId, setAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");

  // Get categories list based on selected transaction type
  const availableCategories = TRANSACTION_CATEGORIES[type] || [];

  // Reset category and account defaults when type changes
  useEffect(() => {
    const available = TRANSACTION_CATEGORIES[type] || [];
    setCategory(available[0] || "");
  }, [type]);

  // Set default account when accounts are loaded
  useEffect(() => {
    if (accounts.length > 0 && !accountId) {
      setAccountId(accounts[0].id);
    }
  }, [accounts, accountId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !accountId || !category) return;

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) return;

    if (type === "TRANSFER" && (!toAccountId || accountId === toAccountId)) {
      alert("Please select a different destination account for transfers.");
      return;
    }

    onAddTransaction({
      date,
      description,
      amount: parsedAmount,
      type,
      category,
      accountId,
      toAccountId: type === "TRANSFER" ? toAccountId : undefined,
    });

    setDescription("");
    setAmount("");
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Log Transaction</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2 col-span-1 md:col-span-2">
            <Label htmlFor="tx-description">Description</Label>
            <Input
              id="tx-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. Weekly Supermarket, Salary payment, Rent..."
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tx-amount">Amount (€)</Label>
            <Input
              id="tx-amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              step="0.01"
              min="0.01"
              placeholder="0.00"
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tx-date">Date</Label>
            <Input
              id="tx-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tx-type">Type</Label>
            <Select
              value={type}
              onValueChange={(val) => setType(val as TransactionType)}
            >
              <SelectTrigger id="tx-type">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
                <SelectItem value="TRANSFER">Transfer</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tx-category">Category</Label>
            <Select value={category} onValueChange={(val) => setCategory(val)}>
              <SelectTrigger id="tx-category">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="tx-account">
              {type === "TRANSFER" ? "Source Account" : "Account"}
            </Label>
            <Select value={accountId} onValueChange={(val) => setAccountId(val)}>
              <SelectTrigger id="tx-account">
                <SelectValue placeholder="Select Account" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {type === "TRANSFER" && (
            <div className="grid gap-2">
              <Label htmlFor="tx-to-account">Destination Account</Label>
              <Select
                value={toAccountId}
                onValueChange={(val) => setToAccountId(val)}
              >
                <SelectTrigger id="tx-to-account">
                  <SelectValue placeholder="Select Destination" />
                </SelectTrigger>
                <SelectContent>
                  {accounts
                    .filter((acc) => acc.id !== accountId)
                    .map((acc) => (
                      <SelectItem key={acc.id} value={acc.id}>
                        {acc.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button type="submit" className="w-full mt-4 col-span-1 md:col-span-2">
            Save Transaction
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddTransactionForm;
