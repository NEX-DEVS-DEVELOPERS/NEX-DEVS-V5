import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import neonDb from '@/lib/neon';    // Neon PostgreSQL database

export async function GET(request: NextRequest) {
  try {
    // Basic server information
    const serverInfo = {
      nodeVersion: process.version,
      platform: os.platform(),
      architecture: os.arch(),
      cpus: os.cpus().length,
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      uptime: os.uptime(),
      environment: process.env.NODE_ENV || 'unknown',
      serverTime: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    // Get Neon PostgreSQL status (primary database)
    let databaseStatus = null;
    try {
      const result = await neonDb.testConnection();
      const projects = await neonDb.getProjects();
      const featuredProjects = await neonDb.getFeaturedProjects();
      const newlyAddedProjects = await neonDb.getNewlyAddedProjects();

      databaseStatus = {
        type: 'PostgreSQL (Neon)',
        connectivity: result.success ? 'connected' : 'error',
        lastConnection: result.timestamp,
        projects: {
          total: projects.length,
          featured: featuredProjects.length,
          newlyAdded: newlyAddedProjects.length
        }
      };
    } catch (error) {
      console.error('Error getting Neon database status:', error);
      databaseStatus = {
        type: 'PostgreSQL (Neon)',
        connectivity: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
    
    // Return all information
    return NextResponse.json({
      ...serverInfo,
      database: databaseStatus
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error in database status API:', error);
    
    return NextResponse.json({
      error: 'Failed to get database status information',
      details: error instanceof Error ? error.message : 'Unknown error',
      serverTime: new Date().toISOString(),
      timestamp: Date.now()
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
} 