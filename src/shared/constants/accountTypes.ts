import { AccountType } from "@/shared/models/AccountType";

// Define the available account types
export const AVAILABLE_ACCOUNT_TYPES: AccountType[] = [
  {
    id: "cash",
    name: "CASH",
    description: "Physical cash or highly liquid funds.",
  },
  {
    id: "investment",
    name: "INVESTMENT",
    description: "Stocks, bonds, mutual funds, etc.",
  },
  {
    id: "crypto",
    name: "CRYPTO",
    description: "Cryptocurrencies like Bitcoin, Ethereum, etc.",
  },
  { id: "savings", name: "SAVINGS", description: "Savings accounts." },
  {
    id: "retirement",
    name: "RETIREMENT",
    description: "Retirement funds (e.g., 401k, IRA).",
  },
  {
    id: "real_estate",
    name: "REAL_ESTATE",
    description: "Real estate properties.",
  },
  {
    id: "business",
    name: "BUSINESS",
    description: "Business accounts or assets.",
  },
  {
    id: "education",
    name: "EDUCATION",
    description: "Education savings funds.",
  },
  { id: "travel", name: "TRAVEL", description: "Funds allocated for travel." },
  { id: "other", name: "OTHER", description: "Any other type of account." },
];
