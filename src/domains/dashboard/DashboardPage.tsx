import { Account } from "@/shared/models/Account";
import React from "react";

import DashboardComponent from "./DashboardComponent";

//TODO: receive data from parent component ??

interface DashboardPageProps {
  accounts: Account[];
}

const DashboardPage: React.FC<DashboardPageProps> = () => {
  return (
    <>
      <DashboardComponent
        patrimonio="0 €"
        investmentAccounts="0 €"
        cashAccounts="0 €"
        dayVariation="0 €"
        investedPercentage={100}
        liquidityPercentage={0}
        upcomingEvents={[]}
      />
    </>
  );
};

export default DashboardPage;
