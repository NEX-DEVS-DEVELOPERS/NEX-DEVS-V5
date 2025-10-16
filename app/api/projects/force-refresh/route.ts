import { NextRequest, NextResponse } from 'next/server';
import neonDb from '@/backend/lib/neon';

// Admin password for authentication
const ADMIN_PASSWORD = 'nex-devs.org889123';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const password = searchParams.get('password');
    
    // Validate password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    
    // Convert ID to number
    const projectId = parseInt(id);
    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    console.log(`Force refreshing project with ID: ${projectId}`);
    
    // Fetch the project from the database
    const project = await neonDb.getProjectById(projectId);
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Update a timestamp field to force the database to update the record
    // This will make the project appear as "updated" without changing its content
    const updatedProject = {
      ...project,
      last_updated: new Date().toISOString()
    };
    
    // Save the updated project back to the database
    const result = await neonDb.updateProject(projectId, updatedProject);
    
    // Revalidate paths
    try {
      // Revalidate main pages
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/&secret=${ADMIN_PASSWORD}`, {
        method: 'GET',
        cache: 'no-store'
      });
      
      // Also revalidate projects page and specific project page
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/projects&secret=${ADMIN_PASSWORD}`, {
        method: 'GET',
        cache: 'no-store'
      });
      
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/projects/${projectId}&secret=${ADMIN_PASSWORD}`, {
        method: 'GET',
        cache: 'no-store'
      });
    } catch (error) {
      console.error('Error revalidating paths:', error);
    }
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Project refreshed successfully',
        project: {
          id: project.id,
          title: project.title,
          isCodeScreenshot: project.isCodeScreenshot,
          last_updated: updatedProject.last_updated
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Surrogate-Control': 'no-store',
          'X-Accel-Expires': '0',
          'Last-Modified': new Date().toUTCString()
        }
      }
    );
  } catch (error) {
    console.error('Error refreshing project:', error);
    return NextResponse.json(
      { 
        error: 'Failed to refresh project',
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  }
} 
