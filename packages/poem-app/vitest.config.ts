import { defineConfig } from 'vitest/config';

/**
 * Vitest Configuration
 *
 * Sets POEM_DEV=true to ensure tests use development paths
 * (dev-workspace/ instead of packages/poem-app/poem/)
 */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.ts'],
    environment: 'node',
    testTimeout: 20000,
    hookTimeout: 20000,
    env: {
      POEM_DEV: 'true'
    },
  },
});
