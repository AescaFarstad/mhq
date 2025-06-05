<template>
  <div class="ingress-choice">
    <ImageHolder 
      class="choice-image"
      atlasName="your_atlas_name_here" 
      imageName="your_image_name_here" 
      :displayWidth="120" 
      :displayHeight="100"
    />
    <div class="choice-content">
      <p>Ingress Choice Content</p>
      <!-- Other content for the card -->
    </div>
  </div>
</template>

<script setup lang="ts">
import ImageHolder from '../../../components/common/ImageHolder.vue';

// Props might be needed later for dynamic content
// defineProps<{
//   // exampleProp: string;
// }>();
</script>

<style scoped>
.ingress-choice {
  width: 100%; /* Fill the space given by parent in IngressView.vue */
  height: 100%;
  background-color: #ff00ff; /* Magenta - consistent with IngressView */
  border: 2px solid #1a202c; /* Darker border for definition */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* Align image to top, content below */
  padding: 10px;
  box-sizing: border-box;
  color: white; /* Text color for content */
}

.choice-image {
  /* ImageHolder will be centered by its own styles if its canvas is smaller than these dimensions */
  /* These dimensions are for the container of the ImageHolder within this component */
  width: 100%; /* Make image container take full width of the card section */
  max-height: 120px; /* Max height for the image area */
  margin-bottom: 10px; /* Space between image and content */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.1); /* Slight background for image area */
}

.choice-content {
  text-align: center;
  font-size: 0.9em;
}
</style> 