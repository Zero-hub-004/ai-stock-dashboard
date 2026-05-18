-- Supabase 初始化脚本
-- 在 Supabase SQL Editor 中执行

-- 创建 stock_analysis 表
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

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_stock_analysis_symbol ON stock_analysis(symbol);
CREATE INDEX IF NOT EXISTS idx_stock_analysis_created_at ON stock_analysis(created_at DESC);

-- 启用 Row Level Security (可选)
ALTER TABLE stock_analysis ENABLE ROW LEVEL SECURITY;

-- 允许匿名插入和读取
CREATE POLICY "Allow anonymous insert" ON stock_analysis
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow anonymous select" ON stock_analysis
  FOR SELECT USING (true);
