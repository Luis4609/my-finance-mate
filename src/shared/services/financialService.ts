// src/services/financialService.ts
import { FMP_API_KEY, FMP_BASE_URL } from "@/shared/config/config"; // Adjust the import path as necessary
import type { RatiosData } from "@/shared/models/Financial";

/**
 * Fetches financial ratios TTM (Trailing Twelve Months) for a company.
 * @param ticker The company ticker symbol.
 * @returns A promise that resolves to RatiosData or null if not found/error.
 */
export const fetchRatiosData = async (
  ticker: string
): Promise<RatiosData | null> => {
  if (!FMP_API_KEY) {
    console.error("FMP API key is not configured.");
    return null;
  }
   if (!ticker) {
    console.warn("fetchRatiosData called without a ticker.");
    return null;
  }

  const url = `${FMP_BASE_URL}/v3/ratios-ttm/${ticker}?apikey=${FMP_API_KEY}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      if (response.status === 404) {
        console.warn(`Ratios TTM data not found for ticker: ${ticker}`);
        return null;
      }
      const errorText = await response.text();
      console.error(
        `Error fetching ratios TTM for ${ticker}: ${response.status} ${response.statusText} - ${errorText}`
      );
      return null;
    }

    const dataArray = await response.json();
    if (!dataArray || dataArray.length === 0) {
        console.warn(`No ratios TTM data entries found for ticker: ${ticker}`);
        return null;
    }
    const fmpRatios = dataArray[0];

    const ratios: RatiosData = {
      per: fmpRatios.peRatioTTM !== null ? parseFloat(fmpRatios.peRatioTTM.toFixed(2)) : null,
      ev_ebitda: fmpRatios.enterpriseValueOverEBITDATTM !== null ? parseFloat(fmpRatios.enterpriseValueOverEBITDATTM.toFixed(2)) : null,
      // FMP uses priceToFreeCashFlowsRatioTTM. If you need EV/FCF, it might require separate calculation.
      ev_fcf: fmpRatios.priceToFreeCashFlowsRatioTTM !== null ? parseFloat(fmpRatios.priceToFreeCashFlowsRatioTTM.toFixed(2)) : null, 
      ev_ebit: null, // EV/EBIT is not typically in ratios-ttm. Set to null or calculate if needed.
      
      // Optional: map other ratios if you've added them to RatiosData interface
      priceToSalesRatioTTM: fmpRatios.priceToSalesRatioTTM !== null ? parseFloat(fmpRatios.priceToSalesRatioTTM.toFixed(2)) : null,
      priceToBookRatioTTM: fmpRatios.priceBookRatioTTM !== null ? parseFloat(fmpRatios.priceBookRatioTTM.toFixed(2)) : null, // Note: FMP field name might be priceBookRatioTTM
      debtToEquityRatioTTM: fmpRatios.debtEquityRatioTTM !== null ? parseFloat(fmpRatios.debtEquityRatioTTM.toFixed(2)) : null,
      roeTTM: fmpRatios.returnOnEquityTTM !== null ? parseFloat(fmpRatios.returnOnEquityTTM.toFixed(2)) : null,
    };
    console.log("Fetched financial ratios data:", ratios);
    return ratios;
  } catch (error) {
    console.error(`Failed to fetch ratios TTM for ${ticker}:`, error);
    return null;
  }
};