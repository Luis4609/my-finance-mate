import React from "react";
import { Banknote, DollarSign, TrendingUp } from "lucide-react";
import DashboardCard from "./components/DashboardCard";
import LiquiditySection from "./components/LiquiditySection";
import AccountDistributionChart from "./components/AccountDistributionChart";
import UpcomingEventsSection from "./components/UpComingEventsSection";
import { UpcomingEvent } from "./models/UpcomingEvent";
import { Account } from "@/shared/models/Account";

interface DashboardProps {
  accounts: Account[];
  patrimonio?: number;
  investmentAccounts?: number;
  cashAccounts?: number;
  dayVariation?: number;
  investedPercentage?: number;
  liquidityPercentage?: number;
  upcomingEvents?: UpcomingEvent[];
}

/**
 * DashboardComponent displays various financial metrics, account distribution, and upcoming events.
 */
const DashboardComponent: React.FC<DashboardProps> = ({
  accounts,
  patrimonio,
  investmentAccounts,
  cashAccounts,
  dayVariation,
  investedPercentage = 100,
  liquidityPercentage = 0,
  upcomingEvents = [],
}) => {
  return (
    <div className="p-6 min-h-screen">
      {/* Top metrics card row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 items-stretch">
        <DashboardCard title="Day Variation" value={dayVariation ?? 0} />
        <LiquiditySection
          investedPercentage={investedPercentage}
          liquidityPercentage={liquidityPercentage}
        />
        <AccountDistributionChart accounts={accounts} />
      </div>

      {/* Bottom section: Próximos eventos */}
      <UpcomingEventsSection events={upcomingEvents} />
    </div>
  );
};

export default DashboardComponent;
