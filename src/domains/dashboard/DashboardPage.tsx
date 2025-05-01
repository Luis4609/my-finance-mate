import { DataTable } from "@/components/data-table";
import { Account } from "@/shared/models/Account"; // Import from shared models
import React from "react";
import AccountDistributionChart from "./components/AccountDistributionChart";
import TotalBalanceCard from "./components/TotalBalanceCard";

import data from "@/app/dashboard/data.json"; // Adjust the path as necessary

interface DashboardPageProps {
  accounts: Account[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ accounts }) => {
  return (
    <div className="flex flex-col">
      <div className="flex flex-row justify-center items-center gap-4 mb-4">
        <TotalBalanceCard accounts={accounts} />
        <AccountDistributionChart accounts={accounts} />
      </div>
      <DataTable data={data} />
    </div>
  );
};

export default DashboardPage;
