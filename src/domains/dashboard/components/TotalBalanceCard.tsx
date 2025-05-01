import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Account } from "@/shared/models/Account";
import { formatCurrency } from "@/shared/utils/currencyUtils";
import { IconTrendingUp } from "@tabler/icons-react";

interface TotalBalanceCardProps {
  accounts: Account[];
}

const TotalBalanceCard: React.FC<TotalBalanceCardProps> = ({ accounts }) => {
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.balance,
    0
  );

  return (
    <Card className="flex flex-col w-full max-w-sm">
      <CardHeader>
        <CardDescription>Total Balance</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {formatCurrency(totalBalance)}
        </CardTitle>
        <CardAction>
          <Badge variant="outline">
            <IconTrendingUp />
            +12.5%
          </Badge>
        </CardAction>
      </CardHeader>
    </Card>
  );
};

export default TotalBalanceCard;
