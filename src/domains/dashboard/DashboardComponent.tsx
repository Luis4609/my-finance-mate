import React from "react";

import { Banknote, DollarSign, TrendingUp } from "lucide-react";
import DashboardCard from "./components/DashboardCard";
import LiquiditySection from "./components/LiquiditySection";
import UpcomingEventsSection from "./components/UpComingEventsSection";
import { UpcomingEvent } from "./models/UpcomingEvent";

interface DashboardProps {
  patrimonio?: number;
  investmentAccounts?: number;
  cashAccounts?: number;
  dayVariation?: number;
  investedPercentage?: number;
  liquidityPercentage?: number;
  upcomingEvents?: UpcomingEvent[];
}

/**
 * DashboardComponent is a React functional component that displays various financial metrics
 * and upcoming events in a dashboard format.
 *
 * @param {number} patrimonio - The total wealth or assets.
 * @param {number} investmentAccounts - The total value of investment accounts.
 * @param {number} cashAccounts - The total value of cash accounts.
 * @param {number} dayVariation - The daily variation in value.
 * @param {number} investedPercentage - The percentage of invested assets.
 * @param {number} liquidityPercentage - The percentage of liquid assets.
 * @param {UpcomingEvent[]} upcomingEvents - An array of upcoming events.
 */
const DashboardComponent: React.FC<DashboardProps> = ({
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Patrimonio"
          value={patrimonio ?? 0}
          icon={DollarSign}
        />
        <DashboardCard
          title="Investment accounts"
          value={investmentAccounts ?? 0}
          icon={TrendingUp}
        />
        <DashboardCard
          title="Cash accounts"
          value={cashAccounts ?? 0}
          icon={Banknote}
        />
      </div>

      {/* Middle section: Day Variation and Liquidity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Day variation" value={dayVariation ?? 0} />
        <LiquiditySection
          investedPercentage={investedPercentage}
          liquidityPercentage={liquidityPercentage}
        />
      </div>

      {/* Bottom section: Próximos eventos */}
      <UpcomingEventsSection events={upcomingEvents} />
    </div>
  );
};

export default DashboardComponent;
