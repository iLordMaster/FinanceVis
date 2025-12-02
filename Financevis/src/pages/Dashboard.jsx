import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import DashboardCard from '../components/dashboard/DashboardCard';
import ChartPlaceholder from '../components/dashboard/ChartPlaceholder';
import './dashboard.css';
import { FaDog } from 'react-icons/fa';
import DualLineChart from '../components/dashboard/DualLineChart';
import { UserApi } from '../api/userApi';
import AssetDonutChart from '../components/dashboard/AssetDonutChart';
import AssetLegend from '../components/dashboard/AssetLegend';
import LineChart from '../components/dashboard/LineChart';
import BarChart from '../components/dashboard/BarChart';
import SpendingList from '../components/dashboard/SpendingList';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMonth, setActiveMonth] = useState('Jun');
  const [accounts, setAccounts] = useState([]);
  const [assets, setAssets] = useState([]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch monthly stats
        const dataJson = await UserApi.request('/api/dashboard/monthly-stats');
        
        if (Array.isArray(dataJson)) {
          setData(dataJson);
        } else {
          console.error('Expected array from monthly-stats but got:', dataJson);
          setData([]);
        }

        // Fetch accounts
        const accountsData = await UserApi.request('/api/dashboard/account-summary');
        console.log('Accounts API response:', accountsData);
        if (Array.isArray(accountsData)) {
          setAccounts(accountsData);
          console.log('Total accounts:', accountsData.length);
        } else {
          console.error('Expected array from account-summary but got:', accountsData);
        }

        // Fetch assets
        const assetsData = await UserApi.request('/api/dashboard/asset-summary');
        console.log('Assets API response:', assetsData);
        if (Array.isArray(assetsData)) {
          setAssets(assetsData);
          console.log('Total assets:', assetsData.length);
        } else {
          console.error('Expected array from asset-summary but got:', assetsData);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const maxIncome = data.length > 0 ? Math.max(...data.map(item => item.income)) : 0;
  const maxExpenses = data.length > 0 ? Math.max(...data.map(item => item.expenses)) : 0;
  
  // Calculate total account balance (sum of all accounts)
  const totalAccountBalance = accounts.reduce((sum, account) => sum + account.balance, 0);
  console.log('Total Account Balance:', totalAccountBalance, 'from', accounts.length, 'accounts');
  
  // Calculate total asset value
  const totalAssetValue = assets.reduce((sum, asset) => sum + asset.value, 0);
  console.log('Total Asset Value:', totalAssetValue, 'from', assets.length, 'assets');
  
  // Calculate total net worth = account balance + total asset values
  const netWorth = totalAccountBalance + totalAssetValue;
  console.log('Net Worth:', netWorth);

  return (
    <div className="dashboard-container">
      <Sidebar activeMonth={activeMonth} onMonthChange={setActiveMonth} />
      <div className="main-content">
        <TopBar isActive={true} balance={`$${totalAccountBalance.toLocaleString()}`} />
        
        <div className="dashboard-grid">
          {/* Total Net Worth */}
          <DashboardCard title="Total Net Worth" className="card-net-worth">
            <div className="net-worth-amount">${netWorth.toLocaleString()}</div>
          </DashboardCard>

          {/* Spendings */}
          <DashboardCard title="Spendings" className="card-spendings">
            <LineChart selectedMonth={activeMonth} type="EXPENSE" />
          </DashboardCard>


          {/* Income */}
          <DashboardCard title="Income" className="card-income">
            <LineChart selectedMonth={activeMonth} type="INCOME" />
          </DashboardCard>

          {/* Spending Categories */}
          <DashboardCard title="Spendings" className="card-categories">
            <SpendingList selectedMonth={activeMonth} />
          </DashboardCard>

          {/* Income Goal */}
          <DashboardCard className="card-income-goal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#646cff' }}>61%</div>
                <div className="card-title">Income Goal</div>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>$24,050 / 39,276</div>
            </div>
            <div className="progress-container">
              <div className="progress-bar"></div>
            </div>
          </DashboardCard>

          {/* Notifications */}
          <DashboardCard title="Notification" className="card-notifications">
            <div className="notification-item">
              3 Bills are past Due, Pay soon to avoid late fees.
            </div>
          </DashboardCard>

          {/* Income Source */}
          <DashboardCard title="Income Source" className="card-income-source">
            <BarChart selectedMonth={activeMonth} />
          </DashboardCard>

          {/* Assets */}
          <DashboardCard title="Assets" className="card-assets">
            <AssetDonutChart />
            <AssetLegend />
          </DashboardCard>

          {/* Income & Expenses */}
          <DashboardCard title="Income & Expenses" className="card-income-expenses">
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${maxExpenses}</div>
                <div style={{ fontSize: '0.8rem', color: '#f97316' }}>Max. Expenses</div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>${maxIncome}</div>
                <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>Max. Income</div>
              </div>
            </div>
            <DualLineChart />
          </DashboardCard>

          

          {/* Misc (Dog) */}
          <DashboardCard className="card-misc">
            <div style={{ textAlign: 'center' }}>
              <div className="card-title">Expenses for My Dogs and Cats</div>
              <FaDog style={{ fontSize: '3rem', color: '#f97316', margin: '10px 0' }} />
              <div style={{ fontSize: '0.8rem' }}>Routine Vet: 140</div>
            </div>
          </DashboardCard>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;