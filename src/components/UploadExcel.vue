<script setup>
import * as XLSX from 'xlsx'

const emit = defineEmits(['rows-parsed'])

async function onFileChange(event) {
  const file = event.target.files?.[0]
  if (!file) return

  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const firstSheet = workbook.SheetNames[0]
  const sheet = workbook.Sheets[firstSheet]
  const parsedRows = XLSX.utils.sheet_to_json(sheet, { defval: '' })

  emit('rows-parsed', parsedRows)
}
</script>

<template>
  <section class="card upload-card">
    <h2>Upload Spreadsheet</h2>
    <p>Select an Excel file (.xlsx or .xls) to start building your dashboard.</p>
    <input type="file" accept=".xlsx,.xls" @change="onFileChange" />
  </section>
</template>

<style scoped>
.card {
  background: #ffffff;
  border: 1px solid #d7deea;
  border-radius: 12px;
  padding: 1rem;
}

.upload-card input {
  margin-top: 0.75rem;
}
</style>
