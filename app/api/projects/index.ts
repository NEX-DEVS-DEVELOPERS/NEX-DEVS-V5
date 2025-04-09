import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

// Admin password for authentication
const ADMIN_PASSWORD = 'nex-devs.org889123'

// Project type with extended properties
export type Project = {
  id: number
  title: string
  description: string
  image: string
  category: string
  technologies: string[]
  link: string
  featured: boolean
  status?: string
  updatedDays?: number
  progress?: number
  features?: string[]
  imagePriority?: number
  visualEffects?: {
    glow: boolean
    animation: string
    showBadge: boolean
  }
  exclusiveFeatures?: string[]
}

// Path to the projects.json file
const projectsFilePath = path.join(process.cwd(), 'app', 'db', 'projects.json')

// Sort projects correctly
export function sortProjects(projects: Project[]): Project[] {
  // Create a copy of the array to avoid mutating the original
  const sorted = [...projects];
  
  // Perform a stable sort (preserves original order when values are equal)
  return sorted.sort((a, b) => {
    // First sort by ID for stable ordering
    return a.id - b.id;
  });
}

// Export a helper function for generating cache-busting URL parameters
export function getCacheBustingParams(): string {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000000);
  const vercelEnv = process.env.VERCEL_ENV || '';
  return `t=${timestamp}&r=${random}&env=${vercelEnv}&forceRefresh=true`;
}

// Helper function to clear Vercel edge caches programmatically
export async function clearVercelCache(path: string = '/api/projects'): Promise<boolean> {
  try {
    // Only attempt to clear cache if we're on Vercel
    if (process.env.VERCEL_URL) {
      console.log(`Attempting to clear Vercel cache for: ${path}`);
      
      // Generate the full URL to purge
      const url = `https://${process.env.VERCEL_URL}${path}`;
      
      // Make the purge request
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache, no-store',
          'Pragma': 'no-cache',
          'X-Vercel-Purge': 'true' // Special header for Vercel
        }
      });
      
      console.log(`Cache purge response: ${res.status}`);
      return res.ok;
    }
    return false;
  } catch (error) {
    console.error('Error clearing Vercel cache:', error);
    return false;
  }
}

// Get all projects
export function getProjects(): Project[] {
  try {
    const projectsData = fs.readFileSync(projectsFilePath, 'utf8')
    const projects: Project[] = JSON.parse(projectsData)
    return sortProjects(projects)
  } catch (error) {
    console.error('Error reading projects file:', error)
    return []
  }
}

// Save projects to file
export async function saveProjects(projects: Project[]): Promise<boolean> {
  try {
    await fs.promises.writeFile(
      projectsFilePath,
      JSON.stringify(sortProjects(projects), null, 2),
      'utf8'
    )
    return true
  } catch (error) {
    console.error('Error saving projects file:', error)
    return false
  }
}

// API handler for projects endpoints
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // GET request - Return all projects
  if (req.method === 'GET') {
    const projects = getProjects()
    return res.status(200).json(projects)
  }

  // POST request - Add a new project
  if (req.method === 'POST') {
    try {
      const { project, password } = req.body

      // Validate password
      if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ error: 'Unauthorized' })
      }

      // Validate project data
      if (!project || !project.title || !project.description || !project.image) {
        return res.status(400).json({ error: 'Invalid project data' })
      }

      // Get current projects
      const projects = getProjects()

      // Generate a new ID
      const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1

      // Prepare new project
      const newProject: Project = {
        ...project,
        id: newId,
        // Ensure sanitized properties
        title: project.title.trim(),
        description: project.description.trim(),
        technologies: Array.isArray(project.technologies) ? project.technologies : [],
        features: Array.isArray(project.features) ? project.features : [],
        exclusiveFeatures: Array.isArray(project.exclusiveFeatures) ? project.exclusiveFeatures : []
      }

      // Add to projects array
      projects.push(newProject)

      // Save updated projects
      await saveProjects(projects)

      return res.status(201).json(newProject)
    } catch (error) {
      console.error('Error adding project:', error)
      return res.status(500).json({ error: 'Error adding project' })
    }
  }

  // Method not allowed
  return res.status(405).json({ error: 'Method not allowed' })
} 