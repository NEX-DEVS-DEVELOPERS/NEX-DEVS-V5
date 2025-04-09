import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/services/database';
import fs from 'fs';
import path from 'path';

const ADMIN_PASSWORD = 'nex-devs.org889123';

// API endpoint to export all database data
export async function GET(request: NextRequest) {
  try {
    // Check auth - require admin password
    const url = new URL(request.url);
    const password = url.searchParams.get('password');
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
    
    // Get all projects
    const projects = db.getAllProjects();
    
    // Create backup folder if it doesn't exist
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Generate backup filename with timestamp
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(backupDir, `db-backup-${timestamp}.json`);
    
    // Write data to backup file
    fs.writeFileSync(backupFilePath, JSON.stringify(projects, null, 2));
    
    // Return success response with data
    return NextResponse.json({
      success: true,
      message: 'Database exported successfully',
      count: projects.length,
      backupFile: backupFilePath,
      data: projects
    });
  } catch (error) {
    console.error('Error exporting database:', error);
    return NextResponse.json({ 
      error: 'Failed to export database data',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 