import React, { useState } from "react";
import { AccountApi } from "../api/accountApi.js";
import "./CreateAccountModal.css";

function CreateAccountModal({ isOpen, onClose, onAccountCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    type: "checking",
    balance: 0,
    currency: "USD",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const accountTypes = [
    { value: "checking", label: "Checking Account" },
    { value: "savings", label: "Savings Account" },
    { value: "credit", label: "Credit Card" },
    { value: "investment", label: "Investment Account" },
    { value: "cash", label: "Cash" },
  ];

  const currencies = [
    { value: "USD", label: "USD ($)" },
    { value: "EUR", label: "EUR (€)" },
    { value: "GBP", label: "GBP (£)" },
    { value: "JPY", label: "JPY (¥)" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "balance" ? parseFloat(value) || 0 : value,
    }));
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.name.trim()) {
      setError("Account name is required");
      return;
    }

    if (formData.name.length < 2) {
      setError("Account name must be at least 2 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await AccountApi.createAccount(formData);
      setSuccess("Account created successfully!");

      // Reset form
      setFormData({
        name: "",
        type: "checking",
        balance: 0,
        currency: "USD",
      });

      // Notify parent component
      if (onAccountCreated) {
        onAccountCreated(result.account);
      }

      // Close modal after a short delay
      setTimeout(() => {
        onClose();
        setSuccess("");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        name: "",
        type: "checking",
        balance: 0,
        currency: "USD",
      });
      setError("");
      setSuccess("");
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div
        className="create-account-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h2>Create New Account</h2>
          <button
            className="close-button"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="create-account-form">
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-group">
            <label htmlFor="name">Account Name *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Main Checking, Savings Account"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Account Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              {accountTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="balance">Initial Balance</label>
              <input
                type="number"
                id="balance"
                name="balance"
                value={formData.balance}
                onChange={handleChange}
                step="0.01"
                min="0"
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="currency">Currency</label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                disabled={isSubmitting}
              >
                {currencies.map((curr) => (
                  <option key={curr.value} value={curr.value}>
                    {curr.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateAccountModal;
