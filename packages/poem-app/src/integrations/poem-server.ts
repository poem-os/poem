import type { AstroIntegration } from 'astro';
import { logStartup, setupShutdownHandlers, logPortConflict, setHelpersLoadedCount } from '../services/server/index.js';
import { initHandlebarsService } from '../services/handlebars/index.js';
import { loadHelpers } from '../services/handlebars/loader.js';
import { getHelperWatcher } from '../services/handlebars/watcher.js';

/**
 * POEM Server Integration
 * Handles startup logging, graceful shutdown, and port conflict detection
 */
export function poemServer(): AstroIntegration {
  let startTime: number;

  return {
    name: 'poem-server',
    hooks: {
      'astro:config:setup': async () => {
        startTime = Date.now();

        // Initialize Handlebars service and load helpers
        const handlebarsService = initHandlebarsService();
        const result = await loadHelpers(handlebarsService);

        // Update server state with helper count
        setHelpersLoadedCount(result.total);

        // Start helper watcher for hot-reload (after initial load completes)
        const watcher = getHelperWatcher(handlebarsService);
        await watcher.start();
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
