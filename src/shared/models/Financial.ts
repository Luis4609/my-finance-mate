// src/types/financial.ts

export interface CompanyFinancials {
    ticker: string;
    companyName: string;
    currentPrice: number;
    epsTTM: number;
    peRatioTTM: number; // Calculated from price and epsTTM
    marketCap: number;
    currentDcfValue: number | null; // dcf from FMP profile can be null
    currectPriceDifferenceToDcfValue: number | null; // dcfDiff from FMP profile can be null
  }
  
  export interface RatiosData {
    ev_ebitda: number | string | null;
    per: number | string | null; // This will come from ratios-ttm endpoint
    ev_fcf: number | string | null; // We'll map priceToFreeCashFlowsRatioTTM here
    ev_ebit: number | string | null; // May not be directly available, might be null
    // Add other ratios from FMP if needed
    priceToSalesRatioTTM?: number | null;
    priceToBookRatioTTM?: number | null;
    debtToEquityRatioTTM?: number | null;
    roeTTM?: number | null;
  }
  
  export interface ScenarioResult {
    year: number;
    eps: number;
    scenario_per_20: number;
    scenario_per_22_5: number;
    scenario_per_25: number;
  }
  
  // Props for the main component, now taking a ticker
  export interface RatiosAndScenariosProps {
    ticker: string | null; // Allow null if no ticker is selected yet
  }
  
  export const PER_MULTIPLES = [20, 22.5, 25] as const;
  export const SCENARIO_YEARS = 5;