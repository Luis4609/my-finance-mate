import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AVAILABLE_ACCOUNT_TYPES } from "@/shared/constants/accountTypes";

interface AddAccountFormProps {
  onAddAccount: (account: {
    name: string;
    balance: number;
    typeId: string;
  }) => void;
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({ onAddAccount }) => {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [typeId, setTypeId] = useState(AVAILABLE_ACCOUNT_TYPES[0].id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || balance === "" || !typeId) return;

    onAddAccount({
      name,
      balance: parseFloat(balance),
      typeId,
    });

    setName("");
    setBalance("");
    setTypeId(AVAILABLE_ACCOUNT_TYPES[0].id);
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
              placeholder="La Caixa, Trade Republic..."
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
              placeholder="1000.00"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accountType">Account Type</Label>
            <Select value={typeId} onValueChange={(val) => setTypeId(val)}>
              <SelectTrigger id="accountType" className="w-full">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_ACCOUNT_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id} className="capitalize">
                    {type.name.toLowerCase().replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full mt-2">
            Add Account
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddAccountForm;
