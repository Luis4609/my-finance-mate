import { CompanyFinancials } from "../models/CompanyFinancials";

const API_KEY = import.meta.env.VITE_FMP_API_KEY;

// Base URL for Financial Modeling Prep API
const BASE_URL = "https://financialmodelingprep.com/api";

export const fetchCompanyFinancials = async (
  ticker: string
): Promise<CompanyFinancials | null> => {
  if (!API_KEY) {
    console.error("FMP API key is not configured.");
    throw new Error("API key is not configured.");
  }

  try {
    // Fetch Company Profile (for company name)
    const profileUrl = `${BASE_URL}/v3/profile/${ticker}?apikey=${API_KEY}`;
    const profileResponse = await fetch(profileUrl);

    if (!profileResponse.ok) {
      if (profileResponse.status === 404) {
        console.warn(`Company profile not found for ticker: ${ticker}`);
        return null;
      }
      console.error(
        `Error fetching profile data for ${ticker}: ${profileResponse.statusText}`
      );
      throw new Error(
        `Error fetching profile data: ${profileResponse.statusText}`
      );
    }

    const profileData = await profileResponse.json();

    console.log("Profile data:", profileData);

    // FMP profile endpoint returns an array, take the first element
    const companyName = profileData[0]?.companyName || "N/A";
    const currentPrice = profileData[0]?.price || 0;
    const marketCap = profileData[0]?.mktCap || 0;
    const currentDcfValue = profileData[0]?.dcf || 0;
    const currentPriceDifferenceToDcfValue = profileData[0]?.dcfDiff || 0;

    // Fetch Income Statement (for EPS) - getting the latest annual EPS
    // Note: FMP has a specific TTM EPS endpoint, but using income-statement demonstrates fetching from another source.
    const incomeStatementUrl = `${BASE_URL}/v3/income-statement/${ticker}?limit=1&apikey=${API_KEY}`; // limit=1 for latest annual
    const incomeStatementResponse = await fetch(incomeStatementUrl);

    if (!incomeStatementResponse.ok) {
      if (incomeStatementResponse.status === 404) {
        console.warn(`Income statement data not found for ticker: ${ticker}`);
        // Decide how critical this data is. For DCF, EPS is essential.
        return null;
      }
      console.error(
        `Error fetching income statement for ${ticker}: ${incomeStatementResponse.statusText}`
      );
      throw new Error(
        `Error fetching income statement: ${incomeStatementResponse.statusText}`
      );
    }
    const incomeStatementData = await incomeStatementResponse.json();
    console.log("Income statement data:", incomeStatementData);
    const epsTTM = incomeStatementData[0]?.eps || 0; // Use 'eps' from income statement

    const peRatioTTM = currentPrice / epsTTM;

    // You might also need to fetch Cash Flow data if your DCF model uses it.
    // Example Cash Flow endpoint: `${BASE_URL}/v3/cash-flow-statement/${ticker}?limit=1&apikey=${API_KEY}`
    // You would need to parse the response and extract the relevant cash flow per share data.

    // Construct the CompanyFinancials object
    const companyFinancials: CompanyFinancials = {
      ticker: ticker.toUpperCase(),
      companyName: companyName,
      currentPrice: currentPrice,
      epsTTM: epsTTM,
      peRatioTTM: peRatioTTM,
      marketCap: marketCap,
      currentDcfValue: currentDcfValue, // Assuming current price is used as DCF value for simplicity
      currectPriceDifferenceToDcfValue: currentPriceDifferenceToDcfValue, // Assuming current price difference to DCF value is fetched from profile data
      // Map cash flow data if fetched
      // cashFlowPerShare: fetchedCashFlowData,
    };

    console.log("Fetched financial data:", companyFinancials);
    return companyFinancials;
  } catch (error) {
    console.error("Failed to fetch company financial data:", error);
    throw error; // Re-throw the error to be caught by the calling component
  }
};
