<template>
  <div class="app">
    <header class="header">
      <h1>🤖 AI 股票分析面板</h1>
      <p class="subtitle">输入股票代码，AI 帮你深度分析</p>
    </header>

    <main class="main">
      <StockSearch @search="handleSearch" :loading="loading" />
      
      <div v-if="error" class="error-alert">
        {{ error }}
      </div>

      <div class="content" v-if="stockData || analysisResult">
        <div class="left-panel">
          <StockInfo v-if="stockData" :data="stockData" />
          <button 
            v-if="stockData && !analysisResult" 
            class="analyze-btn"
            @click="handleAnalyze"
            :disabled="analyzing"
          >
            {{ analyzing ? 'AI 分析中...' : '🔍 AI 分析' }}
          </button>
        </div>

        <div class="right-panel">
          <AnalysisResult v-if="analysisResult" :data="analysisResult" />
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import StockSearch from './components/StockSearch.vue'
import StockInfo from './components/StockInfo.vue'
import AnalysisResult from './components/AnalysisResult.vue'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const loading = ref(false)
const analyzing = ref(false)
const error = ref('')
const stockData = ref(null)
const analysisResult = ref(null)

async function handleSearch(symbol) {
  loading.value = true
  error.value = ''
  stockData.value = null
  analysisResult.value = null

  try {
    const res = await axios.get(`${API_BASE}/stock/${symbol}`)
    stockData.value = res.data
  } catch (err) {
    error.value = err.response?.data?.error || `获取 ${symbol} 数据失败`
  } finally {
    loading.value = false
  }
}

async function handleAnalyze() {
  if (!stockData.value) return

  analyzing.value = true
  error.value = ''

  try {
    const res = await axios.post(`${API_BASE}/analysis`, {
      symbol: stockData.value.symbol,
      stockData: stockData.value
    })
    analysisResult.value = res.data.analysis
  } catch (err) {
    error.value = err.response?.data?.error || 'AI 分析失败'
  } finally {
    analyzing.value = false
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f7fa;
  min-height: 100vh;
}

.app {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 32px;
}

.header h1 {
  font-size: 2rem;
  color: #1a1a2e;
  margin-bottom: 8px;
}

.subtitle {
  color: #666;
}

.main {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.left-panel, .right-panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.analyze-btn {
  padding: 14px 32px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.analyze-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.4);
}

.analyze-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-alert {
  background: #fee;
  color: #c00;
  padding: 12px 16px;
  border-radius: 8px;
  border-left: 4px solid #c00;
}

@media (max-width: 768px) {
  .content {
    grid-template-columns: 1fr;
  }
}
</style>
