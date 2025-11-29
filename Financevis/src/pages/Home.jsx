import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "../components/dashboard/Sidebar";
import TopBar from "../components/dashboard/TopBar";
import DashboardCard from "../components/dashboard/DashboardCard";
import AddIncomeModal from "../components/AddIncomeModal";
import { TransactionApi } from "../api/transactionApi";
import { FaDollarSign, FaTags, FaClock, FaPlus } from "react-icons/fa";
import "./dashboard.css"; // Reuse dashboard styles

const Home = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch income transactions
      const response = await TransactionApi.getTransactions({ type: 'INCOME' });
      setEntries(response.transactions || []);
    } catch (err) {
      setError(err.message || "Failed to fetch entries");
      console.error("Error fetching entries:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [refreshKey, fetchEntries]);

  const handleEntryAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // Calculations
  const totalIncome = entries.reduce((sum, entry) => sum + (entry.amount || 0), 0);
  const uniqueCategories = [...new Set(entries.map((entry) => entry.categoryId?._id).filter(Boolean))];

  let latestEntry = null;
  if (entries.length > 0) {
    const sortedEntries = [...entries].sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    latestEntry = sortedEntries[sortedEntries.length - 1];
  }

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <TopBar />

        <div className="dashboard-grid">
          {/* Welcome / Action Card */}
          <DashboardCard className="card-welcome" style={{ gridColumn: "span 2" }}>
            <div style={{ padding: "10px" }}>
              <h2 style={{ fontSize: "1.8rem", marginBottom: "10px", color: "#fff" }}>
                Take Control of Your Financial Future
              </h2>
              <p style={{ color: "#8a8d98", marginBottom: "20px" }}>
                Visualize your income streams, track your earnings, and make informed decisions.
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                style={{
                  backgroundColor: "#646cff",
                  color: "white",
                  border: "none",
                  padding: "10px 20px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontWeight: "600",
                }}
              >
                <FaPlus /> Add Income Entry
              </button>
            </div>
          </DashboardCard>

          {/* Total Income */}
          <DashboardCard title="Total Income" className="card-balance">
            <div className="balance-amount" style={{ color: "#4ade80" }}>
              ${totalIncome.toFixed(2)}
            </div>
            <div className="card-title" style={{ marginTop: "5px" }}>
              Across all sources
            </div>
          </DashboardCard>

          {/* Categories Count */}
          <DashboardCard title="Income Categories" className="card-income">
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div
                style={{
                  backgroundColor: "rgba(99, 102, 241, 0.2)",
                  padding: "15px",
                  borderRadius: "12px",
                  color: "#6366f1",
                }}
              >
                <FaTags size={24} />
              </div>
              <div>
                <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
                  {uniqueCategories.length}
                </div>
                <div className="card-title">Active Streams</div>
              </div>
            </div>
          </DashboardCard>

          {/* Latest Entry */}
          <DashboardCard title="Latest Entry" className="card-notifications" style={{ gridColumn: "span 2" }}>
            {loading ? (
              <div>Loading...</div>
            ) : latestEntry ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  backgroundColor: "#2a2d3a",
                  padding: "15px",
                  borderRadius: "12px",
                  marginTop: "10px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                  <div
                    style={{
                      backgroundColor: "rgba(74, 222, 128, 0.2)",
                      padding: "12px",
                      borderRadius: "10px",
                      color: "#4ade80",
                    }}
                  >
                    <FaClock size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
                      {latestEntry.categoryId?.name || 'Uncategorized'}
                    </div>
                    <div style={{ color: "#8a8d98", fontSize: "0.9rem" }}>
                      {new Date(latestEntry.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold", color: "#4ade80" }}>
                    +${latestEntry.amount.toFixed(2)}
                  </div>
                  {latestEntry.description && (
                    <div style={{ color: "#8a8d98", fontSize: "0.8rem" }}>
                      {latestEntry.description}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{ color: "#8a8d98", fontStyle: "italic" }}>No entries yet</div>
            )}
          </DashboardCard>
        </div>
      </div>

      <AddIncomeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleEntryAdded}
      />
    </div>
  );
};

export default Home;



