import React from 'react';
import { Account } from '@/shared/models/Account'; // Import from shared models
import AddAccountForm from './components/AddAccountForm';
import AccountTable from './components/AccountTable';

interface AccountsPageProps {
  accounts: Account[];
  onAddAccount: (account: Omit<Account, 'id' | 'lastUpdated' | 'color'>) => void;
  onUpdateBalance: (id: string, newBalance: number) => void;
  onDeleteAccount: (id: string) => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({ accounts, onAddAccount, onUpdateBalance, onDeleteAccount }) => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Manage Accounts</h1>

      <div className="flex flex-col items-center justify-center space-y-6">
        <AddAccountForm onAddAccount={onAddAccount} />
        <AccountTable
          accounts={accounts}
          onUpdateBalance={onUpdateBalance}
          onDeleteAccount={onDeleteAccount}
        />
      </div>
    </div>
  );
};

export default AccountsPage;