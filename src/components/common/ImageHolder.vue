<template>
  <div class="image-holder-wrapper">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps } from 'vue';
import { AtlasManager } from '../../utils/AtlasManager'; // Import the class

const props = defineProps<{
  atlasName: string;
  imageName: string;
  // atlasManager prop is removed
  displayWidth: number;
  displayHeight: number;
  // Optional: width and height for the ImageHolder if it needs a fixed size, otherwise it wraps the image
  // wrapperWidth?: string; // e.g., '50px'
  // wrapperHeight?: string; // e.g., '50px'
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);
const atlasManagerInstance = AtlasManager.getInstance(); // Get the singleton instance

watchEffect(async () => {
  if (!canvasRef.value) {
    return; // Canvas element not ready
  }
  const canvas = canvasRef.value;
  
  // Always set canvas dimensions from props
  canvas.width = props.displayWidth;
  canvas.height = props.displayHeight;

  const ctx = canvas.getContext('2d');

  if (!ctx) {
    console.error("ImageHolder: Could not get 2D context from canvas.");
    // Canvas dimensions are set, but we can't draw or clear without context
    return;
  }

  // Clear the canvas with its defined dimensions
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // If manager or essential props are missing, canvas is already cleared and sized.
  if (!props.atlasName || !props.imageName) {
    // console.warn("ImageHolder: atlasName or imageName is missing.");
    return;
  }
  
  try {
    // Use the singleton instance directly
    const imageData = await atlasManagerInstance.getAtlasImage(props.atlasName, props.imageName);

    if (imageData) {
      const { image, rect } = imageData;
      
      // Calculate destination X and Y to center the image (at its native size)
      const destX = (props.displayWidth - rect.w) / 2;
      const destY = (props.displayHeight - rect.h) / 2;
      
      // Draw the image from atlas at its native size, centered on the canvas
      ctx.drawImage(image, rect.x, rect.y, rect.w, rect.h, destX, destY, rect.w, rect.h);
    } else {
      // Image not found in atlas or atlas not loaded. Canvas is already cleared and sized.
      // console.warn('ImageHolder: Image ' + props.imageName + ' not found in atlas ' + props.atlasName + '.');
    }
  } catch (error) {
    // Error occurred. Canvas is already cleared and sized.
    console.error('ImageHolder: Error getting image from atlas:', error);
  }
});

</script>

<style scoped>
.image-holder-wrapper {
  display: inline-flex; /* Behaves like inline but allows flex for centering children */
  justify-content: center; /* Center canvas horizontally */
  align-items: center;   /* Center canvas vertically */
}

/* The canvas dimensions are set dynamically by the script based on the image. */
/* It will be centered within the image-holder-wrapper by the flex properties. */
canvas {
  /* No specific styling needed here for centering if wrapper handles it */
}
</style> 