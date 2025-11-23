import "./FinancialOverview.css";
import { FaDollarSign, FaTags, FaClock } from "react-icons/fa";

function FinancialOverview() {
  return (
    <section className="financial-overview">
      <h2 className="overview-title">Your Financial Overview</h2>
      <span className="overview-subtitle">
        At a glance: your total income, categories, and latest entries
      </span>
      <div className="overview-cards">
        <div className="overview-card">
          <h3 className="card-title">
            <FaDollarSign className="card-icon" />
            Total Income
          </h3>
          <div className="card-value">10000</div>
          <div className="card-description">Across all income sources</div>
        </div>
        <div className="overview-card">
          <h3 className="card-title">
            <FaTags className="card-icon" />
            Income Categories
          </h3>
          <div className="card-value">2</div>
          <div className="card-description">Unique income streams</div>
        </div>
        <div className="overview-card latest-entry-card">
          <div className="latest-entry-header">
            <h3 className="card-title">
              <FaClock className="card-icon" />
              Latest Entry
            </h3>
            <span className="latest-badge">New</span>
          </div>
          <div className="latest-entry-content">
            <div className="latest-entry-amount">
              <span className="amount-label">Salary</span>
              <span className="amount-value">5000</span>
            </div>
            <div className="card-description latest-entry-date">
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FinancialOverview;
