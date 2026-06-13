import { Link } from 'react-router-dom';
import { usePortfolio } from '../context/PortfolioContext';

export default function StockCard({ stock }) {
  const { livePrices, removeStock } = usePortfolio();
  const live = livePrices[stock.symbol];
  const currentPrice = live?.price || parseFloat(stock.buy_price);
  const buyPrice = parseFloat(stock.buy_price);
  const shares = parseFloat(stock.shares);
  const currentValue = currentPrice * shares;
  const costBasis = buyPrice * shares;
  const gainLoss = currentValue - costBasis;
  const gainLossPct = ((gainLoss / costBasis) * 100).toFixed(2);
  const isGain = gainLoss >= 0;

  return (
    <div className={`stock-card ${live ? 'live' : ''}`}>
      <div className="stock-card-header">
        <div>
          <div className="stock-symbol">{stock.symbol}</div>
          <div className="stock-name">{stock.company_name}</div>
        </div>
        <div className="stock-price-block">
          <div className="stock-price">${currentPrice.toFixed(2)}</div>
          {live && (
            <div className={`stock-change ${live.change >= 0 ? 'up' : 'down'}`}>
              {live.change >= 0 ? '▲' : '▼'} {live.changePercent}
            </div>
          )}
        </div>
      </div>

      <div className="stock-card-body">
        <div className="stock-stat">
          <span>Shares</span><strong>{shares}</strong>
        </div>
        <div className="stock-stat">
          <span>Avg Cost</span><strong>${buyPrice.toFixed(2)}</strong>
        </div>
        <div className="stock-stat">
          <span>Value</span><strong>${currentValue.toFixed(2)}</strong>
        </div>
        <div className={`stock-stat ${isGain ? 'gain' : 'loss'}`}>
          <span>P&L</span>
          <strong>{isGain ? '+' : ''}{gainLoss.toFixed(2)} ({isGain ? '+' : ''}{gainLossPct}%)</strong>
        </div>
      </div>

      <div className="stock-card-footer">
        <Link to={`/stock/${stock.symbol}`} className="btn-sm">View Chart</Link>
        <button className="btn-sm danger" onClick={() => removeStock(stock.id)}>Remove</button>
      </div>
    </div>
  );
}