# 🤖 AI 股票分析面板

一个全栈应用，输入股票代码，调用免费 API 获取行情数据，再通过 LLM 进行 AI 智能分析。

## 🌐 在线访问

- **前端页面**: `https://ai-stock-dashboard-frontend.onrender.com` (待部署)
- **API 服务**: `https://ai-stock-dashboard-api.onrender.com` (待部署)

## ✨ 功能

1. **股票数据查询** - 输入股票代码，实时获取行情数据（价格、涨跌、成交量等）
2. **AI 智能分析** - 调用 LLM API，基于技术面和基本面给出专业分析
3. **结构化输出** - LLM 返回严格 JSON 格式：summary / sentiment / risk_level
4. **数据持久化** - 分析结果自动保存到 Supabase 数据库

## 🛠️ 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Vue 3 + Vite |
| 后端 | Node.js + Express |
| 股票 API | Yahoo Finance (免费) |
| LLM API | OpenAI / Groq (免费额度) |
| 数据库 | Supabase (PostgreSQL) |
| 部署 | Render.com |

## 📦 本地运行

```bash
# 1. 克隆仓库
git clone https://github.com/Zero-hub-004/ai-stock-dashboard.git
cd ai-stock-dashboard

# 2. 安装依赖
cd backend && npm install
cd ../frontend && npm install

# 3. 配置环境变量
cp backend/.env.example backend/.env
# 编辑 .env 填入你的 API Key

# 4. 启动后端
cd backend
npm run dev

# 5. 启动前端（新终端）
cd frontend
npm run dev
```

## 🤖 Prompt 设计

### 强制 LLM 返回严格 JSON 的核心 Prompt

```javascript
const systemPrompt = `You are a professional stock analyst. Analyze the provided stock data and return a STRICT JSON response.

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
}`;
```

### 关键处理逻辑

```javascript
// 清理 LLM 可能返回的 markdown 代码块
const cleanJson = content
  .replace(/^```json\s*/, '')
  .replace(/```\s*$/, '')
  .trim();

// 严格 JSON 解析
try {
  return JSON.parse(cleanJson);
} catch (error) {
  throw new Error(`LLM response is not valid JSON: ${error.message}`);
}
```

## 🐛 Debug 记录

### Bug 1: CORS 跨域问题

**现象**: 前端调用后端 API 时浏览器报 CORS 错误
```
Access to fetch at 'http://localhost:3000/api/stock/AAPL' 
from origin 'http://localhost:5173' has been blocked by CORS policy
```

**原因**: Express 默认不启用跨域，前端和后端运行在不同端口

**解决**: 安装 `cors` 中间件
```javascript
const cors = require('cors');
app.use(cors());
```

### Bug 2: LLM 返回非 JSON 格式

**现象**: LLM 有时会在 JSON 外面包一层 markdown 代码块，如：
```json
{ "summary": "..." }
```

**解决**: 正则清理 markdown 标记
```javascript
const cleanJson = content
  .replace(/^```json\s*/, '')
  .replace(/```\s*$/, '')
  .trim();
```

### Bug 3: Yahoo Finance API 返回空数据

**现象**: 某些港股代码（如 0700.HK）返回 404

**解决**: Yahoo Finance 使用 `.HK` 后缀，但需确保代码格式正确。已在代码中添加 try-catch 和详细错误信息。

## 📁 项目结构

```
ai-stock-dashboard/
├── backend/
│   ├── src/
│   │   ├── index.js           # Express 入口
│   │   ├── routes/
│   │   │   ├── stock.js       # 股票数据路由
│   │   │   └── analysis.js    # AI 分析路由
│   │   └── services/
│   │       ├── stockService.js   # Yahoo Finance API
│   │       ├── llmService.js     # LLM 调用
│   │       └── supabaseService.js # 数据库操作
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── App.vue
│   │   ├── components/
│   │   │   ├── StockSearch.vue
│   │   │   ├── StockInfo.vue
│   │   │   └── AnalysisResult.vue
│   │   └── main.js
│   ├── index.html
│   └── package.json
├── supabase/init.sql          # 数据库初始化脚本
├── render.yaml                # Render 部署配置
└── README.md
```

## 🔑 环境变量

在 `backend/.env` 中配置：

```env
PORT=3000
OPENAI_API_KEY=sk-xxx
# 或
GROQ_API_KEY=gsk_xxx
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_ANON_KEY=eyJ...
```

> 💡 推荐先用 **Groq**（免费，速度快），用完了再用 OpenAI

## 🚀 部署到 Render

1. 推送代码到 GitHub
2. 在 Render 创建 Web Service，关联 GitHub 仓库
3. 添加环境变量
4. 部署完成获取 URL

## 📄 License

MIT
