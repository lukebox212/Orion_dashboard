<script setup>
import { computed, ref } from 'vue'
import { Bar, Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useChartSeries } from '../composables/useChartSeries'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
)

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
})

const chartType = ref('bar')
const xKey = ref('')
const yKey = ref('')

const availableHeaders = computed(() => props.headers || [])

const chartData = computed(() => {
  if (!props.rows.length) return { labels: [], datasets: [] }

  if (!xKey.value || !availableHeaders.value.includes(xKey.value)) {
    xKey.value = availableHeaders.value[0] || ''
  }

  if (!yKey.value || !availableHeaders.value.includes(yKey.value)) {
    yKey.value = availableHeaders.value[1] || availableHeaders.value[0] || ''
  }

  if (!xKey.value || !yKey.value) {
    return { labels: [], datasets: [] }
  }

  return useChartSeries(props.rows, xKey.value, yKey.value)
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
}
</script>

<template>
  <section class="card">
    <h2>Build Chart</h2>

    <div class="controls">
      <label>
        X-axis column
        <select v-model="xKey">
          <option v-for="header in availableHeaders" :key="header" :value="header">
            {{ header }}
          </option>
        </select>
      </label>

      <label>
        Y-axis column
        <select v-model="yKey">
          <option v-for="header in availableHeaders" :key="header" :value="header">
            {{ header }}
          </option>
        </select>
      </label>

      <label>
        Chart type
        <select v-model="chartType">
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
      </label>
    </div>

    <div class="chart-shell">
      <Bar v-if="chartType === 'bar'" :data="chartData" :options="chartOptions" />
      <Line v-else :data="chartData" :options="chartOptions" />
    </div>
  </section>
</template>

<style scoped>
.card {
  background: #ffffff;
  border: 1px solid #d7deea;
  border-radius: 12px;
  padding: 1rem;
}

.controls {
  display: grid;
  grid-template-columns: repeat(3, minmax(160px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1rem;
}

label {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.9rem;
}

select {
  height: 2rem;
}

.chart-shell {
  height: 380px;
}

@media (max-width: 900px) {
  .controls {
    grid-template-columns: 1fr;
  }
}
</style>
