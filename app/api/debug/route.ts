import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import fs from 'fs';
import path from 'path';
import mysqlDb from '@/lib/mysql';

// Check if we're in read-only mode on Vercel
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const READ_ONLY_MODE = isVercel && isProduction;

// Admin password (should match other files)
const ADMIN_PASSWORD = 'nex-devs.org889123';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const password = url.searchParams.get('password');
    
    // Check if password is provided and correct
    const isAuthorized = password === ADMIN_PASSWORD;
    
    // Get basic debug info that's safe to expose without auth
    const basicInfo = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      platform: process.env.VERCEL ? 'Vercel' : 'Other',
      readOnlyMode: READ_ONLY_MODE,
      region: process.env.VERCEL_REGION || 'unknown',
      nodejs: process.version
    };
    
    // Return limited info if not authorized
    if (!isAuthorized) {
      return NextResponse.json({
        ...basicInfo,
        message: 'For detailed debug information, provide the admin password'
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    // Get detailed database status for authorized users
    const dbStatus = await mysqlDb.getDebugStatus();
    
    // Check connectivity by running a test query
    let dbConnectivity = 'unknown';
    try {
      await mysqlDb.testConnection();
      dbConnectivity = 'connected';
    } catch (error) {
      dbConnectivity = 'disconnected';
    }
    
    // Get project counts
    let projectStats = {
      total: 0,
      featured: 0,
      newlyAdded: 0,
      error: null as string | null
    };
    
    try {
      const allProjects = await mysqlDb.getProjects();
      const featuredProjects = await mysqlDb.getFeaturedProjects();
      const newlyAddedProjects = await mysqlDb.getNewlyAddedProjects();
      
      projectStats = {
        total: allProjects.length,
        featured: featuredProjects.length,
        newlyAdded: newlyAddedProjects.length,
        error: null
      };
    } catch (error) {
      projectStats.error = error instanceof Error ? error.message : String(error);
    }
    
    // Return detailed debug information
    return NextResponse.json({
      ...basicInfo,
      database: {
        connectivity: dbConnectivity,
        status: dbStatus,
        projects: projectStats
      },
      serverTime: new Date().toISOString(),
      processUptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error getting debug info:', error);
    return NextResponse.json({ 
      error: 'Failed to get debug information',
      message: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
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