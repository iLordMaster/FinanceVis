import React from 'react';
import { useNavigate } from 'react-router-dom';

const TopBar = () => {
    const navigate = useNavigate();

    const handleHomeClick = () => {
        navigate('/Home');
    };

    const handleDashboardClick = () => {
        navigate('/Dashboard');
    };

    const today = new Date();
    const date = today.toDateString();

  return (
    <div className="top-bar">
      <div className="app-title">
        <h1>Available Balance</h1>
        <span>Personal Finance Tracker</span>
      </div>

      <div className="nav-tabs">
        <div className="nav-tab active" onClick={handleDashboardClick}>Dashboard</div>
        <div className="nav-tab" onClick={handleHomeClick}>Home</div>
      </div>

      <div className="date-selector">
        {date}
      </div>

      <div className="user-profile">
        <div className="user-info">
          <span className="user-name">Simon K. Jimmy</span>
          <span className="user-role">Mortgage consultant</span>
        </div>
        <div className="avatar">
          <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;
