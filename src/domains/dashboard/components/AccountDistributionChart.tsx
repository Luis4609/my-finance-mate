import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as React from "react";
import {
  Cell,
  Label,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Account } from "@/shared/models/Account";
import { formatCurrency } from "@/shared/utils/currencyUtils";

interface AccountDistributionChartProps {
  accounts: Account[];
}

const AccountDistributionChart: React.FC<AccountDistributionChartProps> = ({
  accounts,
}) => {
  const chartData = accounts
    .filter((account) => account.balance !== 0)
    .map((account) => ({
      name: account.name,
      value: Math.abs(account.balance),
      color: account.color,
    }));

  const totalBalance = React.useMemo(() => {
    return accounts.reduce((sum, account) => sum + account.balance, 0);
  }, [accounts]);

  return (
    <Card className="w-full max-w-md mx-auto flex flex-col">
      <CardHeader className="items-center">
        <CardTitle>Account Distribution</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {formatCurrency(totalBalance)}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          Total
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex justify-center items-center h-[300px] text-gray-500">
            No account data available for the chart.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AccountDistributionChart;
