<template>
  <div class="chart-container glass-panel">
    <div class="chart-header">
      <h2>Main Parameters</h2>
    </div>
    <div class="chart-wrapper">
      <v-chart class="chart" :option="chartOption" autoresize />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { use, registerTheme } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  DataZoomComponent
]);

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
});

const chartOption = computed(() => {
  if (!props.data || props.data.length === 0) return {};

  const dates = props.data.map(d => d.timestamp);
  
  return {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 41, 59, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      textStyle: {
        color: '#f8fafc'
      }
    },
    legend: {
      data: ['Fuel Cell Power (KW)', '40 kW Target', 'Battery Power (KW)', 'Battery SoC (%)'],
      textStyle: {
        color: '#94a3b8'
      },
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100,
        borderColor: 'rgba(255,255,255,0.1)',
        textStyle: {
          color: '#94a3b8'
        }
      }
    ],
    xAxis: {
      type: 'time',
      boundaryGap: false,
      axisLabel: {
        color: '#94a3b8'
      },
      splitLine: {
        show: false
      }
    },
    yAxis: [
      {
        type: 'value',
        name: 'Power (KW)',
        position: 'left',
        nameTextStyle: {
          color: '#94a3b8'
        },
        axisLabel: {
          color: '#94a3b8'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255, 255, 255, 0.1)'
          }
        }
      },
      {
        type: 'value',
        name: 'SoC (%)',
        position: 'right',
        max: 100,
        min: 0,
        nameTextStyle: {
          color: '#94a3b8'
        },
        axisLabel: {
          color: '#94a3b8'
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: 'Fuel Cell Power (KW)',
        type: 'line',
        showSymbol: false,
        smooth: true,
        itemStyle: {
          color: '#10b981' // var(--chart-fuel-cell)
        },
        data: props.data.map(d => [d.timestamp, d['Fuel Cell Power-KW']])
      },
      {
        name: '40 kW Target',
        type: 'line',
        showSymbol: false,
        smooth: false,
        lineStyle: {
          color: '#ef4444',
          width: 2,
          type: 'dashed'
        },
        itemStyle: {
          color: '#ef4444'
        },
        emphasis: {
          disabled: true
        },
        data: props.data.map(d => [d.timestamp, 40])
      },
      {
        name: 'Battery Power (KW)',
        type: 'line',
        showSymbol: false,
        smooth: true,
        itemStyle: {
          color: '#3b82f6' // var(--chart-battery-power)
        },
        data: props.data.map(d => [d.timestamp, d['Battery Power-KW']])
      },
      {
        name: 'Battery SoC (%)',
        type: 'line',
        yAxisIndex: 1,
        showSymbol: false,
        smooth: true,
        itemStyle: {
          color: '#f59e0b' // var(--chart-battery-soc)
        },
        data: props.data.map(d => [d.timestamp, d['Battery SoC-percent']])
      }
    ]
  };
});
</script>

<style scoped>
.chart-container {
  padding: 1.5rem;
  height: 500px;
  display: flex;
  flex-direction: column;
}

.chart-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1rem;
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
