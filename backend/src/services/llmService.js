const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.GROQ_API_KEY,
  baseURL: process.env.GROQ_API_KEY ? 'https://api.groq.com/openai/v1' : undefined
});

async function analyzeStock(symbol, stockData) {
  const prompt = buildAnalysisPrompt(symbol, stockData);

  const response = await openai.chat.completions.create({
    model: process.env.GROQ_API_KEY ? 'llama3-70b-8192' : 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: `You are a professional stock analyst. Analyze the provided stock data and return a STRICT JSON response.

Rules:
1. Return ONLY valid JSON. No markdown, no explanations outside JSON.
2. sentiment must be exactly one of: "Bullish", "Neutral", or "Bearish"
3. risk_level must be exactly one of: "Low", "Medium", or "High"
4. summary should be a concise 2-3 sentence analysis in Chinese
5. Do not include any text before or after the JSON

Expected JSON format:
{
  "summary": "string",
  "sentiment": "Bullish|Neutral|Bearish",
  "risk_level": "Low|Medium|High",
  "key_points": ["string", "string", ...]
}`
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.3,
    max_tokens: 500
  });

  const content = response.choices[0].message.content.trim();

  // Clean up potential markdown code blocks
  const cleanJson = content
    .replace(/^```json\s*/, '')
    .replace(/```\s*$/, '')
    .trim();

  try {
    return JSON.parse(cleanJson);
  } catch (error) {
    console.error('JSON parse error:', error.message);
    console.error('Raw content:', content);
    throw new Error(`LLM response is not valid JSON: ${error.message}`);
  }
}

function buildAnalysisPrompt(symbol, stockData) {
  return `请分析以下股票数据，并返回严格 JSON 格式：

股票代码: ${symbol}
当前价格: ${stockData.currentPrice} ${stockData.currency}
涨跌额: ${stockData.change}
涨跌幅: ${stockData.changePercent}%
开盘价: ${stockData.open}
最高价: ${stockData.high}
最低价: ${stockData.low}
收盘价: ${stockData.close}
成交量: ${stockData.volume}
交易所: ${stockData.exchange}

近30天历史数据: ${JSON.stringify(stockData.history.slice(-10))}

请从技术面、基本面和市场情绪角度给出专业分析。`;
}

module.exports = { analyzeStock, buildAnalysisPrompt };
