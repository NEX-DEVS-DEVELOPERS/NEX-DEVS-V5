import { NextRequest, NextResponse } from 'next/server';
import neonDb from '@/backend/lib/neon';    // Neon PostgreSQL database (primary)
import fs from 'fs';
import path from 'path';

// Set a password for admin operations
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

// Helper function to parse JSON fields
function parseJsonField(field: any) {
  if (!field) return null;
  
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      // If not valid JSON, return as array with single string item if it looks like it should be an array
      if (field.startsWith('[') || field.includes(',')) {
        return [field];
      }
      return field;
    }
  }
  
  return field;
}

export async function POST(request: NextRequest) {
  try {
    // Authentication check
    const { password, shouldClear = false } = await request.json();
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting migration from MySQL to Neon PostgreSQL...');
    
    // Test connections to both databases
    console.log('Testing MySQL connection...');
    const mysqlConnectionTest = await mysqlDb.testConnection();
    if (!mysqlConnectionTest.success) {
      return NextResponse.json({ 
        error: 'MySQL connection failed', 
        details: mysqlConnectionTest.message 
      }, { status: 500 });
    }
    
    console.log('Testing Neon PostgreSQL connection...');
    const neonConnectionTest = await neonDb.testConnection();
    if (!neonConnectionTest.success) {
      return NextResponse.json({ 
        error: 'Neon PostgreSQL connection failed', 
        details: neonConnectionTest.message 
      }, { status: 500 });
    }
    
    // Initialize Neon database schema
    await neonDb.initDatabase();
    
    // Get all projects from MySQL
    console.log('Fetching projects from MySQL...');
    const mysqlProjects = await mysqlDb.getProjects();
    console.log(`Retrieved ${mysqlProjects.length} projects from MySQL.`);
    
    // Create a backup of the data
    const backupDir = path.join(process.cwd(), 'backups');
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(backupDir, `mysql-export-${timestamp}.json`);
    fs.writeFileSync(backupFilePath, JSON.stringify(mysqlProjects, null, 2));
    console.log(`Backup saved to ${backupFilePath}`);
    
    // Track migration results
    const results = {
      total: mysqlProjects.length,
      success: 0,
      failed: 0,
      errors: [] as any[],
    };
    
    // If requested, clear existing data in Neon
    if (shouldClear) {
      try {
        console.log('Clearing existing projects from Neon PostgreSQL...');
        const testData = await neonDb.sql`SELECT COUNT(*) as count FROM projects`;
        console.log(`Found ${testData[0].count} existing projects in Neon.`);
        
        await neonDb.sql`TRUNCATE TABLE projects RESTART IDENTITY`;
        console.log('Existing projects cleared from Neon PostgreSQL.');
      } catch (error: any) {
        console.error('Error clearing Neon database:', error);
        // If it fails because the table doesn't exist yet, that's fine
        if (!error.message.includes('does not exist')) {
          return NextResponse.json({ 
            error: 'Failed to clear Neon database', 
            details: error.message 
          }, { status: 500 });
        }
      }
    }
    
    // Process and insert each project into Neon
    console.log('Inserting projects into Neon PostgreSQL...');
    for (const project of mysqlProjects) {
      try {
        // Process the project data for PostgreSQL compatibility
        const processedProject = {
          ...project,
          // Keep id only if clearing existing data
          ...(shouldClear ? {} : { id: undefined }),
          // Convert JSON string fields to objects for PostgreSQL JSONB
          technologies: parseJsonField(project.technologies),
          tech_details: parseJsonField(project.tech_details),
          features: parseJsonField(project.features),
          exclusive_features: parseJsonField(project.exclusive_features),
          visual_effects: parseJsonField(project.visual_effects),
          // Ensure fields are in correct PostgreSQL format
          image_url: project.image_url || project.image || '/placeholder-image.jpg',
          project_link: project.project_link || project.link || '#',
          // Ensure boolean fields are properly typed
          featured: Boolean(project.featured),
          show_both_images_in_priority: Boolean(project.show_both_images_in_priority || project.showBothImagesInPriority),
          is_code_screenshot: Boolean(project.is_code_screenshot || project.isCodeScreenshot),
          use_direct_code_input: Boolean(project.use_direct_code_input || project.useDirectCodeInput),
        };
        
        // Add or update project in Neon database
        const result = await neonDb.createProject(processedProject);
        
        if (result.success) {
          console.log(`✅ Migrated project "${project.title}" with ID: ${result.id}`);
          results.success++;
        } else {
          console.error(`❌ Failed to migrate project "${project.title}":`, result.message);
          results.failed++;
          results.errors.push({
            title: project.title,
            id: project.id,
            error: result.message
          });
        }
      } catch (error: any) {
        console.error(`❌ Error processing project "${project.title}":`, error);
        results.failed++;
        results.errors.push({
          title: project.title,
          id: project.id,
          error: error.message
        });
      }
    }
    
    // Get summary of data in Neon after migration
    let neonSummary;
    try {
      const neonProjects = await neonDb.getProjects();
      const featuredProjects = await neonDb.getFeaturedProjects();
      const categories = await neonDb.getUniqueCategories();
      
      neonSummary = {
        totalProjects: neonProjects.length,
        featuredProjects: featuredProjects.length,
        categories: categories.filter(c => c !== 'All')
      };
    } catch (error) {
      console.error('Error getting Neon summary:', error);
      neonSummary = { error: 'Failed to get summary' };
    }
    
    return NextResponse.json({
      success: true,
      message: `Migration complete. ${results.success} projects migrated successfully, ${results.failed} failed.`,
      results,
      neonSummary,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error during migration:', error);
    return NextResponse.json({
      error: 'Migration failed',
      details: error.message,
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
