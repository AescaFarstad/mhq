import { ref, computed } from 'vue';

// Music configuration - change the first entry to modify the default volume
const VOLUME_LEVELS = [0.11, 0.03, 0, 1.0, 0.33];
const DEFAULT_VOLUME = VOLUME_LEVELS[0];
const MUSIC_VOLUME_KEY = 'mhq_music_volume';

// Global music management
let globalAudio: HTMLAudioElement | null = null;
const globalMusicHasStarted = ref(false);
const globalMusicIsPlaying = ref(false);
const globalMusicVolume = ref(DEFAULT_VOLUME);

// Load volume from localStorage or use default
function loadMusicVolume(): number {
  try {
    const saved = localStorage.getItem(MUSIC_VOLUME_KEY);
    if (saved !== null) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 1) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Failed to load music volume from localStorage:', error);
  }
  return DEFAULT_VOLUME;
}

// Save volume to localStorage
function saveMusicVolume(volume: number): void {
  try {
    localStorage.setItem(MUSIC_VOLUME_KEY, volume.toString());
  } catch (error) {
    console.warn('Failed to save music volume to localStorage:', error);
  }
}

// Initialize and start global music
export function initializeMusic(): void {
  if (globalMusicHasStarted.value) return;
  
  console.log('Initializing music...');
  
  // Load saved volume
  globalMusicVolume.value = loadMusicVolume();
  
  globalAudio = new Audio(`${import.meta.env.BASE_URL}sound/Heavenly Flow.mp3`);
  globalAudio.loop = false; // Play only once
  
  // Set up event listeners
  globalAudio.addEventListener('ended', () => {
    console.log('Music ended');
    globalMusicIsPlaying.value = false;
  });
  
  globalAudio.addEventListener('play', () => {
    console.log('Music started playing');
    globalMusicIsPlaying.value = true;
  });
  
  globalAudio.addEventListener('pause', () => {
    console.log('Music paused');
    globalMusicIsPlaying.value = false;
  });
  
  // Set initial volume and play
  globalAudio.volume = globalMusicVolume.value;
  globalAudio.play().catch(error => {
    console.log('Music play failed:', error);
  });
  
  globalMusicHasStarted.value = true;
}

export function useMusic() {
  // Toggle volume to next level
  const toggleVolume = () => {
    const currentIndex = VOLUME_LEVELS.indexOf(globalMusicVolume.value);
    const nextIndex = (currentIndex + 1) % VOLUME_LEVELS.length;
    const newVolume = VOLUME_LEVELS[nextIndex];
    
    globalMusicVolume.value = Math.max(0, Math.min(1, newVolume));
    saveMusicVolume(globalMusicVolume.value);
    
    // Update global audio volume
    if (globalAudio) {
      globalAudio.volume = newVolume;
    }
  };
  
  // Get current volume as percentage
  const getCurrentVolumePercent = computed(() => {
    return Math.round(globalMusicVolume.value * 100);
  });
  
  // Check if music is playing
  const isPlaying = computed(() => {
    return globalMusicIsPlaying.value;
  });
  
  // Check if music has started
  const hasStarted = computed(() => {
    return globalMusicHasStarted.value;
  });
  
  // Show volume control (only when music is playing)
  const showVolumeControl = computed(() => {
    return isPlaying.value;
  });
  
  return {
    toggleVolume,
    getCurrentVolumePercent,
    isPlaying,
    hasStarted,
    showVolumeControl,
  };
} 