import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/services/database';

// Define Project type here to ensure consistency
export type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  secondImage?: string;
  showBothImagesInPriority?: boolean;
  category: string;
  technologies: string[];
  link: string;
  features?: string[];
  exclusiveFeatures?: string[];
  featured: boolean;
  status?: string;
  updatedDays?: number;
  progress?: number;
  developmentProgress?: number;
  estimatedCompletion?: string;
  imagePriority?: number;
  visualEffects?: any;
  lastUpdated?: string;
};

// Set a password for admin operations
const ADMIN_PASSWORD = 'nex-devs.org889123';

// GET all projects
export async function GET(request: NextRequest) {
  try {
    // Determine if we need specific projects or all
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured');
    const newlyAdded = url.searchParams.get('newlyAdded');
    
    // Logging to debug
    console.log(`API Request - action: ${action}, category: ${category}, featured: ${featured}, newlyAdded: ${newlyAdded}`);
    
    // Check if we need to return categories instead of projects
    if (action === 'categories') {
      try {
        const categories = await db.getUniqueCategories();
        console.log(`Retrieved ${categories.length} categories`);
        
        return new NextResponse(JSON.stringify(categories), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      } catch (error) {
        console.error('Error retrieving categories:', error);
        // Return empty array
        return new NextResponse(JSON.stringify([]), {
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
      }
    }
    
    let projects: Project[] = [];
    
    try {
      // Get the appropriate projects based on query parameters - awaiting the promises
      if (newlyAdded === 'true') {
        projects = await db.getNewlyAddedProjects();
      } else if (featured === 'true') {
        projects = await db.getFeaturedProjects();
      } else if (category && category !== 'All') {
        projects = await db.getProjectsByCategory(category);
      } else {
        projects = await db.getAllProjects();
      }
      
      console.log(`Retrieved ${projects.length} projects`);
    } catch (dbError) {
      console.error('Database error when fetching projects:', dbError);
      // Return empty array instead of failing
      projects = [];
    }
    
    // Check if projects is valid, if not, provide fallback
    if (!Array.isArray(projects)) {
      console.error('Projects is not an array, returning empty array instead');
      projects = [];
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
    // Always return a valid array even in case of error to prevent UI breakage
    return NextResponse.json([] as Project[], { 
      status: 200, // Use 200 instead of 500 to prevent UI breakage
      headers: {
        'Content-Type': 'application/json',
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
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { project, password } = requestData;
    
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
    let requestData;
    try {
      requestData = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
    
    const { project, password } = requestData;
    
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate project data
    if (!project || !project.id) {
      return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
    }
    
    // Check if project exists
    const existingProject = await db.getProjectById(project.id);
    
    if (!existingProject) {
      console.error(`Project not found with ID: ${project.id}`);
      // Try to recover by treating it as a new project in production
      if (process.env.NODE_ENV === 'production') {
        try {
          console.log('Production environment: Creating project instead of updating');
          const newProject = await db.createProject(project);
          return NextResponse.json(newProject);
        } catch (createError) {
          console.error('Failed to create project as fallback:', createError);
          return NextResponse.json({ error: 'Project not found and creation failed' }, { status: 404 });
        }
      } else {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
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
    
    console.log(`Updating project with ID: ${updatedProject.id}`);
    
    try {
      const success = await db.updateProject(updatedProject);
      
      if (!success) {
        console.warn(`Update failed for project ID: ${updatedProject.id}`);
        return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
      }
      
      console.log(`Successfully updated project ID: ${updatedProject.id}`);
      
      // Force revalidation paths if needed
      try {
        const revalidateUrl = `${request.nextUrl.origin}/api/revalidate?path=/&secret=${ADMIN_PASSWORD}`;
        console.log(`Revalidating paths: ${revalidateUrl}`);
        
        await fetch(revalidateUrl, {
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
      
      return NextResponse.json({ success: true, project: updatedProject }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    } catch (updateError) {
      console.error('Error in database update:', updateError);
      return NextResponse.json({ 
        error: 'Database update error: ' + (updateError instanceof Error ? updateError.message : String(updateError))
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE a project
export async function DELETE(request: NextRequest) {
  try {
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
        // If JSON parsing fails, continue with the values we have
      }
    }
    
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate ID
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    
    console.log(`Deleting project with ID: ${id}`);
    
    // Delete the project
    try {
      const success = await db.deleteProject(id);
      
      if (!success) {
        console.warn(`Project not found for deletion: ${id}`);
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      
      console.log(`Successfully deleted project ID: ${id}`);
      return NextResponse.json({ success: true });
    } catch (deleteError) {
      console.error(`Error deleting project ID ${id}:`, deleteError);
      return NextResponse.json({ 
        error: 'Database error during deletion: ' + (deleteError instanceof Error ? deleteError.message : String(deleteError))
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in DELETE handler:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
} 