import React from "react";
import { Banknote, DollarSign, TrendingUp } from "lucide-react";
import DashboardCard from "./components/DashboardCard";
import LiquiditySection from "./components/LiquiditySection";
import AccountDistributionChart from "./components/AccountDistributionChart";
import RecentTransactions from "./components/RecentTransactions";
import UpcomingEventsSection from "./components/UpComingEventsSection";
import { UpcomingEvent } from "./models/UpcomingEvent";
import { Account } from "@/shared/models/Account";
import { Transaction } from "@/shared/models/Transaction";

interface DashboardProps {
  accounts: Account[];
  transactions: Transaction[];
  patrimonio?: number;
  investmentAccounts?: number;
  cashAccounts?: number;
  dayVariation?: number;
  investedPercentage?: number;
  liquidityPercentage?: number;
  upcomingEvents?: UpcomingEvent[];
}

/**
 * DashboardComponent displays various financial metrics, account distribution,
 * recent transaction activity, and upcoming events.
 */
const DashboardComponent: React.FC<DashboardProps> = ({
  accounts,
  transactions,
  patrimonio,
  investmentAccounts,
  cashAccounts,
  dayVariation,
  investedPercentage = 100,
  liquidityPercentage = 0,
  upcomingEvents = [],
}) => {
  return (
    <div className="p-6 min-h-screen flex flex-col gap-6">
      {/* Top metrics card row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Patrimonio"
          value={patrimonio ?? 0}
          icon={DollarSign}
        />
        <DashboardCard
          title="Investment Accounts"
          value={investmentAccounts ?? 0}
          icon={TrendingUp}
        />
        <DashboardCard
          title="Cash Accounts"
          value={cashAccounts ?? 0}
          icon={Banknote}
        />
      </div>

      {/* Middle section: Day Variation, Liquidity, and Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <DashboardCard title="Day Variation" value={dayVariation ?? 0} />
        <LiquiditySection
          investedPercentage={investedPercentage}
          liquidityPercentage={liquidityPercentage}
        />
        <AccountDistributionChart accounts={accounts} />
      </div>

      {/* Bottom section: Recent Transactions and Upcoming Events */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        <div className="md:col-span-2">
          <RecentTransactions transactions={transactions} />
        </div>
        <div className="md:col-span-1">
          <UpcomingEventsSection events={upcomingEvents} />
        </div>
      </div>
    </div>
  );
};

export default DashboardComponent;
