import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Get environment information
    const nodeVersion = process.version;
    const uptime = process.uptime();
    const nodeEnv = process.env.NODE_ENV;
    
    // Get package.json to determine Next.js version
    let nextVersion = 'unknown';
    try {
      const packageJsonPath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        nextVersion = packageJson.dependencies?.next || packageJson.devDependencies?.next || 'unknown';
      }
    } catch (err) {
      console.error('Error reading package.json:', err);
    }
    
    // Get system information
    const platform = os.platform();
    const cpuInfo = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    
    // Enhanced database information
    const dbInfo = {
      type: process.env.DATABASE_URL?.includes('mysql') 
        ? 'MySQL' 
        : process.env.MYSQL_HOST 
          ? 'MySQL' 
          : 'JSON',
      host: process.env.MYSQL_HOST || process.env.DATABASE_URL?.split('@')[1]?.split('/')[0] || 'N/A',
      database: process.env.MYSQL_DATABASE || process.env.DATABASE_URL?.split('/').pop() || 'N/A',
      port: process.env.MYSQL_PORT || process.env.DATABASE_URL?.match(/:(\d+)\//)?.pop() || 'N/A',
      isConnected: Boolean(process.env.MYSQL_HOST || process.env.DATABASE_URL?.includes('mysql')),
      connectionType: process.env.DATABASE_URL ? 'URL String' : process.env.MYSQL_HOST ? 'Direct Connection' : 'Local JSON',
      ssl: Boolean(process.env.DATABASE_URL?.includes('ssl=true') || process.env.MYSQL_SSL === 'true'),
      // Add connection URLs (sanitized for security)
      localUrl: process.env.NODE_ENV === 'development' ? 'mysql://localhost:3306/railway' : null,
      productionUrl: process.env.DATABASE_URL 
        ? `mysql://${process.env.DATABASE_URL.split('@')[1]}` // Only show host part
        : process.env.MYSQL_HOST 
          ? `mysql://${process.env.MYSQL_HOST}:${process.env.MYSQL_PORT}/${process.env.MYSQL_DATABASE}`
          : null
    };
    
    // Calculate API response time
    const startTime = process.hrtime();
    const endTime = process.hrtime(startTime);
    const responseTimeMs = (endTime[0] * 1000 + endTime[1] / 1000000).toFixed(2);
    
    // Get headers information from request
    const userAgent = request.headers.get('user-agent') ?? 'Unknown';
    const host = request.headers.get('host') ?? 'localhost';
    const referer = request.headers.get('referer') ?? 'Unknown';

    // Enhanced website URLs
    const websiteUrls = {
      current: request.url,
      local: 'http://localhost:3000',
      production: process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
        ? `https://${process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL}`
        : null,
      preview: process.env.VERCEL_ENV === 'preview' 
        ? `https://${process.env.VERCEL_URL}`
        : null,
      environment: process.env.NODE_ENV,
      isVercel: Boolean(process.env.VERCEL),
      branch: process.env.VERCEL_GIT_COMMIT_REF || 'N/A'
    };
    
    // Enhanced performance metrics
    const performanceMetrics = {
      memory: {
        used: Math.round(usedMemory / 1024 / 1024),
        total: Math.round(totalMemory / 1024 / 1024),
        percentage: Math.round((usedMemory / totalMemory) * 100),
        freeMemory: Math.round(freeMemory / 1024 / 1024),
      },
      cpu: {
        cores: cpuInfo.length,
        model: cpuInfo[0]?.model || 'Unknown',
        speed: cpuInfo[0]?.speed || 'Unknown',
        loadAverage: os.loadavg(),
      },
      uptime: {
        raw: uptime,
        formatted: `${Math.floor(uptime / 60 / 60)}h ${Math.floor((uptime / 60) % 60)}m ${Math.floor(uptime % 60)}s`,
      },
      process: {
        pid: process.pid,
        ppid: process.ppid,
        title: process.title,
        arch: process.arch,
      }
    };
    
    // Construct response data
    const debugInfo = {
      timestamp: new Date().toISOString(),
      nodeVersion,
      nextVersion,
      nodeEnv,
      platform,
      performanceMetrics,
      database: dbInfo,
      websiteUrls,
      apiResponseTime: `${responseTimeMs}ms`,
      requestInfo: {
        url: request.url,
        method: request.method,
        userAgent,
        host,
        referer,
      }
    };
    
    return NextResponse.json(debugInfo, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, must-revalidate',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error generating debug information:', error);
    return NextResponse.json(
      { error: 'Failed to generate debug information' }, 
      { status: 500 }
    );
  }
} 