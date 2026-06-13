const router = require('express').Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    res.json(await db.all('SELECT * FROM alerts WHERE user_id=? ORDER BY created_at DESC', [req.user.id]));
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.post('/', auth, async (req, res) => {
  const { symbol, target_price, condition } = req.body;
  try {
    const result = await db.run(
      'INSERT INTO alerts(user_id,symbol,target_price,condition) VALUES(?,?,?,?)',
      [req.user.id, symbol.toUpperCase(), target_price, condition]
    );
    const alert = await db.get('SELECT * FROM alerts WHERE id=?', [result.lastInsertRowid]);
    res.json(alert);
  } catch (err) { res.status(500).json({ message: err.message }); }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    await db.run('DELETE FROM alerts WHERE id=? AND user_id=?', [req.params.id, req.user.id]);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ message: err.message }); }
});

module.exports = router;