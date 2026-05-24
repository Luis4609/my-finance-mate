import React from 'react';
import { Account } from '@/shared/models/Account';
import AddAccountForm from './components/AddAccountForm';
import AccountTable from './components/AccountTable';

interface AccountsPageProps {
  accounts: Account[];
  onAddAccount: (account: { name: string; balance: number; typeId: string }) => void;
  onUpdateBalance: (id: string, newBalance: number) => void;
  onDeleteAccount: (id: string) => void;
}

const AccountsPage: React.FC<AccountsPageProps> = ({ accounts, onAddAccount, onUpdateBalance, onDeleteAccount }) => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-white font-sans">Manage Accounts</h1>

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