<template>
  <div class="noise-visualizer">
    <div class="controls">
      <h3>Noise Visualizer</h3>
      
      <!-- Mode selection buttons -->
      <div class="mode-buttons">
        <button 
          v-for="mode in noiseModes" 
          :key="mode.id"
          :class="{ active: currentMode === mode.id }"
          @click="setMode(mode.id)"
        >
          {{ mode.label }}
        </button>
      </div>

      <!-- Parameters -->
      <div class="parameters">
        <div class="param-group">
          <label>Width (pixels): {{ canvasWidth }}</label>
          <input 
            type="range" 
            v-model.number="canvasWidth" 
            min="200" 
            max="1600" 
            step="10"
            @input="redraw"
          />
        </div>
        
        <div class="param-group">
          <label>Height (pixels): {{ canvasHeight }}</label>
          <input 
            type="range" 
            v-model.number="canvasHeight" 
            min="100" 
            max="800" 
            step="10"
            @input="redraw"
          />
        </div>

        <div class="param-group">
          <label>Noise Scale: {{ noiseScale.toFixed(2) }}</label>
          <input 
            type="range" 
            v-model.number="noiseScale" 
            min="0.01" 
            max="10" 
            step="0.01"
            @input="redraw"
          />
        </div>

        <div class="param-group">
          <label>X Offset: {{ xOffset.toFixed(2) }}</label>
          <input 
            type="range" 
            v-model.number="xOffset" 
            min="-100" 
            max="100" 
            step="0.1"
            @input="redraw"
          />
        </div>

        <div class="param-group" v-if="currentMode === 'seeded'">
          <label>Seed: {{ seed }}</label>
          <input 
            type="number" 
            v-model.number="seed" 
            @input="redraw"
          />
        </div>

        <div class="param-group" v-if="currentMode.startsWith('simplex')">
          <label>Simplex Seed: {{ simplexSeed }}</label>
          <input 
            type="number" 
            v-model.number="simplexSeed" 
            @input="updateSimplex"
          />
        </div>

        <div class="param-group" v-if="currentMode === 'simplex_octaves'">
          <label>Octaves: {{ octaves }}</label>
          <input 
            type="range" 
            v-model.number="octaves" 
            min="1" 
            max="8" 
            step="1"
            @input="redraw"
          />
        </div>

        <div class="param-group" v-if="currentMode === 'simplex_octaves'">
          <label>Persistence: {{ persistence.toFixed(2) }}</label>
          <input 
            type="range" 
            v-model.number="persistence" 
            min="0.1" 
            max="1" 
            step="0.05"
            @input="redraw"
          />
        </div>
      </div>

      <button @click="redraw" class="redraw-button">Redraw</button>
    </div>

    <!-- Canvas for visualization -->
    <canvas 
      ref="canvas" 
      :width="canvasWidth" 
      :height="canvasHeight"
      class="noise-canvas"
    ></canvas>

    <!-- Stats display -->
    <div class="stats">
      <div>Min Value: {{ stats.min.toFixed(4) }}</div>
      <div>Max Value: {{ stats.max.toFixed(4) }}</div>
      <div>Average: {{ stats.avg.toFixed(4) }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { initOpenSimplex2F, openSimplex1D, octaveOpenSimplex1D } from '../logic/utils/openSimplex2F';
import { seededRandom } from '../logic/utils/mathUtils';

// Canvas reference
const canvas = ref<HTMLCanvasElement>();

// Parameters
const canvasWidth = ref(800);
const canvasHeight = ref(300);
const noiseScale = ref(1.0);
const xOffset = ref(0);
const seed = ref(12345);
const simplexSeed = ref(12345);
const octaves = ref(4);
const persistence = ref(0.5);

// Current mode
const currentMode = ref('math_random');

// Available modes
const noiseModes = [
  { id: 'math_random', label: 'Math.random()' },
  { id: 'seeded', label: 'Seeded Random' },
  { id: 'simplex_1d', label: 'OpenSimplex2F 1D' },
  { id: 'simplex_octaves', label: 'OpenSimplex2F Octaves 1D' }
];

// Stats tracking
const stats = ref({
  min: 0,
  max: 0,
  avg: 0
});

function setMode(mode: string) {
  currentMode.value = mode;
  redraw();
}

function updateSimplex() {
  initOpenSimplex2F(simplexSeed.value);
  redraw();
}

function sampleNoise(x: number): number {
  const scaledX = x * noiseScale.value + xOffset.value;
  
  switch (currentMode.value) {
    case 'math_random':
      // For Math.random(), we use x as entropy to get pseudo-1D behavior
      Math.random(); // Advance the generator based on x
      return Math.random();
      
    case 'seeded': {
      // Use seeded random with x-based seed modification
      // Create a unique seed for each x position by combining the base seed with x
      const xBasedSeed = seed.value + Math.floor(scaledX * 1000);
      const result = seededRandom(xBasedSeed);
      return result.value;
    }
    
    case 'simplex_1d':
      // Use 1D OpenSimplex2F noise
      return openSimplex1D(scaledX);
      
    case 'simplex_octaves':
      // Use octave 1D noise
      return octaveOpenSimplex1D(scaledX, octaves.value, persistence.value, 1);
      
    default:
      return 0;
  }
}

function redraw() {
  nextTick(() => {
    const ctx = canvas.value?.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvasWidth.value, canvasHeight.value);

    // Sample noise for each pixel column
    const values: number[] = [];
    let minVal = Infinity;
    let maxVal = -Infinity;
    let sum = 0;

    for (let x = 0; x < canvasWidth.value; x++) {
      const value = sampleNoise(x);
      values.push(value);
      minVal = Math.min(minVal, value);
      maxVal = Math.max(maxVal, value);
      sum += value;
    }

    // Update stats
    stats.value = {
      min: minVal,
      max: maxVal,
      avg: sum / values.length
    };

    // Normalize and draw bars
    const range = maxVal - minVal;
    const normalizeValue = range > 0 ? (val: number) => (val - minVal) / range : () => 0.5;

    ctx.fillStyle = '#4CAF50';
    
    for (let x = 0; x < canvasWidth.value; x++) {
      const normalizedValue = normalizeValue(values[x]);
      const barHeight = normalizedValue * canvasHeight.value;
      
      // Draw bar from bottom up
      ctx.fillRect(x, canvasHeight.value - barHeight, 1, barHeight);
    }

    // Draw zero line if range spans negative and positive
    if (minVal < 0 && maxVal > 0) {
      const zeroY = canvasHeight.value - (normalizeValue(0) * canvasHeight.value);
      ctx.strokeStyle = '#FF5722';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, zeroY);
      ctx.lineTo(canvasWidth.value, zeroY);
      ctx.stroke();
    }
  });
}

onMounted(() => {
  // Initialize OpenSimplex2F with default seed
  initOpenSimplex2F(simplexSeed.value);
  redraw();
});
</script>

<style scoped>
.noise-visualizer {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
  padding: 20px;
  background: #2d2d2d;
  color: white;
  font-family: 'Courier New', monospace;
  box-sizing: border-box;
}

.controls h3 {
  margin: 0 0 15px 0;
  color: #4CAF50;
}

.mode-buttons {
  display: flex;
  gap: 5px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.mode-buttons button {
  padding: 8px 12px;
  background: #404040;
  color: white;
  border: 1px solid #666;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.mode-buttons button:hover {
  background: #505050;
}

.mode-buttons button.active {
  background: #4CAF50;
  border-color: #4CAF50;
}

.parameters {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.param-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.param-group label {
  font-size: 14px;
  color: #ccc;
}

.param-group input[type="range"] {
  width: 100%;
}

.param-group input[type="number"] {
  padding: 4px;
  background: #404040;
  border: 1px solid #666;
  border-radius: 4px;
  color: white;
  font-family: inherit;
}

.redraw-button {
  padding: 10px 20px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  margin-bottom: 20px;
}

.redraw-button:hover {
  background: #1976D2;
}

.noise-canvas {
  border: 2px solid #666;
  border-radius: 4px;
  background: #1a1a1a;
  display: block;
  margin-bottom: 15px;
  flex-grow: 1;
  max-height: calc(100vh - 400px);
}

.stats {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #ccc;
}

.stats > div {
  padding: 5px 10px;
  background: #404040;
  border-radius: 4px;
}
</style> 