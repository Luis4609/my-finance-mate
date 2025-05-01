import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle
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
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
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
    </div>
  );
};

export default TotalBalanceCard;
