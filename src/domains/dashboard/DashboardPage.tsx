import { Account } from "@/shared/models/Account";
import React from "react";

import DashboardComponent from "./DashboardComponent";

interface DashboardPageProps {
  accounts: Account[];
}

const DashboardPage: React.FC<DashboardPageProps> = ({ accounts }) => {
  // Calcular los valores necesarios a partir de las cuentas
  const patrimonio = accounts.reduce((total, account) => total + account.balance, 0);

  const investmentAccounts = accounts
    .filter((account) => account.type.name === "INVESTMENT")
    .reduce((total, account) => total + account.balance, 0);

  const cashAccounts = accounts
    .filter((account) => account.type.name === "CASH")
    .reduce((total, account) => total + account.balance, 0);

  const dayVariation = 0; // Puedes calcular esto si tienes los datos necesarios

  const investedPercentage =
    accounts.length > 0 ? (investmentAccounts / patrimonio) * 100 : 0;

  const liquidityPercentage = 100 - investedPercentage;

  return (
    <>
      <DashboardComponent
        patrimonio={patrimonio}
        investmentAccounts={investmentAccounts}
        cashAccounts={cashAccounts}
        dayVariation={dayVariation}
        investedPercentage={investedPercentage}
        liquidityPercentage={liquidityPercentage}
        upcomingEvents={[]} // Puedes reemplazar esto con eventos reales si los tienes
      />
    </>
  );
};

export default DashboardPage;
