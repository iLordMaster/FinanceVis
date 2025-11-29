import React from 'react';

const DashboardCard = ({ title, children, className = '' }) => {
  return (
    <div className={`dashboard-card ${className}`}>
      {title && <div className="card-title">{title}</div>}
      {children}
    </div>
  );
};

export default DashboardCard;
