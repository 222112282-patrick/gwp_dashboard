<template>
  <div class="bar-chart-container">
    <Bar v-if="chartData" :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Bar } from 'vue-chartjs';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Daftarkan semua elemen yang dibutuhkan oleh Bar Chart
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

  // --- BAGIAN INI DIPERBARUI ---
  // Kita ambil 6 parameter kunci dengan NILAI ASLINYA (TANPA NORMALISASI)
  const dataValues = [
    properties.gwp_class_ || 0,
    properties.elevasi || 0,
    properties.slope || 0,
    properties.ndvi || 0,
    properties.rainfall || 0,
    properties.twi || 0,
  ];

  const labels = ['Potensi Air', 'Elevasi', 'Slope', 'NDVI', 'Curah Hujan', 'TWI'];

  return {
    labels: labels,
    datasets: [
      {
        label: `Profil Desa ${properties.WADMKD || ''}`,
        backgroundColor: [ // Beri warna berbeda untuk setiap bar
          '#42b883', '#8da0cb', '#fc8d62', 
          '#66c2a5', '#e78ac3', '#a6d854'
        ],
        borderColor: '#555',
        borderWidth: 1,
        data: dataValues
      }
    ]
  };
});

// Opsi untuk Bar Chart Horizontal
const chartOptions = {
  indexAxis: 'y', // Ini yang membuat chart menjadi horizontal
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { 
      display: false // Sembunyikan legenda default, karena nama parameter sudah ada di sumbu Y
    },
    title: {
      display: true,
      text: 'Nilai Asli Parameter',
      color: '#f0f0f0',
      font: {
        size: 14
      }
    }
  },
  scales: {
    x: { // Sumbu X sekarang adalah sumbu nilai
      ticks: { color: '#ccc' },
      grid: { color: '#444' }
    },
    y: { // Sumbu Y sekarang adalah sumbu kategori/parameter
      ticks: { color: '#ccc' },
      grid: { color: 'transparent' }
    }
  }
};
</script>

<style scoped>
.bar-chart-container {
  height: 300px; /* Anda bisa sesuaikan tingginya */
  margin-top: 1rem;
  padding: 0.5rem;
}
</style>