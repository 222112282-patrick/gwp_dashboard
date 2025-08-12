<template>
  <div class="chart-container">
    <h3>Statistik Layer: {{ activeLayerName }}</h3>
    <Bar v-if="chartData.labels.length" :data="chartData" :options="chartOptions" />
    <p v-else>Tidak ada data statistik untuk ditampilkan.</p>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

// Komponen menerima props dari App.vue
const props = defineProps({
  geojson: {
    type: Object,
    required: true
  },
  activeLayer: {
    type: String,
    required: true
  },
  activeLayerName: {
    type: String,
    required: true
  }
});

// Logika inti: Memproses data GeoJSON menjadi data yang bisa dibaca oleh Chart.js
const chartData = computed(() => {
  if (!props.geojson || !props.geojson.features) {
    return { labels: [], datasets: [] };
  }

  const features = props.geojson.features;
  const layer = props.activeLayer;
  
  // Menghitung frekuensi setiap nilai unik di kolom layer aktif
  const counts = features.reduce((acc, feature) => {
    const value = feature.properties[layer];
    if (value !== undefined && value !== null) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});

  // Memetakan nilai ke label yang lebih deskriptif (khusus untuk potensi air)
  const getLabel = (value) => {
    if (layer === 'gwp_class_') {
      const gwpLabels = { 1: 'Sgt. Rendah', 2: 'Rendah', 3: 'Sedang', 4: 'Tinggi', 5: 'Sgt. Tinggi' };
      return gwpLabels[value] || value;
    }
    return value;
  };

  const sortedLabels = Object.keys(counts).sort((a, b) => a - b);
  const labels = sortedLabels.map(key => getLabel(key));
  const data = sortedLabels.map(key => counts[key]);

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

// Opsi untuk kustomisasi tampilan chart
const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // Sembunyikan legenda default chart
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: '#ccc' // Warna teks di sumbu Y
      },
      grid: {
        color: '#444' // Warna garis grid
      }
    },
    x: {
      ticks: {
        color: '#ccc' // Warna teks di sumbu X
      },
       grid: {
        color: '#444'
      }
    }
  }
});
</script>

<style scoped>
.chart-container {
  margin-top: 2rem;
  background-color: var(--secondary-bg);
  padding: 1rem;
  border-radius: 6px;
  height: 300px; /* Beri tinggi tetap agar tidak berubah-ubah */
}
.chart-container h3 {
  margin-top: 0;
  color: var(--accent-color);
  font-size: 1.1rem;
  margin-bottom: 1rem;
}
</style>