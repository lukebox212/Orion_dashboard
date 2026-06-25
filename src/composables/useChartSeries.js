export function useChartSeries(rows, xKey, yKey) {
  const labels = rows.map((row) => String(row[xKey] ?? ''))
  const values = rows.map((row) => Number(row[yKey] ?? 0))

  return {
    labels,
    datasets: [
      {
        label: `${yKey} by ${xKey}`,
        data: values,
        backgroundColor: 'rgba(42, 111, 220, 0.35)',
        borderColor: 'rgba(42, 111, 220, 1)',
        borderWidth: 2,
      },
    ],
  }
}
