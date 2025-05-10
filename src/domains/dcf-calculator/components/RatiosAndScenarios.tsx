// src/components/financial/RatiosAndScenarios.tsx
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { RatiosAndScenariosProps } from "@/shared/models/Financial"; // Props type from shared location
import { useFinancialCalculations } from "@/shared/hooks/useFinancialCalculations";
import EpsGrowthInput from "./EpsGrowthInput";
import RatiosDisplay from "./RatiosDisplay";
import ScenariosTable from "./ScenariosTable";
import { Loader2 } from "lucide-react"; // Import Loader

const RatiosAndScenarios: React.FC<RatiosAndScenariosProps> = ({
  ticker, // Now receives ticker
}) => {
  const {
    companyName,
    // currentPrice, // Available if you want to display it
    epsTTM, // Available if you want to display it
    epsGrowth,
    handleEpsGrowthChange,
    ratios,
    scenarios,
    loading,
    error,
    isInputDisabled,
    hasRequiredData,
  } = useFinancialCalculations({ ticker });

  console.log("RatiosAndScenarios - ticker:", ticker);
  console.log("RatiosAndScenarios - loading:", ratios);

  if (!ticker) {
    return (
      <Card className="rounded-lg shadow-md p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Ratios y Escenarios
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-400 text-center">
            Please select a ticker to view financial data.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Display a main loader when initial data is being fetched for the ticker
  if (loading && !companyName && !ratios) {
    // More specific condition for initial load
    return (
      <Card className="rounded-lg shadow-md p-6 flex flex-col items-center justify-center min-h-[300px]">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <p className="mt-4 text-white">
          Loading financial data for {ticker.toUpperCase()}...
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-lg shadow-md p-6">
      <CardHeader className="mb-4">
        {" "}
        {/* Adjusted margin */}
        <CardTitle className="text-xl font-bold text-white">
          {companyName
            ? `${companyName} (${ticker.toUpperCase()})`
            : `Ratios y Escenarios para ${ticker.toUpperCase()}`}
        </CardTitle>
        {epsTTM !== undefined && epsTTM !== null && (
          <p className="text-sm text-gray-300">
            Current EPS (TTM): ${epsTTM.toFixed(2)}
          </p>
        )}
      </CardHeader>
      <CardContent className="flex flex-col space-y-6">
        <EpsGrowthInput
          value={epsGrowth}
          onChange={handleEpsGrowthChange}
          // Pass loading from the hook if you want the input's internal loader to spin
          // The main loading is handled above, this `loading` prop on EpsGrowthInput is for its own spinner
          loading={loading && epsGrowth !== ""}
          disabled={isInputDisabled}
        />

        {error && (
          <p className="text-red-500 text-sm text-center py-2">{error}</p>
        )}

        {/* Ratios Display */}
        {ratios && <RatiosDisplay ratios={ratios} />}

        {/* Scenarios Table */}
        {scenarios.length > 0 && <ScenariosTable scenarios={scenarios} />}

        {/* Informational messages */}
        {!loading &&
          !error &&
          ticker &&
          hasRequiredData &&
          epsGrowth === "" &&
          scenarios.length === 0 &&
          (epsTTM ?? 0) > 0 && (
            <p className="text-gray-400 text-sm text-center">
              Enter EPS Growth (%) to calculate future scenarios.
            </p>
          )}
        {!loading && !error && ticker && epsTTM <= 0 && (
          <p className="text-yellow-500 text-sm text-center">
            Current EPS (TTM) is ${epsTTM?.toFixed(2)}. Scenarios cannot be
            calculated with non-positive EPS.
          </p>
        )}
        {!loading && !error && ticker && !hasRequiredData && (
          <p className="text-gray-400 text-sm text-center">
            Data might be partially loaded or unavailable for{" "}
            {ticker.toUpperCase()}.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default RatiosAndScenarios;
