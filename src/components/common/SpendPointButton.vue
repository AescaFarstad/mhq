<template>
  <button 
    class="spend-point-btn"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    :title="title"
  >
    <span class="plus-text">+</span>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
}>();

const emit = defineEmits<{
  click: [event: MouseEvent];
  mouseenter: [event: MouseEvent];
  mouseleave: [event: MouseEvent];
}>();

const handleClick = (event: MouseEvent) => {
  emit('click', event);
};

const handleMouseEnter = (event: MouseEvent) => {
  emit('mouseenter', event);
};

const handleMouseLeave = (event: MouseEvent) => {
  emit('mouseleave', event);
};
</script>

<style scoped>
.spend-point-btn {
  background: linear-gradient(145deg, #32d74b, #28a745);
  border: 1px solid #20c997;
  border-radius: 20%;
  color: white;
  font-size: 1.2em;
  font-weight: bold;
  width: 20px;
  height: 20px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: -2px;
  margin-bottom: -2px;
  line-height: 1;
  box-shadow: 0 2px 4px rgba(40, 167, 69, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
}

.spend-point-btn:hover {
  background: linear-gradient(145deg, #3ae158, #32d74b);
  box-shadow: 0 4px 8px rgba(40, 167, 69, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.spend-point-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 2px rgba(40, 167, 69, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3);
}

.plus-text {
  transform: translate(0px, -1px);
}
</style> 