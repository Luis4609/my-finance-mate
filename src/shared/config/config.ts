// Ensure your VITE_FMP_API_KEY is set in your .env file
export const FMP_API_KEY = import.meta.env.VITE_FMP_API_KEY;
export const FMP_BASE_URL = "https://financialmodelingprep.com/api";

if (!FMP_API_KEY) {
  console.warn(
    "FMP API key (VITE_FMP_API_KEY) is not configured in your .env file. API calls will likely fail."
  );
}
