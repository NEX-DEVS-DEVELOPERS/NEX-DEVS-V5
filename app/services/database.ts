import { getProjects, getProjectById, createProject as createNeonProject, updateProject as updateNeonProject, deleteProject as deleteNeonProject, getFeaturedProjects as getNeonFeaturedProjects, getNewlyAddedProjects as getNeonNewlyAddedProjects, getProjectsByCategory as getNeonProjectsByCategory, getUniqueCategories as getNeonUniqueCategories } from '@/backend/lib/neon';
import { Project } from '../api/projects/index';

// Determine environment variables
const isProduction = process.env.NODE_ENV === 'production';
const isVercel = process.env.VERCEL === '1';
const READ_ONLY_MODE = isVercel && isProduction;

console.log(`Environment: ${isProduction ? 'Production' : 'Development'}, Vercel: ${isVercel ? 'Yes' : 'No'}, Read-only: ${READ_ONLY_MODE ? 'Yes' : 'No'}`);

// Get all projects
export async function getAllProjects(): Promise<Project[]> {
  try {
    return await getProjects();
  } catch (error) {
    console.error('Error fetching all projects:', error);
    return [];
  }
}

// Get project by ID
export async function getProjectById(id: number): Promise<Project | null> {
  try {
    return await getProjectById(id);
  } catch (error) {
    console.error(`Error fetching project with id ${id}:`, error);
    return null;
  }
}

// Create a new project
export async function createProject(project: Omit<Project, 'id'>): Promise<Project> {
  try {
    if (READ_ONLY_MODE) {
      console.log(`[Read-only mode] Would create new project: ${project.title}`);
      
      // In read-only mode, generate a fake ID and pretend it worked
      return {
        ...project,
        id: Math.floor(Math.random() * 10000) + 1000, // Generate a fake ID
        lastUpdated: new Date().toISOString()
      } as Project;
    }
    
    return await createNeonProject(project);
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Update an existing project
export async function updateProject(idOrProject: number | Project, projectData?: Project): Promise<boolean> {
  try {
    if (READ_ONLY_MODE) {
      console.log(`[Read-only mode] Would update project id: ${typeof idOrProject === 'number' ? idOrProject : idOrProject.id}`);
      return true; // Pretend it worked
    }
    
    const id = typeof idOrProject === 'number' ? idOrProject : idOrProject.id;
    const data = projectData || (typeof idOrProject !== 'number' ? idOrProject : {});
    
    await updateNeonProject(id, data);
    return true;
  } catch (error) {
    console.error(`Error updating project:`, error);
    return false;
  }
}

// Delete a project
export async function deleteProject(id: number): Promise<boolean> {
  try {
    if (READ_ONLY_MODE) {
      console.log(`[Read-only mode] Would delete project id: ${id}`);
      return true; // Pretend it worked
    }
    
    await deleteNeonProject(id);
    return true;
  } catch (error) {
    console.error(`Error deleting project with id ${id}:`, error);
    return false;
  }
}

// Get newly added projects
export async function getNewlyAddedProjects(): Promise<Project[]> {
  try {
    return await getNeonNewlyAddedProjects();
  } catch (error) {
    console.error('Error fetching newly added projects:', error);
    return [];
  }
}

// Get regular (non-featured) projects
export async function getRegularProjects(): Promise<Project[]> {
  try {
    // Get all projects and filter out featured ones
    const allProjects = await getProjects();
    return allProjects.filter(project => !project.featured);
  } catch (error) {
    console.error('Error fetching regular projects:', error);
    return [];
  }
}

// Get featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  try {
    return await getNeonFeaturedProjects();
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

// Get projects by category
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  try {
    return await getNeonProjectsByCategory(category);
  } catch (error) {
    console.error(`Error fetching projects in category ${category}:`, error);
    return [];
  }
}

// Get unique categories
export async function getUniqueCategories(): Promise<string[]> {
  try {
    return await getNeonUniqueCategories();
  } catch (error) {
    console.error('Error fetching unique categories:', error);
    return [];
  }
}

// Function to migrate JSON data to the database (kept for compatibility)
export async function migrateJsonToSqlite(): Promise<void> {
  // This function is maintained for compatibility but doesn't do anything anymore
  // since we've migrated from SQLite to Neon PostgreSQL
  console.log('migrateJsonToSqlite function called but skipped - using Neon PostgreSQL now');
  return;
}

// Function to initialize the database (kept for compatibility)
export async function initializeDatabase() {
  // This function now uses Neon PostgreSQL initialization
  try {
    // Import the function dynamically to avoid circular references
    const { initDatabase } = await import('@/lib/neon');
    await initDatabase();
    console.log('Database initialization completed');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getNewlyAddedProjects,
  getRegularProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getUniqueCategories,
  migrateJsonToSqlite
}; 
