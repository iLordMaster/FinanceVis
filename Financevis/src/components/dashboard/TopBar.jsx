import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaCog, FaSignOutAlt, FaChartLine, FaHome, FaDollarSign } from 'react-icons/fa';
import { useUser } from '../../context/UserContext.jsx';

const TopBar = ({ balance }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Helper function to get tab index from path
    const getTabIndexFromPath = useCallback((path) => {
        if (path === '/dashboard') return 0;
        if (path === '/' || path === '/home') return 1;
        if (path === '/pricing') return 2;
        return 0; // default to dashboard
    }, []);

    const [activeTabIndex, setActiveTabIndex] = useState(() => getTabIndexFromPath(location.pathname));

    const { user } = useUser();

    // console.log(user); // Removed log

    const DEFAULT_AVATAR = "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
    const USER_PFP = user?.profilePicture;

    // Update active tab when route changes
    useEffect(() => {
        setActiveTabIndex(getTabIndexFromPath(location.pathname));
    }, [location.pathname, getTabIndexFromPath]);

    const handleHomeClick = () => {
        navigate('/');
    };

    const handleDashboardClick = () => {
        navigate('/dashboard');
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

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
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const date = today.toLocaleDateString('en-US', options);

  return (
    <div className="top-bar">
      <div className="app-title">
        <span>Personal Finance Tracker</span>
        <h1>Available Balance</h1>
        <div className="top-balance-amount">{balance || "$0"}</div>
      </div>

      <div className="nav-tabs" style={{ '--active-tab-index': activeTabIndex }}>
        <div className="nav-tab-indicator"></div>
        <div className={`nav-tab ${activeTabIndex === 0 ? 'active-text' : ''}`} onClick={handleDashboardClick}>
            <FaChartLine size={25} style={{ marginRight: '8px'}}/>
            Dashboard
        </div>
        <div className={`nav-tab ${activeTabIndex === 1 ? 'active-text' : ''}`} onClick={handleHomeClick}>
            <FaHome size={25} style={{ marginRight: '8px'}}/>
            Overview
        </div>
        <div className={`nav-tab ${activeTabIndex === 2 ? 'active-text' : ''}`} onClick={() => navigate('/pricing')}>
            <FaDollarSign style={{ marginRight: '8px'}}/>
            Pricing
        </div>
      </div>

      <div className="date-selector">
        {date}
      </div>

      <div className="user-profile" ref={dropdownRef}>
        <div className="user-info">
          <span className="user-name">{user?.name || "User"}</span>
          <span className="user-role">Mortgage consultant</span>
        </div>
        <div className="avatar" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
          <img src={USER_PFP ? USER_PFP : DEFAULT_AVATAR} alt="User Avatar" />
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
