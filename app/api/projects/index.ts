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
  detailedDescription?: string
  image: string
  secondImage?: string
  showBothImagesInPriority?: boolean
  category: string
  technologies: string[]
  techDetails?: {
    frontend?: string
    styling?: string
    performance?: string
    '3D'?: string
    framework?: string
    animation?: string
  }
  link: string
  featured: boolean
  status?: string
  updatedDays?: number
  progress?: number
  completionDate?: string
  clientName?: string
  duration?: string
  features?: string[]
  developmentProgress?: number
  estimatedCompletion?: string
  imagePriority?: number
  visualEffects?: {
    glow?: boolean
    morphTransition?: boolean
    rippleEffect?: boolean
    floatingElements?: boolean
    shimmering?: boolean
    animation?: string
    showBadge?: boolean
    spotlight?: boolean
    shadows?: string
    border?: string
    glassmorphism?: boolean
    particles?: boolean
    hover?: string
    backdrop?: string
    animationTiming?: string
    animationIntensity?: string
  }
  exclusiveFeatures?: string[]
  lastUpdated?: string
}

// Path to the projects.json file
const projectsFilePath = path.join(process.cwd(), 'app', 'db', 'projects.json')

// Sort projects by image priority and featured status
export function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    // First sort by numeric imagePriority (this is the main priority sorting)
    if (typeof a.imagePriority === 'number' && typeof b.imagePriority === 'number') {
      return a.imagePriority - b.imagePriority;
    }
    
    // If only one has numeric priority, it takes precedence
    if (typeof a.imagePriority === 'number') return -1;
    if (typeof b.imagePriority === 'number') return 1;
    
    // Boolean priority is secondary
    if (a.imagePriority === true && b.imagePriority !== true) return -1;
    if (a.imagePriority !== true && b.imagePriority === true) return 1;
    
    // Then by featured status
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // Then by updatedDays if they exist (newer first)
    if (a.updatedDays !== undefined && b.updatedDays !== undefined) {
      return a.updatedDays - b.updatedDays;
    }
    
    // Finally by id (newer first assuming higher id is newer)
    return b.id - a.id;
  });
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
  // Redirect to the new API endpoints using route.ts
  return res.redirect(307, '/api/projects');
} 