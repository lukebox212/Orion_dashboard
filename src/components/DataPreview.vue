<script setup>
import { computed } from 'vue'

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
})

const previewRows = computed(() => props.rows.slice(0, 10))
const headers = computed(() => Object.keys(previewRows.value[0] || {}))
</script>

<template>
  <section class="card">
    <h2>Data Preview</h2>
    <p>Showing the first 10 rows from your spreadsheet.</p>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th v-for="header in headers" :key="header">{{ header }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, idx) in previewRows" :key="idx">
            <td v-for="header in headers" :key="header">{{ row[header] }}</td>
          </tr>
        </tbody>
      </table>
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

.table-wrap {
  overflow: auto;
  margin-top: 0.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

th,
td {
  border-bottom: 1px solid #e4e8f1;
  text-align: left;
  padding: 0.5rem;
  white-space: nowrap;
}

th {
  background: #f4f7fc;
}
</style>
