import { createContext, useContext, useState } from "react";

const AccountContext = createContext(null);

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};

export const AccountProvider = ({ children }) => {
  const [selectedAccount, setSelectedAccount] = useState(null); // null = "All Accounts"
  const [accounts, setAccounts] = useState([]);

  const value = {
    selectedAccount,
    setSelectedAccount,
    accounts,
    setAccounts,
    // Helper to get the selected account ID (null for "All Accounts")
    getSelectedAccountId: () => selectedAccount?.id || null,
  };

  return (
    <AccountContext.Provider value={value}>{children}</AccountContext.Provider>
  );
};
