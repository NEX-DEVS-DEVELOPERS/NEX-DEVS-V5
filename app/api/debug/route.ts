import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import fs from 'fs';
import path from 'path';
import neonDb from '@/backend/lib/neon';

// Check if we're in read-only mode on Vercel
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const isDev = process.env.NODE_ENV === 'development';
const READ_ONLY_MODE = isVercel && isProduction;

// Admin password (should match other files)
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

/**
 * Debug API endpoint to check database status and server information
 */
export async function GET(request: NextRequest) {
  // Check for authentication
  const authHeader = request.headers.get('Authorization');
  const url = new URL(request.url);
  const passwordFromQuery = url.searchParams.get('password');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  const password = passwordFromQuery || bearerToken || '';
  
  // Simple auth check if password provided
  const isAuthenticated = password === ADMIN_PASSWORD;
  
  try {
    // Gather server information
    const serverInfo = {
      environment: process.env.NODE_ENV,
      nodeVersion: process.version,
      platform: os.platform(),
      arch: os.arch(),
      cpuCount: os.cpus().length,
      memoryTotal: Math.round(os.totalmem() / (1024 * 1024)) + 'MB',
      memoryFree: Math.round(os.freemem() / (1024 * 1024)) + 'MB',
      uptime: Math.round(os.uptime()) + ' seconds'
    };

    // Test Neon PostgreSQL connection (primary database)
    let neonStatus = {
      available: Boolean(neonDb),
      connected: false,
      lastConnectionTime: null,
      error: null as string | null,
      projects: {
        total: 0,
        featured: 0,
        newlyAdded: 0
      }
    };
    
    // Get Neon PostgreSQL status
    if (neonDb) {
      try {
        const neonConnectionTest = await neonDb.testConnection();
        neonStatus.connected = neonConnectionTest.success;
        neonStatus.lastConnectionTime = new Date().toISOString();
        
        // If authenticated, get project counts
        if (isAuthenticated && neonStatus.connected) {
          const allProjects = await neonDb.getProjects();
          const featuredProjects = await neonDb.getFeaturedProjects();
          const newlyAddedProjects = await neonDb.getNewlyAddedProjects();
          
          neonStatus.projects = {
            total: allProjects.length,
            featured: featuredProjects.length,
            newlyAdded: newlyAddedProjects.length
          };
        }
        
        // If available, get debug status from Neon
        if (neonDb.getDebugStatus) {
          const neonDebug = await neonDb.getDebugStatus();
          neonStatus = { ...neonStatus, debug: neonDebug };
        }
      } catch (error) {
        neonStatus.error = error instanceof Error ? error.message : 'Unknown Neon PostgreSQL error';
        console.error('Neon PostgreSQL status check error:', error);
      }
    }
    
    // Build the response object
    const responseObj = {
      timestamp: new Date().toISOString(),
      server: serverInfo,
      database: {
        type: 'PostgreSQL (Neon)',
        ...neonStatus,
        primary: neonStatus.connected ? 'neon' : 'none'
      },
      authenticated: isAuthenticated
    };
    
    return NextResponse.json(responseObj);
    
    } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json({
      error: 'Failed to gather debug information',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
