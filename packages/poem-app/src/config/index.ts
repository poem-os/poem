/**
 * POEM App Configuration
 * Reads from environment variables with sensible defaults
 */
export const config = {
  server: {
    port: parseInt(process.env.PORT || '4321', 10),
    host: process.env.HOST || 'localhost',
  },
  version: process.env.npm_package_version || '0.1.0',
};

export type Config = typeof config;
