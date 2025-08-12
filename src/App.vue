<template>
  <div class="app-wrapper">
    <header class="header">
      <h1>🌍 Dashboard Analisis Potensi Air Tanah</h1>
      <h2>Studi Kasus: Nusa Tenggara Timur</h2>
    </header>

    <main class="content-container">
      <section class="controls">
        <label for="layer-select">Pilih Peta yang Ingin Ditampilkan:</label>
        <select id="layer-select" v-model="selectedLayer" class="map-select">
          <option v-for="option in mapOptions" :key="option.value" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </section>

      <section class="map-section">
        <h3>Visualisasi: {{ activeLayerName }}</h3>
        <div class="map-container" :class="{ 'map-transitioning': isTransitioning }">
          <div v-if="loading" class="loading-overlay">
            <div class="spinner"></div>
            <p>Memuat data peta...</p>
          </div>
          <l-map ref="map" :zoom="zoom" :center="center" :use-global-leaflet="false">
            <l-tile-layer :url="activeBasemap.url" :attribution="activeBasemap.attribution" />
            <l-geo-json v-if="geojsonData" :geojson="geojsonData" :options="geojsonOptions" ref="geojsonLayer" />
          </l-map>
          <Legend v-if="geojsonData" :activeLayer="selectedLayer" />
        </div>
      </section>

      <section class="details-section">
        <h3>Detail Atribut Data</h3>
        <p>Arahkan kursor ke poligon pada peta untuk melihat detail per desa. Di bawah ini adalah data dari wilayah yang Anda pilih.</p>
        
        <div v-if="featureForTable" class="dataframe">
          <p><strong>Data untuk Desa/Kelurahan: {{ featureForTable.WADMKD }}, Kecamatan: {{ featureForTable.WADMKC }}</strong></p>
          <table>
            <thead>
              <tr>
                <th v-for="(value, key) in featureForTable" :key="key">{{ key }}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td v-for="(value, key) in featureForTable" :key="key">
                  {{ typeof value === 'number' ? value.toFixed(3) : value }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { LMap, LTileLayer, LGeoJson } from "@vue-leaflet/vue-leaflet";
import Legend from './components/Legend.vue';
import * as L from 'leaflet';

// State Management
const map = ref(null);
const zoom = ref(7.5);
const center = ref([-9.5, 122.0]);
const geojsonData = ref(null);
const loading = ref(true);
const geojsonLayer = ref(null);
const activeBasemap = ref({ name: 'Satelit', url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', attribution: 'Tiles © Esri' });
const isTransitioning = ref(false);

// BARU: State untuk menyimpan data yang di-hover
const hoveredFeature = ref(null);

const mapOptions = ref([
  { value: 'gwp_class_', text: 'Peta Potensi Air Tanah' },
  { value: 'elevasi', text: 'Peta Elevasi' },
  { value: 'slope', text: 'Peta Kemiringan Lereng (Slope)' },
  { value: 'ndvi', text: 'Peta Indeks Vegetasi (NDVI)' },
  { value: 'rainfall', text: 'Peta Curah Hujan (Rainfall)' },
  { value: 'twi', text: 'Peta Indeks Topografi Basah (TWI)' },
  { value: 'curvature', text: 'Peta Kelengkungan (Curvature)' },
  { value: 'Aspect', text: 'Peta Aspek Lereng' },
  { value: 'Jenis_Tana', text: 'Peta Jenis Tanah' },
  { value: 'LULC', text: 'Peta Tutupan Lahan (LULC)' },
  { value: 'Litologi_1', text: 'Peta Litologi' },
  { value: 'Tekstur_ta', text: 'Peta Tekstur Tanah' },
]);
const selectedLayer = ref('gwp_class_');

// Computed Properties
const activeLayerName = computed(() => mapOptions.value.find(opt => opt.value === selectedLayer.value)?.text || 'Data');
const geojsonOptions = computed(() => ({ style: styleFeature, onEachFeature: onEachFeature }));

// BARU: Computed property untuk menentukan data apa yang ditampilkan di tabel
const featureForTable = computed(() => {
  // Jika ada desa yang di-hover, tampilkan datanya
  if (hoveredFeature.value) {
    return hoveredFeature.value;
  }
  // Jika tidak, tampilkan data desa pertama sebagai contoh
  if (geojsonData.value) {
    return geojsonData.value.features[0].properties;
  }
  return null;
});


// Functions
const getColor = (property, value) => {
  const numValue = parseFloat(value); // Pastikan nilai numerik (float juga aman)
  if (isNaN(numValue)) return '#808080'; // Warna abu untuk nilai null/invalid

  switch (property) {
    case 'gwp_class_':
      if (numValue >= 5) return '#2b83ba';
      if (numValue >= 4) return '#abdda4';
      if (numValue >= 3) return '#ffffbf';
      if (numValue >= 2) return '#fdae61';
      if (numValue >= 1) return '#d7191c';
      return '#cccccc';


    case 'elevasi':
      return numValue > 1000 ? '#5e3c99' :
             numValue > 500  ? '#b2abd2' :
             numValue > 200  ? '#f7f7f7' :
             numValue > 50   ? '#d8daeb' : '#fde0ef';

    case 'slope':
      return numValue > 40 ? '#d7191c' :
             numValue > 25 ? '#fdae61' :
             numValue > 15 ? '#ffffbf' :
             numValue > 5  ? '#abdda4' : '#2b83ba';

    case 'ndvi':
      return numValue > 0.8 ? '#00441b' :
             numValue > 0.6 ? '#238b45' :
             numValue > 0.4 ? '#66c2a4' :
             numValue > 0.2 ? '#b2e2e2' : '#edf8fb';

    case 'rainfall':
      return numValue > 3000 ? '#081d58' :
             numValue > 2500 ? '#253494' :
             numValue > 2000 ? '#225ea8' :
             numValue > 1500 ? '#1d91c0' : '#41b6c4';

    case 'twi':
      return numValue > 15 ? '#0c2c84' :
             numValue > 10 ? '#225ea8' :
             numValue > 5  ? '#1d91c0' :
             numValue > 2  ? '#7fcdbb' : '#ccece6';

    case 'curvature':
      return numValue > 0.5  ? '#d73027' :
             numValue > 0.1  ? '#fc8d59' :
             numValue > -0.1 ? '#fee08b' :
             numValue > -0.5 ? '#91cf60' : '#1a9850';

    case 'Aspect':
    case 'Jenis_Tana':
    case 'LULC':
    case 'Litologi_1':
    case 'Tekstur_ta':
      const colors = [
        '#e41a1c', '#377eb8', '#4daf4a', '#984ea3',
        '#ff7f00', '#ffff33', '#a65628', '#f781bf',
        '#999999', '#66c2a5', '#fc8d62', '#8da0cb'
      ];
      return colors[Math.abs(Math.floor(numValue)) % colors.length];

    default:
      return '#cccccc';
  }
};

const styleFeature = (feature) => {
  const propertyName = selectedLayer.value;
  const propertyValue = feature.properties[propertyName];
  return {
    fillColor: getColor(propertyName, propertyValue),
    weight: 1,
    opacity: 1,
    color: '#ffffff',
    fillOpacity: 0.7
  };
};

// DIPERBARUI: onEachFeature sekarang juga mengupdate state hoveredFeature
const onEachFeature = (feature, layer) => {
  layer.on({
    mouseover: (e) => {
      e.target.setStyle({ weight: 3, color: '#ffc107', fillOpacity: 0.9 });
      hoveredFeature.value = feature.properties; // Update state saat hover
      const props = feature.properties;
      const tooltipContent = `<div class="map-tooltip"><strong>${props.WADMKD || ''}</strong><br>${activeLayerName.value}: ${props[selectedLayer.value] !== undefined ? props[selectedLayer.value] : 'N/A'}</div>`;
      layer.bindTooltip(tooltipContent).openTooltip();
    },
    mouseout: (e) => {
      geojsonLayer.value.leafletObject.resetStyle(e.target);
      hoveredFeature.value = null; // Hapus state saat mouse keluar
      layer.closeTooltip();
    },
  });
};

// Watcher
watch(selectedLayer, async () => {
  if (!geojsonLayer.value) return;
  isTransitioning.value = true;
  await new Promise(resolve => setTimeout(resolve, 250));
  geojsonLayer.value.leafletObject.resetStyle();
  isTransitioning.value = false;
});

// Lifecycle Hook
onMounted(async () => {
  loading.value = true;
  try {
    const response = await fetch('/peta_potensi_air_tanah.geojson');
    if (!response.ok) throw new Error('Data peta tidak ditemukan!');
    geojsonData.value = await response.json();
  } catch (error) {
    console.error('Gagal memuat GeoJSON:', error);
    alert('Gagal memuat data peta.');
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.legend-container {
  position: absolute;
  bottom: 20px;
  right: 20px;
  background-color: rgba(36, 36, 36, 0.85);
  padding: 10px 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  z-index: 1000;
  color: #f0f0f0;
  max-width: 200px;
}
.legend-container h4 {
  margin: 0 0 10px 0;
  font-size: 1rem;
  text-align: center;
  border-bottom: 1px solid #555;
  padding-bottom: 5px;
}
.legend-container ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.legend-container li {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
  font-size: 0.85rem;
}
.legend-color-box {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  border: 1px solid #777;
}
</style>

<style>
/* Style Global */
:root {
  --primary-bg: #242424;
  --secondary-bg: #1a1a1a;
  --text-color: #f0f0f0;
  --border-color: #444;
  --accent-color: #42b883;
}
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  background-color: var(--secondary-bg);
  color: var(--text-color);
}
/* Layout Utama */
.app-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}
.header h1 {
  font-size: 2rem;
  color: var(--accent-color);
  display: flex;
  align-items: center;
}
.header h2 {
  font-size: 1.2rem;
  font-weight: normal;
  color: #ccc;
  margin-top: -10px;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 1.5rem;
}
.controls {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
.controls label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #aaa;
}
.map-select {
  width: 100%;
  max-width: 400px;
  padding: 0.75rem;
  background-color: var(--primary-bg);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 1rem;
}
.map-section {
  margin-top: 2rem;
}
.map-section h3 {
  font-size: 1.5rem;
}
.map-container {
  position: relative;
  width: 100%;
  height: 65vh;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  background-color: #1a1a1a;
}
/* Animasi Transisi */
.map-container .leaflet-pane {
  transition: opacity 0.25s ease-in-out;
}
.map-container.map-transitioning .leaflet-pane {
  opacity: 0;
}
/* Style untuk Tooltip Peta */
.map-tooltip .leaflet-tooltip-content {
  background-color: rgba(36, 36, 36, 0.9) !important;
  color: var(--text-color) !important;
  border-radius: 4px !important;
  padding: 8px 12px !important;
  white-space: pre-wrap !important;
}
.leaflet-tooltip {
  border: 1px solid var(--border-color) !important;
  box-shadow: none !important;
}
.leaflet-tooltip-top:before, .leaflet-tooltip-bottom:before, .leaflet-tooltip-left:before, .leaflet-tooltip-right:before {
  border: none !important;
}
/* Tabel Data Detail */
.details-section {
  margin-top: 2rem;
}
.details-section h3 {
  font-size: 1.5rem;
}
.dataframe {
  background: var(--primary-bg);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  padding: 1rem;
  overflow-x: auto;
}
.dataframe p {
  font-size: 0.9rem;
  color: #ccc;
}
.dataframe table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
.dataframe th, .dataframe td {
  padding: 8px 12px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  font-size: 0.85rem;
  white-space: nowrap;
}
.dataframe th {
  color: var(--accent-color);
}
.dataframe tr:last-child td {
  border-bottom: none;
}
/* Loading Spinner */
.loading-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0, 0, 0, 0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 2000; color: white; }
.spinner { border: 4px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top: 4px solid var(--accent-color); width: 50px; height: 50px; animation: spin 1s linear infinite; margin-bottom: 1rem; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
</style>