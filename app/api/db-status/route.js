import { NextResponse } from 'next/server';
import db from '@/lib/mysql';

export async function GET() {
  try {
    // Test the database connection
    const result = await db.testConnection();
    
    // Initialize the database if needed
    if (result.success) {
      await db.initDatabase();
    }
    
    // Check for projects
    let projectCount = 0;
    let projects = [];
    
    try {
      projects = await db.getProjects();
      projectCount = projects.length;
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
    
    return NextResponse.json({
      status: result.success ? 'connected' : 'error',
      connection: result,
      database: process.env.MYSQL_DATABASE,
      host: process.env.MYSQL_HOST,
      projectCount,
      projects: projectCount > 0 ? projects.map(p => ({ id: p.id, title: p.title })) : [],
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Database connection check failed:', error);
    return NextResponse.json({
      status: 'error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : null,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 