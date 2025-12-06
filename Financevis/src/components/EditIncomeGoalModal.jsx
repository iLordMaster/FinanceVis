import React, { useState, useEffect } from "react";
import { AccountApi } from "../api/accountApi";
import "./EditIncomeGoalModal.css";

const EditIncomeGoalModal = ({
  isOpen,
  onClose,
  currentGoal,
  selectedAccount,
  onSave,
}) => {
  const [goal, setGoal] = useState(currentGoal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setGoal(currentGoal);
  }, [currentGoal]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!selectedAccount || (!selectedAccount.id && !selectedAccount._id)) {
        throw new Error("No account selected");
      }

      // Use id or _id depending on what's available
      const accountId = selectedAccount.id || selectedAccount._id;
      console.log("Updating account:", accountId, "with goal:", Number(goal));

      // Update the account's income goal
      const result = await AccountApi.updateAccount(accountId, {
        incomeGoal: Number(goal),
      });
      console.log("Update result:", result);
      onSave(Number(goal));
      onClose();
    } catch (err) {
      console.error("Error updating income goal:", err);
      setError(err.message || "Failed to update income goal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Income Goal</h2>
        {selectedAccount && (
          <p style={{ color: "#9ca3af", marginBottom: "1rem" }}>
            Setting goal for: <strong>{selectedAccount.name}</strong>
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="incomeGoal">Yearly Income Goal ($)</label>
            <input
              type="number"
              id="incomeGoal"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              min="0"
              required
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="save-btn">
              {loading ? "Saving..." : "Save Goal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncomeGoalModal;
