import { useState, useEffect } from 'react';
import './AddIncomeModal.css';
import { TransactionApi } from '../api/transactionApi';
import { CategoryApi } from '../api/categoryApi';

function AddIncomeModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch income categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await CategoryApi.getCategories('INCOME');
        setCategories(response.categories || []);
        // Set first category as default if available
        if (response.categories && response.categories.length > 0 && !formData.categoryId) {
          setFormData(prev => ({ ...prev, categoryId: response.categories[0]._id }));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate category selection
      if (!formData.categoryId) {
        throw new Error('Please select a category');
      }

      // Create transaction data
      const transactionData = {
        categoryId: formData.categoryId,
        type: 'INCOME',
        amount: parseFloat(formData.amount),
        date: new Date(formData.date),
        description: formData.description
      };

      // Call API to create transaction
      await TransactionApi.createTransaction(transactionData);

      // Reset form and close modal on success
      setFormData({
        amount: '',
        categoryId: categories.length > 0 ? categories[0]._id : '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add income');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Income</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Amount ($)</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              required
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">Category</label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {categories.length === 0 && (
              <small style={{ color: '#8a8d98', fontSize: '0.8rem' }}>
                No income categories found. Create one first.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (Optional)</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="e.g. Monthly Paycheck"
            />
          </div>

          <div className="modal-actions">
            {error && (
              <div className="error-message" style={{ marginBottom: '1rem', color: '#ff4444', textAlign: 'center' }}>
                {error}
              </div>
            )}
            <button type="button" className="btn-cancel" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Adding...' : 'Add Income'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddIncomeModal;
