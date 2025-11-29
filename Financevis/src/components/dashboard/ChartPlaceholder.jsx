import React from 'react';

const ChartPlaceholder = ({ text = "Chart goes here" }) => {
  return (
    <div className="chart-placeholder">
      {text}
    </div>
  );
};

export default ChartPlaceholder;
