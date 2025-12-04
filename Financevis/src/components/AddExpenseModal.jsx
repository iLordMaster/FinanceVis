import { useState, useEffect } from 'react';
import './AddIncomeModal.css'; // Reuse the same styling
import { TransactionApi } from '../api/transactionApi';
import { CategoryApi } from '../api/categoryApi';
import { AccountApi } from '../api/accountApi';

function AddExpenseModal({ isOpen, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    amount: '',
    categoryId: '',
    accountId: '',
    date: new Date().toISOString().split('T')[0],
    description: ''
  });
  const [categories, setCategories] = useState([]);
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch expense categories and accounts on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, accountsResponse] = await Promise.all([
          CategoryApi.getCategories('EXPENSE'),
          AccountApi.getAccounts()
        ]);
        
        setCategories(categoriesResponse.categories || []);
        setAccounts(accountsResponse.accounts || []);
        
        // Set first category and account as default if available
        const updates = {};
        if (categoriesResponse.categories && categoriesResponse.categories.length > 0 && !formData.categoryId) {
          updates.categoryId = categoriesResponse.categories[0]._id;
        }
        if (accountsResponse.accounts && accountsResponse.accounts.length > 0 && !formData.accountId) {
          updates.accountId = accountsResponse.accounts[0]._id;
        }
        if (Object.keys(updates).length > 0) {
          setFormData(prev => ({ ...prev, ...updates }));
        }
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    if (isOpen) {
      fetchData();
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
      // Validate required fields
      if (!formData.categoryId) {
        throw new Error('Please select a category');
      }
      if (!formData.accountId) {
        throw new Error('Please select an account');
      }

      // Create transaction data
      const transactionData = {
        accountId: formData.accountId,
        categoryId: formData.categoryId,
        type: 'EXPENSE',
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
        accountId: accounts.length > 0 ? accounts[0]._id : '',
        date: new Date().toISOString().split('T')[0],
        description: ''
      });
      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to add expense');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add Expense</h2>
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
                No expense categories found. Create one first.
              </small>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="accountId">Account</label>
            <select
              id="accountId"
              name="accountId"
              value={formData.accountId}
              onChange={handleChange}
              required
            >
              <option value="">Select an account</option>
              {accounts.map((account) => (
                <option key={account._id} value={account._id}>
                  {account.name}
                </option>
              ))}
            </select>
            {accounts.length === 0 && (
              <small style={{ color: '#8a8d98', fontSize: '0.8rem' }}>
                No accounts found. Create one first.
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
              placeholder="e.g. Grocery Shopping"
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
              {loading ? 'Adding...' : 'Add Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddExpenseModal;
