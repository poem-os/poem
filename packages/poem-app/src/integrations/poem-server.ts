import type { AstroIntegration } from 'astro';
import { logStartup, setupShutdownHandlers, logPortConflict } from '../services/server/index.js';

/**
 * POEM Server Integration
 * Handles startup logging, graceful shutdown, and port conflict detection
 */
export function poemServer(): AstroIntegration {
  let startTime: number;

  return {
    name: 'poem-server',
    hooks: {
      'astro:config:setup': () => {
        startTime = Date.now();
      },
      'astro:server:setup': ({ server }) => {
        // Setup graceful shutdown handlers
        setupShutdownHandlers();

        // Handle port conflict errors
        server.httpServer?.on('error', (error: NodeJS.ErrnoException) => {
          if (error.code === 'EADDRINUSE') {
            const port = (server.httpServer?.address() as { port: number })?.port || 4321;
            logPortConflict(port);
            process.exit(1);
          }
        });
      },
      'astro:server:start': ({ address }) => {
        const elapsed = Date.now() - startTime;
        const port = address.port;
        logStartup(port, elapsed);
      },
    },
  };
}
