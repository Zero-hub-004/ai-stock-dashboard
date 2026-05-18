<template>
  <div class="stock-card">
    <div class="stock-header">
      <h2>{{ data.symbol }}</h2>
      <span class="exchange">{{ data.exchange }}</span>
    </div>
    
    <div class="price-row">
      <div class="current-price">
        <span class="price">{{ formatPrice(data.currentPrice) }}</span>
        <span class="currency">{{ data.currency }}</span>
      </div>
      <div class="change" :class="changeClass">
        <span class="change-value">{{ data.change >= 0 ? '+' : '' }}{{ data.change }}</span>
        <span class="change-percent">({{ data.change >= 0 ? '+' : '' }}{{ data.changePercent }}%)</span>
      </div>
    </div>

    <div class="details-grid">
      <div class="detail-item">
        <span class="label">开盘</span>
        <span class="value">{{ formatPrice(data.open) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">最高</span>
        <span class="value">{{ formatPrice(data.high) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">最低</span>
        <span class="value">{{ formatPrice(data.low) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">收盘</span>
        <span class="value">{{ formatPrice(data.close) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">成交量</span>
        <span class="value">{{ formatVolume(data.volume) }}</span>
      </div>
      <div class="detail-item">
        <span class="label">昨收</span>
        <span class="value">{{ formatPrice(data.previousClose) }}</span>
      </div>
    </div>

    <div class="chart-container" v-if="data.history">
      <h3>近30天走势</h3>
      <div class="mini-chart">
        <svg viewBox="0 0 300 100" preserveAspectRatio="none">
          <polyline
            :points="getChartPoints(data.history)"
            fill="none"
            :stroke="data.change >= 0 ? '#e74c3c' : '#2ecc71'"
            stroke-width="2"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: { type: Object, required: true }
})

function formatPrice(price) {
  return price ? price.toFixed(2) : '-'
}

function formatVolume(vol) {
  if (!vol) return '-'
  if (vol >= 1e8) return (vol / 1e8).toFixed(2) + '亿'
  if (vol >= 1e4) return (vol / 1e4).toFixed(2) + '万'
  return vol.toString()
}

const changeClass = props.data.change >= 0 ? 'up' : 'down'

function getChartPoints(history) {
  if (!history || history.length < 2) return ''
  const closes = history.map(d => d.close).filter(c => c !== null)
  if (closes.length < 2) return ''
  
  const min = Math.min(...closes)
  const max = Math.max(...closes)
  const range = max - min || 1
  
  return closes.map((val, i) => {
    const x = (i / (closes.length - 1)) * 300
    const y = 100 - ((val - min) / range) * 90 - 5
    return `${x},${y}`
  }).join(' ')
}
</script>

<style scoped>
.stock-card {
  background: #fff;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.06);
}

.stock-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.stock-header h2 {
  font-size: 1.5rem;
  color: #1a1a2e;
}

.exchange {
  font-size: 0.8rem;
  color: #999;
  background: #f0f0f0;
  padding: 4px 10px;
  border-radius: 12px;
}

.price-row {
  display: flex;
  align-items: baseline;
  gap: 16px;
  margin-bottom: 20px;
}

.current-price {
  display: flex;
  align-items: baseline;
  gap: 4px;
}

.price {
  font-size: 2.2rem;
  font-weight: 700;
  color: #1a1a2e;
}

.currency {
  font-size: 1rem;
  color: #666;
}

.change {
  font-size: 1.1rem;
  font-weight: 600;
}

.change.up {
  color: #e74c3c;
}

.change.down {
  color: #2ecc71;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #eee;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.label {
  font-size: 0.8rem;
  color: #999;
}

.value {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.chart-container {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #eee;
}

.chart-container h3 {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.mini-chart {
  height: 80px;
  background: #fafafa;
  border-radius: 8px;
  overflow: hidden;
}

.mini-chart svg {
  width: 100%;
  height: 100%;
}
</style>
