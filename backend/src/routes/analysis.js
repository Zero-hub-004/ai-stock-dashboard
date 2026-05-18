const express = require('express');
const { analyzeStock } = require('../services/llmService');
const { saveAnalysis, getAnalysisHistory } = require('../services/supabaseService');

const router = express.Router();

// POST /api/analysis - AI 分析股票
router.post('/', async (req, res) => {
  try {
    const { symbol, stockData } = req.body;
    
    if (!symbol || !stockData) {
      return res.status(400).json({ error: 'Missing symbol or stockData' });
    }

    // 调用 LLM 分析
    const analysis = await analyzeStock(symbol, stockData);
    
    // 保存到 Supabase
    const saved = await saveAnalysis({
      symbol,
      stock_data: stockData,
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      risk_level: analysis.risk_level,
      raw_response: analysis
    });

    res.json({
      success: true,
      analysis,
      saved_id: saved.id
    });
  } catch (error) {
    console.error('Analysis route error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analysis/history - 获取历史分析
router.get('/history', async (req, res) => {
  try {
    const data = await getAnalysisHistory();
    res.json(data);
  } catch (error) {
    console.error('History route error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
