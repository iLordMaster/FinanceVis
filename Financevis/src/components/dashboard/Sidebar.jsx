import React from 'react';

const Sidebar = ({ activeMonth, onMonthChange }) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  return (
    <div className="sidebar">
      <div className="logo">FV</div>
      <div className="month-list">
        {months.map((month) => (
          <div 
            key={month} 
            className={`month-item ${activeMonth === month ? 'active' : ''}`}
            onClick={() => onMonthChange(month)}
          >
            {month}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
