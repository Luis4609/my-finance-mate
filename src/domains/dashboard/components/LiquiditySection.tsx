import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Info } from "lucide-react";

interface LiquiditySectionProps {
  investedPercentage: number;
  liquidityPercentage: number;
}

const LiquiditySection: React.FC<LiquiditySectionProps> = ({
  investedPercentage,
  liquidityPercentage,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center">
          Liquidity
          {/* Optional: Add an info icon */}
          <Info className="h-4 w-4 ml-1 text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Progress value={investedPercentage} className="w-full h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Invested {investedPercentage.toFixed(2)}%</span>
            <span>Liquidity {liquidityPercentage.toFixed(2)}%</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiquiditySection;
