const router = require('express').Router();
const auth = require('../middleware/auth');
const { getQuote, getHistory, searchSymbol } = require('../services/alphaVantage');

router.get('/search', auth, async (req, res) => {
  try {
    const results = await searchSymbol(req.query.q);
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/quote/:symbol', auth, async (req, res) => {
  try {
    const quote = await getQuote(req.params.symbol);
    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/history/:symbol', auth, async (req, res) => {
  try {
    const history = await getHistory(req.params.symbol);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;