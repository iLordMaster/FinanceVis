import React, { useState } from 'react';
import { UserApi } from '../api/userApi';
import './EditIncomeGoalModal.css'; // We'll create this CSS file

const EditIncomeGoalModal = ({ isOpen, onClose, currentGoal, onSave }) => {
  const [goal, setGoal] = useState(currentGoal);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.id) throw new Error('User not found');

      await UserApi.updateProfile(user.id, { incomeGoal: Number(goal) });
      onSave(Number(goal));
      onClose();
    } catch (err) {
      console.error('Error updating income goal:', err);
      setError('Failed to update income goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Set Income Goal</h2>
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
              {loading ? 'Saving...' : 'Save Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditIncomeGoalModal;
