export interface AccountType {
  id: string;
  name:
    | "CASH"
    | "INVESTMENT"
    | "CRYPTO"
    | "SAVINGS"
    | "RETIREMENT"
    | "REAL_ESTATE"
    | "BUSINESS"
    | "EDUCATION"
    | "TRAVEL"
    | "OTHER";
  description: string | null; // Optional description for the account type
}
