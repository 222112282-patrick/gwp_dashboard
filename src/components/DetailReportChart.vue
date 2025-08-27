<template>
  <div class="bar-chart-container">
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { layerConfig, detailChartLayers } from '../mapConfig.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  featureProperties: {
    type: Object,
    required: true
  }
});

const chartData = computed(() => {
  const properties = props.featureProperties;
  if (!properties) return null;

  const labels = detailChartLayers.map(key => layerConfig[key]?.title || key);
  
  const dataValues = detailChartLayers.map(key => {
    const config = layerConfig[key];
    if (!config) return 0;
    return properties[config.dataKey] || 0;
  });

  return {
    labels: labels,
    datasets: [
      {
        label: `Profil Desa ${properties.Desa || ''}`,
        backgroundColor: [
          '#42b883', '#8da0cb', '#fc8d62', 
          '#66c2a5', '#e78ac3', '#a6d854', '#ffd92f'
        ],
        borderColor: '#555',
        borderWidth: 1,
        data: dataValues
      }
    ]
  };
});

const chartOptions = {
  indexAxis: 'y', 
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      display: false 
    },
    title: {
      display: true,
      text: 'Nilai Atribut',
      color: '#f0f0f0',
      font: {
        size: 14
      }
    }
  },
  scales: {
    x: {
      ticks: { color: '#ccc' },
      grid: { color: '#444' }
    },
    y: { 
      ticks: { color: '#ccc' },
      grid: { color: 'transparent' }
    }
  }
};
</script>

<style scoped>
.bar-chart-container {
  height: 300px; 
  margin-top: 1rem;
  padding: 0.5rem;
}
</style>