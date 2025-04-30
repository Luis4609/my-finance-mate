import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Account } from "@/shared/models/Account";
import React, { useState } from "react";

interface AddAccountFormProps {
  onAddAccount: (
    account: Omit<Account, "id" | "lastUpdated" | "color" | "isActive">
  ) => void;
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({ onAddAccount }) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");

  //TODO: Add a dropdown for account types
  // For now, we will use a text input for account type
  const [type, setType] = useState("");


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || balance === "") return;

    const newAccount = {
      name,
      balance: parseFloat(balance),
      lastUpdated: new Date().toISOString(),
      type,
    };

    onAddAccount(newAccount);
    setName("");
    setBalance("");
    setType(""); 
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Add New Account</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Account Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="balance">Initial Balance</Label>
            <Input
              id="balance"
              type="number"
              value={balance}
              onChange={(e) => setBalance(e.target.value)}
              step="0.01"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="balance">Account type</Label>
            <Input
              id="accountType"
              type="text"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Add Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAccountForm;
