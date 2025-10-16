import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/backend/lib/neon';

// Environment variables for authentication
const DB_PASSWORD = process.env.DB_PASSWORD || 'alihasnaat919';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

// GET team member by ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid team member ID' }, { status: 400 });
    }
    
    const teamMember = await db.getTeamMemberById(id);
    
    if (!teamMember) {
      return NextResponse.json({ error: 'Team member not found' }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      data: teamMember
    });
  } catch (error) {
    console.error(`Error fetching team member with ID ${params.id}:`, error);
    return NextResponse.json({ 
      error: 'Failed to fetch team member',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// PUT to update team member by ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid team member ID' }, { status: 400 });
    }
    
    const { password, ...member } = await request.json();
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid password' }, { status: 401 });
    }
    
    // Update the team member
    const result = await db.updateTeamMember(id, member);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Team member with ID ${id} updated successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error updating team member with ID ${params.id}:`, error);
    return NextResponse.json({ 
      error: 'Failed to update team member', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE team member by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json({ error: 'Invalid team member ID' }, { status: 400 });
    }
    
    const { password } = await request.json();
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid password' }, { status: 401 });
    }
    
    // Delete the team member
    const result = await db.deleteTeamMember(id);
    
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Team member with ID ${id} deleted successfully`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(`Error deleting team member with ID ${params.id}:`, error);
    return NextResponse.json({ 
      error: 'Failed to delete team member',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
