<template>
  <canvas ref="canvasEl" class="starfield-background"></canvas>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, defineProps, defineEmits } from 'vue';

const props = defineProps<{
  attractorPosition: { x: number; y: number } | null;
  isEngaged: boolean;
}>();

const emit = defineEmits<{
  (e: 'all-stars-gone'): void;
}>();

const canvasEl = ref<HTMLCanvasElement | null>(null);
let animationFrameId: number;

const mouse = ref<{ x: number; y: number } | null>(null);

const handleMouseMove = (event: MouseEvent) => {
  mouse.value = { x: event.clientX, y: event.clientY };
};
const handleMouseLeave = () => {
  mouse.value = null;
};

onMounted(() => {
  const canvas = canvasEl.value;
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseleave', handleMouseLeave);

  let width = 0;
  let height = 0;

  interface Star {
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    cosAV: number;
    sinAV: number;
    isFlyingOut?: boolean;
    sensitivity: number;
    baseRadius: number;
    creationTime: number;
  }
  const stars: Star[] = [];
  const numStars = 1000;
  const speed = 0.05;

  function resetStar(star: Star, isInitial = false) {
    const angularVelocity = (Math.random() - 0.5) * 0.015;
    star.cosAV = Math.cos(angularVelocity);
    star.sinAV = Math.sin(angularVelocity);
    
    star.sensitivity = 0.2 + Math.random() * 1.3;
    star.baseRadius = 1 + Math.random() * 5;
    star.creationTime = Date.now();

    star.z = isInitial 
      ? (width + Math.random() * width) 
      : (width * 0.8 + Math.random() * width * 0.4);

    const focal = Math.min(width, height);
    const centerX = width / 2;
    const centerY = height / 2;
    
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.hypot(centerX, centerY) * 1.1; 

    const screenX = centerX + Math.cos(angle) * radius;
    const screenY = centerY + Math.sin(angle) * radius;

    star.x = (screenX - centerX) * star.z / focal;
    star.y = (screenY - centerY) * star.z / focal;

    const flyInSpeed = 2 + Math.random() * 2;
    const magnitude = Math.hypot(star.x, star.y);
    if (magnitude > 0) {
        star.vx = (-star.x / magnitude) * flyInSpeed;
        star.vy = (-star.y / magnitude) * flyInSpeed;
    } else {
        star.vx = 0;
        star.vy = 0;
    }
  }

  function initStars() {
    if (!canvas) return;
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;

    stars.length = 0;
    for (let i = 0; i < numStars; i++) {
      const star = {} as Star;
      resetStar(star, true);
      stars.push(star);
    }
  }

  function animate() {
    if (!canvas || !ctx) {
      animationFrameId = requestAnimationFrame(animate);
      return;
    };
    
    ctx.fillStyle = 'rgba(44, 62, 80, 0.7)';
    ctx.fillRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = height / 2;
    const focal = Math.min(width, height);

    if (props.isEngaged) {
        if (stars.length === 0) {
            cancelAnimationFrame(animationFrameId);
            return;
        }

        for (let i = stars.length - 1; i >= 0; i--) {
            const star = stars[i];

            if (!star.isFlyingOut) {
                const swirl_vx = (star.x * star.cosAV - star.y * star.sinAV) - star.x;
                const swirl_vy = (star.x * star.sinAV + star.y * star.cosAV) - star.y;
                
                star.vx += swirl_vx;
                star.vy += swirl_vy;

                const mag = Math.hypot(star.vx, star.vy);
                const minWorldSpeed = 3; 

                if (mag < minWorldSpeed) {
                    const out_x = star.x - (width/2);
                    const out_y = star.y - (height/2);
                    const out_mag = Math.hypot(out_x, out_y);
                    if (out_mag > 0) {
                       star.vx = (out_x / out_mag) * minWorldSpeed;
                       star.vy = (out_y / out_mag) * minWorldSpeed;
                    } else {
                       const randomAngle = Math.random() * Math.PI * 2;
                       star.vx = Math.cos(randomAngle) * minWorldSpeed;
                       star.vy = Math.sin(randomAngle) * minWorldSpeed;
                    }
                }
                star.isFlyingOut = true;
            }

            star.x += star.vx;
            star.y += star.vy;
            star.z -= speed;

            const screenX = (star.x / star.z) * focal + centerX;
            const screenY = (star.y / star.z) * focal + centerY;
            const margin = 100;

            if (star.z <= 0 || screenX < -margin || screenX > width + margin || screenY < -margin || screenY > height + margin) {
                stars.splice(i, 1);
            } else {
                const r = (star.baseRadius / star.z) * focal * 0.5;
                const opacity = Math.min(1, (focal / star.z) * 1.5);
                ctx.fillStyle = `rgba(226, 232, 240, ${opacity})`;
                ctx.beginPath();
                ctx.arc(screenX, screenY, r, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        if (stars.length === 0) {
            emit('all-stars-gone');
        }

    } else {
        const attractionForce = 120;
        const repulsionForce = 50;

        for (const star of stars) {
            const sx = (star.x / star.z) * focal + centerX;
            const sy = (star.y / star.z) * focal + centerY;

            let ax = 0, ay = 0;
            
            if (props.attractorPosition) {
                const dx = props.attractorPosition.x - sx;
                const dy = props.attractorPosition.y - sy;
                const distSq = dx * dx + dy * dy;
                if (distSq > 1) {
                    const force = attractionForce / distSq;
                    ax += dx * force;
                    ay += dy * force;
                }
            } 
            else if (mouse.value) {
                const dx = sx - mouse.value.x;
                const dy = sy - mouse.value.y;
                const distSq = dx * dx + dy * dy;
                const repelRadius = (Math.min(width, height) * 0.1) * star.sensitivity;

                if (distSq < repelRadius * repelRadius && distSq > 1) {
                    const force = repulsionForce / distSq;
                    ax += dx * force;
                    ay += dy * force;
                }
            }
            
            if (Math.abs(ax) > 0 || Math.abs(ay) > 0) {
                star.vx += (ax * star.z) / focal;
                star.vy += (ay * star.z) / focal;
            }

            const newX = star.x * star.cosAV - star.y * star.sinAV;
            const newY = star.x * star.sinAV + star.y * star.cosAV;
            star.x = newX;
            star.y = newY;
            
            const newVx = star.vx * star.cosAV - star.vy * star.sinAV;
            const newVy = star.vx * star.sinAV + star.vy * star.cosAV;
            star.vx = newVx;
            star.vy = newVy;

            star.x += star.vx;
            star.y += star.vy;

            const starAge = Date.now() - star.creationTime;
            if (starAge > 4500 - (Math.abs(star.vx) + Math.abs(star.vy)) * 300) {
                star.vx *= 0.95;
                star.vy *= 0.95;
            }

            star.z -= speed;

            if (star.z <= 0 || (star.z > width * 2 && isNaN(sx))) {
                resetStar(star, false);
            }

            if (star.z > 0) {
                const screenX = (star.x / star.z) * focal + centerX;
                const screenY = (star.y / star.z) * focal + centerY;
            
                const r = (star.baseRadius / star.z) * focal * 0.5;
                
                const distFromCenter = Math.hypot(screenX - centerX, screenY - centerY);
                const centralClearance = Math.min(width, height) * 0.05 * star.sensitivity;

                if (distFromCenter > centralClearance && screenX > 0 && screenX < width && screenY > 0 && screenY < height) {
                    const opacity = Math.min(1, (focal / star.z) * 1.5);
                    ctx.fillStyle = `rgba(226, 232, 240, ${opacity})`;
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, r, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        }
    }

    animationFrameId = requestAnimationFrame(animate);
  }

  let isInitialized = false;
  const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            initStars();
            if (!isInitialized) {
                animate();
                isInitialized = true;
            }
        }
    }
  });

  resizeObserver.observe(canvas);

  onUnmounted(() => {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseleave', handleMouseLeave);
    if(canvas) {
        resizeObserver.unobserve(canvas);
    }
  });
});
</script>

<style scoped>
.starfield-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style> 