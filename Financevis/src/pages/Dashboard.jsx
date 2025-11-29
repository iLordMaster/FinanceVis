import React from 'react';
import Sidebar from '../components/dashboard/Sidebar';
import TopBar from '../components/dashboard/TopBar';
import DashboardCard from '../components/dashboard/DashboardCard';
import ChartPlaceholder from '../components/dashboard/ChartPlaceholder';
import './dashboard.css';
import { FaHome, FaUser, FaCar, FaDog } from 'react-icons/fa';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <TopBar isActive={true} />
        
        <div className="dashboard-grid">
          {/* Available Balance */}
          <DashboardCard title="Available Balance" className="card-balance">
            <div className="balance-amount">$14,822</div>
          </DashboardCard>

          {/* Total Net Worth */}
          <DashboardCard title="Total Net Worth" className="card-net-worth">
            <div className="net-worth-amount">$278,378</div>
          </DashboardCard>

          {/* Spendings */}
          <DashboardCard title="Spendings" className="card-spendings">
            <div className="card-title">$9,228</div>
            <ChartPlaceholder text="Line Chart" />
          </DashboardCard>

          {/* Income */}
          <DashboardCard title="Income" className="card-income">
            <div className="card-title">$24,050</div>
            <ChartPlaceholder text="Line Chart" />
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
            <ChartPlaceholder text="Bar Chart" />
          </DashboardCard>

          {/* Income & Expenses */}
          <DashboardCard title="Income & Expenses" className="card-income-expenses">
            <div style={{ display: 'flex', gap: '20px', marginBottom: '10px' }}>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>$20,239</div>
                <div style={{ fontSize: '0.8rem', color: '#f97316' }}>Max. Expenses</div>
              </div>
              <div>
                <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>$20,239</div>
                <div style={{ fontSize: '0.8rem', color: '#4ade80' }}>Max. Income</div>
              </div>
            </div>
            <ChartPlaceholder text="Dual Line Chart" />
          </DashboardCard>

          {/* Assets */}
          <DashboardCard title="Assets" className="card-assets">
            <ChartPlaceholder text="Donut Chart" />
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