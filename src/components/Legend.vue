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
import { layerConfig } from '../mapConfig.js';

const props = defineProps({
  activeLayer: { type: String, required: true }
});

const title = computed(() => layerConfig[props.activeLayer]?.title || 'Legenda');
const legendItems = computed(() => layerConfig[props.activeLayer]?.legend || []);
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
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
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