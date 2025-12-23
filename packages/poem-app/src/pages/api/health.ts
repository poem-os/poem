import type { APIContext } from 'astro';

/**
 * Health check endpoint for POEM server
 * Returns server status, timestamp, and version
 */
export async function GET(_context: APIContext) {
  return new Response(
    JSON.stringify({
      status: 'ok',
      timestamp: new Date().toISOString(),
      version: '0.1.0',
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}
