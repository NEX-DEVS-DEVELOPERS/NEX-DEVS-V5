import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import mysqlDb from '@/lib/mysql';

// Check if MySQL environment variables are set
const isMySQLConfigured = process.env.MYSQL_HOST || process.env.MYSQL_DATABASE;

// Try to detect database type
async function detectDatabaseType() {
  try {
    // Try MySQL connection first if configured
    if (isMySQLConfigured) {
      try {
        const mysqlResult = await mysqlDb.testConnection();
        if (mysqlResult.success) {
          return { 
            type: 'mysql', 
            host: process.env.MYSQL_HOST || 'mysql', 
            readOnlyMode: false
          };
        }
      } catch (error) {
        console.error('MySQL test failed:', error);
      }
    }
    
    // Check for SQLite file
    const sqliteDbPaths = [
      path.join(process.cwd(), 'app/db/projects.db'),
      path.join(process.cwd(), 'db/projects.db')
    ];
    
    for (const dbPath of sqliteDbPaths) {
      if (fs.existsSync(dbPath)) {
        const isVercel = process.env.VERCEL === '1';
        const isProduction = process.env.NODE_ENV === 'production';
        const readOnlyMode = isVercel && isProduction;
        
        return { 
          type: 'sqlite', 
          path: dbPath, 
          readOnlyMode: readOnlyMode 
        };
      }
    }
    
    // No database found
    return { type: 'unknown', readOnlyMode: true };
  } catch (error) {
    console.error('Error detecting database type:', error);
    return { type: 'error', error: String(error), readOnlyMode: true };
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const check = url.searchParams.get('check');
    
    if (check === 'readOnly') {
      const dbInfo = await detectDatabaseType();
      return NextResponse.json({
        readOnlyMode: dbInfo.readOnlyMode
      });
    } else if (check === 'dbType') {
      const dbInfo = await detectDatabaseType();
      return NextResponse.json(dbInfo);
    }
    
    // Default response - full config
    const dbInfo = await detectDatabaseType();
    const config = {
      database: dbInfo,
      environment: process.env.NODE_ENV || 'development',
      isVercel: process.env.VERCEL === '1',
      timestamp: new Date().toISOString()
    };
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Error in config API:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
} 