import { NextRequest } from 'next/server';
import { enhancedSecurityMonitor } from '@/utils/enhancedSecurityMonitor';
import { sessionManager } from '@/utils/sessionManager';

// Admin password from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

/**
 * Server-Sent Events endpoint for real-time security updates
 * Provides live streaming of security statistics, events, and alerts
 */
export async function GET(request: NextRequest) {
  // Check authentication
  const url = new URL(request.url);
  const password = url.searchParams.get('password') || '';
  
  if (password !== ADMIN_PASSWORD) {
    return new Response('Authentication required', { status: 401 });
  }

  // Create readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const encoder = new TextEncoder();
      
      const sendData = (data: any) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial data
      const initialData = {
        type: 'initial',
        timestamp: new Date().toISOString(),
        stats: enhancedSecurityMonitor.getSecurityStats(),
        events: enhancedSecurityMonitor.getRecentEvents(10),
        alerts: enhancedSecurityMonitor.getSecurityAlerts(),
        sessions: sessionManager.getActiveSessions().slice(0, 10),
        sessionStats: sessionManager.getSessionStats()
      };
      
      sendData(initialData);

      // Subscribe to security updates
      const unsubscribeSecurity = enhancedSecurityMonitor.onUpdate((securityData) => {
        sendData({
          type: 'security_update',
          timestamp: new Date().toISOString(),
          ...securityData
        });
      });

      // Subscribe to session updates
      const unsubscribeSession = sessionManager.onUpdate((sessionData) => {
        sendData({
          type: 'session_update',
          timestamp: new Date().toISOString(),
          sessions: sessionData.sessions.slice(0, 10),
          sessionStats: sessionData.stats
        });
      });

      // Send heartbeat every 30 seconds
      const heartbeatInterval = setInterval(() => {
        sendData({
          type: 'heartbeat',
          timestamp: new Date().toISOString(),
          status: 'alive'
        });
      }, 30000);

      // Send periodic full updates every 5 seconds
      const updateInterval = setInterval(() => {
        const fullUpdate = {
          type: 'full_update',
          timestamp: new Date().toISOString(),
          stats: enhancedSecurityMonitor.getSecurityStats(),
          events: enhancedSecurityMonitor.getRecentEvents(10),
          alerts: enhancedSecurityMonitor.getSecurityAlerts(),
          sessions: sessionManager.getActiveSessions().slice(0, 10),
          sessionStats: sessionManager.getSessionStats()
        };
        
        sendData(fullUpdate);
      }, 5000);

      // Cleanup function
      const cleanup = () => {
        clearInterval(heartbeatInterval);
        clearInterval(updateInterval);
        unsubscribeSecurity();
        unsubscribeSession();
      };

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        cleanup();
        controller.close();
      });

      // Store cleanup function for potential manual cleanup
      (controller as any).cleanup = cleanup;
    },

    cancel() {
      // Cleanup when stream is cancelled
      if ((this as any).cleanup) {
        (this as any).cleanup();
      }
    }
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Cache-Control',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  });
}

/**
 * Handle preflight requests for CORS
 */
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Cache-Control',
    },
  });
}
