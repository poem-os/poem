/**
 * Server Lifecycle Service
 * Provides server state tracking, startup logging, and shutdown handling
 */

import { config } from '../../config/index.js';
import { resetHelperWatcher } from '../handlebars/watcher.js';

// Server start timestamp (set when module loads)
const serverStartTime = Date.now();

// Helpers loaded count (set by Handlebars service initialization)
let helpersLoadedCount = 0;

/**
 * Get server uptime in seconds
 */
export function getUptime(): number {
  return (Date.now() - serverStartTime) / 1000;
}

/**
 * Get current environment
 */
export function getEnvironment(): 'development' | 'production' {
  return (process.env.NODE_ENV as 'development' | 'production') || 'development';
}

/**
 * Get count of registered Handlebars helpers
 * @returns Number of helpers loaded during initialization
 */
export function getHelpersLoadedCount(): number {
  return helpersLoadedCount;
}

/**
 * Set the count of registered Handlebars helpers
 * Called by poem-server integration after loading helpers
 * @param count - Number of helpers loaded
 */
export function setHelpersLoadedCount(count: number): void {
  helpersLoadedCount = count;
}

/**
 * Log server startup information
 */
export function logStartup(port: number, startTimeMs: number): void {
  const env = getEnvironment();
  const version = config.version;

  console.log('');
  console.log('\x1b[36m🚀 POEM Server starting...\x1b[0m');
  console.log(`   Port: ${port}`);
  console.log(`   Environment: ${env}`);
  console.log(`   Version: ${version}`);
  console.log(`\x1b[32m✅ Server ready in ${startTimeMs}ms\x1b[0m`);
  console.log('');
}

/**
 * Log server shutdown
 */
export function logShutdown(signal: string): void {
  console.log('');
  console.log(`\x1b[33m⚠️  Received ${signal}, shutting down gracefully...\x1b[0m`);
  console.log('\x1b[32m✅ POEM Server stopped\x1b[0m');
  console.log('');
}

/**
 * Log port conflict error with helpful message
 */
export function logPortConflict(port: number): void {
  console.error('');
  console.error(`\x1b[31m❌ Port ${port} is already in use\x1b[0m`);
  console.error('');
  console.error('Try one of these:');
  console.error(`  • Use a different port: PORT=${port + 1} npm run dev`);
  console.error(`  • Find and stop the process using port ${port}`);
  console.error(`  • Use 'lsof -i :${port}' to identify the process`);
  console.error('');
}

/**
 * Setup graceful shutdown handlers
 */
export function setupShutdownHandlers(): void {
  const shutdown = async (signal: string) => {
    // Stop the helper watcher before shutdown
    await resetHelperWatcher();

    logShutdown(signal);
    process.exit(0);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

/**
 * Server state for health endpoint
 */
export interface ServerState {
  uptime: number;
  environment: 'development' | 'production';
  helpersLoaded: number;
  version: string;
}

/**
 * Get current server state for health endpoint
 */
export function getServerState(): ServerState {
  return {
    uptime: getUptime(),
    environment: getEnvironment(),
    helpersLoaded: getHelpersLoadedCount(),
    version: config.version,
  };
}
