import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <TotalBalanceCard accounts={accounts} />
        <AccountDistributionChart accounts={accounts} />
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>Account distribution by type</CardTitle>
          </CardHeader>
          <CardContent>
            {/* TODO: crear  y definir el componente 
            reutilizar el AccountDistribution */}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
