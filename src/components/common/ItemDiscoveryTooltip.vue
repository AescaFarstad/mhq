<template>
  <div
    v-if="visible"
    class="custom-tooltip"
    :style="{ left: x + 'px', top: y + 'px' }"
  >
    <div class="tooltip-content">
      <!-- Skills/Specializations: Image + Description + Keywords -->
      <div v-if="(imageType === 'skill' || imageType === 'skill_specialization') && content" class="tooltip-with-image">
        <canvas 
          ref="skillImageCanvas"
          width="72"
          height="72"
          class="tooltip-skill-icon"
        ></canvas>
        <div class="tooltip-text-section">
          <div class="tooltip-description" v-html="descriptionOnly"></div>
          <!-- Keywords section for skills/specializations -->
          <div v-if="keywords.length > 0" class="tooltip-keywords-section">
            <div class="tooltip-keywords-label">Keywords that led to this discovery:</div>
            <div class="tooltip-keywords">
              <span v-for="(keyword, index) in keywords" :key="keyword" class="keyword-highlight">
                {{ keyword }}<span v-if="index < keywords.length - 1">, </span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Attributes/Categories/Buildings: Description only -->
      <div v-if="imageType !== 'skill' && imageType !== 'skill_specialization' && content" 
           class="tooltip-description" 
           v-html="content">
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { AtlasManager } from '../../utils/AtlasManager';

interface Props {
  visible: boolean;
  x: number;
  y: number;
  itemId: string;
  itemName: string;
  imageType: string;
  content: string;
  descriptionOnly: string;
  keywords: string[];
}

const props = defineProps<Props>();

const skillImageCanvas = ref<HTMLCanvasElement>();

const getAtlasName = (itemType: string): string => {
  switch (itemType) {
    case 'skill':
    case 'skill_specialization':
      return 'skills';
    case 'building':
      return 'buildings';
    case 'attribute':
    case 'attribute_category':
      return 'attributes';
    default:
      return 'skills';
  }
};

const renderSkillImage = async (itemId: string, itemType: string) => {
  if (!skillImageCanvas.value) return;
  
  const canvas = skillImageCanvas.value;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  
  // Clear canvas
  ctx.clearRect(0, 0, 72, 72);
  
  try {
    const atlasManager = AtlasManager.getInstance();
    const atlasName = getAtlasName(itemType);
    const imageData = await atlasManager.getAtlasImage(atlasName, itemId);
    
    if (imageData) {
      const { image, rect } = imageData;
      
      // Calculate scale to fit 72x72 while maintaining aspect ratio
      const scale = Math.min(72 / rect.w, 72 / rect.h);
      const scaledWidth = rect.w * scale;
      const scaledHeight = rect.h * scale;
      
      // Center the scaled image
      const offsetX = (72 - scaledWidth) / 2;
      const offsetY = (72 - scaledHeight) / 2;
      
      // Draw the scaled image
      ctx.drawImage(
        image, 
        rect.x, rect.y, rect.w, rect.h,  // Source rectangle
        offsetX, offsetY, scaledWidth, scaledHeight  // Destination rectangle
      );
    }
  } catch (error) {
    console.warn('Failed to render skill image:', error);
  }
};

// Watch for tooltip visibility and render image when needed
watch([() => props.visible, () => props.itemId, () => props.imageType], async () => {
  if (props.visible && (props.imageType === 'skill' || props.imageType === 'skill_specialization')) {
    await nextTick(); // Wait for DOM update
    renderSkillImage(props.itemId, props.imageType);
  }
});
</script>

<style scoped>
.custom-tooltip {
  position: fixed;
  z-index: 1000;
  width: 550px; /* Match log entry width */
  max-width: 550px;
  background-color: #2c3e50;
  color: white;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  pointer-events: none;
  opacity: 0.95;
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 0.95;
    transform: translateY(0);
  }
}

.tooltip-content {
  padding: 12px 16px;
  font-size: 13px;
  line-height: 1.4;
}

.tooltip-content :deep(.tooltip-with-image) {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.tooltip-content :deep(.tooltip-skill-icon) {
  flex-shrink: 0;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.1);
}

.tooltip-content :deep(.tooltip-text-section) {
  flex: 1;
}

.tooltip-content :deep(.tooltip-description) {
  font-weight: bold;
  color: #f8f9fa;
  flex: 1;
}

.tooltip-content :deep(.tooltip-keywords-section) {
  margin-top: 8px;
  margin-bottom: 4px;
}

.tooltip-content :deep(.tooltip-keywords-label) {
  color: #e2e8f0;
  font-size: 12px;
}

.tooltip-content :deep(.tooltip-keywords) {
  color: #e2e8f0;
}

.tooltip-content :deep(.keyword-highlight) {
  color: #a4d7fe;
  font-weight: bold;
}

.tooltip-content :deep(strong) {
  color: white;
}
</style> 