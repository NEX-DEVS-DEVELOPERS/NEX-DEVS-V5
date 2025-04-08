import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { getProjects, saveProjects } from '@/app/utils/projects'

const ADMIN_PASSWORD = 'nex-devs.org889123'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const projects = await getProjects()
    const project = projects.find(p => p.id === id)

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    return NextResponse.json(project)
  } catch (error) {
    console.error('Error retrieving project:', error)
    return NextResponse.json({ error: 'Failed to retrieve project' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    const projects = await getProjects()
    const projectIndex = projects.findIndex(p => p.id === id)

    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    const body = await request.json()
    const updatedProject = { ...projects[projectIndex], ...body }
    projects[projectIndex] = updatedProject

    await saveProjects(projects)

    return NextResponse.json(updatedProject)
  } catch (error) {
    console.error('Error updating project:', error)
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const id = parseInt(params.id)
    const projects = await getProjects()
    const filteredProjects = projects.filter(p => p.id !== id)

    if (filteredProjects.length === projects.length) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 })
    }

    await saveProjects(filteredProjects)

    return NextResponse.json({ message: 'Project deleted successfully' })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 })
  }
} 