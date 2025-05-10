// src/services/companyService.ts
import { FMP_API_KEY, FMP_BASE_URL } from "@/shared/config/config"; // Adjust the import path as necessary
import type { CompanyFinancials } from "@/shared/models/Financial";

/**
 * Fetches comprehensive financial data for a company.
 * @param ticker The company ticker symbol.
 * @returns A promise that resolves to CompanyFinancials or null if not found/error.
 */
export const fetchCompanyFinancials = async (
  ticker: string
): Promise<CompanyFinancials | null> => {
  if (!FMP_API_KEY) {
    console.error("FMP API key is not configured.");
    // throw new Error("API key is not configured."); // Or return null to handle gracefully
    return null;
  }
  if (!ticker) {
    console.warn("fetchCompanyFinancials called without a ticker.");
    return null;
  }

  try {
    // Fetch Company Profile
    const profileUrl = `${FMP_BASE_URL}/v3/profile/${ticker}?apikey=${FMP_API_KEY}`;
    const profileResponse = await fetch(profileUrl);

    if (!profileResponse.ok) {
      if (profileResponse.status === 404) {
        console.warn(`Company profile not found for ticker: ${ticker}`);
        return null;
      }
      const errorText = await profileResponse.text();
      console.error(
        `Error fetching profile data for ${ticker}: ${profileResponse.status} ${profileResponse.statusText} - ${errorText}`
      );
      return null; // Gracefully handle error
    }

    const profileDataArray = await profileResponse.json();
    if (!profileDataArray || profileDataArray.length === 0) {
        console.warn(`No profile data found for ticker: ${ticker}`);
        return null;
    }
    const profileData = profileDataArray[0];

    const companyName = profileData?.companyName || "N/A";
    const currentPrice = profileData?.price || 0;
    const marketCap = profileData?.mktCap || 0;
    const currentDcfValue = profileData?.dcf || null; // dcf can be null
    const currentPriceDifferenceToDcfValue = profileData?.dcfDiff || null; // dcfDiff can be null

    // Fetch Income Statement for EPS
    const incomeStatementUrl = `${FMP_BASE_URL}/v3/income-statement/${ticker}?limit=1&apikey=${FMP_API_KEY}`;
    const incomeStatementResponse = await fetch(incomeStatementUrl);

    if (!incomeStatementResponse.ok) {
      if (incomeStatementResponse.status === 404) {
        console.warn(`Income statement data not found for ticker: ${ticker}`);
        // Depending on requirements, you might still return partial data or null
      }
      const errorText = await incomeStatementResponse.text();
      console.error(
        `Error fetching income statement for ${ticker}: ${incomeStatementResponse.status} ${incomeStatementResponse.statusText} - ${errorText}`
      );
      // If EPS is crucial and not found, returning null might be appropriate
      // For now, we'll try to proceed, epsTTM will be 0 if not found.
    }
    
    let epsTTM = 0;
    if (incomeStatementResponse.ok) {
        const incomeStatementDataArray = await incomeStatementResponse.json();
        if (incomeStatementDataArray && incomeStatementDataArray.length > 0) {
            epsTTM = incomeStatementDataArray[0]?.eps || 0;
        } else {
            console.warn(`No income statement data entries for ${ticker}`);
        }
    }


    const peRatioTTM = epsTTM !== 0 && currentPrice ? currentPrice / epsTTM : 0;

    const companyFinancials: CompanyFinancials = {
      ticker: ticker.toUpperCase(),
      companyName,
      currentPrice,
      epsTTM,
      peRatioTTM: parseFloat(peRatioTTM.toFixed(2)),
      marketCap,
      currentDcfValue,
      currentPriceDifferenceToDcfValue,
    };

    console.log("Fetched company financials:", companyFinancials);
    return companyFinancials;
  } catch (error) {
    console.error(`Failed to fetch company financial data for ${ticker}:`, error);
    return null; // Gracefully handle error
  }
};