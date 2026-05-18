const express = require('express');
const { getStockQuote, getStockHistory } = require('../services/stockService');

const router = express.Router();

// GET /api/stock/:symbol - 获取股票行情
router.get('/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const data = await getStockQuote(symbol);
    res.json(data);
  } catch (error) {
    console.error('Stock route error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
