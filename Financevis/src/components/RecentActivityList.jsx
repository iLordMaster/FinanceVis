import React, { useState, useEffect } from "react";
import { TransactionApi } from "../api/transactionApi";
import { CategoryApi } from "../api/categoryApi";
import { FaArrowUp, FaArrowDown, FaClock, FaDownload } from "react-icons/fa";
import EmptyState from "./EmptyState";
import "./RecentActivityList.css";

const RecentActivityList = ({ limit = 5, onRefresh, onPremiumClick }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, [onRefresh]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch transactions and categories separately
      const [transactionResponse, incomeCategories, expenseCategories] =
        await Promise.all([
          TransactionApi.getTransactions(),
          CategoryApi.getCategories("INCOME"),
          CategoryApi.getCategories("EXPENSE"),
        ]);

      // Combine all categories into a map for quick lookup
      const categoryMap = new Map();
      [
        ...(incomeCategories.categories || []),
        ...(expenseCategories.categories || []),
      ].forEach((cat) => {
        categoryMap.set(cat.id, cat);
      });

      if (
        transactionResponse.transactions &&
        Array.isArray(transactionResponse.transactions)
      ) {
        // Map category data to transactions
        const transactionsWithCategories = transactionResponse.transactions.map(
          (transaction) => ({
            ...transaction,
            categoryId:
              typeof transaction.categoryId === "string"
                ? categoryMap.get(transaction.categoryId)
                : transaction.categoryId,
          })
        );

        // Sort by date (most recent first) and limit
        const sorted = transactionsWithCategories
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, limit);
        setTransactions(sorted);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch transactions");
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  if (loading) {
    return (
      <div className="recent-activity-loading">
        <div className="loading-spinner"></div>
        <p>Loading transactions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="recent-activity-error">
        <p>Error: {error}</p>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <EmptyState
        icon="📊"
        title="No Transactions Yet"
        message="Start tracking your finances by adding your first income or expense entry."
      />
    );
  }

  return (
    <div className="recent-activity-list">
      <button
        className="download-activity-btn"
        onClick={() => onPremiumClick?.()}
        style={{
          width: "100%",
          padding: "12px",
          marginBottom: "15px",
          backgroundColor: "rgba(249, 115, 22, 0.1)",
          border: "2px dashed #3f3f46",
          borderRadius: "12px",
          color: "#e4e4e7",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          fontSize: "0.9rem",
          fontWeight: "600",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(249, 115, 22, 0.15)";
          e.currentTarget.style.borderColor = "#f97316";
          e.currentTarget.style.transform = "scale(1.02)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(249, 115, 22, 0.1)";
          e.currentTarget.style.borderColor = "#3f3f46";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <FaDownload />
        Download Activity
        <span style={{ marginLeft: "5px" }}>🔒</span>
      </button>
      {transactions.map((transaction, index) => (
        <div
          key={transaction._id || `transaction-${index}`}
          className="activity-item"
        >
          <div className="activity-icon-wrapper">
            <div className={`activity-icon ${transaction.type.toLowerCase()}`}>
              {transaction.type === "INCOME" ? (
                <FaArrowDown size={16} />
              ) : (
                <FaArrowUp size={16} />
              )}
            </div>
          </div>

          <div className="activity-details">
            <div className="activity-category">
              {transaction.categoryId?.name || "Uncategorized"}
            </div>
            <div className="activity-date">
              <FaClock size={12} style={{ marginRight: "4px" }} />
              {formatDate(transaction.date)}
            </div>
          </div>

          <div className="activity-amount-wrapper">
            <div
              className={`activity-amount ${transaction.type.toLowerCase()}`}
            >
              {transaction.type === "INCOME" ? "+" : "-"}$
              {Math.abs(transaction.amount).toFixed(2)}
            </div>
            {transaction.description && (
              <div className="activity-description">
                {transaction.description}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentActivityList;
