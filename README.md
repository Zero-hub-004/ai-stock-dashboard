# 🤖 AI 股票分析面板

一个全栈应用，输入股票代码，调用免费 API 获取行情数据，再通过 LLM 进行 AI 智能分析。

## 🌐 在线访问

> 部署后在此填写在线 URL

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
| 股票 API | Twelve Data (免费 800次/天) |
| LLM API | OpenAI GPT-3.5 |
| 数据库 | Supabase (PostgreSQL) |
| 部署 | Render.com |

## 📋 已配置 API Keys

```
OPENAI_API_KEY         = ✅ 已配置
TWELVE_DATA_API_KEY    = ✅ 已配置 (9e513ef98ad04b6488a364cdb58d6173)
SUPABASE_URL           = ✅ 已配置 (https://orouwfqfgitffntfzbvj.supabase.co)
SUPABASE_ANON_KEY      = ⬜ 待填写（在 Supabase 后台复制）
```

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
# 编辑 backend/.env 填入你的 API Key

# 4. 启动后端
cd backend
npm run dev

# 5. 启动前端（新终端）
cd frontend
npm run dev
```

访问 http://localhost:5173

## 🗄️ Supabase 数据库初始化

在 Supabase 后台 → **SQL Editor** 中执行：

```sql
CREATE TABLE IF NOT EXISTS stock_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol TEXT NOT NULL,
  stock_data JSONB NOT NULL,
  summary TEXT NOT NULL,
  sentiment TEXT NOT NULL CHECK (sentiment IN ('Bullish', 'Neutral', 'Bearish')),
  risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High')),
  raw_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_symbol ON stock_analysis(symbol);
CREATE INDEX IF NOT EXISTS idx_created_at ON stock_analysis(created_at DESC);

ALTER TABLE stock_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all insert" ON stock_analysis FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow all select" ON stock_analysis FOR SELECT USING (true);
```

## 🤖 Prompt 设计

### 系统 Prompt（强制 JSON 输出）

```javascript
const systemPrompt = `You are a professional stock analyst. Return ONLY valid JSON.

Rules:
1. Return ONLY valid JSON. No markdown, no explanations.
2. sentiment: "Bullish" | "Neutral" | "Bearish"
3. risk_level: "Low" | "Medium" | "High"
4. summary: 2-3 sentences in Chinese
5. key_points: array of 3 strings

JSON format:
{
  "summary": "string",
  "sentiment": "Bullish|Neutral|Bearish",
  "risk_level": "Low|Medium|High",
  "key_points": ["string", "string", "string"]
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
return JSON.parse(cleanJson);
```

## 🐛 Debug 记录

### Bug 1: Yahoo Finance 403 错误
**现象**: Yahoo Finance API 返回 403 Forbidden
**解决**: 改用 Twelve Data API，demo key 可用（`https://api.twelvedata.com`）

### Bug 2: CORS 跨域问题
**现象**: 浏览器报 CORS 错误
**解决**: Express 安装 `cors` 中间件

### Bug 3: LLM 返回非 JSON
**现象**: LLM 返回 markdown 代码块包裹的 JSON
**解决**: 正则清理 ` ```json ` 标记

### Bug 4: 网络代理导致连接失败
**现象**: `ENOTFOUND` 或 `502` 错误
**解决**: 部署到 Render，云端网络无代理限制

## 📁 项目结构

```
ai-stock-dashboard/
├── backend/
│   ├── src/
│   │   ├── index.js
│   │   ├── routes/stock.js
│   │   ├── routes/analysis.js
│   │   └── services/
│   │       ├── stockService.js      # Twelve Data
│   │       ├── llmService.js        # OpenAI
│   │       └── supabaseService.js   # 数据库
│   ├── .env                         # 敏感信息
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── App.vue
│   │   └── components/
│   │       ├── StockSearch.vue
│   │       ├── StockInfo.vue
│   │       └── AnalysisResult.vue
│   └── package.json
├── supabase/init.sql
├── render.yaml
└── README.md
```

## 🚀 部署到 Render

1. 推送代码到 GitHub（代码已提交，需手动 push）
2. 登录 https://render.com，用 GitHub 关联仓库
3. 创建 **Web Service**：
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
4. 添加环境变量（在 Render Dashboard）：
   - `OPENAI_API_KEY` = 你的 key
   - `SUPABASE_URL` = `https://orouwfqfgitffntfzbvj.supabase.co`
   - `SUPABASE_ANON_KEY` = 你的 anon key
   - `TWELVE_DATA_API_KEY` = `9e513ef98ad04b6488a364cdb58d6173`
5. 部署完成，复制 URL 到 README

## 🔑 环境变量说明

| 变量 | 说明 | 获取方式 |
|------|------|----------|
| OPENAI_API_KEY | LLM 接口 | platform.openai.com/api-keys |
| TWELVE_DATA_API_KEY | 股票数据 | twelvedata.com（免费注册） |
| SUPABASE_URL | 数据库地址 | Supabase 项目设置 |
| SUPABASE_ANON_KEY | 客户端 Key | Supabase 项目设置 → API |

## 📄 License

MIT
