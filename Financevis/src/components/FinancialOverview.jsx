import { useState, useEffect, useCallback } from "react";
import "./FinancialOverview.css";
import { FaDollarSign, FaTags, FaClock } from "react-icons/fa";
import { UserApi } from "../api/userApi";

function FinancialOverview({ refreshTrigger }) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Get user from localStorage
      const userStr = localStorage.getItem("user");
      if (!userStr) {
        setError("User not authenticated");
        return;
      }
      const user = JSON.parse(userStr);

      // Fetch entries from API
      console.log("Fetching entries for user:", user.id);
      const response = await UserApi.getIncomeEntries(user.id);
      console.log("Response:", response);
      console.log("Entries fetched:", response.entries);
      console.log("Entry details:", response.entries.map(e => ({
        id: e._id,
        cat: e.entryCat,
        amount: e.entryAmount,
        entryDate: e.entryDate,
        createdAt: e.createdAt,
        description: e.entryDescription
      })));
      setEntries(response.entries || []);
    } catch (err) {
      setError(err.message || "Failed to fetch entries");
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependencies since we're using localStorage

  useEffect(() => {
    console.log("FinancialOverview refreshing, trigger:", refreshTrigger);
    fetchEntries();
  }, [refreshTrigger, fetchEntries]); // Re-fetch when refreshTrigger changes


  // Calculate total income
  const totalIncome = entries.reduce((sum, entry) => sum + (entry.entryAmount || 0), 0);

  // Get unique categories
  const uniqueCategories = [...new Set(entries.map(entry => entry.entryCat))].filter(Boolean);

  // Get latest entry - sort by timestamp and take the last one
  let latestEntry = null;
  if (entries.length > 0) {
    const sortedEntries = [...entries].sort((a, b) => {
      // Helper function to get timestamp from entry
      const getTimestamp = (entry) => {
        if (entry.createdAt) {
          return new Date(entry.createdAt).getTime();
        } else if (entry._id) {
          // Extract timestamp from MongoDB ObjectId (first 4 bytes)
          return parseInt(entry._id.substring(0, 8), 16) * 1000;
        } else {
          return new Date(entry.entryDate).getTime();
        }
      };
      
      return getTimestamp(a) - getTimestamp(b);
    });
    
    latestEntry = sortedEntries[sortedEntries.length - 1];
    console.log("Sorted entries by timestamp:", sortedEntries.map(e => ({
      cat: e.entryCat,
      amount: e.entryAmount,
      timestamp: e.createdAt || e._id || e.entryDate
    })));
    console.log("Latest entry selected:", {
      cat: latestEntry.entryCat,
      amount: latestEntry.entryAmount,
      timestamp: latestEntry.createdAt || latestEntry._id || latestEntry.entryDate
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
                <span className="amount-label">{latestEntry.entryCat}</span>
                <span className="amount-value">${latestEntry.entryAmount.toFixed(2)}</span>
              </div>
              <div className="card-description latest-entry-date">
                {new Date(latestEntry.entryDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {latestEntry.entryDescription && (
                <div className="card-description" style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
                  {latestEntry.entryDescription}
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
