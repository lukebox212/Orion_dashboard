<template>
  <div class="dashboard-wrapper">
    <header class="glass-panel">
      <div class="logo-area">
        <Activity class="icon-accent" :size="32" />
        <h1>Orion Dashboard</h1>
      </div>
      <div class="upload-area">
        <label for="csv-upload" class="btn">
          <Upload :size="18" />
          <span>Upload CSV Data</span>
        </label>
        <input 
          id="csv-upload" 
          type="file" 
          accept=".csv" 
          @change="handleFileUpload" 
          class="hidden-input" 
        />
        <span v-if="fileName" class="file-name">{{ fileName }}</span>
      </div>
    </header>

    <main v-if="parsedData.length > 0">
      <!-- Top KPIs / Summary -->
      <div class="kpi-grid">
        <div class="kpi-card glass-panel">
          <div class="kpi-title">Rolling Energy Use</div>
          <div class="kpi-value">tbc</div>
        </div>
        <div class="kpi-card glass-panel">
          <div class="kpi-title">Rolling Fuel Usage</div>
          <div class="kpi-value">{{ rollingFuelUsage.toFixed(2) }}<span class="unit">KG</span></div>
        </div>
      </div>

      <!-- Main Chart (Pertinent Parameters) -->
      <DashboardChart :data="parsedData" />

      <!-- Secondary Charts (Other Parameters) -->
      <!-- <SecondaryCharts :data="parsedData" /> -->
    </main>

    <main v-else class="empty-state glass-panel">
      <LineChart class="empty-icon" :size="64" />
      <h2>No Data Loaded</h2>
      <p>Please upload a Hydrogen Mobile Power Unit CSV file to view the dashboard.</p>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Papa from 'papaparse';
import { Activity, Upload, LineChart } from 'lucide-vue-next';
import DashboardChart from './components/DashboardChart.vue';
import SecondaryCharts from './components/SecondaryCharts.vue';

const parsedData = ref([]);
const fileName = ref('');

const latestData = computed(() => {
  if (parsedData.value.length === 0) return {};
  return parsedData.value[parsedData.value.length - 1];
});

// Rolling fuel usage from CSV samples.
// Assumes each row is a 1-minute sample and gas flow is reported as g/hr.
const rollingFuelUsage = computed(() => {
  const grams = parsedData.value.reduce((total, row) => { 
    const gasFlow = Number(row['Gas Flow Rate-g/hr']); // gets the value from the CSV row named "Gas Flow Rate-g/hr"
    if (!Number.isFinite(gasFlow)) return total; // Skip invalid values
    return total + gasFlow / 60; // Assuming the data is per minute, convert to grams per hour
  }, 0); // total is initialized to 0

  return grams / 1000; // Convert grams to kilograms
});

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (!file) return;
  
  fileName.value = file.name;

  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    transformHeader: (header) => header.trim(),
    complete: (results) => {
      const data = results.data;

      console.log('raw first row:', data[0]);
      console.log('raw keys:', Object.keys(data[0]));
      
      // Process Data: Combine Date and Time into a single timestamp object for ECharts
      const processedData = data.map((row, index) => {
        let timestamp = null;
        let dateStr = row.Date ? String(row.Date).trim() : '';
        let timeStr = row.Time ? String(row.Time).trim() : '';
        
        // Handle UK Date format (DD/MM/YYYY)
        if (dateStr && dateStr.includes('/')) {
           const parts = dateStr.split('/');
           if (parts.length === 3) {
             // If first part is DD and third is YYYY
             if (parts[0].length <= 2 && parts[2].length === 4) {
               dateStr = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
             }
           }
        }

        if (dateStr && timeStr) {
          timestamp = new Date(`${dateStr}T${timeStr}`).getTime();
        } else if (dateStr) {
          timestamp = new Date(dateStr).getTime();
        } else if (timeStr) {
           timestamp = new Date(`1970-01-01T${timeStr}`).getTime();
        }

        if (!timestamp || isNaN(timestamp)) {
          // Fallback if Date parsing completely fails so we don't break the chart
          timestamp = new Date(2020, 0, 1).getTime() + (index * 1000);
        }

        return {
          ...row,
          timestamp
        };
      });

      console.log('processed first row:', processedData[0]);
      console.log(
        'gas flow sample:',
        processedData[0]?.['Gas Flow Rate-g/hr']
      );

      parsedData.value = processedData;
    },
    error: (error) => {
      console.error('Error parsing CSV:', error);
      alert('Error parsing CSV file. Please check the format.');
    }
  });
};
</script>

<style scoped>
.dashboard-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 2rem;
}

.logo-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo-area h1 {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.025em;
  background: linear-gradient(to right, #f8fafc, #94a3b8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.icon-accent {
  color: var(--accent-primary);
}

.upload-area {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.hidden-input {
  display: none;
}

.file-name {
  font-size: 0.875rem;
  color: var(--text-secondary);
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

main {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.kpi-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.kpi-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.kpi-title {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.kpi-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}

.unit {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-secondary);
}

.empty-state {
  padding: 5rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.empty-icon {
  color: var(--panel-border);
  margin-bottom: 1rem;
}

.empty-state h2 {
  color: var(--text-primary);
  font-size: 1.5rem;
}
</style>
