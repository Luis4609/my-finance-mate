import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/shared/utils/currencyUtils";

interface DashboardCardProps {
  title: string;
  value: number | null;
  icon?: React.ElementType;
}

/**
 * Reusable card component for displaying key metrics.
 * @param {DashboardCardProps} props - Component props.
 * @param {string} props.title - The title of the card.
 * @param {number} props.value - The main value to display in the card.
 * @param {React.ElementType} [props.icon] - Optional icon component to display in the header.
 */
const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  icon: Icon,
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(value ?? 0)}</div>
      </CardContent>
    </Card>
  );
};

export default DashboardCard;
