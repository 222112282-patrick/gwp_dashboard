<template>
  <div class="legend-container" v-if="legendItems.length > 0">
    <h4>{{ title }}</h4>
    <ul>
      <li v-for="item in legendItems" :key="item.label">
        <span class="legend-color-box" :style="{ backgroundColor: item.color }"></span>
        {{ item.label }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  activeLayer: { type: String, required: true }
});

const mapLayerTitles = {
    'gwp_class': 'Potensi Air Tanah',
    'Elevasi': 'Elevasi (mdpl)',
    'Slope': 'Kemiringan Lereng',
    'NDVI': 'Indeks Vegetasi (NDVI)',
    'Rainfall': 'Curah Hujan (mm/thn)',
    'TWI': 'Indeks Topografi Basah',
    'Curvature': 'Kelengkungan',
    'Aspect': 'Aspek Lereng',
    'Jenis_Tanah': 'Jenis Tanah',
    'LULC': 'Tutupan Lahan',
    'Litologi': 'Litologi',
    'Tekstur_Tanah': 'Tekstur Tanah',
};

const title = computed(() => mapLayerTitles[props.activeLayer] || 'Legenda');

const legendItems = computed(() => {
  const categoricalColors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf', '#999999', '#66c2a5', '#fc8d62', '#8da0cb'];

  switch (props.activeLayer) {
    case 'gwp_class':
      return [
        { color: '#2b83ba', label: 'Sangat Tinggi (5)' }, { color: '#abdda4', label: 'Tinggi (4)' },
        { color: '#ffffbf', label: 'Sedang (3)' }, { color: '#fdae61', label: 'Rendah (2)' },
        { color: '#d7191c', label: 'Sangat Rendah (1)' }
      ];
    case 'Elevasi':
       return [
        { color: '#5e3c99', label: '> 1000m' }, { color: '#b2abd2', label: '500-1000m' },
        { color: '#f7f7f7', label: '200-500m' }, { color: '#d8daeb', label: '50-200m' },
        { color: '#fde0ef', label: '< 50m' }
      ];
    case 'Slope':
       return [
        { color: '#2b83ba', label: 'Datar (0-5°)' }, { color: '#abdda4', label: 'Landai (5-15°)' },
        { color: '#ffffbf', label: 'Miring (15-25°)' }, { color: '#fdae61', label: 'Curam (25-40°)' },
        { color: '#d7191c', label: 'Sgt. Curam (>40°)' }
      ];
    case 'NDVI':
      return [
        { color: '#00441b', label: '> 0.8' }, { color: '#238b45', label: '0.6 - 0.8' },
        { color: '#66c2a4', label: '0.4 - 0.6' }, { color: '#b2e2e2', label: '0.2 - 0.4' },
        { color: '#edf8fb', label: '< 0.2' }
      ];
    case 'Rainfall':
       return [
        { color: '#081d58', label: '> 3000' }, { color: '#253494', label: '2500-3000' },
        { color: '#225ea8', label: '2000-2500' }, { color: '#1d91c0', label: '1500-2000' },
        { color: '#41b6c4', label: '< 1500' }
      ];
    case 'TWI':
        return [
            { color: '#0c2c84', label: '> 15' }, { color: '#225ea8', label: '10 - 15' },
            { color: '#1d91c0', label: '5 - 10' }, { color: '#7fcdbb', label: '2 - 5' },
            { color: '#ccece6', label: '< 2' }
        ];
    case 'Curvature':
        return [
            { color: '#d73027', label: 'Sgt. Cembung' }, { color: '#fc8d59', label: 'Cembung' },
            { color: '#fee08b', label: 'Datar' }, { color: '#91cf60', label: 'Cekung' },
            { color: '#1a9850', label: 'Sgt. Cekung' }
        ];
    
    case 'Aspect':
    case 'Jenis_Tanah':
    case 'LULC':
    case 'Litologi':
    case 'Tekstur_Tanah':
      return categoricalColors.slice(0, 8).map((color, index) => ({
        color: color,
        label: `Kelas ${index + 1}`
      }));

    default:
      return [];
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