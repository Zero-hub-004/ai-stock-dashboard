const axios = require('axios');

const TWELVE_DATA_API_KEY = process.env.TWELVE_DATA_API_KEY || 'demo';

async function getStockQuote(symbol) {
  try {
    // 获取实时报价
    const quoteRes = await axios.get(
      `https://api.twelvedata.com/quote`,
      {
        params: {
          symbol,
          apikey: TWELVE_DATA_API_KEY
        },
        timeout: 15000
      }
    );

    if (quoteRes.data.status === 'error') {
      throw new Error(quoteRes.data.message);
    }

    const q = quoteRes.data;

    // 获取历史数据
    const historyRes = await axios.get(
      `https://api.twelvedata.com/time_series`,
      {
        params: {
          symbol,
          interval: '1day',
          outputsize: 30,
          apikey: TWELVE_DATA_API_KEY
        },
        timeout: 15000
      }
    );

    const history = (historyRes.data.values || [])
      .reverse() // Twelve Data 返回的是最新在前
      .map(d => ({
        date: d.datetime,
        open: parseFloat(d.open),
        high: parseFloat(d.high),
        low: parseFloat(d.low),
        close: parseFloat(d.close),
        volume: parseInt(d.volume)
      }));

    const currentPrice = parseFloat(q.close);
    const previousClose = parseFloat(q.previous_close);
    const change = currentPrice - previousClose;
    const changePercent = previousClose > 0 ? ((change / previousClose) * 100).toFixed(2) : '0.00';

    return {
      symbol: q.symbol,
      currency: q.currency,
      exchange: q.exchange,
      currentPrice,
      previousClose,
      open: parseFloat(q.open),
      high: parseFloat(q.high),
      low: parseFloat(q.low),
      close: currentPrice,
      volume: parseInt(q.volume),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent),
      timestamp: new Date().toISOString(),
      history
    };
  } catch (error) {
    console.error('Stock API error:', error.message);
    throw new Error(`Failed to fetch stock data for ${symbol}: ${error.message}`);
  }
}

module.exports = { getStockQuote };
