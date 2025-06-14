/// <reference types="vitest" />
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    // Vitest configuration options
    globals: true, // Use global APIs (describe, it, expect) without importing
    environment: 'node', // Or 'jsdom' if you need DOM APIs
  },
}); 