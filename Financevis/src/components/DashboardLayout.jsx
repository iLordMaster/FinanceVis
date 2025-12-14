import React, { useState, useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./dashboard/Sidebar";
import TopBar from "./dashboard/TopBar";
import { ProfileApi } from "../api/profileApi";
import Api from "../api/api";
import { useAccount } from "../context/AccountContext";
import "../pages/Dashboard.css";

const DashboardLayout = () => {
  const currentMonth = new Date().getMonth();
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const [activeMonth, setActiveMonth] = useState(months[currentMonth]);
  const [balance, setBalance] = useState("$0");
  const [allAccounts, setAllAccounts] = useState([]);
  const location = useLocation();
  const { selectedAccount } = useAccount();

  // Fetch all accounts for balance calculation
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const accountsData = await Api.request(
          "/api/dashboard/account-summary"
        );
        if (Array.isArray(accountsData)) {
          setAllAccounts(accountsData);
        }
      } catch (error) {
        console.error("Error fetching accounts for layout:", error);
      }
    };

    fetchAccounts();
  }, []);

  // Update balance when selected account or accounts change
  useEffect(() => {
    if (selectedAccount) {
      // Show selected account's balance
      setBalance(`$${selectedAccount.balance.toLocaleString()}`);
    } else if (allAccounts.length > 0) {
      // Show total balance of all accounts
      const totalBalance = allAccounts.reduce(
        (sum, account) => sum + account.balance,
        0
      );
      setBalance(`$${totalBalance.toLocaleString()}`);
    }
  }, [selectedAccount, allAccounts]);

  // Determine if Sidebar should show active month (only for Dashboard page)
  const showMonthSelector = location.pathname === "/dashboard";

  return (
    <div className="dashboard-container">
      <Sidebar
        activeMonth={activeMonth}
        onMonthChange={setActiveMonth}
        showMonthSelector={showMonthSelector}
      />
      <div className="main-content">
        <TopBar
          isActive={location.pathname === "/dashboard"}
          balance={balance}
        />
        <Outlet context={{ activeMonth, setActiveMonth }} />
      </div>
    </div>
  );
};

export default DashboardLayout;
