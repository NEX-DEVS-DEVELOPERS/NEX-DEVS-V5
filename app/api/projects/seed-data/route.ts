import { NextRequest, NextResponse } from 'next/server';
import db from '@/app/services/database';
import path from 'path';

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

// Sample projects data for initial setup
const SAMPLE_PROJECTS: Omit<Project, 'id'>[] = [
  {
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
    
    // Get existing projects
    const existingProjects = await db.getAllProjects();
    
    // Only seed if there are no projects yet
    if (existingProjects.length > 0) {
      return NextResponse.json({ 
        success: true, 
        message: `${existingProjects.length} projects already exist`, 
        count: existingProjects.length
      });
    }
    
    console.log(`Seeding ${SAMPLE_PROJECTS.length} sample projects...`);
    
    // Create each project using the database service
    const createdProjects = [];
    for (const projectData of SAMPLE_PROJECTS) {
      try {
        const newProject = await db.createProject(projectData);
        createdProjects.push(newProject);
        console.log(`Created project: ${newProject.title}`);
      } catch (projectError) {
        console.error(`Error creating project ${projectData.title}:`, projectError);
      }
    }
    
    if (createdProjects.length === 0) {
      throw new Error('Failed to create any projects');
    }
    
    console.log(`Successfully created ${createdProjects.length} sample projects`);
    
    return NextResponse.json({ 
      success: true, 
      message: `Created ${createdProjects.length} sample projects`,
      projects: createdProjects
    }, { status: 201 });
  } catch (error) {
    console.error('Error seeding projects:', error);
    return NextResponse.json({ 
      error: 'Failed to seed projects',
      details: error instanceof Error ? error.message : String(error) 
    }, { status: 500 });
  }
} 