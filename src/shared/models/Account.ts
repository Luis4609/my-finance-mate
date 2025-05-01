import { AccountType } from "./AccountType";

export interface Account {
  id: string;
  name: string;
  balance: number;
  lastUpdated: string;
  color: string; // Added color here as it's needed for the dashboard chart
  type: AccountType;
  isActive: boolean;
}
