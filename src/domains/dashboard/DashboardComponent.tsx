import React from "react";

import { Banknote, DollarSign, TrendingUp } from "lucide-react";
import DashboardCard from "./components/DashboardCard";
import LiquiditySection from "./components/LiquiditySection";
import UpcomingEventsSection from "./components/UpComingEventsSection";
import { UpcomingEvent } from "./models/UpcomingEvent";

interface DashboardProps {
  patrimonio?: string;
  investmentAccounts?: string;
  cashAccounts?: string;
  dayVariation?: string;
  investedPercentage?: number;
  liquidityPercentage?: number;
  upcomingEvents?: UpcomingEvent[];
}

//TODO: receive data from parent component

/**
 * DashboardComponent is a React functional component that displays various financial metrics
 * and upcoming events in a dashboard format.
 *
 * @param {string} patrimonio - The total wealth or assets.
 * @param {string} investmentAccounts - The total value of investment accounts.
 * @param {string} cashAccounts - The total value of cash accounts.
 * @param {string} dayVariation - The daily variation in value.
 * @param {number} investedPercentage - The percentage of invested assets.
 * @param {number} liquidityPercentage - The percentage of liquid assets.
 * @param {UpcomingEvent[]} upcomingEvents - An array of upcoming events.
 */
const DashboardComponent: React.FC<DashboardProps> = ({
  patrimonio = "0 €",
  investmentAccounts = "0 €",
  cashAccounts = "0 €",
  dayVariation = "0 €",
  investedPercentage = 100,
  liquidityPercentage = 0,
  upcomingEvents = [],
}) => {
  return (
    <div className="p-6 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard
          title="Patrimonio"
          value={patrimonio}
          icon={DollarSign}
        />
        <DashboardCard
          title="Investment accounts"
          value={investmentAccounts}
          icon={TrendingUp}
        />
        <DashboardCard
          title="Cash accounts"
          value={cashAccounts}
          icon={Banknote}
        />
      </div>

      {/* Middle section: Day Variation and Liquidity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Day variation" value={dayVariation} />
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
