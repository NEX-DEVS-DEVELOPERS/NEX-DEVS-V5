import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getProjects, saveProjects } from '@/app/utils/projects'
import sqliteDb from '@/app/services/database'
import mysqlDb from '@/lib/mysql'

// Use MySQL as the primary database
const db = mysqlDb

const ADMIN_PASSWORD = 'nex-devs.org889123'

// Check if we're in read-only mode on Vercel
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const READ_ONLY_MODE = isVercel && isProduction;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const timestamp = new Date().getTime();
    
    console.log(`[GET Project ${id}] Request received at timestamp: ${timestamp}`);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }
    
    const project = await db.getProjectById(id)
    
    if (!project) {
      console.log(`[GET Project ${id}] Project not found`);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    console.log(`[GET Project ${id}] Successfully retrieved project: ${project.title}`);
    if (project.isCodeScreenshot) {
      console.log(`[GET Project ${id}] Code screenshot details: language=${project.codeLanguage}, title=${project.codeTitle}`);
    }
    
    return NextResponse.json(project, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'X-Accel-Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'X-Response-Time': timestamp.toString()
      }
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    const timestamp = new Date().getTime();
    console.log(`[PUT Project ${id}] Request received at timestamp: ${timestamp}`);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    // Special handling for read-only mode
    if (READ_ONLY_MODE) {
      console.log(`[Read-only mode] Would update project ID: ${id}`);
      
      // In read-only mode, get the current data and pretend we updated it
      const currentProject = await db.getProjectById(id);
      
      if (!currentProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      
      // Get the request data to merge with current data
      const data = await request.json();
      const updatedProject = { 
        ...currentProject, 
        ...data.project || data,
        id // Ensure ID remains the same
      };
      
      return NextResponse.json({ 
        ...updatedProject,
        readOnly: true,
        message: 'Project updated (read-only mode)'
      });
    }
    
    // Check if project exists
    const existingProject = await db.getProjectById(id);
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    // Get the request data
    const data = await request.json();
    
    // Check for admin password if provided
    if (data.password && data.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get project data from request body
    const projectData = data.project || data;
    
    // Combine with existing project
    const updatedProject = { 
      ...existingProject, 
      ...projectData,
      id // Ensure ID remains the same
    };
    
    console.log(`[PUT Project ${id}] Updating project with title: ${updatedProject.title}`);
    
    // Log code screenshot details if present
    if (updatedProject.isCodeScreenshot) {
      console.log(`[PUT Project ${id}] Code screenshot details:`, {
        isCodeScreenshot: Boolean(updatedProject.isCodeScreenshot),
        codeLanguage: updatedProject.codeLanguage || 'none',
        codeTitle: updatedProject.codeTitle || 'none',
        hasCodeContent: Boolean(updatedProject.codeContent),
        useDirectCodeInput: Boolean(updatedProject.useDirectCodeInput)
      });
    }
    
    // Update in database
    const result = await db.updateProject(id, updatedProject);
    
    // Handle different return types between MySQL (object) and SQLite (boolean)
    const isSuccess = result !== false && result !== undefined && result !== null;
    
    if (!isSuccess) {
      return NextResponse.json({ error: 'Failed to update project in database' }, { status: 500 });
    }

    console.log(`[PUT Project ${id}] Project successfully updated`);
    
    // Force revalidation of related pages
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
      
      await fetch(`${request.nextUrl.origin}/api/revalidate?path=/projects/${id}&secret=${ADMIN_PASSWORD}`, {
        method: 'GET',
        cache: 'no-store'
      });
      
      console.log(`[PUT Project ${id}] All paths revalidated successfully`);
    } catch (error) {
      console.error('Error revalidating paths:', error);
    }

    // Return the updated project
    return NextResponse.json(updatedProject, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'X-Accel-Expires': '0',
        'Last-Modified': new Date().toUTCString(),
        'X-Response-Time': timestamp.toString()
      }
    });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ 
      error: 'Failed to update project', 
      details: error instanceof Error ? error.message : String(error),
      readOnly: READ_ONLY_MODE
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`DELETE request received for project ID: ${params.id}`);
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      console.error('Invalid project ID:', params.id);
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    // Extract authorization information with more logging
    const authHeader = request.headers.get('Authorization');
    const url = new URL(request.url);
    const queryPassword = url.searchParams.get('password');
    
    console.log(`Auth method check: Header: ${!!authHeader}, Query: ${!!queryPassword}`);
    
    // Check password from header or query parameters
    const isAuthorized = 
      (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] === ADMIN_PASSWORD) ||
      (queryPassword && queryPassword === ADMIN_PASSWORD);
    
    if (!isAuthorized) {
      console.error('Unauthorized delete attempt for project ID:', id);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    console.log(`Attempting to delete project ID: ${id}`);
    
    // Special handling for read-only mode
    if (READ_ONLY_MODE) {
      console.log(`[Read-only mode] Would delete project ID: ${id}`);
      
      // In Vercel production, return success even though we can't actually modify the DB
      return NextResponse.json({ 
        message: 'Project marked for deletion (read-only mode)',
        success: true,
        readOnly: true
      });
    }
    
    // First check if the project exists
    const project = await db.getProjectById(id);
    if (!project) {
      console.error(`Project ID ${id} not found for deletion`);
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    
    // Delete from database with explicit error handling
    let success = false;
    try {
      const result = await db.deleteProject(id);
      // Handle different return types between MySQL and SQLite
      success = result && (typeof result === 'boolean' ? result : true);
      console.log(`Deletion result for project ID ${id}: ${success ? 'Success' : 'Failed'}`);
    } catch (dbError) {
      console.error(`Database error deleting project ID ${id}:`, dbError);
      return NextResponse.json({ 
        error: 'Database error during deletion',
        details: dbError instanceof Error ? dbError.message : String(dbError),
        readOnly: READ_ONLY_MODE
      }, { status: 500 });
    }
    
    if (!success) {
      console.error(`Failed to delete project ID ${id} (no database error but operation failed)`);
      return NextResponse.json({ error: 'Project deletion failed' }, { status: 500 });
    }

    // Clear cache for this endpoint
    const revalidateResponse = await fetch(`${url.origin}/api/revalidate?path=/&secret=${ADMIN_PASSWORD}`);
    console.log(`Cache revalidation status: ${revalidateResponse.status}`);

    return NextResponse.json({ message: 'Project deleted successfully' }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ 
      error: 'Failed to delete project', 
      details: error instanceof Error ? error.message : String(error),
      readOnly: READ_ONLY_MODE
    }, { status: 500 });
  }
} 