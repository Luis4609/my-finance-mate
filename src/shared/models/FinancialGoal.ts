export interface FinancialGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string; // Changed to non-optional string
  startDate: string; // Added startDate
  description?: string;
  linkedAccountIds?: string[]; // Added linkedAccountIds
  icon?: string; // Added icon
  createdAt: string; // Kept as string
  updatedAt: string; // Kept as string
  // status field removed as per instruction
}
