import { useAccounts } from "@/shared/hooks/useAccounts";
import { useTransactions } from "@/shared/hooks/useTransactions";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AccountsPage from "./domains/accounts/AccountsPage";
import DashboardPage from "./domains/dashboard/DashboardPage";
import TransactionsPage from "./domains/transactions/TransactionsPage";
import DcfCalculatorPage from "./domains/dcf-calculator/DcfCalculatorPage";
import Layout from "./shared/components/layout";

function App() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();
  const { transactions, addTransaction, deleteTransaction } = useTransactions({
    accounts,
    updateAccount,
  });

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/dashboard"
            element={<DashboardPage accounts={accounts} transactions={transactions} />}
          />
          <Route
            path="/accounts"
            element={
              <AccountsPage
                accounts={accounts}
                onAddAccount={addAccount}
                onUpdateBalance={(id, newBalance) => updateAccount(id, { balance: newBalance })}
                onDeleteAccount={deleteAccount}
              />
            }
          />
          <Route
            path="/transactions"
            element={
              <TransactionsPage
                accounts={accounts}
                transactions={transactions}
                onAddTransaction={addTransaction}
                onDeleteTransaction={deleteTransaction}
              />
            }
          />
          <Route path="/dcf-calculator" element={<DcfCalculatorPage />} />
          <Route path="/" element={<DashboardPage accounts={accounts} transactions={transactions} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
