import { NextRequest, NextResponse } from 'next/server';
import { Project } from './index';
import db from '@/app/services/database';
import fs from 'fs';
import path from 'path';

// Set a password for admin operations
const ADMIN_PASSWORD = 'nex-devs.org889123';

// Check if we're in read-only mode on Vercel
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const READ_ONLY_MODE = isVercel && isProduction;

// GET all projects
export async function GET(request: NextRequest) {
  try {
    // Determine if we need specific projects or all
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const newlyAdded = url.searchParams.get('newlyAdded');
    
    // Check if we need to return database status (admin only)
    if (action === 'status') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Get database information
      try {
        const dbStats = getDatabaseStats();
        
        return NextResponse.json({
          path: dbStats.path,
          count: dbStats.count,
          size: dbStats.size,
          lastModified: dbStats.lastModified,
          environment: process.env.NODE_ENV || 'unknown',
          timestamp: new Date().toISOString()
        }, {
          headers: {
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      } catch (error) {
        console.error('Error getting database stats:', error);
        return NextResponse.json({ 
          error: 'Failed to get database stats',
          details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
      }
    }
    
    // Check if we need to return categories instead of projects
    if (action === 'categories') {
      const categories = db.getUniqueCategories();
      return new NextResponse(JSON.stringify(categories), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    let projects: Project[];
    
    // Get the appropriate projects based on query parameters
    if (newlyAdded === 'true') {
      projects = db.getNewlyAddedProjects();
    } else if (featured === 'true') {
      projects = db.getFeaturedProjects();
    } else if (category && category !== 'All') {
      projects = db.getProjectsByCategory(category);
    } else {
      projects = db.getAllProjects();
    }
    
    // Set strong cache control headers to prevent browser caching
    return new NextResponse(JSON.stringify(projects), {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'X-Accel-Expires': '0',
        'Last-Modified': new Date().toUTCString()
      }
    });
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}

// Helper function to get database stats
function getDatabaseStats() {
  try {
    // Get path from db
    const dbPath = (db as any).db?.filename || 'unknown';
    
    // Count projects
    const countProjects = db.getAllProjects().length;
    
    // Get file stats if possible
    let fileSize = 0;
    let lastModified = 'unknown';
    
    if (dbPath !== 'unknown' && dbPath !== ':memory:') {
      try {
        const stats = fs.statSync(dbPath);
        fileSize = stats.size;
        lastModified = stats.mtime.toISOString();
      } catch (error) {
        console.warn('Could not get file stats for database:', error);
      }
    }
    
    return {
      path: dbPath,
      count: countProjects,
      size: fileSize,
      lastModified: lastModified
    };
  } catch (error) {
    console.error('Error getting database stats:', error);
    return {
      path: 'error',
      count: 0,
      size: 0,
      lastModified: 'error'
    };
  }
}

// POST to create a new project
export async function POST(request: NextRequest) {
  try {
    const { project, password } = await request.json();
    
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate required fields
    if (!project) {
      return NextResponse.json({ error: 'Invalid project data - project object is missing' }, { status: 400 });
    }
    
    // Check all required fields according to SQLite schema
    const requiredFields = ['title', 'description', 'category', 'link'];
    const missingFields = requiredFields.filter(field => !project[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Invalid project data - missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }

    // Check if this is a newly added project
    const isNewlyAdded = project.title.startsWith('NEWLY ADDED:');
    
    // Fill in default values for any undefined fields that are required by the database
    const projectWithDefaults = {
      ...project,
      title: project.title.trim(),
      description: project.description.trim(),
      // Ensure image field has a value, use placeholder if not provided
      image: (project.image && project.image.trim()) || '/projects/placeholder.jpg',
      category: project.category.trim(),
      link: project.link.trim(),
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      featured: Boolean(project.featured),
      // Add newly added project fields if applicable
      status: isNewlyAdded ? (project.status || 'In Development') : project.status,
      updatedDays: isNewlyAdded ? (project.updatedDays || 1) : project.updatedDays,
      progress: isNewlyAdded ? (project.progress || 50) : project.progress,
      developmentProgress: isNewlyAdded ? (project.developmentProgress || 50) : project.developmentProgress,
      estimatedCompletion: project.estimatedCompletion || null,
      // SQLite schema defines these fields but they may not be in the form data
      secondImage: project.secondImage || null,
      showBothImagesInPriority: Boolean(project.showBothImagesInPriority),
      features: Array.isArray(project.features) ? project.features : [],
      exclusiveFeatures: Array.isArray(project.exclusiveFeatures) ? project.exclusiveFeatures : [],
      imagePriority: typeof project.imagePriority === 'number' ? project.imagePriority : (isNewlyAdded ? 1 : 5),
      visualEffects: project.visualEffects ? (
        typeof project.visualEffects === 'string' ? 
          project.visualEffects : 
          JSON.stringify(project.visualEffects)
      ) : JSON.stringify({
        animation: 'none',
        showBadge: false
      }),
      // Always set lastUpdated field
      lastUpdated: new Date().toISOString()
    };
    
    console.log('Creating project with data:', {
      title: projectWithDefaults.title,
      category: projectWithDefaults.category,
      isNewlyAdded,
      visualEffectsType: typeof projectWithDefaults.visualEffects
    });
    
    // Create the new project
    try {
      const newProject = db.createProject(projectWithDefaults);
      
      console.log('Project created successfully with ID:', newProject.id);
      
      return NextResponse.json(newProject, { 
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } catch (dbError) {
      console.error('Database error creating project:', dbError);
      console.error('Project data causing error:', JSON.stringify(projectWithDefaults, null, 2));
      return NextResponse.json({ 
        error: 'Database error creating project: ' + (dbError instanceof Error ? dbError.message : String(dbError)),
        details: projectWithDefaults
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to add project: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 });
  }
}

// PUT to update a project
export async function PUT(request: NextRequest) {
  try {
    console.log('Update project request received');
    const { project, password } = await request.json();
    
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate project data
    if (!project || !project.id) {
      return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
    }
    
    console.log(`Updating project ID: ${project.id}`);
    
    // Special handling for read-only mode
    if (READ_ONLY_MODE) {
      console.log(`[Read-only mode] Would update project ID: ${project.id}`);
      
      // In Vercel production, return success even though we can't actually modify the DB
      return NextResponse.json({ 
        ...project, 
        readOnly: true,
        message: 'Project updated (read-only mode)' 
      });
    }
    
    // Check if project exists
    const existingProject = db.getProjectById(project.id);
    
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Update the project
    const updatedProject = {
      ...project,
      title: project.title.trim(),
      description: project.description.trim(),
      image: project.image.trim(),
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      exclusiveFeatures: Array.isArray(project.exclusiveFeatures) ? project.exclusiveFeatures : [],
      featured: Boolean(project.featured),
      imagePriority: typeof project.imagePriority === 'number' ? project.imagePriority : 5,
      visualEffects: project.visualEffects || {
        animation: 'none',
        showBadge: false
      },
      lastUpdated: new Date().toISOString()
    };
    
    const success = db.updateProject(updatedProject);
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
    
    // Force revalidation paths if needed
    try {
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/&secret=${ADMIN_PASSWORD}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } catch (error) {
      console.error('Error revalidating paths:', error);
    }
    
    return NextResponse.json(updatedProject, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ 
      error: 'Failed to update project', 
      details: error instanceof Error ? error.message : String(error),
      readOnly: READ_ONLY_MODE
    }, { status: 500 });
  }
}

// DELETE a project
export async function DELETE(request: NextRequest) {
  try {
    console.log('Delete request received');
    
    // Get data from either query parameters or request body
    const url = new URL(request.url);
    let id: number | null = null;
    let password: string | null = null;
    
    // Check query parameters first
    const idParam = url.searchParams.get('id');
    const passwordParam = url.searchParams.get('password');
    
    if (idParam && passwordParam) {
      id = parseInt(idParam);
      password = passwordParam;
    } else {
      // Fall back to request body if no query parameters
      try {
        const body = await request.json();
        id = body.id;
        password = body.password;
      } catch (e) {
        console.error('Error parsing request body:', e);
      }
    }
    
    console.log(`Project ID to delete: ${id}, Auth provided: ${!!password}`);
    
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate ID
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    
    // Special handling for read-only mode
    if (READ_ONLY_MODE) {
      console.log(`[Read-only mode] Would delete project ID: ${id}`);
      
      // In Vercel production, return success even though we can't actually modify the DB
      // This allows the UI to work correctly even though changes aren't permanent
      return NextResponse.json({ 
        success: true,
        readOnly: true,
        message: 'Project marked for deletion (read-only mode)' 
      });
    }
    
    // Delete the project
    const success = db.deleteProject(id);
    
    if (!success) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : String(error),
      readOnly: READ_ONLY_MODE
    }, { status: 500 });
  }
} 