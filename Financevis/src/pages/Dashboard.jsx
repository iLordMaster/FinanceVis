import React, { useState, useEffect } from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import DashboardCard from '../components/dashboard/DashboardCard';
import ChartPlaceholder from '../components/dashboard/ChartPlaceholder';
import './dashboard.css';
import { FaHome, FaUser, FaCar, FaDog } from 'react-icons/fa';
import DualLineChart from '../components/dashboard/DualLineChart';
import { UserApi } from '../api/userApi';
import AssetDonutChart from '../components/dashboard/AssetDonutChart';
import LineChart from '../components/dashboard/LineChart';
import BarChart from '../components/dashboard/BarChart';

const Dashboard = () => {
  const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const dataJson = await UserApi.request('/api/dashboard/monthly-stats');
          
          if (Array.isArray(dataJson)) {
            setData(dataJson);
          } else {
            console.error('Expected array from monthly-stats but got:', dataJson);
            setData([]);
          }
        } catch (error) {
          console.error('Error fetching monthly stats:', error);
          setData([]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);

    const maxIncome = data.length > 0 ? Math.max(...data.map(item => item.income)) : 0;
    const maxExpenses = data.length > 0 ? Math.max(...data.map(item => item.expenses)) : 0;

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <TopBar isActive={true} balance="$14,822" />
        
        <div className="dashboard-grid">
          {/* Total Net Worth */}
          <DashboardCard title="Total Net Worth" className="card-net-worth">
            <div className="net-worth-amount">$278,378</div>
          </DashboardCard>

          {/* Spendings */}
          <DashboardCard title="Spendings" className="card-spendings">
            <div className="card-title">$9,228</div>
            <LineChart />
          </DashboardCard>


          {/* Income */}
          <DashboardCard title="Income" className="card-income">
            <div className="card-title">$24,050</div>
            <LineChart />
          </DashboardCard>

          {/* Spending Categories */}
          <DashboardCard title="Spendings" className="card-categories">
            <div className="category-list">
              <div className="category-item">
                <div className="cat-icon" style={{ backgroundColor: '#4f46e5' }}><FaHome /></div>
                <div className="cat-details">
                  <span className="cat-name">Housing</span>
                  <span className="cat-amount">$3,452</span>
                </div>
              </div>
              <div className="category-item">
                <div className="cat-icon" style={{ backgroundColor: '#db2777' }}><FaUser /></div>
                <div className="cat-details">
                  <span className="cat-name">Personal</span>
                  <span className="cat-amount">$2,200</span>
                </div>
              </div>
              <div className="category-item">
                <div className="cat-icon" style={{ backgroundColor: '#f97316' }}><FaCar /></div>
                <div className="cat-details">
                  <span className="cat-name">Transportation</span>
                  <span className="cat-amount">$2,190</span>
                </div>
              </div>
            </div>
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
            <BarChart />
          </DashboardCard>

          {/* Assets */}
          <DashboardCard title="Assets" className="card-assets">
            <AssetDonutChart />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px', fontSize: '0.8rem' }}>
              <div>
                <div>Gold</div>
                <div style={{ fontWeight: 'bold' }}>$15,700</div>
              </div>
              <div>
                <div>Stock</div>
                <div style={{ fontWeight: 'bold' }}>$22,500</div>
              </div>
            </div>
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