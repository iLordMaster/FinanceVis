import React, { useState, useEffect } from "react";
import { RecurringTransactionApi } from "../api/recurringTransactionApi";
import { CategoryApi } from "../api/categoryApi";
import { AccountApi } from "../api/accountApi";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaArrowLeft,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";
import "./ManageRecurringIncomeModal.css";

const ManageRecurringIncomeModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState("list"); // 'list' or 'form'
  const [recurringTransactions, setRecurringTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    categoryId: "",
    accountId: "",
    dayOfMonth: 1,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "",
    isActive: true,
    type: "INCOME",
  });

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [recurringRes, categoriesRes, accountsRes] = await Promise.all([
        RecurringTransactionApi.getRecurringTransactions(),
        CategoryApi.getCategories("INCOME"),
        AccountApi.getAccounts(),
      ]);

      setRecurringTransactions(recurringRes.recurringTransactions || []);
      console.log("Fetched Categories:", categoriesRes.categories);
      setCategories(categoriesRes.categories || []);
      setAccounts(accountsRes.accounts || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setView("list");
    setEditingId(null);
    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      amount: "",
      categoryId: "",
      accountId: "",
      dayOfMonth: 1,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      isActive: true,
      type: "INCOME",
    });
  };

  const handleAddNew = () => {
    resetForm();
    setEditingId(null);
    setView("form");
  };

  const handleEdit = (transaction) => {
    setFormData({
      name: transaction.name,
      amount: transaction.amount,
      categoryId: transaction.categoryId?._id || transaction.categoryId,
      accountId: transaction.accountId,
      dayOfMonth: transaction.dayOfMonth,
      startDate: new Date(transaction.startDate).toISOString().split("T")[0],
      endDate: transaction.endDate
        ? new Date(transaction.endDate).toISOString().split("T")[0]
        : "",
      isActive: transaction.isActive,
      type: transaction.type,
    });
    setEditingId(transaction.id);
    setView("form");
  };

  const handleDelete = async (id) => {
    if (
      !window.confirm("Are you sure you want to delete this recurring income?")
    )
      return;

    try {
      await RecurringTransactionApi.deleteRecurringTransaction(id);
      await fetchData();
    } catch (error) {
      console.error("Error deleting recurring transaction:", error);
      alert("Failed to delete recurring income");
    }
  };

  const handleToggleActive = async (transaction) => {
    try {
      await RecurringTransactionApi.updateRecurringTransaction(transaction.id, {
        isActive: !transaction.isActive,
      });
      await fetchData();
    } catch (error) {
      console.error("Error toggling active status:", error);
      alert("Failed to update status");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = {
        ...formData,
        amount: parseFloat(formData.amount),
        dayOfMonth: parseInt(formData.dayOfMonth),
        endDate: formData.endDate || null,
      };

      if (editingId) {
        await RecurringTransactionApi.updateRecurringTransaction(
          editingId,
          data
        );
      } else {
        await RecurringTransactionApi.createRecurringTransaction(data);
      }

      await fetchData();
      setView("list");
      resetForm();
      setEditingId(null);
    } catch (error) {
      console.error("Error saving recurring transaction:", error);
      alert("Failed to save recurring income");
    }
  };

  const getNextExecutionDate = (transaction) => {
    const today = new Date();
    const dayOfMonth = transaction.dayOfMonth;
    let nextDate = new Date(today.getFullYear(), today.getMonth(), dayOfMonth);

    if (nextDate <= today) {
      nextDate = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        dayOfMonth
      );
    }

    return nextDate.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="modal-content recurring-income-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>
            {view === "list"
              ? "Manage Recurring Income"
              : editingId
              ? "Edit Recurring Income"
              : "Add Recurring Income"}
          </h2>
          <button className="close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>

        <div className="modal-body">
          {view === "list" ? (
            // LIST VIEW
            <>
              <button className="add-new-btn" onClick={handleAddNew}>
                <FaPlus /> Add New Recurring Income
              </button>

              {loading ? (
                <div className="loading-state">Loading...</div>
              ) : recurringTransactions.length === 0 ? (
                <div className="empty-state">
                  <p>No recurring income streams yet</p>
                  <p className="empty-subtitle">
                    Click "Add New" to create your first recurring income
                  </p>
                </div>
              ) : (
                <div className="recurring-list">
                  {recurringTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className={`recurring-item ${
                        !transaction.isActive ? "inactive" : ""
                      }`}
                    >
                      <div className="recurring-item-main">
                        <div className="recurring-item-info">
                          <h3>{transaction.name}</h3>
                          <p className="recurring-details">
                            ${transaction.amount.toLocaleString()} • Day{" "}
                            {transaction.dayOfMonth} of each month
                          </p>
                          <p className="recurring-next">
                            Next: {getNextExecutionDate(transaction)}
                          </p>
                        </div>
                        <div className="recurring-item-amount">
                          ${transaction.amount.toLocaleString()}
                        </div>
                      </div>
                      <div className="recurring-item-actions">
                        <button
                          className="toggle-btn"
                          onClick={() => handleToggleActive(transaction)}
                          title={
                            transaction.isActive ? "Deactivate" : "Activate"
                          }
                        >
                          {transaction.isActive ? (
                            <FaToggleOn />
                          ) : (
                            <FaToggleOff />
                          )}
                          {transaction.isActive ? "Active" : "Inactive"}
                        </button>
                        <button
                          className="edit-btn"
                          onClick={() => handleEdit(transaction)}
                        >
                          <FaEdit /> Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(transaction.id)}
                        >
                          <FaTrash /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            // FORM VIEW
            <form onSubmit={handleSubmit} className="recurring-form">
              <button
                type="button"
                className="back-btn"
                onClick={() => setView("list")}
              >
                <FaArrowLeft /> Back to List
              </button>

              <div className="form-group full-width">
                <label>Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Monthly Salary"
                  required
                />
              </div>

              <div className="form-group">
                <label>Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  value={formData.categoryId}
                  onChange={(e) =>
                    setFormData({ ...formData, categoryId: e.target.value })
                  }
                  required
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Account *</label>
                <select
                  value={formData.accountId}
                  onChange={(e) =>
                    setFormData({ ...formData, accountId: e.target.value })
                  }
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map((acc) => (
                    <option key={acc.id} value={acc.id}>
                      {acc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Day of Month (1-31) *</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  value={formData.dayOfMonth}
                  onChange={(e) =>
                    setFormData({ ...formData, dayOfMonth: e.target.value })
                  }
                  required
                />
                <small>
                  Transaction will be created on this day each month
                </small>
              </div>

              <div className="form-group">
                <label>Start Date *</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                />
                <small>Leave empty for indefinite recurring income</small>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData({ ...formData, isActive: e.target.checked })
                    }
                  />
                  Active
                </label>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setView("list")}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  {editingId ? "Update" : "Create"} Recurring Income
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageRecurringIncomeModal;
