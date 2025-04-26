import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface AssumptionsFormProps {
  epsGrowthRate: number;
  onEpsGrowthRateChange: (value: number) => void;
  appropriateEpsMultiple: number;
  onAppropriateEpsMultipleChange: (value: number) => void;
  desiredReturn: number;
  onDesiredReturnChange: (value: number) => void;
}

const AssumptionsForm: React.FC<AssumptionsFormProps> = ({
  epsGrowthRate,
  onEpsGrowthRateChange,
  appropriateEpsMultiple,
  onAppropriateEpsMultipleChange,
  desiredReturn,
  onDesiredReturnChange,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Assumptions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="epsGrowthRate">EPS Growth Rate (%)</Label>
          <Input
            id="epsGrowthRate"
            type="number"
            value={epsGrowthRate}
            onChange={(e) =>
              onEpsGrowthRateChange(parseFloat(e.target.value) || 0)
            }
            step="0.1"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="appropriateEpsMultiple">
            Appropriate EPS Multiple
          </Label>
          <Input
            id="appropriateEpsMultiple"
            type="number"
            value={appropriateEpsMultiple}
            onChange={(e) =>
              onAppropriateEpsMultipleChange(parseFloat(e.target.value) || 0)
            }
            step="0.1"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="desiredReturn">Desired Return (%)</Label>
          <Input
            id="desiredReturn"
            type="number"
            value={desiredReturn}
            onChange={(e) =>
              onDesiredReturnChange(parseFloat(e.target.value) || 0)
            }
            step="0.1"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AssumptionsForm;
