import { useAccounts } from "@/shared/hooks/useAccounts"; // Import the custom hook
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AccountsPage from "./domains/accounts/AccountsPage";
import DashboardPage from "./domains/dashboard/DashboardPage";
import DcfCalculatorPage from "./domains/dcf-calculator/DcfCalculatorPage";
import BudgetPage from "./domains/budgeting/BudgetPage"; // Import BudgetPage
import Layout from "./shared/components/layout";

function App() {
  const { accounts, addAccount, updateAccount, deleteAccount } = useAccounts();

  return (
    <Router>
      <Layout>
        <Routes>
          <Route
            path="/dashboard"
            element={<DashboardPage accounts={accounts} />}
          />
          <Route
            path="/accounts"
            element={
              <AccountsPage
                accounts={accounts}
                onAddAccount={addAccount}
                onUpdateBalance={updateAccount}
                onDeleteAccount={deleteAccount}
              />
            }
          />
          <Route path="/dcf-calculator" element={<DcfCalculatorPage />} />
          <Route path="/budgeting" element={<BudgetPage />} /> {/* Add BudgetPage route */}
          <Route path="/" element={<DashboardPage accounts={accounts} />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
