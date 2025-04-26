import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Account } from "@/shared/models/Account";
import { formatCurrency } from "@/shared/utils/currencyUtils"; // Import the currency formatting utility

interface TotalBalanceCardProps {
  accounts: Account[];
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({ accounts }) => {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Total Balance</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Format total balance using the utility function */}
        <p className="text-3xl font-bold text-blue-600">
          {formatCurrency(totalBalance)}
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalBalanceCard;
