import { useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { usePortfolio } from '../context/PortfolioContext';

export const useWebSocket = (symbols = []) => {
  const { user } = useAuth();
  const { updateLivePrice } = usePortfolio();
  const ws = useRef(null);

  useEffect(() => {
    if (!user || symbols.length === 0) return;

    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    ws.current = new WebSocket(`${protocol}://localhost:5000/ws`);

    ws.current.onopen = () => {
      // Subscribe to all symbols
      symbols.forEach(symbol => {
        ws.current.send(JSON.stringify({
          type: 'SUBSCRIBE',
          symbol,
          userId: user.id
        }));
      });
    };

    ws.current.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'PRICE_UPDATE') {
        updateLivePrice(msg.symbol, msg.quote);
      }
    };

    ws.current.onerror = (e) => console.error('WS error:', e);

    return () => {
      symbols.forEach(symbol => {
        ws.current?.send(JSON.stringify({
          type: 'UNSUBSCRIBE',
          symbol,
          userId: user.id
        }));
      });
      ws.current?.close();
    };
  }, [user, symbols.join(',')]);

  return ws.current;
};