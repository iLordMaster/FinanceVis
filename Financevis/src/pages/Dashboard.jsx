import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
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
import EditIncomeGoalModal from '../components/EditIncomeGoalModal';
import { DashboardService } from '../services/DashboardService';
import PaywallModal from '../components/PaywallModal';

const Dashboard = () => {
  const { activeMonth, setActiveMonth } = useOutletContext();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [activeMonth, setActiveMonth] = useState('Jun'); // Managed by layout
  const [accounts, setAccounts] = useState([]);
  const [assets, setAssets] = useState([]);
  const [incomeGoal, setIncomeGoal] = useState(0);
  const [ytdIncome, setYtdIncome] = useState(0);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isPaywallOpen, setIsPaywallOpen] = useState(false);
  
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

        // Fetch user profile for income goal
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const userObj = JSON.parse(userStr);
          const userProfile = await UserApi.getUser(userObj.id);
          setIncomeGoal(userProfile.incomeGoal || 0);
        }

        // Fetch YTD Income
        const now = new Date();
        const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
        const endOfToday = new Date().toISOString();
        
        const ytdStats = await DashboardService.getMonthlyIncomeVsExpenses({
          startDate: startOfYear,
          endDate: endOfToday
        });
        setYtdIncome(ytdStats.income || 0);
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
        <div 
          style={{ cursor: 'pointer' }} 
          onClick={() => setIsGoalModalOpen(true)}
          title="Click to edit goal"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#646cff' }}>
                {incomeGoal > 0 ? Math.min(Math.round((ytdIncome / incomeGoal) * 100), 100) : 0}%
              </div>
              <div className="card-title">Income Goal (YTD)</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '0.9rem' }}>
              ${ytdIncome.toLocaleString()} / {incomeGoal.toLocaleString()}
            </div>
          </div>
          <div className="progress-container">
            <div 
              className="progress-bar" 
              style={{ width: `${incomeGoal > 0 ? Math.min((ytdIncome / incomeGoal) * 100, 100) : 0}%` }}
            ></div>
          </div>
        </div>
      </DashboardCard>

      {/* Income Goal Modal */}
      <EditIncomeGoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        currentGoal={incomeGoal}
        onSave={(newGoal) => setIncomeGoal(newGoal)}
      />

      {/* Notifications */}
      <DashboardCard title="Notification" className="card-notifications">
        <div className="notification-item">
          3 Bills are past Due, Pay soon to avoid late fees.
        </div>
      </DashboardCard>

      {/* Next Month's Prediction */}
      <DashboardCard title="Next Month's Prediction" className="card-prediction">
        <div className="restricted-content" onClick={() => setIsPaywallOpen(true)}>
          <div className="restricted-overlay">
            <div className="lock-icon">🔒</div>
            <div className="restricted-text">Premium Feature</div>
            <div className="restricted-subtext">Click to unlock</div>
          </div>
        </div>
      </DashboardCard>

      {/* Paywall Modal */}
      <PaywallModal 
        isOpen={isPaywallOpen} 
        onClose={() => setIsPaywallOpen(false)} 
      />

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
  );
};

export default Dashboard;