import { usePortfolio } from '../context/PortfolioContext';
import { useWebSocket } from '../hooks/useWebSocket';
import StockCard from '../components/StockCard';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { stocks, totalValue, totalCost, totalGainLoss, totalGainLossPct, loading } = usePortfolio();
  const symbols = [...new Set(stocks.map(s => s.symbol))];

  // Connect WebSocket for all portfolio symbols
  useWebSocket(symbols);

  const isGain = totalGainLoss >= 0;

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Dashboard</h1>

        {/* Summary Cards */}
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-label">Portfolio Value</div>
            <div className="summary-value">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Total Invested</div>
            <div className="summary-value">${totalCost.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className={`summary-card ${isGain ? 'gain' : 'loss'}`}>
            <div className="summary-label">Total Gain / Loss</div>
            <div className="summary-value">
              {isGain ? '+' : ''}{totalGainLoss.toFixed(2)} ({isGain ? '+' : ''}{totalGainLossPct}%)
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-label">Stocks Held</div>
            <div className="summary-value">{stocks.length}</div>
          </div>
        </div>

        {/* Stock Cards */}
        <div className="section-header">
          <h2 className="section-title">My Portfolio</h2>
          <Link to="/portfolio" className="btn-outline">Manage →</Link>
        </div>

        {loading ? (
          <div className="loading">Loading portfolio...</div>
        ) : stocks.length === 0 ? (
          <div className="empty-state">
            <div style={{ fontSize: 56 }}>📈</div>
            <p>No stocks yet. <Link to="/portfolio">Add your first stock</Link></p>
          </div>
        ) : (
          <div className="stocks-grid">
            {stocks.map(stock => (
              <StockCard key={stock.id} stock={stock} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}