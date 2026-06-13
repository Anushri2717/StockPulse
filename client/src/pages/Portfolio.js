import { useState, useRef } from 'react';
import { usePortfolio } from '../context/PortfolioContext';
import { useAuth } from '../context/AuthContext';
import StockCard from '../components/StockCard';

export default function Portfolio() {
  const { stocks, addStock, loading } = usePortfolio();
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState({ shares:'', buy_price:'' });
  const [adding, setAdding] = useState(false);
  const timer = useRef(null);

  const search = (val) => {
    setQuery(val);
    clearTimeout(timer.current);
    if (!val.trim()) { setResults([]); return; }
    timer.current = setTimeout(async () => {
      const res = await fetch(`/api/stocks/search?q=${val}`, { headers:{Authorization:`Bearer ${token}`} });
      const data = await res.json();
      setResults(data);
    }, 400);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!selected) return;
    setAdding(true);
    await addStock(selected.symbol, form.shares, form.buy_price);
    setSelected(null); setForm({shares:'',buy_price:''}); setQuery(''); setResults([]);
    setAdding(false);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">My Portfolio</h1>

        {/* Add Stock */}
        <div className="ai-panel" style={{ marginBottom: 32 }}>
          <h2 className="section-title" style={{ marginBottom: 16 }}>➕ Add Stock</h2>
          <div className="search-box">
            <span className="search-icon">🔍</span>
            <input
              className="search-input-field"
              placeholder="Search symbol or company name (e.g. Apple, AAPL)"
              value={query}
              onChange={e => search(e.target.value)}
            />
            {results.length > 0 && (
              <div className="search-results">
                {results.map(r => (
                  <div key={r.symbol} className="search-result-item"
                    onClick={() => { setSelected(r); setQuery(r.name); setResults([]); }}>
                    <span className="result-symbol">{r.symbol}</span>
                    <span className="result-name">{r.name} · {r.region}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selected && (
            <form onSubmit={handleAdd} style={{ display:'flex', gap:12, marginTop:12, flexWrap:'wrap', alignItems:'flex-end' }}>
              <div className="form-group" style={{ flex:1, minWidth:120 }}>
                <label>Shares</label>
                <input type="number" placeholder="e.g. 10" step="0.0001" min="0.0001"
                  value={form.shares} onChange={e=>setForm({...form,shares:e.target.value})} required />
              </div>
              <div className="form-group" style={{ flex:1, minWidth:120 }}>
                <label>Buy Price ($)</label>
                <input type="number" placeholder="e.g. 182.50" step="0.01" min="0.01"
                  value={form.buy_price} onChange={e=>setForm({...form,buy_price:e.target.value})} required />
              </div>
              <button type="submit" className="btn-primary" disabled={adding}>
                {adding ? '⏳ Adding...' : `Add ${selected.symbol}`}
              </button>
            </form>
          )}
        </div>

        {/* Stock List */}
        {loading ? (
          <div className="loading">Loading portfolio...</div>
        ) : stocks.length === 0 ? (
          <div className="empty-state">
            <div style={{fontSize:56}}>📊</div>
            <p>Search above to add your first stock!</p>
          </div>
        ) : (
          <div className="stocks-grid">
            {stocks.map(s => <StockCard key={s.id} stock={s} />)}
          </div>
        )}
      </div>
    </div>
  );
}