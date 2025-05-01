import { Account } from "@/shared/models/Account"; // Import from shared models
import React from "react";
import AccountDistributionChart from "./components/AccountDistributionChart";
import TotalBalanceCard from "./components/TotalBalanceCard";
interface DashboardPageProps {
  accounts: Account[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ accounts }) => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">
        Financial Dashboard
      </h1>

      <div className="flex flex-row items-center space-y-6">
        <TotalBalanceCard accounts={accounts} />
        <AccountDistributionChart accounts={accounts} />
      </div>
    </div>
  );
};

export default DashboardPage;
