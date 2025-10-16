import { NextRequest, NextResponse } from 'next/server';
import neonDb from '@/backend/lib/neon';

// Define types for our featured projects
interface FeaturedProject {
  id: number;
  title: string;
  image: string;
  showBothImagesInPriority?: boolean;
  show_both_images_in_priority?: boolean;
  isCodeScreenshot?: boolean;
  is_code_screenshot?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    // Test the database connection
    console.log('Testing Neon database connection...');
    const connectionResult = await neonDb.testConnection();
    
    // Initialize the database if connection is successful
    let initResult = false;
    if (connectionResult.success) {
      console.log('Connection successful, initializing database...');
      initResult = await neonDb.initDatabase();
    }
    
    // Get database schema information
    let schemaInfo = null;
    let projectCount = 0;
    let featuredProjects: FeaturedProject[] = [];
    let debugStatus = null;
    
    if (connectionResult.success) {
      try {
        // Get debug status which includes schema information
        debugStatus = await neonDb.getDebugStatus();
        
        // Get project count
        const projects = await neonDb.getProjects();
        projectCount = projects.length;
        
        // Get a few featured projects for testing
        const featured = await neonDb.getFeaturedProjects();
        featuredProjects = featured.slice(0, 3).map(p => ({
          id: p.id,
          title: p.title,
          image: p.image,
          showBothImagesInPriority: p.showBothImagesInPriority,
          show_both_images_in_priority: p.show_both_images_in_priority,
          isCodeScreenshot: p.isCodeScreenshot,
          is_code_screenshot: p.is_code_screenshot
        }));
        
        // Get schema information by querying PostgreSQL system tables
        const schemaResult = await neonDb.sql`
          SELECT 
            table_name, 
            column_name, 
            data_type 
          FROM 
            information_schema.columns 
          WHERE 
            table_name = 'projects'
          ORDER BY 
            ordinal_position;
        `;
        
        schemaInfo = schemaResult;
      } catch (error) {
        console.error('Error getting schema information:', error);
      }
    }
    
    return NextResponse.json({
      connectionStatus: connectionResult.success ? 'connected' : 'error',
      connectionDetails: connectionResult,
      databaseInitialized: initResult,
      projectCount,
      featuredProjects,
      schemaInfo,
      debugStatus,
      timestamp: new Date().toISOString()
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error testing Neon database:', error);
    return NextResponse.json({
      connectionStatus: 'error',
      error: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 
