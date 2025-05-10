import * as React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/shared/utils/currencyUtils'; 

interface ProjectionChartProps {
  projectionData: { year: string; projectedPrice: number }[];
  currentPrice: number | null;
}

const ProjectionChart: React.FC<ProjectionChartProps> = ({ projectionData, currentPrice }) => {
  // Add current price point to the beginning of the data for the chart
  const chartData = currentPrice !== null
    ? [{ year: 'Today', projectedPrice: currentPrice }, ...projectionData]
    : projectionData;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>5-Year Projection</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length > (currentPrice !== null ? 1 : 0) ? ( // Render chart only if there's projection data + optional current price
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              {/* Format Y-axis labels as currency */}
              <YAxis tickFormatter={(value: number) => formatCurrency(value)} />
              {/* Format tooltip values as currency */}
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Line type="monotone" dataKey="projectedPrice" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
           <div className="flex justify-center items-center h-[300px] text-gray-500">
            Enter assumptions to see projection.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectionChart;