import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

// Define interfaces for data structures
interface RatiosData {
  ev_ebitda: number | string | null;
  per: number | string | null;
  ev_fcf: number | string | null;
  ev_ebit: number | string | null;
}

interface ScenarioResult {
  year: number;
  eps: number;
  scenario_per_20: number;
  scenario_per_22_5: number;
  scenario_per_25: number;
}

interface RatiosAndScenariosProps {
  currentEps: number | null; // Need current EPS to calculate scenarios
}

/**
 * Component to display stock ratios and EPS scenarios table with dark theme styles.
 * @param {RatiosAndScenariosProps} props - Component props.
 * @param {number | null} props.currentEps - The current EPS to base scenarios on.
 */
const RatiosAndScenarios: React.FC<RatiosAndScenariosProps> = ({
  currentEps,
}) => {
  const [epsGrowth, setEpsGrowth] = useState<number | "">("");
  const [ratios, setRatios] = useState<RatiosData | null>(null);
  const [scenarios, setScenarios] = useState<ScenarioResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Placeholder for fetching data - replace with actual API call
  const fetchRatiosAndScenarios = async (
    growthRate: number,
    baseEps: number
  ) => {
    setLoading(true);
    setError(null);
    setRatios(null);
    setScenarios([]);

    try {
      // In a real application, you would fetch this data from an API
      console.log(
        `Calculating scenarios with EPS Growth: ${growthRate}% and Base EPS: ${baseEps}`
      );

      const fetchedRatios: RatiosData = {
        ev_ebitda: 26.52,
        per: 37.29,
        ev_fcf: 32.83,
        ev_ebit: "NaN",
      };
      setRatios(fetchedRatios);

      // Simulate calculating scenarios
      const calculatedScenarios: ScenarioResult[] = [];
      const perMultiples = [20, 22.5, 25];
      const growthFactor = 1 + growthRate / 100;

      for (let i = 1; i <= 5; i++) {
        const futureEps = baseEps * Math.pow(growthFactor, i);
        calculatedScenarios.push({
          year: i,
          eps: parseFloat(futureEps.toFixed(2)), // Round EPS for display
          scenario_per_20: parseFloat((futureEps * perMultiples[0]).toFixed(2)),
          scenario_per_22_5: parseFloat(
            (futureEps * perMultiples[1]).toFixed(2)
          ),
          scenario_per_25: parseFloat((futureEps * perMultiples[2]).toFixed(2)),
        });
      }
      setScenarios(calculatedScenarios);
    } catch (err) {
      console.error("Error fetching ratios or calculating scenarios:", err);
      setError(
        "Failed to fetch data or calculate scenarios. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetData = () => {
    if (epsGrowth !== "" && currentEps !== null) {
      fetchRatiosAndScenarios(Number(epsGrowth), currentEps);
    } else if (currentEps === null) {
      setError("Please search for a company first to get the base EPS.");
    } else {
      setError("Please enter EPS Growth.");
    }
  };

  return (
    <Card className="rounded-lg shadow-md p-6">
      <CardHeader className="mb-6">
        <CardTitle className="text-xl font-bold text-white">
          Ratios y Escenarios
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <div className="flex flex-row sm:flex-row gap-4 items-center justify-evenly">
          <Label htmlFor="scenario-eps-growth" className="">
            EPS Growth (%)
          </Label>
          <Input
            id="scenario-eps-growth"
            type="number"
            value={epsGrowth}
            onChange={(e) =>
              setEpsGrowth(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="5"
            disabled={currentEps === null || loading}
            className="text-white  disabled:opacity-50 disabled:cursor-not-allowed flex-3"
          />
          <Button
            onClick={handleGetData}
            disabled={loading || epsGrowth === "" || currentEps === null}
            className="flex-1"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Obtener Datos"}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Ratios Section : TODO mejorar */}
        {ratios && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Ratios</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <span className="font-medium">EV/EBITDA:</span>{" "}
                {ratios.ev_ebitda !== null ? ratios.ev_ebitda : "N/A"}
              </div>
              <div>
                <span className="font-medium">PER:</span>{" "}
                {ratios.per !== null ? ratios.per : "N/A"}
              </div>
              <div>
                <span className="font-medium">EV/FCF:</span>{" "}
                {ratios.ev_fcf !== null ? ratios.ev_fcf : "N/A"}
              </div>
              <div>
                <span className="font-medium">EV/EBIT:</span>{" "}
                {ratios.ev_ebit !== null ? ratios.ev_ebit : "N/A"}
              </div>
            </div>
          </div>
        )}

        {scenarios.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">
              Escenarios de EPS
            </h3>
            <div className="overflow-x-auto">
              <Table className="min-w-full rounded-md overflow-hidden">
                <TableHeader>
                  <TableRow className="">
                    <TableHead>Año</TableHead>
                    <TableHead>EPS</TableHead>
                    <TableHead>Escenario (PER 20)</TableHead>
                    <TableHead>Escenario (PER 22.5)</TableHead>
                    <TableHead>Escenario (PER 25)</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scenarios.map((scenario) => (
                    <TableRow key={scenario.year} className="border-b ">
                      <TableCell className="font-medium ">
                        {scenario.year}
                      </TableCell>
                      <TableCell>{scenario.eps}</TableCell>
                      <TableCell>{scenario.scenario_per_20}</TableCell>
                      <TableCell>{scenario.scenario_per_22_5}</TableCell>
                      <TableCell>{scenario.scenario_per_25}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RatiosAndScenarios;
