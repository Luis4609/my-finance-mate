import { DataTable } from "@/components/data-table";
import { Account } from "@/shared/models/Account";
import React from "react";
import AccountDistributionChart from "./components/AccountDistributionChart";
import TotalBalanceCard from "./components/TotalBalanceCard";

import data from "@/app/dashboard/data.json";
import { SectionCards } from "@/components/section-cards";

interface DashboardPageProps {
  accounts: Account[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ accounts }) => {
  return (
    <>
      <div className="flex flex-row justify-center items-center gap-4 mb-4">
        <TotalBalanceCard accounts={accounts} />
        <AccountDistributionChart accounts={accounts} />
      </div>
      <SectionCards></SectionCards>
      <DataTable
        data={data
          .filter((item) => item.ticker !== undefined)
          .map((item) => ({
            ...item,
            status: (["Buy", "Hold", "Sell"].includes(item.status)
              ? item.status
              : "Hold") as "Buy" | "Hold" | "Sell",
          }))}
      />
    </>
  );
};

export default DashboardPage;
