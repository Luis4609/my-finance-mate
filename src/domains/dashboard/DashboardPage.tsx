import { Account } from "@/shared/models/Account"; // Import from shared models
import React from "react";
import AccountDistributionChart from "./components/AccountDistributionChart";
import TotalBalanceCard from "./components/TotalBalanceCard";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";

import data from "@/app/dashboard/data.json"; // Adjust the path as necessary
interface DashboardPageProps {
  accounts: Account[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ accounts }) => {
  return (
    <>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <TotalBalanceCard accounts={accounts} />
        <AccountDistributionChart accounts={accounts} />
        <SectionCards />
        <div className="px-4 lg:px-6">
          <ChartAreaInteractive />
        </div>
        <DataTable data={data} />
      </div>
    </>
  );
};

export default DashboardPage;
