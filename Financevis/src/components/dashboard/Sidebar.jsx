import React, { useState } from 'react';

const Sidebar = () => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const [activeMonth, setActiveMonth] = useState('Jun');

  return (
    <div className="sidebar">
      <div className="month-list">
        {months.map((month) => (
          <div 
            key={month} 
            className={`month-item ${activeMonth === month ? 'active' : ''}`}
            onClick={() => setActiveMonth(month)}
          >
            {month}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
