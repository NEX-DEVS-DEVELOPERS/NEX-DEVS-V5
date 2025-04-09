import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { existsSync } from 'fs';

// Project type definition
type Project = {
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
  exclusiveFeatures?: string[];
  visualEffects?: any;
};

// Admin password
const ADMIN_PASSWORD = 'nex-devs.org889123';

// JSON storage path
const JSON_STORAGE_PATH = path.join(process.cwd(), 'projects.json');

// Sample projects data for initial setup
const SAMPLE_PROJECTS: Project[] = [
  {
    id: 1,
    title: "Portfolio Website",
    description: "A modern Next.js portfolio showcasing development projects with dark theme and responsive design.",
    image: "/projects/portfolio.jpg",
    category: "Web Development",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    link: "https://example.com",
    featured: true,
    status: "Completed",
    features: ["Responsive Design", "Dark Theme", "Project Showcase"]
  },
  {
    id: 2,
    title: "E-Commerce Dashboard",
    description: "Admin dashboard for e-commerce site with inventory management and sales analytics.",
    image: "/projects/dashboard.jpg",
    category: "Web Application",
    technologies: ["React", "Redux", "Node.js", "MongoDB"],
    link: "https://example.com/dashboard",
    featured: false,
    status: "In Development",
    progress: 80,
    updatedDays: 3
  }
];

// Seed database endpoint handler
export async function POST(request: NextRequest) {
  try {
    // Get admin password
    const adminAuth = request.headers.get('AdminAuth');
    
    // Validate password
    if (adminAuth !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if file exists
    const fileExists = existsSync(JSON_STORAGE_PATH);
    const emptyFile = fileExists ? 
      (await fs.readFile(JSON_STORAGE_PATH, 'utf-8')).trim() === '[]' : false;
    
    // Only seed if file doesn't exist or is empty
    if (fileExists && !emptyFile) {
      const projects = JSON.parse(await fs.readFile(JSON_STORAGE_PATH, 'utf-8'));
      return NextResponse.json({ 
        success: true, 
        message: 'Projects already exist', 
        count: projects.length
      });
    }
    
    // Create directory if it doesn't exist
    const storageDir = path.dirname(JSON_STORAGE_PATH);
    await fs.mkdir(storageDir, { recursive: true });
    
    // Write sample projects to file
    await fs.writeFile(JSON_STORAGE_PATH, JSON.stringify(SAMPLE_PROJECTS, null, 2), 'utf-8');
    
    console.log(`Seeded ${SAMPLE_PROJECTS.length} sample projects`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Seeded ${SAMPLE_PROJECTS.length} sample projects`,
      projects: SAMPLE_PROJECTS
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding projects:', error);
    return NextResponse.json({ 
      error: 'Failed to seed projects', 
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 