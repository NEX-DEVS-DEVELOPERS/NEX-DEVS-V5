import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getProjects, saveProjects } from '@/frontend/utils/projects'
import sqliteDb from '@/backend/services/database'
import neonDb from '@/backend/lib/neon'

// Set a password for admin operations
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123'
// Set a database password for project operations
const DB_PASSWORD = process.env.DATABASE_PASSWORD || 'alihasnaat919'

// Use Neon PostgreSQL database exclusively
const db = neonDb

// Check if we're in read-only mode on Vercel
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const READ_ONLY_MODE = isVercel && isProduction;

// GET a single project by ID
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    // Get project from database
    const project = await db.getProjectById(id);
    
    if (!project) {
      // If not found in primary database, try fallback only if available
      let fallbackProject = null;
      if (mysqlDb) {
        try {
          fallbackProject = await mysqlDb.getProjectById(id);
        } catch (error) {
          console.error('Error fetching from fallback database:', error);
        }
      }
      
      if (!fallbackProject) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }
      
      return NextResponse.json(fallbackProject);
    }
    
    return NextResponse.json(project);
  } catch (error) {
    console.error(`Error fetching project with ID ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT to update a project
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const body = await request.json();
    const { password, ...projectData } = body;
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid database password' }, { status: 401 });
    }
    
    console.log(`Updating project ID ${id} with data:`, {
      title: projectData.title,
      category: projectData.category,
      featured: projectData.featured,
      status: projectData.status,
      timestamp: new Date().toISOString()
    });
    
    // Update in Neon database
    const result = await db.updateProject(id, projectData);
    
    if (!result.success) {
      console.error(`Failed to update project ID ${id}:`, result.message);
      return NextResponse.json({ 
        error: result.message,
        details: 'Database update failed' 
      }, { status: 500 });
    }
    
    console.log(`Successfully updated project ID ${id}`);
    
    return NextResponse.json({
      success: true,
      message: `Project with ID ${id} updated successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating project with ID ${params.id}:`, error);
    return NextResponse.json({
      error: 'Failed to update project',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// DELETE to remove a project
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Get password from query params or bearer token
    const url = new URL(request.url);
    const passwordFromQuery = url.searchParams.get('password');
    const authHeader = request.headers.get('Authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
    const password = passwordFromQuery || bearerToken;
    
    const id = parseInt(params.id, 10);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid database password' }, { status: 401 });
    }
    
    console.log(`Deleting project ID ${id}`);
    
    // First, get the project to confirm it exists
    const existingProject = await db.getProjectById(id);
    if (!existingProject) {
      return NextResponse.json({ error: `Project with ID ${id} not found` }, { status: 404 });
    }
    
    // Delete from database
    const result = await db.deleteProject(id);
    
    if (!result.success) {
      console.error(`Failed to delete project ID ${id}:`, result.message);
      return NextResponse.json({ 
        error: result.message,
        details: 'Database deletion failed' 
      }, { status: 500 });
    }
    
    console.log(`Successfully deleted project ID ${id}`);
    
    return NextResponse.json({
      success: true,
      message: `Project "${existingProject.title}" with ID ${id} deleted successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error deleting project with ID ${params.id}:`, error);
    return NextResponse.json({
      error: 'Failed to delete project',
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
} 