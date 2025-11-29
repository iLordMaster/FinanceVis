import { useState, useEffect, useCallback } from "react";
import "./FinancialOverview.css";
import { FaDollarSign, FaTags, FaClock } from "react-icons/fa";
import { TransactionApi } from "../api/transactionApi";

function FinancialOverview({ refreshTrigger }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch income transactions
      console.log("Fetching income transactions");
      const response = await TransactionApi.getTransactions({ type: 'INCOME' });
      console.log("Response:", response);
      console.log("Transactions fetched:", response.transactions);
      setEntries(response.transactions || []);
    } catch (err) {
      setError(err.message || "Failed to fetch entries");
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies since we're using auth token

  useEffect(() => {
    console.log("FinancialOverview refreshing, trigger:", refreshTrigger);
    fetchEntries();
  }, [refreshTrigger, fetchEntries]); // Re-fetch when refreshTrigger changes


  // Calculate total income
  const totalIncome = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);

  // Get unique categories
  const uniqueCategories = [...new Set(entries.map(entry => entry.categoryId?._id).filter(Boolean))];

  // Get latest entry - sort by date and take the last one
  let latestEntry = null;
  if (entries.length > 0) {
    const sortedEntries = [...entries].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    
    latestEntry = sortedEntries[sortedEntries.length - 1];
    console.log("Sorted entries by date:", sortedEntries.map(e => ({
      cat: e.categoryId?.name,
      amount: e.amount,
      date: e.date
    })));
    console.log("Latest entry selected:", {
      cat: latestEntry.categoryId?.name,
      amount: latestEntry.amount,
      date: latestEntry.date
    });
  }

  if (loading) {
    return (
      <section className="financial-overview">
        <h2 className="overview-title">Your Financial Overview</h2>
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="financial-overview">
        <h2 className="overview-title">Your Financial Overview</h2>
        <div style={{ textAlign: 'center', padding: '2rem', color: '#ff4444' }}>
          {error}
        </div>
      </section>
    );
  }

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
          <div className="card-value">${totalIncome.toFixed(2)}</div>
          <div className="card-description">Across all income sources</div>
        </div>
        <div className="overview-card">
          <h3 className="card-title">
            <FaTags className="card-icon" />
            Income Categories
          </h3>
          <div className="card-value">{uniqueCategories.length}</div>
          <div className="card-description">Unique income streams</div>
        </div>
        <div className="overview-card latest-entry-card">
          <div className="latest-entry-header">
            <h3 className="card-title">
              <FaClock className="card-icon" />
              Latest Entry
            </h3>
            {latestEntry && <span className="latest-badge">New</span>}
          </div>
          {latestEntry ? (
            <div className="latest-entry-content">
              <div className="latest-entry-amount">
                <span className="amount-label">{latestEntry.categoryId?.name || 'Uncategorized'}</span>
                <span className="amount-value">${latestEntry.amount.toFixed(2)}</span>
              </div>
              <div className="card-description latest-entry-date">
                {new Date(latestEntry.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {latestEntry.description && (
                <div className="card-description" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  {latestEntry.description}
                </div>
              )}
            </div>
          ) : (
            <div className="latest-entry-content">
              <div className="card-description">No entries yet</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default FinancialOverview;
