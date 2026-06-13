import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useFetch, useApi } from '../hooks/useFetch';
import PriceChart from '../components/PriceChart';
import AIPanel from '../components/AIPanel';
import { usePortfolio } from '../context/PortfolioContext';

export default function StockDetail() {
  const { symbol } = useParams();
  const { data: history, loading } = useFetch(`/api/stocks/history/${symbol}`);
  const { data: quote } = useFetch(`/api/stocks/quote/${symbol}`);
  const { stocks, livePrices } = usePortfolio();
  const holding = stocks.find(s => s.symbol === symbol);
  const liveQuote = livePrices[symbol] || quote;

  return (
    <div className="page">
      <div className="container">
        <div className="detail-header">
          <div>
            <h1 className="page-title">{symbol}</h1>
            {liveQuote && (
              <div className="price-display">
                <span className="current-price">${liveQuote.price?.toFixed(2)}</span>
                <span className={`price-change ${liveQuote.change >= 0 ? 'up' : 'down'}`}>
                  {liveQuote.change >= 0 ? '▲' : '▼'} {Math.abs(liveQuote.change).toFixed(2)} ({liveQuote.changePercent})
                </span>
                <span className="live-badge">● LIVE</span>
              </div>
            )}
          </div>
          {holding && (
            <div className="holding-info">
              <div>Holding: <strong>{holding.shares} shares</strong></div>
              <div>Bought at: <strong>${parseFloat(holding.buy_price).toFixed(2)}</strong></div>
            </div>
          )}
        </div>

        {/* Chart */}
        <div className="chart-section">
          <h2 className="section-title">30-Day Price History</h2>
          {loading ? (
            <div className="loading">Loading chart...</div>
          ) : (
            <PriceChart data={history || []} symbol={symbol} />
          )}
        </div>

        {/* AI Analysis */}
        {holding && liveQuote && history && (
          <AIPanel
            symbol={symbol}
            history={history}
            currentPrice={liveQuote.price}
            buyPrice={parseFloat(holding.buy_price)}
          />
        )}
      </div>
    </div>
  );
}