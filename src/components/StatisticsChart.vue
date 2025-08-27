<template>
  <div class="chart-container">
    <h3>Statistik: {{ chartTitle }}</h3>
    <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
    <p v-else>Tidak ada data statistik untuk ditampilkan.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { layerConfig } from '../mapConfig.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const props = defineProps({
  geojson: {
    type: Object,
    required: true
  },
  activeLayer: {
    type: String,
    required: true
  },
});

const chartTitle = computed(() => layerConfig[props.activeLayer]?.title || 'Data');

const chartData = computed(() => {
  if (!props.geojson || !props.geojson.features) {
    return { labels: [], datasets: [] };
  }

  const features = props.geojson.features;
  const layerKey = props.activeLayer;
  const config = layerConfig[layerKey];

  if (!config) {
    return { labels: [], datasets: [] };
  }
  
  const counts = features.reduce((acc, feature) => {
    const value = feature.properties[config.dataKey];
    if (value !== undefined && value !== null) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});

  const getLabel = (value) => {
    if (config.getChartLabel) {
      return config.getChartLabel(value);
    }
    return value;
  };

  const sortedKeys = Object.keys(counts).sort((a, b) => Number(a) - Number(b));
  const labels = sortedKeys.map(key => getLabel(key));
  const data = sortedKeys.map(key => counts[key]);

  return {
    labels: labels,
    datasets: [
      {
        label: 'Jumlah Desa/Area',
        backgroundColor: '#42b883',
        borderColor: '#42b883',
        data: data,
      },
    ],
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false 
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#ccc' 
      },
      grid: {
        color: '#444'
      }
    },
    x: {
      ticks: {
        color: '#ccc' 
      },
      grid: {
        color: '#444'
      }
    }
  }
};
</script>

<style scoped>
.chart-container {
  margin-top: 2rem;
  background-color: var(--secondary-bg);
  padding: 1rem;
  border-radius: 6px;
  height: 300px; 
}
.chart-container h3 {
  margin-top: 0;
  color: var(--accent-color);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
</style>