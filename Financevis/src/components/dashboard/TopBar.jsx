import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaUser,
  FaSignOutAlt,
  FaChartLine,
  FaHome,
  FaDollarSign,
  FaWallet,
  FaUniversity,
  FaCreditCard,
  FaPiggyBank,
} from "react-icons/fa";
import { useUser } from "../../context/UserContext.jsx";
import { useAccount } from "../../context/AccountContext.jsx";
import { AccountApi } from "../../api/accountApi.js";
import ProfileModal from "../ProfileModal.jsx";

const TopBar = ({ balance }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [loadingAccounts, setLoadingAccounts] = useState(true);

  // Use AccountContext for shared state
  const { selectedAccount, setSelectedAccount, accounts, setAccounts } =
    useAccount();
  const dropdownRef = useRef(null);

  // Helper function to get tab index from path
  const getTabIndexFromPath = useCallback((path) => {
    if (path === "/dashboard") return 0;
    if (path === "/" || path === "/home") return 1;
    if (path === "/pricing") return 2;
    return 0; // default to dashboard
  }, []);

  const [activeTabIndex, setActiveTabIndex] = useState(() =>
    getTabIndexFromPath(location.pathname)
  );

  const { user } = useUser();

  const DEFAULT_AVATAR =
    "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
  const USER_PFP = user?.profilePicture;

  // Fetch accounts on mount
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        setLoadingAccounts(true);
        const response = await AccountApi.getAccounts();
        console.log("Accounts fetched:", response);
        setAccounts(response.accounts || []);
      } catch (error) {
        console.error("Error fetching accounts:", error);
        setAccounts([]);
      } finally {
        setLoadingAccounts(false);
      }
    };

    if (user?.id && accounts.length === 0) {
      fetchAccounts();
    } else if (accounts.length > 0) {
      setLoadingAccounts(false);
    }
  }, [user?.id, accounts.length, setAccounts]);

  // Update active tab when route changes
  useEffect(() => {
    setActiveTabIndex(getTabIndexFromPath(location.pathname));
  }, [location.pathname, getTabIndexFromPath]);

  const handleHomeClick = () => {
    navigate("/");
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    setIsDropdownOpen(false);
    setIsProfileModalOpen(true);
  };

  const handleAccountSelect = (account) => {
    setSelectedAccount(account);
    setIsDropdownOpen(false);
    console.log("Selected account:", account);
    // TODO: Implement filtering logic based on selected account
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const today = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const date = today.toLocaleDateString("en-US", options);

  // Get icon for account type
  const getAccountIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "checking":
        return <FaUniversity className="account-type-icon" />;
      case "savings":
        return <FaPiggyBank className="account-type-icon" />;
      case "credit":
      case "credit card":
        return <FaCreditCard className="account-type-icon" />;
      default:
        return <FaWallet className="account-type-icon" />;
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount || 0);
  };

  // Calculate total balance
  const totalBalance = accounts.reduce(
    (sum, acc) => sum + (acc.balance || 0),
    0
  );

  return (
    <>
      <div className="top-bar">
        <div className="app-title">
          <span>Personal Finance Tracker</span>
          <h1>Available Balance</h1>
          <div className="top-balance-amount">{balance || "$0"}</div>
        </div>

        <div
          className="nav-tabs"
          style={{ "--active-tab-index": activeTabIndex }}
        >
          <div className="nav-tab-indicator"></div>
          <div
            className={`nav-tab ${activeTabIndex === 0 ? "active-text" : ""}`}
            onClick={handleDashboardClick}
          >
            <FaChartLine style={{ marginRight: "8px", fontSize: "24px" }} />
            Dashboard
          </div>
          <div
            className={`nav-tab ${activeTabIndex === 1 ? "active-text" : ""}`}
            onClick={handleHomeClick}
          >
            <FaHome style={{ marginRight: "8px", fontSize: "24px" }} />
            Overview
          </div>
          <div
            className={`nav-tab ${activeTabIndex === 2 ? "active-text" : ""}`}
            onClick={() => navigate("/pricing")}
          >
            <FaDollarSign style={{ marginRight: "8px", fontSize: "18px" }} />
            Pricing
          </div>
        </div>

        <div className="date-selector">{date}</div>

        <div className="user-profile" ref={dropdownRef}>
          <div className="user-info">
            <span className="user-name">{user?.name || "User"}</span>
            <span className="user-role">
              {selectedAccount ? selectedAccount.name : "All Accounts"}
            </span>
          </div>
          <div
            className="avatar"
            onClick={toggleDropdown}
            style={{ cursor: "pointer" }}
          >
            <img src={USER_PFP ? USER_PFP : DEFAULT_AVATAR} alt="User Avatar" />
          </div>

          {isDropdownOpen && (
            <div className="account-dropdown">
              {loadingAccounts ? (
                <div className="dropdown-loading">Loading accounts...</div>
              ) : (
                <>
                  {/* All Accounts Option */}
                  <div
                    className={`account-item ${
                      !selectedAccount ? "active" : ""
                    }`}
                    onClick={() => handleAccountSelect(null)}
                  >
                    <div className="account-item-content">
                      <FaWallet className="account-type-icon" />
                      <div className="account-details">
                        <span className="account-name">All Accounts</span>
                        <span className="account-type">Total Balance</span>
                      </div>
                    </div>
                    <span className="account-balance">
                      {formatCurrency(totalBalance)}
                    </span>
                  </div>

                  {accounts.length > 0 && (
                    <div className="dropdown-divider"></div>
                  )}

                  {/* Individual Accounts */}
                  {accounts.map((account) => (
                    <div
                      key={account.id}
                      className={`account-item ${
                        selectedAccount?.id === account.id ? "active" : ""
                      }`}
                      onClick={() => handleAccountSelect(account)}
                    >
                      <div className="account-item-content">
                        {getAccountIcon(account.type)}
                        <div className="account-details">
                          <span className="account-name">{account.name}</span>
                          <span className="account-type">{account.type}</span>
                        </div>
                      </div>
                      <span className="account-balance">
                        {formatCurrency(account.balance)}
                      </span>
                    </div>
                  ))}

                  <div className="dropdown-divider"></div>

                  {/* Profile & Logout */}
                  <div className="dropdown-item" onClick={handleProfileClick}>
                    <FaUser className="dropdown-icon" />
                    <span>My Profile</span>
                  </div>
                  <div className="dropdown-item logout" onClick={handleLogout}>
                    <FaSignOutAlt className="dropdown-icon" />
                    <span>Log Out</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </>
  );
};

export default TopBar;
