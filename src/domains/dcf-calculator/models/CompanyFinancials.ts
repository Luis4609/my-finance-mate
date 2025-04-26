// Defines the structure for financial data fetched from an external API
export interface CompanyFinancials {
  ticker: string;
  companyName: string;
  currentPrice: number;
  epsTTM: number; // Earnings Per Share Trailing Twelve Months
  peRatioTTM: number; // Price-to-Earnings Ratio Trailing Twelve Months
  // Add other relevant fields as needed (e.g., cash flow data if you use it)
  // cashFlowPerShare?: number;
  marketCap?: number; // Optional field for market capitalization
  currentDcfValue?: number; // Optional field for current DCF value
  currectPriceDifferenceToDcfValue?: number; // Optional field for current price difference to DCF value
}
