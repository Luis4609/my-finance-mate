import { useAccounts } from "@/shared/hooks/useAccounts"; // Import the custom hook
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AccountsPage from "./domains/accounts/AccountsPage";
import DashboardPage from "./domains/dashboard/DashboardPage";
import DcfCalculatorPage from "./domains/dcf-calculator/DcfCalculatorPage";

function App() {
  // Use the custom hook to manage accounts state and logic
  const { accounts, addAccount, updateAccountBalance, deleteAccount } =
    useAccounts();

  return (
    <Router>
      <div className="App">
        <nav className="bg-gray-800 p-4">
          <ul className="flex space-x-4">
            <li>
              <Link to="/dashboard" className="text-white hover:text-gray-300">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/accounts" className="text-white hover:text-gray-300">
                Accounts
              </Link>
            </li>
            <li>
              <Link to="/dcf-calculator" className="text-white hover:text-gray-300">DCF Calculator</Link> {/* Add link */}
            </li>
          </ul>
        </nav>

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
                onUpdateBalance={updateAccountBalance}
                onDeleteAccount={deleteAccount}
              />
            }
          />
          <Route path="/dcf-calculator" element={<DcfCalculatorPage />} />
          <Route path="/" element={<DashboardPage accounts={accounts} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
