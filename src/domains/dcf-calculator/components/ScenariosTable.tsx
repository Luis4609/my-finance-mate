// src/components/financial/ScenariosTable.tsx
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ScenarioResult } from "@/shared/models/Financial";

interface ScenariosTableProps {
  scenarios: ScenarioResult[];
}

const ScenariosTable: React.FC<ScenariosTableProps> = ({ scenarios }) => {
  if (!scenarios || scenarios.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white">EPS Scenarios</h3>
      <div className="overflow-x-auto">
        <Table className="min-w-full rounded-md overflow-hidden">
          <TableHeader>
            <TableRow className="">
              <TableHead>Year</TableHead>
              <TableHead>EPS</TableHead>
              <TableHead>Scenario (PER 20)</TableHead>
              <TableHead>Scenario (PER 22.5)</TableHead>
              <TableHead>Scenario (PER 25)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scenarios.map((scenario) => (
              <TableRow key={scenario.year} className="border-b">
                <TableCell className="font-medium">{scenario.year}</TableCell>
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
  );
};

export default React.memo(ScenariosTable);
