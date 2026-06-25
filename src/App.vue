<script setup>
import { computed, ref } from 'vue'
import UploadExcel from './components/UploadExcel.vue'
import DataPreview from './components/DataPreview.vue'
import ChartBuilder from './components/ChartBuilder.vue'

const rows = ref([])

const headers = computed(() => {
  if (!rows.value.length) return []
  return Object.keys(rows.value[0])
})

function handleRowsParsed(parsedRows) {
  rows.value = parsedRows
}
</script>

<template>
  <main class="dashboard-shell">
    <header>
      <h1>Orion Spreadsheet Dashboard</h1>
      <p>Upload an Excel file to preview data and build charts.</p>
    </header>

    <UploadExcel @rows-parsed="handleRowsParsed" />

    <DataPreview v-if="rows.length" :rows="rows" />
    <ChartBuilder v-if="rows.length" :rows="rows" :headers="headers" />

    <p v-if="!rows.length" class="hint">
      Your charts and table preview will appear after uploading a file.
    </p>
  </main>
</template>

<style scoped>
.dashboard-shell {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1.25rem;
  display: grid;
  gap: 1rem;
}

h1 {
  margin: 0;
  font-size: 1.7rem;
}

header p {
  margin: 0.45rem 0 0;
  color: #43516d;
}

.hint {
  margin: 0;
  color: #5f6d89;
}
</style>
