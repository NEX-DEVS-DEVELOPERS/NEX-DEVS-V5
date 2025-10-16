import { NextRequest, NextResponse } from 'next/server';
import db from '@/backend/services/database';
import fs from 'fs';
import path from 'path';
import { Project } from '../projects/index';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { password, projects } = await request.json();
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (!Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json({ error: 'Invalid project data provided' }, { status: 400 });
    }

    console.log(`Attempting to import ${projects.length} projects`);
    
    // Clear existing projects if requested
    const url = new URL(request.url);
    const clearExisting = url.searchParams.get('clear') === 'true';
    
    if (clearExisting) {
      console.log('Clearing existing projects from database...');
      // Get all projects and delete them one by one
      const allProjects = db.getAllProjects();
      console.log(`Deleting ${allProjects.length} existing projects...`);
      
      for (const project of allProjects) {
        db.deleteProject(project.id);
      }
    }
    
    // Track success and failures
    const results = {
      success: 0,
      failed: 0,
      errors: [] as string[]
    };
    
    // Import each project
    for (const project of projects) {
      try {
        // Handle ID for new import
        const projectData = { ...project };
        
        // For new import without clearing, remove ID to avoid conflicts
        if (!clearExisting && projectData.id) {
          delete projectData.id;
        }
        
        // Ensure visual effects is in the correct format
        if (projectData.visualEffects && typeof projectData.visualEffects !== 'string') {
          projectData.visualEffects = JSON.stringify(projectData.visualEffects);
        }
        
        // Handle arrays
        if (projectData.technologies && !Array.isArray(projectData.technologies)) {
          try {
            projectData.technologies = JSON.parse(projectData.technologies);
          } catch (e) {
            projectData.technologies = [];
          }
        }
        
        if (projectData.features && !Array.isArray(projectData.features)) {
          try {
            projectData.features = JSON.parse(projectData.features);
          } catch (e) {
            projectData.features = [];
          }
        }
        
        if (projectData.exclusiveFeatures && !Array.isArray(projectData.exclusiveFeatures)) {
          try {
            projectData.exclusiveFeatures = JSON.parse(projectData.exclusiveFeatures);
          } catch (e) {
            projectData.exclusiveFeatures = [];
          }
        }
        
        // Insert or update the project
        if (clearExisting || !projectData.id) {
          db.createProject(projectData as Omit<Project, 'id'>);
        } else {
          db.updateProject(projectData as Project);
        }
        
        results.success++;
      } catch (err) {
        console.error('Error importing project:', err);
        results.failed++;
        results.errors.push(err instanceof Error ? err.message : String(err));
      }
    }
    
    // Create a backup of the imported data
    try {
      const backupDir = path.join(process.cwd(), 'backups');
      if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
      }
      
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFilePath = path.join(backupDir, `db-import-${timestamp}.json`);
      fs.writeFileSync(backupFilePath, JSON.stringify(projects, null, 2));
    } catch (err) {
      console.warn('Failed to create backup of imported data:', err);
    }
    
    return NextResponse.json({
      success: true,
      message: `Imported ${results.success} projects successfully. ${results.failed} failed.`,
      results
    });
  } catch (error) {
    console.error('Error in import process:', error);
    return NextResponse.json({
      error: 'Failed to import projects',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 
