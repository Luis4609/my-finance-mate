// src/hooks/useFinancialCalculations.ts
import { useState, useEffect, useCallback } from "react";
import type {
  RatiosData,
  ScenarioResult,
  CompanyFinancials,
} from "@/shared/models/Financial"; // Adjust the import path as necessary
import { fetchCompanyFinancials } from "@/domains/dcf-calculator/services/companyService"; // Adjust the import path as necessary
import { fetchRatiosData as fetchCoreRatiosData } from "@/shared/services/financialService"; // Renamed import to avoid conflict
import { calculateScenarios } from "@/domains/dcf-calculator/utils/scenarioCalculator"; // Adjust the import path as necessary

interface UseFinancialCalculationsParams {
  ticker: string | null;
}

export const useFinancialCalculations = ({
  ticker,
}: UseFinancialCalculationsParams) => {
  const [companyFinancials, setCompanyFinancials] =
    useState<CompanyFinancials | null>(null);
  const [epsGrowth, setEpsGrowth] = useState<number | "">("");
  const [ratios, setRatios] = useState<RatiosData | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial company data and core ratios
  useEffect(() => {
    const loadInitialData = async () => {
      if (!ticker) {
        setCompanyFinancials(null);
        setRatios(null);
        setScenarios([]);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      setCompanyFinancials(null); // Reset previous data
      setRatios(null);
      setScenarios([]);

      try {
        const financials = await fetchCompanyFinancials(ticker);
        setCompanyFinancials(financials);

        const coreRatios = await fetchCoreRatiosData(ticker);
        setRatios(coreRatios);

        if (financials && financials.epsTTM > 0 && epsGrowth !== "") {
          const calculatedScenarios = calculateScenarios({
            baseEps: financials.epsTTM,
            growthRate: Number(epsGrowth),
          });
          setScenarios(calculatedScenarios);
        } else if (financials && financials.epsTTM <= 0) {
          setError(
            "EPS TTM is zero or negative, cannot calculate scenarios with current EPS growth."
          );
        }
      } catch (err) {
        console.error("Error loading initial financial data:", err);
        setError("Failed to load company data or ratios. Please try again.");
        setCompanyFinancials(null);
        setRatios(null);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [ticker]); // Reacts to ticker changes

  // Calculate scenarios when epsGrowth or companyFinancials (for epsTTM) changes
  useEffect(() => {
    if (
      epsGrowth === "" ||
      !companyFinancials ||
      companyFinancials.epsTTM <= 0
    ) {
      setScenarios([]); // Clear scenarios if no growth rate or invalid base EPS
      if (
        companyFinancials &&
        companyFinancials.epsTTM <= 0 &&
        epsGrowth !== ""
      ) {
        // setError("EPS TTM is zero or negative, cannot calculate scenarios.");
        // This error is better handled when initially loading or if user tries to input growth
      }
      return;
    }

    // Only proceed if not loading initial data, to avoid race conditions or double calcs
    if (!loading && companyFinancials && companyFinancials.epsTTM > 0) {
      // setLoading(true); // You might want a more granular loading for scenarios only
      // setError(null); // Clear previous scenario-specific errors
      try {
        const calculatedScenarios = calculateScenarios({
          baseEps: companyFinancials.epsTTM,
          growthRate: Number(epsGrowth),
        });
        setScenarios(calculatedScenarios);
      } catch (e) {
        console.error("Error calculating scenarios:", e);
        setError("Failed to calculate scenarios.");
      } finally {
        // setLoading(false);
      }
    }
  }, [epsGrowth, companyFinancials, loading]); // React to these changes

  const handleEpsGrowthChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value === "") {
        setEpsGrowth("");
      } else {
        const numValue = parseFloat(value);
        setEpsGrowth(isNaN(numValue) ? "" : numValue);
      }
      // If EPS is 0 or negative, and user enters growth, set an error
      if (companyFinancials && companyFinancials.epsTTM <= 0 && value !== "") {
        setError(
          "Current EPS is not positive; scenarios cannot be calculated with this EPS growth."
        );
      } else if (error && companyFinancials && companyFinancials.epsTTM > 0) {
        setError(null); // Clear error if conditions are met again
      }
    },
    [companyFinancials, error] // Add companyFinancials and error to dependencies
  );

  const isInputDisabled =
    !ticker || loading || !companyFinancials || companyFinancials.epsTTM <= 0;

  return {
    companyName: companyFinancials?.companyName,
    currentPrice: companyFinancials?.currentPrice,
    epsTTM: companyFinancials?.epsTTM,
    epsGrowth,
    handleEpsGrowthChange,
    ratios,
    scenarios,
    loading, // Single loading state for simplicity
    error,
    isInputDisabled,
    hasRequiredData: !!companyFinancials && !!ratios, // Helper to know if basic data is loaded
  };
};
