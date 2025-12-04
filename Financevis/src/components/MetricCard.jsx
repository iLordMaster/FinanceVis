import React from 'react';
import './MetricCard.css';

const MetricCard = ({ title, value, icon, gradient, trend }) => {
  return (
    <div className={`metric-card ${gradient ? `gradient-${gradient}` : ''}`}>
      <div className="metric-header">
        <div className="metric-icon-wrapper">
          {icon}
        </div>
        {trend && (
          <div className={`metric-trend ${trend.direction}`}>
            {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
          </div>
        )}
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-title">{title}</div>
    </div>
  );
};

export default MetricCard;
