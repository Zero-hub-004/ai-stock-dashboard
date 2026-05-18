<template>
  <div class="search-box">
    <input
      v-model="inputSymbol"
      @keyup.enter="handleSearch"
      placeholder="输入股票代码，如 AAPL、600519、0700.HK"
      class="search-input"
      :disabled="loading"
    />
    <button 
      class="search-btn" 
      @click="handleSearch"
      :disabled="loading || !inputSymbol.trim()"
    >
      {{ loading ? '查询中...' : '查询' }}
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({ loading: Boolean })
const emit = defineEmits(['search'])

const inputSymbol = ref('')

function handleSearch() {
  const symbol = inputSymbol.value.trim().toUpperCase()
  if (symbol) {
    emit('search', symbol)
  }
}
</script>

<style scoped>
.search-box {
  display: flex;
  gap: 12px;
  max-width: 600px;
  margin: 0 auto;
}

.search-input {
  flex: 1;
  padding: 14px 18px;
  font-size: 1rem;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #667eea;
}

.search-input:disabled {
  background: #f0f0f0;
}

.search-btn {
  padding: 14px 28px;
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  background: #1a1a2e;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-btn:hover:not(:disabled) {
  background: #333;
}

.search-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
