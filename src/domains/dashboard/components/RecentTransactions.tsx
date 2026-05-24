import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/shared/models/Transaction";
import { formatCurrency } from "@/shared/utils/currencyUtils";
import { ArrowRight, History } from "lucide-react";
import { Link } from "react-router-dom";

interface RecentTransactionsProps {
  transactions: Transaction[];
}

const RecentTransactions: React.FC<RecentTransactionsProps> = ({ transactions }) => {
  // Show only the 5 most recent transactions
  const recent = transactions.slice(0, 5);

  return (
    <Card className="flex flex-col w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-muted-foreground" />
          <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
        </div>
        <Link
          to="/transactions"
          className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight className="h-3 w-3" />
        </Link>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-between">
        {recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
            No recent activity.
          </div>
        ) : (
          <div className="divide-y divide-border flex-1 flex flex-col justify-start">
            {recent.map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between text-sm transition-all hover:bg-muted/10 px-2 rounded-sm"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-medium text-white line-clamp-1">
                    {tx.description}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {tx.date} &bull; {tx.category.toLowerCase().replace('_', ' ')}
                  </span>
                </div>
                <span
                  className={`font-semibold ${
                    tx.type === "INCOME"
                      ? "text-emerald-400"
                      : tx.type === "EXPENSE"
                        ? "text-rose-400"
                        : "text-sky-400"
                  }`}
                >
                  {tx.type === "EXPENSE" ? "-" : "+"}
                  {formatCurrency(tx.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentTransactions;
