import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getProjects, saveProjects } from '@/app/utils/projects'
import db from '@/app/services/database'

const ADMIN_PASSWORD = 'nex-devs.org889123'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }
    
    const project = db.getProjectById(id)
    
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }
    
    return NextResponse.json(project, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
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
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }
    
    // Check if project exists
    const existingProject = db.getProjectById(id)
    if (!existingProject) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    // Get the request data
    const data = await request.json()
    
    // Check for admin password if provided
    if (data.password && data.password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Get project data from request body
    const projectData = data.project || data
    
    // Combine with existing project
    const updatedProject = { 
      ...existingProject, 
      ...projectData,
      id // Ensure ID remains the same
    }
    
    // Update in database
    const success = db.updateProject(updatedProject)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to update project in database' }, { status: 500 })
    }

    // Return the updated project
    return NextResponse.json(updatedProject, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 })
    }
    
    // Check authorization - either from headers or query params
    const authHeader = request.headers.get('Authorization')
    const url = new URL(request.url)
    const queryPassword = url.searchParams.get('password')
    
    // Check password from header or query parameters
    const isAuthorized = 
      (authHeader && authHeader.startsWith('Bearer ') && authHeader.split(' ')[1] === ADMIN_PASSWORD) ||
      (queryPassword && queryPassword === ADMIN_PASSWORD)
    
    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    // Delete from database
    const success = db.deleteProject(id)
    
    if (!success) {
      return NextResponse.json({ error: 'Project not found or could not be deleted' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Project deleted successfully' }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project: ' + (error instanceof Error ? error.message : String(error)) }, { status: 500 })
  }
} 