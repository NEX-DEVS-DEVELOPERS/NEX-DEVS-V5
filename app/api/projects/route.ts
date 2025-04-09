import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Project, sortProjects } from '../projects/index';

// Set a password for admin operations
const ADMIN_PASSWORD = 'nex-devs.org889123';

// Path to the projects.json file
const projectsFilePath = path.join(process.cwd(), 'app', 'db', 'projects.json');

// Cache mechanism to ensure changes are reflected across instances
let projectsCache: Project[] | null = null;
let lastCacheUpdate = 0;
const CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

// Read projects with cache handling
async function readProjects(): Promise<Project[]> {
  // Always invalidate cache on each read to ensure fresh data
  projectsCache = null;
  
  try {
    const data = await readFile(projectsFilePath, 'utf8');
    const parsedProjects = JSON.parse(data) as Project[];
    
    // Process each project to ensure it has updated timestamps
    const projectsWithTimestamps = parsedProjects.map(project => ({
      ...project,
      _fetchTime: Date.now() // Add timestamp to force stale detection
    }));
    
    projectsCache = projectsWithTimestamps;
    lastCacheUpdate = Date.now();
    
    // Return only the project data without the timestamp
    return projectsWithTimestamps;
  } catch (error) {
    console.error('Error reading projects:', error);
    projectsCache = [];
    return [];
  }
}

// Write projects with cache update
async function writeProjects(projects: Project[]): Promise<boolean> {
  try {
    // Add a timestamp to the data to ensure it's different each time
    const timestamp = new Date().toISOString();
    const dataWithTimestamp = {
      projects: sortProjects(projects),
      lastUpdated: timestamp
    };
    
    // Write the data with timestamp to ensure file changes
    await writeFile(
      projectsFilePath,
      JSON.stringify(dataWithTimestamp.projects, null, 2),
      'utf8'
    );
    
    // Force cache invalidation for ALL projects
    projectsCache = null;
    lastCacheUpdate = Date.now();
    
    return true;
  } catch (error) {
    console.error('Error writing projects:', error);
    return false;
  }
}

// GET all projects
export async function GET(request: NextRequest) {
  try {
    // Force cache invalidation on every request
    projectsCache = null;
    
    const projects = await readProjects();
    
    // Set strong cache control headers to prevent browser caching
    return new NextResponse(JSON.stringify(sortProjects(projects)), {
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

// POST to create a new project
export async function POST(request: NextRequest) {
  try {
    const { project, password } = await request.json();
    
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate project data
    if (!project || !project.title || !project.description || !project.image) {
      return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
    }
    
    // Read current projects
    const projects = await readProjects();
    
    // Generate a new ID
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    
    // Create new project object with proper properties
    const newProject: Project = {
      ...project,
      id: newId,
      title: project.title.trim(),
      description: project.description.trim(),
      image: project.image.trim(),
      // For data URLs, ensure we don't recreate them or manipulate them
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      exclusiveFeatures: Array.isArray(project.exclusiveFeatures) ? project.exclusiveFeatures : [],
      featured: Boolean(project.featured),
      imagePriority: typeof project.imagePriority === 'number' ? project.imagePriority : 5,
      visualEffects: project.visualEffects || {
        glow: false,
        animation: 'none',
        showBadge: false
      }
    };
    
    // Add to projects array
    projects.push(newProject);
    
    // Write updated projects back to file
    await writeProjects(projects);
    
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Error adding project:', error);
    return NextResponse.json({ error: 'Failed to add project' }, { status: 500 });
  }
}

// PUT to update a project
export async function PUT(request: NextRequest) {
  try {
    const { project, password } = await request.json();
    
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Validate project data
    if (!project || !project.id) {
      return NextResponse.json({ error: 'Invalid project data' }, { status: 400 });
    }
    
    // Force cache invalidation before reading
    projectsCache = null;
    
    // Read current projects
    const projects = await readProjects();
    
    // Find the project to update
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Add timestamp to project to force cache invalidation
    const updatedProject: Project = {
      ...project,
      title: project.title.trim(),
      description: project.description.trim(),
      image: project.image.trim(),
      technologies: Array.isArray(project.technologies) ? project.technologies : [],
      exclusiveFeatures: Array.isArray(project.exclusiveFeatures) ? project.exclusiveFeatures : [],
      featured: Boolean(project.featured),
      imagePriority: typeof project.imagePriority === 'number' ? project.imagePriority : 5,
      visualEffects: project.visualEffects || {
        glow: false,
        animation: 'none',
        showBadge: false
      },
      _lastUpdated: new Date().toISOString() // Add timestamp to force change detection
    };
    
    // Update the project in the array
    projects[index] = updatedProject;
    
    // Write updated projects back to file
    await writeProjects(projects);
    
    // Force Vercel to revalidate the data for this project
    const revalidationResponse = await fetch(`${request.nextUrl.origin}/api/revalidate?path=/&secret=${ADMIN_PASSWORD}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    }).catch(error => console.error('Error revalidating paths:', error));
    
    console.log('Revalidation response:', revalidationResponse ? 'successful' : 'failed');
    
    return NextResponse.json(updatedProject, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
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
    
    // Read current projects
    const projects = await readProjects();
    
    // Filter out the project to delete
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Write updated projects back to file
    await writeProjects(filteredProjects);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
} 