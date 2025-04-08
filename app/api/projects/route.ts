import { NextRequest, NextResponse } from 'next/server';
import { readFile, writeFile } from 'fs/promises';
import path from 'path';
import { Project, sortProjects } from '../projects/index';

// Set a password for admin operations
const ADMIN_PASSWORD = 'nex-devs.org889123';

// Path to the projects.json file
const projectsFilePath = path.join(process.cwd(), 'app', 'db', 'projects.json');

// GET all projects
export async function GET() {
  try {
    const data = await readFile(projectsFilePath, 'utf8');
    const projects = JSON.parse(data);
    return NextResponse.json(sortProjects(projects));
  } catch (error) {
    console.error('Error reading projects:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
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
    const data = await readFile(projectsFilePath, 'utf8');
    const projects: Project[] = JSON.parse(data);
    
    // Generate a new ID
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    
    // Create new project object with proper properties
    const newProject: Project = {
      ...project,
      id: newId,
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
      }
    };
    
    // Add to projects array
    projects.push(newProject);
    
    // Write updated projects back to file
    await writeFile(projectsFilePath, JSON.stringify(sortProjects(projects), null, 2), 'utf8');
    
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
    
    // Read current projects
    const data = await readFile(projectsFilePath, 'utf8');
    const projects: Project[] = JSON.parse(data);
    
    // Find the project to update
    const index = projects.findIndex(p => p.id === project.id);
    
    if (index === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Ensure proper types for visualEffects and imagePriority
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
      }
    };
    
    // Update the project in the array
    projects[index] = updatedProject;
    
    // Write updated projects back to file
    await writeFile(projectsFilePath, JSON.stringify(sortProjects(projects), null, 2), 'utf8');
    
    return NextResponse.json(updatedProject);
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
    const data = await readFile(projectsFilePath, 'utf8');
    const projects: Project[] = JSON.parse(data);
    
    // Filter out the project to delete
    const filteredProjects = projects.filter(p => p.id !== id);
    
    if (filteredProjects.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Write updated projects back to file
    await writeFile(projectsFilePath, JSON.stringify(sortProjects(filteredProjects), null, 2), 'utf8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
} 