<template>
  <div class="legend-container">
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
  activeLayer: {
    type: String,
    required: true
  }
});

const title = computed(() => {
  switch (props.activeLayer) {
    case 'gwp_class_': return 'Potensi Air Tanah';
    case 'elevasi': return 'Elevasi (mdpl)';
    case 'slope': return 'Kemiringan Lereng';
    default: return 'Legenda';
  }
});

const legendItems = computed(() => {
  switch (props.activeLayer) {
    case 'gwp_class_':
      return [
        { color: '#2b83ba', label: 'Sangat Tinggi (5)' },
        { color: '#abdda4', label: 'Tinggi (4)' },
        { color: '#ffffbf', label: 'Sedang (3)' },
        { color: '#fdae61', label: 'Rendah (2)' },
        { color: '#d7191c', label: 'Sangat Rendah (1)' }
      ];
    case 'elevasi':
       return [
        { color: '#5e3c99', label: '> 1000m' },
        { color: '#b2abd2', label: '500m - 1000m' },
        { color: '#f7f7f7', label: '200m - 500m' },
        { color: '#d8daeb', label: '50m - 200m' },
        { color: '#fde0ef', label: '< 50m' }
      ];
    case 'slope':
       return [
        { color: '#2b83ba', label: 'Datar (0-5°)' },
        { color: '#abdda4', label: 'Landai (5-15°)' },
        { color: '#ffffbf', label: 'Miring (15-25°)' },
        { color: '#fdae61', label: 'Curam (25-40°)' },
        { color: '#d7191c', label: 'Sangat Curam (>40°)' }
      ];
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