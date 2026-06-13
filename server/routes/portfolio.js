const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');
const { getQuote } = require('../services/alphaVantage');

router.get('/', auth, async (req, res) => {
  try {
    const rows = await db.all('SELECT * FROM portfolios WHERE user_id=? ORDER BY bought_at DESC', [req.user.id]);
    res.json(rows);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { symbol, shares, buy_price } = req.body;
  try {
    const quote = await getQuote(symbol.toUpperCase());
    const company_name = quote?.name || symbol.toUpperCase();
    const result = await db.run(
      'INSERT INTO portfolios(user_id,symbol,company_name,shares,buy_price) VALUES(?,?,?,?,?)',
      [req.user.id, symbol.toUpperCase(), company_name, shares, buy_price]
    );
    const stock = await db.get('SELECT * FROM portfolios WHERE id=?', [result.lastInsertRowid]);
    res.json(stock);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.run('DELETE FROM portfolios WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;