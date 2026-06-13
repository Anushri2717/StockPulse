const cron = require('node-cron');
const db = require('../config/db');
const { getQuote } = require('./alphaVantage');

const startAlertChecker = () => {
  cron.schedule('* * * * *', async () => {
    try {
      const alerts = await db.all('SELECT * FROM alerts WHERE is_triggered=0');
      if (!alerts.length) return;
      const symbols = [...new Set(alerts.map(a => a.symbol))];
      for (const symbol of symbols) {
        const quote = await getQuote(symbol).catch(() => null);
        if (!quote) continue;
        const triggered = alerts.filter(a => {
          if (a.symbol !== symbol) return false;
          return a.condition === 'above'
            ? quote.price >= a.target_price
            : quote.price <= a.target_price;
        });
        for (const alert of triggered) {
          await db.run('UPDATE alerts SET is_triggered=1 WHERE id=?', [alert.id]);
          console.log(`🔔 ALERT: ${symbol} hit $${quote.price}`);
        }
      }
    } catch (err) {
      console.error('Alert checker error:', err.message);
    }
  });
  console.log('⏰ Alert checker started');
};

module.exports = { startAlertChecker };