import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/shared/utils/currencyUtils";
import React, { useMemo, useState } from "react";
import AssumptionsForm from "./components/AssumptionsForm";
import CalculationResults from "./components/CalculationResults";
import CompanySearch from "./components/CompanySearch";
import ProjectionChart from "./components/ProjectionChart";
import { CompanyFinancials } from "./models/CompanyFinancials";
import { fetchCompanyFinancials } from "./services/financialApi"; // Import the simulated API call

const DcfCalculatorPage: React.FC = () => {
  const [companyFinancials, setCompanyFinancials] =
    useState<CompanyFinancials | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // User Inputs
  const [epsGrowthRate, setEpsGrowthRate] = useState(9); // Default from example
  const [appropriateEpsMultiple, setAppropriateEpsMultiple] = useState(20); // Default from example
  const [desiredReturn, setDesiredReturn] = useState(15); // Default from example

  // Handle Company Search
  const handleSearch = async (ticker: string) => {
    setLoading(true);
    setError(null);
    setCompanyFinancials(null); // Clear previous data
    try {
      const data = await fetchCompanyFinancials(ticker);
      if (data) {
        setCompanyFinancials(data);
      } else {
        setError(
          `Could not fetch data for ticker: ${ticker}. Please check the ticker symbol.`
        );
      }
    } catch (err) {
      console.error("API Error:", err);
      setError("An error occurred while fetching financial data.");
    } finally {
      setLoading(false);
    }
  };

  // DCF Calculation Logic
  const { returnFromTodaysPrice, entryPriceForDesiredReturn, projectionData } =
    useMemo(() => {
      if (!companyFinancials) {
        return {
          returnFromTodaysPrice: null,
          entryPriceForDesiredReturn: null,
          projectionData: [],
        };
      }

      const currentEPS = companyFinancials.epsTTM;
      const currentPrice = companyFinancials.currentPrice;
      const growthRate = epsGrowthRate / 100;
      const targetMultiple = appropriateEpsMultiple;
      const requiredReturn = desiredReturn / 100;
      const projectionYears = 5; // Based on the example image

      const projection: { year: string; projectedPrice: number }[] = [];
      let projectedPriceYear5 = 0;

      for (let i = 1; i <= projectionYears; i++) {
        const projectedEPS = currentEPS * Math.pow(1 + growthRate, i);
        const projectedPrice = projectedEPS * targetMultiple;
        projection.push({ year: `Year ${i}`, projectedPrice });
        if (i === projectionYears) {
          projectedPriceYear5 = projectedPrice;
        }
      }

      // Calculate Entry Price for Desired Return
      const entryPrice =
        projectedPriceYear5 / Math.pow(1 + requiredReturn, projectionYears);

      // Calculate Annualized Return from Today's Price
      // Avoid division by zero or negative prices
      const annualizedReturn =
        currentPrice > 0 && projectedPriceYear5 > 0
          ? (Math.pow(projectedPriceYear5 / currentPrice, 1 / projectionYears) -
              1) *
            100
          : null;

      return {
        returnFromTodaysPrice: annualizedReturn,
        entryPriceForDesiredReturn: entryPrice,
        projectionData: projection,
      };
    }, [
      companyFinancials,
      epsGrowthRate,
      appropriateEpsMultiple,
      desiredReturn,
    ]); // Recalculate when these dependencies change

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        DCF Calculator
      </h1>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Company Search and Financials */}
        <div className="lg:col-span-2">
          {" "}
          {/* Span across two columns on large screens */}
          <CompanySearch onSearch={handleSearch} loading={loading} />
          {companyFinancials && (
            <Card className="w-full mt-4">
              <CardHeader>
                <CardTitle>
                  {companyFinancials.companyName} ({companyFinancials.ticker})
                </CardTitle>
                <p className="text-xl font-bold text-gray-800">
                  {formatCurrency(companyFinancials.currentPrice)}
                </p>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">EPS (TTM):</p>
                  <p className="text-lg font-semibold">
                    {companyFinancials.epsTTM.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">PE (TTM):</p>
                  <p className="text-lg font-semibold">
                    {companyFinancials.peRatioTTM.toFixed(2)}
                  </p>
                </div>
                {/* Add other financial data here */}
              </CardContent>
            </Card>
          )}
          {error && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}
        </div>

        {/* Assumptions Form */}
        <AssumptionsForm
          epsGrowthRate={epsGrowthRate}
          onEpsGrowthRateChange={setEpsGrowthRate}
          appropriateEpsMultiple={appropriateEpsMultiple}
          onAppropriateEpsMultipleChange={setAppropriateEpsMultiple}
          desiredReturn={desiredReturn}
          onDesiredReturnChange={setDesiredReturn}
        />

        {/* Calculation Results */}
        <CalculationResults
          returnFromTodaysPrice={returnFromTodaysPrice}
          entryPriceForDesiredReturn={entryPriceForDesiredReturn}
        />

        {/* Projection Chart */}
        <div className="lg:col-span-2">
          {" "}
          {/* Span across two columns on large screens */}
          <ProjectionChart
            projectionData={projectionData}
            currentPrice={companyFinancials?.currentPrice ?? null}
          />
        </div>
      </div>
    </div>
  );
};

export default DcfCalculatorPage;
