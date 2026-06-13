const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAISuggestion } = require('../services/aiAnalysis');

router.post('/suggest', auth, async (req, res) => {
  try {
    const suggestion = await getAISuggestion(req.body);
    res.json({ suggestion });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;