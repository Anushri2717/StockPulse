const WebSocket = require('ws');
const { getQuote } = require('./alphaVantage');

const clients = new Map();
const watchlist = new Map();

const initWebSocket = (server) => {
  const wss = new WebSocket.Server({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    ws.on('message', async (raw) => {
      try {
        const msg = JSON.parse(raw);
        if (msg.type === 'SUBSCRIBE') {
          clients.set(msg.userId, ws);
          if (!watchlist.has(msg.symbol)) watchlist.set(msg.symbol, new Set());
          watchlist.get(msg.symbol).add(msg.userId);
        }
        if (msg.type === 'UNSUBSCRIBE') {
          watchlist.get(msg.symbol)?.delete(msg.userId);
        }
      } catch {}
    });

    ws.on('close', () => {
      clients.forEach((client, userId) => {
        if (client === ws) {
          clients.delete(userId);
          watchlist.forEach(users => users.delete(userId));
        }
      });
    });
  });

  // Push live prices every 30 seconds
  setInterval(async () => {
    for (const [symbol, userIds] of watchlist.entries()) {
      if (!userIds.size) continue;
      try {
        const quote = await getQuote(symbol);
        if (!quote) continue;
        const payload = JSON.stringify({ type: 'PRICE_UPDATE', symbol, quote });
        userIds.forEach(userId => {
          const ws = clients.get(userId);
          if (ws?.readyState === WebSocket.OPEN) ws.send(payload);
        });
      } catch {}
    }
  }, 30000);

  console.log('📡 WebSocket server ready');
};

module.exports = { initWebSocket };