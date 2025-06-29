<template>
  <div class="progress-section" :class="{ 'progress-gained': isGaining }">
    <progress
      :value="animatedProgress"
      :max="maxValue"
      class="progress-bar"
      :style="{ '--progress-bar-color': progressBarColor }"
    ></progress>
    <div class="progress-overlay-text-container">
      <span class="progress-text">{{ Math.round(animatedProgress) }}/{{ Math.round(maxValue) }} {{ progressLabel }}</span>
    </div>
    <div v-if="isGaining" class="progress-gain-effect"></div>
    <div v-if="showIncrement" class="progress-increment" :class="{ 'fade-out': isFadingOut }">
      +{{ Math.round(progressIncrement) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

const props = defineProps({
  currentProgress: {
    type: Number,
    required: true,
  },
  maxValue: {
    type: Number,
    required: true,
  },
  progressLabel: {
    type: String,
    default: 'XP'
  },
  progressColor: {
    type: String,
    default: 'blue' // 'blue', 'green', 'red', 'yellow', etc.
  },
  disableGainEffect: {
    type: Boolean,
    default: false
  }
});

const animatedProgress = ref(props.currentProgress);
const isGaining = ref(false);
const showIncrement = ref(false);
const isFadingOut = ref(false);
const progressIncrement = ref(0);
const animationId = ref<number | null>(null);

// Watch for changes in currentProgress and animate
watch(() => props.currentProgress, (newValue, oldValue) => {
  if (newValue !== oldValue && oldValue !== undefined) {
    const difference = newValue - oldValue;
    
    // Show progress increment if there's a positive change that would display as at least +1
    // This prevents tiny fractional increments from showing as "+0"
    if (difference > 0 && Math.round(difference) >= 1) {
      progressIncrement.value = difference;
      showIncrement.value = true;
      isFadingOut.value = false;
      
      // Start fade out after 1.5 seconds
      setTimeout(() => {
        isFadingOut.value = true;
        
        // Hide completely after fade animation
        setTimeout(() => {
          showIncrement.value = false;
        }, 500);
      }, 1500);
    }
    
    // Trigger gaining effect only for meaningful changes (not tiny increments)
    // Skip gain effect if disabled
    if (difference > 0 && Math.round(difference) >= 1 && !props.disableGainEffect) {
      isGaining.value = true;
      setTimeout(() => {
        isGaining.value = false;
      }, 600);
    }

    // Cancel any ongoing animation
    if (animationId.value !== null) {
      cancelAnimationFrame(animationId.value);
      animationId.value = null;
    }

    // Animate the progress value
    const startValue = animatedProgress.value; // Start from current animated position
    const targetValue = newValue;
    const animationDifference = targetValue - startValue;
    const duration = 800; // milliseconds
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      
      animatedProgress.value = startValue + (animationDifference * easeOutQuart);
      
      if (progress < 1) {
        animationId.value = requestAnimationFrame(animate);
      } else {
        animatedProgress.value = targetValue; // Ensure exact final value
        animationId.value = null;
      }
    };
    
    animationId.value = requestAnimationFrame(animate);
  }
}, { immediate: true });

const progressBarColor = computed(() => {
  if (animatedProgress.value >= props.maxValue) {
    return 'rgb(0, 200, 0)'; // Green when at max
  }
  
  // Different color schemes based on progressColor prop
  const progress = Math.min(1, animatedProgress.value / props.maxValue);
  const intensity = Math.round(100 + (progress * 155)); // From dark to bright
  
  switch (props.progressColor.toLowerCase()) {
    case 'blue':
      return `rgb(0, ${Math.round(intensity * 0.7)}, ${intensity})`;
    case 'green':
      return `rgb(0, ${intensity}, ${Math.round(intensity * 0.7)})`;
    case 'red':
      return `rgb(${intensity}, 0, ${Math.round(intensity * 0.3)})`;
    case 'yellow':
      return `rgb(${intensity}, ${intensity}, 0)`;
    case 'purple':
      return `rgb(${Math.round(intensity * 0.8)}, 0, ${intensity})`;
    case 'orange':
      return `rgb(${intensity}, ${Math.round(intensity * 0.6)}, 0)`;
    default:
      return `rgb(0, ${Math.round(intensity * 0.7)}, ${intensity})`; // Default to blue
  }
});

</script>

<style scoped>
.progress-section {
  position: relative;
  height: 20px;
}

.progress-bar {
  width: 100%;
  height: 100%;
  border-radius: 3px;
  -webkit-appearance: none;
  appearance: none;
}

.progress-bar::-webkit-progress-bar {
  background-color: #e0e0e0;
  border-radius: 3px;
}
.progress-bar::-webkit-progress-value {
  background-color: var(--progress-bar-color);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.progress-bar::-moz-progress-bar {
  background-color: var(--progress-bar-color);
  border-radius: 3px;
  transition: background-color 0.3s ease;
}

.progress-overlay-text-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
  box-sizing: border-box;
  pointer-events: none;
  font-size: 0.75em;
  font-weight: bold;
  color: black;
  text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
}

.progress-text {
  text-align: center;
}

/* Progress Gain Animation */
.progress-gained {
  animation: progress-pulse 0.6s ease-out;
}

@keyframes progress-pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 100, 255, 0.4);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 0 4px rgba(0, 100, 255, 0.2);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(0, 100, 255, 0);
  }
}

.progress-gain-effect {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    transparent 0%, 
    rgba(0, 150, 255, 0.3) 50%, 
    transparent 100%);
  border-radius: 3px;
  animation: sweep 0.8s ease-out;
  pointer-events: none;
}

@keyframes sweep {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* Enhanced progress bar transitions */
.progress-bar::-webkit-progress-value {
  background-color: var(--progress-bar-color);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.progress-bar::-moz-progress-bar {
  background-color: var(--progress-bar-color);
  border-radius: 3px;
  transition: all 0.3s ease;
}

/* Progress Increment Display */
.progress-increment {
  position: absolute;
  right: 5px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.75em;
  font-weight: bold;
  color: black;
  text-shadow: 1px 1px 1px rgba(255,255,255,0.8);
  white-space: nowrap;
  animation: slide-in 0.3s ease-out;
  z-index: 10;
  pointer-events: none;
}

.progress-increment.fade-out {
  animation: fade-out 0.5s ease-in forwards;
}

@keyframes slide-in {
  0% {
    transform: translateY(-50%);
    opacity: 0;
    scale: 0.8;
  }
  100% {
    transform: translateY(-50%);
    opacity: 1;
    scale: 1;
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
    transform: translateY(-50%);
  }
  100% {
    opacity: 0;
    transform: translateY(-50%);
  }
}
</style> 