import type { APIContext } from 'astro';
import { getServerState } from '../../services/server/index.js';

/**
 * Health check endpoint for POEM server
 * Returns server status, version, uptime, and helpers count
 *
 * @example Response:
 * {
 *   "status": "ok",
 *   "version": "0.1.0",
 *   "uptime": 123.45,
 *   "helpersLoaded": 0
 * }
 */
export async function GET(_context: APIContext) {
  const state = getServerState();

  return new Response(
    JSON.stringify({
      status: 'ok',
      version: state.version,
      uptime: state.uptime,
      helpersLoaded: state.helpersLoaded,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
