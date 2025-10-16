import fs from 'fs';
import path from 'path';

// Project type definition
export type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  technologies: string[];
  link: string;
  featured: boolean;
  status?: string;
  updatedDays?: number;
  progress?: number;
  features?: string[];
};

// Path to the projects.json file
const projectsFilePath = path.join(process.cwd(), 'app', 'db', 'projects.json');

// Get all projects
export function getProjects(): Project[] {
  try {
    const projectsData = fs.readFileSync(projectsFilePath, 'utf8');
    return JSON.parse(projectsData);
  } catch (error) {
    console.error('Error reading projects file:', error);
    return [];
  }
}

// Save projects to file
export async function saveProjects(projects: Project[]): Promise<boolean> {
  try {
    await fs.promises.writeFile(
      projectsFilePath,
      JSON.stringify(projects, null, 2),
      'utf8'
    );
    return true;
  } catch (error) {
    console.error('Error saving projects file:', error);
    return false;
  }
}

// Get newly added projects
export function getNewlyAddedProjects(): Project[] {
  const projects = getProjects();
  return projects.filter(project => 
    project.title.startsWith('NEWLY ADDED:') || 
    (project.status && ['In Development', 'Beta Testing', 'Recently Launched'].includes(project.status))
  );
}

// Get regular projects (non-newly added)
export function getRegularProjects(): Project[] {
  const projects = getProjects();
  return projects.filter(project => 
    !project.title.startsWith('NEWLY ADDED:') && 
    (!project.status || !['In Development', 'Beta Testing', 'Recently Launched'].includes(project.status))
  );
}

// Get featured projects
export function getFeaturedProjects(): Project[] {
  const projects = getProjects();
  return projects.filter(project => project.featured);
}

// Get project by ID
export function getProjectById(id: number): Project | undefined {
  const projects = getProjects();
  return projects.find(project => project.id === id);
}

// Get unique categories from all projects
export function getUniqueCategories(): string[] {
  const projects = getProjects();
  return ['All', ...Array.from(new Set(projects.map(project => project.category)))];
} 
