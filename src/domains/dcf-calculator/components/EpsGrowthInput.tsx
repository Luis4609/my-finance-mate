// src/components/financial/EpsGrowthInput.tsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";

interface EpsGrowthInputProps {
  value: number | "";
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  loading: boolean;
}

const EpsGrowthInput: React.FC<EpsGrowthInputProps> = ({
  value,
  onChange,
  disabled,
  loading,
}) => {
  return (
    <div className="flex flex-row sm:flex-row gap-4 items-center justify-evenly">
      <Label htmlFor="scenario-eps-growth" className="">
        EPS Growth (%)
      </Label>
      <Input
        id="scenario-eps-growth"
        type="number"
        value={value}
        onChange={onChange}
        placeholder="e.g. 5"
        disabled={disabled}
        className="text-white disabled:opacity-50 disabled:cursor-not-allowed flex-3"
      />
      {loading && <Loader2 className="animate-spin ml-2" />}
    </div>
  );
};

export default React.memo(EpsGrowthInput); // Memoize if props are stable