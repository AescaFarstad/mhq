<script setup lang="ts">
import { ref, computed, watch, withDefaults } from 'vue';
import type { IngressUpgrades } from '../IngressTypes';

const props = withDefaults(defineProps<{
  charges: number;
  materializationProgress: number;
  totalAspectPoints: number;
  upgrades?: IngressUpgrades;
  showProgress: boolean;
}>(), {
  showProgress: true,
});

const isHintVisible = ref(false);
const materializationBarFlash = ref<'default' | 'increase' | 'decrease'>('default');

const aspectPointsDisplay = computed(() => {
  if (props.charges <= 0) return '';
  const stars = '★'.repeat(props.charges);
  return stars.replace(/(.{5})/g, '$1 ').trimEnd();
});

const formattedProgress = computed(() => {
  return props.materializationProgress.toFixed(3);
});

const displayRate = computed(() => {
  let rate = props.totalAspectPoints;
  if (props.upgrades?.breach_materialization_speed) {
    rate *= 2;
  }
  return rate;
});

const progressBarWidth = computed(() => {
  const fractionalPart = props.materializationProgress % 1;
  return `${fractionalPart * 100}%`;
});

watch(() => props.charges, (newCharges, oldCharges) => {
  if (oldCharges === undefined) {
    return;
  }
  
  if (newCharges > oldCharges) {
    materializationBarFlash.value = 'increase';
  } else if (newCharges < oldCharges) {
    materializationBarFlash.value = 'decrease';
  } else {
    return;
  }

  setTimeout(() => {
    materializationBarFlash.value = 'default';
  }, 1.3 * 1000);
});
</script>

<template>
  <div
    class="aspect-points-bar"
    :class="{
      'flash-green-materialization': materializationBarFlash === 'increase',
      'flash-dark-materialization': materializationBarFlash === 'decrease'
    }"
  >
    <div v-if="showProgress" class="progress-bar-fill" :style="{ width: progressBarWidth }"></div>
    <div class="content-overlay">
      <span class="aspect-points-label">Aspect points: </span>
      <span class="stars">{{ aspectPointsDisplay }}</span>
      <div v-if="showProgress" class="progress-text-container">
        <span v-if="materializationProgress >= 100" class="materialization-ready">
          Ready to Materialize
        </span>
        <span v-else class="materialization-progress">
          Materialization progress: {{ formattedProgress }}%, rate: {{ displayRate }}x
        </span>
        <div
          v-if="materializationProgress < 100"
          class="input-hint-container"
          @mouseenter="isHintVisible = true"
          @mouseleave="isHintVisible = false"
        >
          <span class="hint-icon">?</span>
          <div v-if="isHintVisible" class="hint-tooltip">
              <ul>
                <li>The rate is proportional to the total amount of aspect points you've earned.</li>
                <li>Spending points does not affect the rate, though you may feel an unfamiliar reluctance to part with them. This is greed—a mortal sensation.</li>
              </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.aspect-points-bar {
  display: flex;
  align-items: center;
  padding: 8px 15px;
  background-color: #3e4f61; 
  color: #e2e8f0;
  font-size: 0.9em;
  border-radius: 6px;
  box-sizing: border-box;
  transition: background-color 1.3s ease;
  width: 100%;
  position: relative;
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background-color: rgba(15, 241, 68, 0.2);
  transition: width 0.05s linear;
  border-radius: 6px;
}

.content-overlay {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  width: 100%;
}

.aspect-points-label {
  flex-shrink: 0;
}

.progress-text-container {
  margin-left: auto;
  min-width: 340px;
  text-align: right;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.materialization-progress {
  font-size: 0.9em;
  color: #bdc3c7;
}

.materialization-ready {
  font-weight: bold;
  font-size: 1.1em;
  color: #2ecc71;
}

.aspect-points-bar .stars {
  font-size: 1.2em;
  color: #f1c40f; /* Star color */
  margin-left: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

@keyframes flashGreenMaterializationAnim {
  0%, 100% { background-color: #3e4f61; }
  50% { background-color: #27ae5f1c; } /* Green flash */
}

.flash-green-materialization {
  animation: flashGreenMaterializationAnim 0.1s ease-out;
}

@keyframes flashDarkMaterializationAnim {
  0%, 100% { background-color: #3e4f61; }
  50% { background-color: #2c3a47; } /* Darker flash */
}

.flash-dark-materialization {
  animation: flashDarkMaterializationAnim 1.3s ease-out;
}

.input-hint-container {
  position: relative;
  cursor: pointer;
}
.hint-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 18px;
  height: 18px;
  border: 1px solid #7f8c8d;
  border-radius: 50%;
  font-size: 0.75rem;
  color: #bdc3c7;
  background-color: #2c3e50;
  transition: all 0.2s ease;
}
.input-hint-container:hover .hint-icon {
    border-color: #ecf0f1;
    color: #ecf0f1;
}
.hint-tooltip {
  position: absolute;
  top: 130%;
  right: 0;
  width: 350px;
  background-color: #2c3e50;
  border: 1px solid #7f8c8d;
  padding: 15px;
  border-radius: 6px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  z-index: 100;
  color: #ecf0f1;
  text-align: left;
  font-size: 0.85rem;
}
.hint-tooltip ul {
  margin: 0;
  padding-left: 0;
  list-style-position: inside;
}
.hint-tooltip li {
  margin-bottom: 10px;
}
.hint-tooltip li:last-child {
  margin-bottom: 0;
}
</style> 