import { NextResponse } from 'next/server';
import db from '@/lib/mysql';

export async function GET() {
  try {
    // Test the connection
    const connectionTest = await db.testConnection();
    
    // Try to get all projects
    let projects = [];
    let error = null;
    
    try {
      projects = await db.getProjects();
    } catch (err) {
      error = err.message;
    }
    
    return NextResponse.json({
      connection: connectionTest,
      projectsCount: projects.length,
      projects: projects.map(p => ({
        id: p.id,
        title: p.title,
        category: p.category
      })),
      error
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'API Test failed', details: error.message },
      { status: 500 }
    );
  }
} 