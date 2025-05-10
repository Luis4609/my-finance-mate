// src/utils/scenarioCalculator.ts
import type { ScenarioResult } from "@/shared/models/Financial";
import { PER_MULTIPLES, SCENARIO_YEARS } from "@/shared/models/Financial";

interface CalculateScenariosParams {
  baseEps: number;
  growthRate: number;
  years?: number; // Optional: defaults to SCENARIO_YEARS
  perMultiples?: readonly number[]; // Optional: defaults to PER_MULTIPLES
}

/**
 * Calculates future EPS scenarios based on a base EPS and growth rate.
 * @param params - The parameters for calculation.
 * @returns An array of ScenarioResult.
 */
export const calculateScenarios = ({
  baseEps,
  growthRate,
  years = SCENARIO_YEARS,
  perMultiples = PER_MULTIPLES,
}: CalculateScenariosParams): ScenarioResult[] => {
  if (baseEps <= 0 || growthRate < -100) { // Added some basic validation
    return [];
  }

  const calculatedScenarios: ScenarioResult[] = [];
  const growthFactor = 1 + growthRate / 100;

  for (let i = 1; i <= years; i++) {
    const futureEps = baseEps * Math.pow(growthFactor, i);
    calculatedScenarios.push({
      year: i,
      eps: parseFloat(futureEps.toFixed(2)),
      scenario_per_20: parseFloat((futureEps * perMultiples[0]).toFixed(2)),
      scenario_per_22_5: parseFloat(
        (futureEps * perMultiples[1]).toFixed(2)
      ),
      scenario_per_25: parseFloat((futureEps * perMultiples[2]).toFixed(2)),
    });
  }
  return calculatedScenarios;
};