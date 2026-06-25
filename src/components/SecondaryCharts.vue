<template>
  <div class="secondary-charts">
    <div class="grid-layout">
      <!-- Converters Panel -->
      <div class="chart-container glass-panel">
        <div class="chart-header">
          <h3>Converter Outputs (KW)</h3>
          <div class="legend-mini">
            <span class="legend-item"><span class="dot" style="background: #ef4444"></span>C1</span>
            <span class="legend-item"><span class="dot" style="background: #10b981"></span>C2</span>
            <span class="legend-item"><span class="dot" style="background: #3b82f6"></span>C3</span>
          </div>
        </div>
        <div class="chart-wrapper">
          <v-chart class="chart" :option="convertersOption" autoresize />
        </div>
      </div>

      <!-- Pressures Panel -->
      <div class="chart-container glass-panel">
        <div class="chart-header">
          <h3>Hydrogen Pressures (BAR)</h3>
        </div>
        <div class="chart-wrapper">
          <v-chart class="chart" :option="pressuresOption" autoresize />
        </div>
      </div>
      
      <!-- Misc Panel -->
      <div class="chart-container glass-panel">
        <div class="chart-header">
          <h3>System Metrics</h3>
        </div>
        <div class="chart-wrapper">
          <v-chart class="chart" :option="miscOption" autoresize />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import VChart from 'vue-echarts';

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const defaultChartOpts = {
  tooltip: { trigger: 'axis', backgroundColor: 'rgba(30,41,59,0.9)', textStyle: { color: '#fff' } },
  grid: { left: '3%', right: '4%', bottom: '15%', top: '10%', containLabel: true },
  xAxis: { type: 'time', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { show: false } },
};

const convertersOption = computed(() => {
  if (!props.data || props.data.length === 0) return {};
  return {
    ...defaultChartOpts,
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } } },
    series: [
      { name: 'C1-AC1-KW', type: 'line', showSymbol: false, itemStyle: { color: '#ef4444' }, data: props.data.map(d => [d.timestamp, d['C1-AC1-KW']]) },
      { name: 'C2-AC1-KW', type: 'line', showSymbol: false, itemStyle: { color: '#10b981' }, data: props.data.map(d => [d.timestamp, d['C2-AC1-KW']]) },
      { name: 'C3-AC1-KW', type: 'line', showSymbol: false, itemStyle: { color: '#3b82f6' }, data: props.data.map(d => [d.timestamp, d['C3-AC1-KW']]) }
    ]
  };
});

const pressuresOption = computed(() => {
  if (!props.data || props.data.length === 0) return {};
  return {
    ...defaultChartOpts,
    legend: { show: true, textStyle: { color: '#94a3b8', fontSize: 10 }, bottom: 0 },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } } },
    series: [
      { name: 'Press 1', type: 'line', showSymbol: false, data: props.data.map(d => [d.timestamp, d['Hydrogen Pressure 1-BAR']]) },
      { name: 'Press 2', type: 'line', showSymbol: false, data: props.data.map(d => [d.timestamp, d['Hydrogen Pressure 2-BAR']]) },
      { name: 'Press 3', type: 'line', showSymbol: false, data: props.data.map(d => [d.timestamp, d['Hydrogen Pressure 3-BAR']]) }
    ]
  };
});

const miscOption = computed(() => {
  if (!props.data || props.data.length === 0) return {};
  return {
    ...defaultChartOpts,
    legend: { show: true, textStyle: { color: '#94a3b8', fontSize: 10 }, bottom: 0 },
    yAxis: [
      { type: 'value', name: 'g/hr', position: 'left', axisLabel: { color: '#94a3b8' }, splitLine: { lineStyle: { color: 'rgba(255,255,255,0.05)' } } },
      { type: 'value', name: '%', position: 'right', max: 100, axisLabel: { color: '#94a3b8' }, splitLine: { show: false } }
    ],
    series: [
      { name: 'Gas Flow', type: 'line', showSymbol: false, itemStyle: { color: '#8b5cf6' }, data: props.data.map(d => [d.timestamp, d['Gas Flow Rate-g/hr']]) },
      { name: 'Water Level', type: 'line', yAxisIndex: 1, showSymbol: false, itemStyle: { color: '#0ea5e9' }, data: props.data.map(d => [d.timestamp, d['Fuel Cell Water Level-percent']]) }
    ]
  };
});
</script>

<style scoped>
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.chart-container {
  padding: 1.25rem;
  height: 300px;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.chart-header h3 {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-primary);
}

.legend-mini {
  display: flex;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.chart-wrapper {
  flex-grow: 1;
  min-height: 0;
}

.chart {
  width: 100%;
  height: 100%;
}
</style>
