import { useState } from 'react';
import { useApi } from '../hooks/useFetch';

export default function AlertModal({ symbol, currentPrice, onClose, onCreated }) {
  const { post } = useApi();
  const [form, setForm] = useState({
    target_price: currentPrice || '',
    condition: 'above'
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const alert = await post('/api/alerts', { symbol, ...form });
    setLoading(false);
    onCreated(alert);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>🔔 Set Price Alert — {symbol}</h3>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Alert me when price is</label>
            <select
              value={form.condition}
              onChange={e => setForm({ ...form, condition: e.target.value })}
            >
              <option value="above">Above</option>
              <option value="below">Below</option>
            </select>
          </div>
          <div className="form-group">
            <label>Target Price ($)</label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.target_price}
              onChange={e => setForm({ ...form, target_price: e.target.value })}
              placeholder="Enter price"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating...' : '🔔 Create Alert'}
          </button>
        </form>
      </div>
    </div>
  );
}