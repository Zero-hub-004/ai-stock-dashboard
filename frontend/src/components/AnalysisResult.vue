<template>
  <div class="analysis-card">
    <div class="analysis-header">
      <h2>🧠 AI 分析结果</h2>
      <div class="badges">
        <span class="badge sentiment" :class="data.sentiment.toLowerCase()">
          {{ sentimentLabel }}
        </span>
        <span class="badge risk" :class="data.risk_level.toLowerCase()">
          风险: {{ riskLabel }}
        </span>
      </div>
    </div>

    <div class="summary">
      <h3>📋 分析总结</h3>
      <p>{{ data.summary }}</p>
    </div>

    <div class="key-points" v-if="data.key_points && data.key_points.length">
      <h3>💡 关键要点</h3>
      <ul>
        <li v-for="(point, i) in data.key_points" :key="i">{{ point }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  data: { type: Object, required: true }
})

const sentimentLabel = computed(() => {
  const map = { 'Bullish': '看多', 'Neutral': '中性', 'Bearish': '看空' }
  return map[props.data.sentiment] || props.data.sentiment
})

const riskLabel = computed(() => {
  const map = { 'Low': '低', 'Medium': '中', 'High': '高' }
  return map[props.data.risk_level] || props.data.risk_level
})
</script>

<style scoped>
.analysis-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.analysis-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.analysis-header h2 {
  font-size: 1.3rem;
  color: #1a1a2e;
}

.badges {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.sentiment.bullish {
  background: #fff0f0;
  color: #e74c3c;
}

.sentiment.neutral {
  background: #f0f0f0;
  color: #666;
}

.sentiment.bearish {
  background: #f0fff0;
  color: #2ecc71;
}

.risk.low {
  background: #e8f5e9;
  color: #27ae60;
}

.risk.medium {
  background: #fff3e0;
  color: #f39c12;
}

.risk.high {
  background: #ffebee;
  color: #c0392b;
}

.summary {
  margin-bottom: 20px;
}

.summary h3 {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 8px;
}

.summary p {
  color: #555;
  line-height: 1.7;
  font-size: 0.95rem;
}

.key-points h3 {
  font-size: 0.95rem;
  color: #333;
  margin-bottom: 8px;
}

.key-points ul {
  list-style: none;
  padding: 0;
}

.key-points li {
  padding: 8px 0;
  padding-left: 20px;
  position: relative;
  color: #555;
  line-height: 1.6;
  border-bottom: 1px solid #f5f5f5;
}

.key-points li:last-child {
  border-bottom: none;
}

.key-points li::before {
  content: '▸';
  position: absolute;
  left: 0;
  color: #667eea;
}
</style>
