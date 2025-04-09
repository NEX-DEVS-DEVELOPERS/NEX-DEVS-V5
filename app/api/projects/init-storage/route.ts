import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Project type definition
type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link: string;
  featured: boolean;
};

// Set a password for admin operations
const ADMIN_PASSWORD = 'nex-devs.org889123';

// Default empty project data
const DEFAULT_PROJECTS: Project[] = [];

// JSON storage path
const JSON_STORAGE_PATH = path.join(process.cwd(), 'projects.json');

// Handler for POST request to initialize storage
export async function POST(request: NextRequest) {
  try {
    // Get admin password from headers
    const adminAuth = request.headers.get('AdminAuth');
    
    // Validate password
    if (adminAuth !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if projects.json already exists
    const fileExists = existsSync(JSON_STORAGE_PATH);
    
    if (fileExists) {
      // File already exists, no need to initialize
      return NextResponse.json({ success: true, message: 'Storage already exists' });
    }
    
    // Create directory if it doesn't exist
    const storageDir = path.dirname(JSON_STORAGE_PATH);
    await fs.mkdir(storageDir, { recursive: true });
    
    // Create a default projects.json file
    await fs.writeFile(JSON_STORAGE_PATH, JSON.stringify(DEFAULT_PROJECTS, null, 2), 'utf-8');
    
    console.log(`Created default storage file at ${JSON_STORAGE_PATH}`);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Storage initialized successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error initializing storage:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize storage', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 