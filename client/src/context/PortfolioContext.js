import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PortfolioContext = createContext();

export const PortfolioProvider = ({ children }) => {
  const { token } = useAuth();
  const [stocks, setStocks] = useState([]);
  const [livePrices, setLivePrices] = useState({});
  const [loading, setLoading] = useState(false);

  const fetchPortfolio = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/portfolio', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setStocks(data);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const updateLivePrice = (symbol, quote) => {
    setLivePrices(prev => ({ ...prev, [symbol]: quote }));
  };

  const addStock = async (symbol, shares, buy_price) => {
    const res = await fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ symbol, shares, buy_price })
    });
    const data = await res.json();
    setStocks(prev => [data, ...prev]);
    return data;
  };

  const removeStock = async (id) => {
    await fetch(`/api/portfolio/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setStocks(prev => prev.filter(s => s.id !== id));
  };

  // Calculate total portfolio value
  const totalValue = stocks.reduce((sum, s) => {
    const price = livePrices[s.symbol]?.price || parseFloat(s.buy_price);
    return sum + price * parseFloat(s.shares);
  }, 0);

  const totalCost = stocks.reduce((sum, s) => {
    return sum + parseFloat(s.buy_price) * parseFloat(s.shares);
  }, 0);

  const totalGainLoss = totalValue - totalCost;
  const totalGainLossPct = totalCost > 0 ? ((totalGainLoss / totalCost) * 100).toFixed(2) : '0.00';

  useEffect(() => { fetchPortfolio(); }, [token]);

  return (
    <PortfolioContext.Provider value={{
      stocks, livePrices, loading,
      fetchPortfolio, addStock, removeStock, updateLivePrice,
      totalValue, totalCost, totalGainLoss, totalGainLossPct
    }}>
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => useContext(PortfolioContext);