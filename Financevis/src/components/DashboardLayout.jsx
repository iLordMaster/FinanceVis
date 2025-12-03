import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './dashboard/Sidebar';
import TopBar from './dashboard/TopBar';
import { UserApi } from '../api/userApi';
import '../pages/dashboard.css';

const DashboardLayout = () => {
  const [activeMonth, setActiveMonth] = useState('Jun');
  const [balance, setBalance] = useState("$0");
  const location = useLocation();

  // Fetch balance for TopBar
  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const accountsData = await UserApi.request('/api/dashboard/account-summary');
        if (Array.isArray(accountsData)) {
          const totalBalance = accountsData.reduce((sum, account) => sum + account.balance, 0);
          setBalance(`$${totalBalance.toLocaleString()}`);
        }
      } catch (error) {
        console.error('Error fetching balance for layout:', error);
      }
    };

    fetchBalance();
  }, []);

  // Determine if Sidebar should show active month (only for Dashboard page)
  const showMonthSelector = location.pathname === '/dashboard';

  return (
    <div className="dashboard-container">
      <Sidebar 
        activeMonth={activeMonth} 
        onMonthChange={setActiveMonth}
        showMonthSelector={showMonthSelector}
      />
      <div className="main-content">
        <TopBar isActive={location.pathname === '/dashboard'} balance={balance} />
        <Outlet context={{ activeMonth, setActiveMonth }} />
      </div>
    </div>
  );
};

export default DashboardLayout;
