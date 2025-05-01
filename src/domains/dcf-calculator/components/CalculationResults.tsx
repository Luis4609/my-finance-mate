import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/shared/utils/currencyUtils'; // Import currency formatter

interface CalculationResultsProps {
  returnFromTodaysPrice: number | null;
  entryPriceForDesiredReturn: number | null;
}

const CalculationResults: React.FC<CalculationResultsProps> = ({
  returnFromTodaysPrice,
  entryPriceForDesiredReturn,
}) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Calculation Results</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-4">
        <div>
          <p className="text-sm text-gray-600">Return from today's price (Annualized):</p>
          <p className="text-xl font-bold">
            {returnFromTodaysPrice !== null ? `${returnFromTodaysPrice.toFixed(2)} %` : '-'}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Entry Price for Desired Return:</p>
          <p className="text-xl font-bold text-green-600">
             {entryPriceForDesiredReturn !== null ? formatCurrency(entryPriceForDesiredReturn) : '-'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalculationResults;