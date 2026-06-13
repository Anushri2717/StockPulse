import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import AlertModal from '../components/AlertModal';

export default function Alerts() {
  const { token } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('/api/alerts', { headers:{Authorization:`Bearer ${token}`} })
      .then(r=>r.json()).then(setAlerts);
  }, [token]);

  const handleDelete = async (id) => {
    await fetch(`/api/alerts/${id}`, { method:'DELETE', headers:{Authorization:`Bearer ${token}`} });
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="page">
      <div className="container">
        <div className="section-header" style={{marginBottom:28}}>
          <h1 className="page-title" style={{marginBottom:0}}>🔔 Price Alerts</h1>
          <button className="btn-primary" onClick={() => setShowModal(true)}>+ New Alert</button>
        </div>

        {alerts.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize:56}}>🔔</div>
            <p>No alerts yet. Create one to get notified when a stock hits your target price.</p>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map(a => (
              <div key={a.id} className={`alert-card ${a.is_triggered ? 'triggered' : ''}`}>
                <div className="alert-symbol">{a.symbol}</div>
                <div className="alert-detail">
                  Alert when price goes <strong>{a.condition}</strong> <strong>${parseFloat(a.target_price).toFixed(2)}</strong>
                </div>
                <span className={`alert-status ${a.is_triggered ? 'done' : 'active'}`}>
                  {a.is_triggered ? '✅ Triggered' : '⏳ Active'}
                </span>
                {!a.is_triggered && (
                  <button className="btn-sm danger" onClick={() => handleDelete(a.id)}>Delete</button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <AlertModal
          onClose={() => setShowModal(false)}
          onCreated={(alert) => setAlerts(prev => [alert, ...prev])}
        />
      )}
    </div>
  );
}