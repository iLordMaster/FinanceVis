import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaChartLine } from 'react-icons/fa';

const TopBar = ({ isActive }) => {
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    const handleLogout = () => {
        // Clear user data from localStorage
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        // Navigate to login page
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const today = new Date();
    const date = today.toDateString();

  return (
    <div className="top-bar">
      <div className="app-title">
        <h1>Available Balance</h1>
        <span>Personal Finance Tracker</span>
      </div>

      <div className="nav-tabs">
        <div className={`nav-tab ${isActive ? "active" : ""}`} onClick={handleDashboardClick}>Dashboard</div>
        <div className={`nav-tab ${!isActive ? "active" : ""}`} onClick={handleHomeClick}>Home</div>
      </div>

      <div className="date-selector">
        {date}
      </div>

      <div className="user-profile" ref={dropdownRef}>
        <div className="user-info">
          <span className="user-name">Simon K. Jimmy</span>
          <span className="user-role">Mortgage consultant</span>
        </div>
        <div className="avatar" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
          <img src="https://i.pravatar.cc/150?img=11" alt="User Avatar" />
        </div>
        
        {isDropdownOpen && (
          <div className="account-dropdown">
            <div className="dropdown-item" onClick={() => navigate('/profile')}>
              <FaUser className="dropdown-icon" />
              <span>My Profile</span>
            </div>
            <div className="dropdown-item" onClick={() => navigate('/dashboard')}>
              <FaChartLine className="dropdown-icon" />
              <span>Analytics</span>
            </div>
            <div className="dropdown-item" onClick={() => navigate('/settings')}>
              <FaCog className="dropdown-icon" />
              <span>Settings</span>
            </div>
            <div className="dropdown-divider"></div>
            <div className="dropdown-item logout" onClick={handleLogout}>
              <FaSignOutAlt className="dropdown-icon" />
              <span>Log Out</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
