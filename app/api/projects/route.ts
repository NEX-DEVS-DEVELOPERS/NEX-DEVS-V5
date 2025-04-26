import { NextRequest, NextResponse } from 'next/server';
import { Project } from './index';
import sqliteDb from '@/app/services/database'; // SQLite database (keeping as fallback)
import mysqlDb from '@/lib/mysql'; // MySQL database (primary)
import fs from 'fs';
import path from 'path';

// Set a password for admin operations
const ADMIN_PASSWORD = 'nex-devs.org889123';

// Use MySQL by default
const db = mysqlDb;

// Check if we're in read-only mode on Vercel
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const READ_ONLY_MODE = isVercel && isProduction;

// GET all projects
export async function GET(request: NextRequest) {
  try {
    // Add timestamp to force fresh data
    const timestamp = new Date().getTime();
    console.log(`GET projects request at timestamp: ${timestamp}`);
    
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
        const dbStats = await getDatabaseStats();
        
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
      const categories = await db.getUniqueCategories();
      return new NextResponse(JSON.stringify(categories), {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }
    
    let projects;
    
    // Get the appropriate projects based on query parameters
    if (newlyAdded === 'true') {
      projects = await db.getNewlyAddedProjects();
      console.log(`Retrieved ${projects.length} newly added projects`);
    } else if (featured === 'true') {
      projects = await db.getFeaturedProjects();
      console.log(`Retrieved ${projects.length} featured projects`);
    } else if (category && category !== 'All') {
      projects = await db.getProjectsByCategory(category);
      console.log(`Retrieved ${projects.length} projects in category: ${category}`);
    } else {
      projects = await db.getProjects();
      console.log(`Retrieved ${projects.length} total projects`);
    }
    
    // Log a sample of the projects (for debugging)
    if (projects.length > 0) {
      console.log(`First project sample:`, {
        id: projects[0].id,
        title: projects[0].title,
        isCodeScreenshot: projects[0].isCodeScreenshot
      });
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
        'Last-Modified': new Date().toUTCString(),
        'X-Response-Time': new Date().getTime().toString()
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
async function getDatabaseStats() {
  try {
    // For MySQL, use a different approach
    const result = await db.testConnection();
    const projects = await db.getProjects();
    const countProjects = projects.length;
    
    return {
      path: process.env.MYSQL_HOST || 'mysql-database',
      count: countProjects,
      size: 0, // Not applicable for MySQL
      lastModified: new Date().toISOString()
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
    
    // Check all required fields - support both SQLite and MySQL column names
    const requiredFields = ['title', 'description', 'category'];
    // Check for either 'link' or 'project_link'
    if (!project.link && !project.project_link) {
      requiredFields.push('link');
    }
    
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
      // Add MySQL compatible field
      image_url: (project.image_url || project.image || '/projects/placeholder.jpg').trim(),
      category: project.category.trim(),
      // Handle both SQLite and MySQL link field names
      link: project.link ? project.link.trim() : (project.project_link ? project.project_link.trim() : ''),
      // Add MySQL compatible field
      project_link: project.project_link ? project.project_link.trim() : (project.link ? project.link.trim() : ''),
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
      // Code screenshot fields
      isCodeScreenshot: Boolean(project.isCodeScreenshot),
      is_code_screenshot: Boolean(project.isCodeScreenshot),
      codeLanguage: project.codeLanguage || '',
      code_language: project.codeLanguage || '',
      codeTitle: project.codeTitle || '',
      code_title: project.codeTitle || '',
      codeContent: project.codeContent || '',
      code_content: project.codeContent || '',
      useDirectCodeInput: Boolean(project.useDirectCodeInput),
      use_direct_code_input: Boolean(project.useDirectCodeInput),
      // Always set lastUpdated field
      lastUpdated: new Date().toISOString(),
      // MySQL created_at field
      created_at: new Date().toISOString()
    };
    
    console.log('Creating project with data:', {
      title: projectWithDefaults.title,
      category: projectWithDefaults.category,
      isNewlyAdded,
      visualEffectsType: typeof projectWithDefaults.visualEffects
    });
    
    // Create the new project
    try {
      const newProject = await db.createProject(projectWithDefaults);
      
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
    const existingProject = await db.getProjectById(project.id);
    
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Update the project with field mapping support for MySQL
    const updatedProject = {
      ...project,
      title: project.title.trim(),
      description: project.description.trim(),
      // Handle both SQLite and MySQL image field
      image: project.image ? project.image.trim() : project.image_url ? project.image_url.trim() : existingProject.image,
      // Add MySQL compatible field
      image_url: project.image_url ? project.image_url.trim() : project.image ? project.image.trim() : existingProject.image_url || existingProject.image,
      // Handle both SQLite and MySQL link field
      link: project.link ? project.link.trim() : project.project_link ? project.project_link.trim() : existingProject.link,
      // Add MySQL compatible field
      project_link: project.project_link ? project.project_link.trim() : project.link ? project.link.trim() : existingProject.project_link || existingProject.link,
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      exclusiveFeatures: Array.isArray(project.exclusiveFeatures) ? project.exclusiveFeatures : [],
      featured: Boolean(project.featured),
      imagePriority: typeof project.imagePriority === 'number' ? project.imagePriority : 5,
      visualEffects: project.visualEffects || {
        animation: 'none',
        showBadge: false
      },
      // Code screenshot fields
      isCodeScreenshot: project.isCodeScreenshot !== undefined ? Boolean(project.isCodeScreenshot) : Boolean(existingProject.isCodeScreenshot),
      is_code_screenshot: project.isCodeScreenshot !== undefined ? Boolean(project.isCodeScreenshot) : Boolean(existingProject.isCodeScreenshot),
      codeLanguage: project.codeLanguage || existingProject.codeLanguage || '',
      code_language: project.codeLanguage || existingProject.codeLanguage || '',
      codeTitle: project.codeTitle || existingProject.codeTitle || '',
      code_title: project.codeTitle || existingProject.codeTitle || '',
      codeContent: project.codeContent || existingProject.codeContent || '',
      code_content: project.codeContent || existingProject.codeContent || '',
      useDirectCodeInput: project.useDirectCodeInput !== undefined ? Boolean(project.useDirectCodeInput) : Boolean(existingProject.useDirectCodeInput),
      use_direct_code_input: project.useDirectCodeInput !== undefined ? Boolean(project.useDirectCodeInput) : Boolean(existingProject.useDirectCodeInput),
      lastUpdated: new Date().toISOString(),
      // MySQL timestamp format
      updated_at: new Date().toISOString()
    };
    
    console.log('Updating project with data:', {
      id: updatedProject.id,
      title: updatedProject.title,
      isCodeScreenshot: updatedProject.isCodeScreenshot,
      codeTitle: updatedProject.codeTitle
    });
    
    const success = await db.updateProject(updatedProject.id, updatedProject);
    
    // Handle different return types between MySQL (object) and SQLite (boolean)
    const isSuccess = success !== false && success !== undefined && success !== null;
    
    if (!isSuccess) {
      return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
    }
    
    // Force revalidation paths
    try {
      // Revalidate main pages
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/&secret=${ADMIN_PASSWORD}`, {
        method: 'GET',
        cache: 'no-store'
      });
      
      // Also revalidate projects page and specific project page
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/projects&secret=${ADMIN_PASSWORD}`, {
        method: 'GET',
        cache: 'no-store'
      });
      
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/project/${project.id}&secret=${ADMIN_PASSWORD}`, {
        method: 'GET',
        cache: 'no-store'
      });
      
      console.log('All paths revalidated successfully');
    } catch (error) {
      console.error('Error revalidating paths:', error);
    }
    
    return NextResponse.json(updatedProject, {
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
    const result = await db.deleteProject(id);
    
    // Handle different return types between MySQL and SQLite
    const isSuccess = result && (typeof result === 'boolean' ? result : true);
    
    if (!isSuccess) {
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