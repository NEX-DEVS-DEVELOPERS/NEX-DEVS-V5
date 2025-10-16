import { NextRequest, NextResponse } from 'next/server';
import { Project } from './index';
import neonDb from '@/backend/lib/neon'; // Neon PostgreSQL database (primary)
import fs from 'fs';
import path from 'path';

// Set a password for admin operations
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123'
// Set a database password for project operations
const DB_PASSWORD = process.env.DATABASE_PASSWORD || 'alihasnaat919'

// Use Neon PostgreSQL database exclusively
const db = neonDb;

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
    const showcase_location = url.searchParams.get('showcase_location');
    
    // Check if we need to return database status (admin only)
    if (action === 'status') {
      const authHeader = request.headers.get('Authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      
      // Get database information
      try {
        const dbStats = await db.getDebugStatus();
        
        return NextResponse.json({
          ...dbStats,
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
    if (showcase_location) {
      console.log(`Fetching projects with showcase_location: ${showcase_location}`);
      projects = await db.getProjectsByShowcaseLocation(showcase_location);
      console.log(`Retrieved ${projects.length} projects with showcase_location: ${showcase_location}`);
    } else if (newlyAdded === 'true') {
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

// POST to create a new project
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { password, ...project } = data;
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid database password' }, { status: 401 });
    }
    
    // Validate required fields
    if (!project) {
      return NextResponse.json({ error: 'Invalid project data - project object is missing' }, { status: 400 });
    }
    
    // Check all required fields - support both camelCase and snake_case field names
    const requiredFields = ['title', 'description', 'category'];
    // Check for either 'link', 'project_link', or 'projectLink' only if project is not in development
    const hasLink = project.link || project.project_link || project.projectLink;
    const isInDevelopment = project.status === 'In Development' || project.link === '' || project.project_link === '' || project.projectLink === '';

    if (!hasLink && !isInDevelopment) {
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
    
    console.log('Incoming project data:', {
      title: project.title,
      hasShowBothImagesInPriority: 'showBothImagesInPriority' in project,
      showBothImagesInPriorityValue: project.showBothImagesInPriority,
      hasSnakeCase: 'show_both_images_in_priority' in project,
      snakeCaseValue: project.show_both_images_in_priority
    });
    
    // Fill in default values for any undefined fields that are required by the database
    const projectWithDefaults = {
      ...project,
      title: project.title.trim(),
      description: project.description.trim(),
      // Ensure image field has a value, use placeholder if not provided
      image: (project.image && project.image.trim()) || '/projects/placeholder.jpg',
      // Add PostgreSQL compatible field
      image_url: (project.image_url || project.image || '/projects/placeholder.jpg').trim(),
      category: project.category.trim(),
      // Handle both camelCase and snake_case link field names
      link: project.link ? project.link.trim() : (project.project_link ? project.project_link.trim() : (project.projectLink ? project.projectLink.trim() : '')),
      // Add PostgreSQL compatible field
      project_link: project.project_link ? project.project_link.trim() : (project.link ? project.link.trim() : (project.projectLink ? project.projectLink.trim() : '')),
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      featured: Boolean(project.featured),
      // Add newly added project fields if applicable
      status: isNewlyAdded ? (project.status || 'In Development') : project.status,
      updatedDays: isNewlyAdded ? (project.updatedDays || 1) : project.updatedDays,
      updated_days: isNewlyAdded ? (project.updated_days || project.updatedDays || 1) : (project.updated_days || project.updatedDays),
      progress: isNewlyAdded ? (project.progress || 50) : project.progress,
      developmentProgress: isNewlyAdded ? (project.developmentProgress || 50) : project.developmentProgress,
      development_progress: isNewlyAdded ? (project.development_progress || project.developmentProgress || 50) : (project.development_progress || project.developmentProgress),
      estimatedCompletion: project.estimatedCompletion || null,
      estimated_completion: project.estimated_completion || project.estimatedCompletion || null,
      // Other fields that may be defined
      secondImage: project.secondImage || null,
      second_image: project.second_image || project.secondImage || null,
      // Important: Make sure we handle both camelCase and snake_case for this field
      showBothImagesInPriority: Boolean(project.showBothImagesInPriority || project.show_both_images_in_priority),
      show_both_images_in_priority: Boolean(project.show_both_images_in_priority || project.showBothImagesInPriority),
      features: Array.isArray(project.features) ? project.features : [],
      exclusiveFeatures: Array.isArray(project.exclusiveFeatures) ? project.exclusiveFeatures : [],
      exclusive_features: Array.isArray(project.exclusive_features) ? project.exclusive_features : (Array.isArray(project.exclusiveFeatures) ? project.exclusiveFeatures : []),
      imagePriority: typeof project.imagePriority === 'number' ? project.imagePriority : (isNewlyAdded ? 1 : 5),
      image_priority: typeof project.image_priority === 'number' ? project.image_priority : (typeof project.imagePriority === 'number' ? project.imagePriority : (isNewlyAdded ? 1 : 5)),
      visualEffects: project.visualEffects ? (
        typeof project.visualEffects === 'string' ? 
          project.visualEffects : 
          JSON.stringify(project.visualEffects)
      ) : JSON.stringify({
        animation: 'none',
        showBadge: false
      }),
      visual_effects: project.visual_effects ? (
        typeof project.visual_effects === 'string' ? 
          project.visual_effects : 
          JSON.stringify(project.visual_effects)
      ) : (project.visualEffects ? (
        typeof project.visualEffects === 'string' ? 
          project.visualEffects : 
          JSON.stringify(project.visualEffects)
      ) : JSON.stringify({
        animation: 'none',
        showBadge: false
      })),
      // Code screenshot fields
      isCodeScreenshot: Boolean(project.isCodeScreenshot),
      is_code_screenshot: Boolean(project.is_code_screenshot || project.isCodeScreenshot),
      codeLanguage: project.codeLanguage || '',
      code_language: project.code_language || project.codeLanguage || '',
      codeTitle: project.codeTitle || '',
      code_title: project.code_title || project.codeTitle || '',
      codeContent: project.codeContent || '',
      code_content: project.code_content || project.codeContent || '',
      useDirectCodeInput: Boolean(project.useDirectCodeInput),
      use_direct_code_input: Boolean(project.use_direct_code_input || project.useDirectCodeInput),
      // GitHub-related fields
      githubLink: project.githubLink || null,
      github_link: project.github_link || project.githubLink || null,
      githubClientLink: project.githubClientLink || null,
      github_client_link: project.github_client_link || project.githubClientLink || null,
      githubServerLink: project.githubServerLink || null,
      github_server_link: project.github_server_link || project.githubServerLink || null,
      // Always set last_updated field
      last_updated: new Date().toISOString(),
      // Created at field
      created_at: new Date().toISOString()
    };
    
    console.log('Creating project with data:', {
      title: projectWithDefaults.title,
      category: projectWithDefaults.category,
      isNewlyAdded,
      timestamp: new Date().toISOString(),
      visualEffectsType: typeof projectWithDefaults.visualEffects,
      showBothImagesInPriority: projectWithDefaults.showBothImagesInPriority,
      show_both_images_in_priority: projectWithDefaults.show_both_images_in_priority
    });
    
    // Create the new project in Neon database
    const result = await db.createProject(projectWithDefaults);
    
    if (!result.success) {
      console.error('Failed to create project:', result.message);
      return NextResponse.json({ 
        error: result.message,
        details: 'Database creation failed'
      }, { status: 500 });
    }
    
    console.log(`Successfully created project with ID ${result.id}`);
    
    // Return success with the new project ID
    return NextResponse.json({
      success: true,
      message: `Project "${projectWithDefaults.title}" created successfully`,
      id: result.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ 
      error: 'Failed to create project', 
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// PUT to update an existing project
export async function PUT(request: NextRequest) {
  try {
    const { id, project, password } = await request.json();
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid database password' }, { status: 401 });
    }
    
    // Validate project ID and data
    if (!id || !project) {
      return NextResponse.json({ error: 'Invalid request - missing project ID or data' }, { status: 400 });
    }
    
    // Update the project
    const result = await db.updateProject(id, project);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Project with ID ${id} updated successfully`
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ 
      error: 'Failed to update project', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE to remove an existing project
export async function DELETE(request: NextRequest) {
  try {
    const { id, password } = await request.json();
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid database password' }, { status: 401 });
    }
    
    // Validate project ID
    if (!id) {
      return NextResponse.json({ error: 'Invalid request - missing project ID' }, { status: 400 });
    }
    
    // Delete the project
    const result = await db.deleteProject(id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Project with ID ${id} deleted successfully`
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 
