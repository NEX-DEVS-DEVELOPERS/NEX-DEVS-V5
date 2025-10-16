import { NextRequest, NextResponse } from 'next/server';
import * as db from '@/backend/lib/neon';

// Environment variables for authentication
const DB_PASSWORD = process.env.DB_PASSWORD || 'alihasnaat919';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

// GET all team members
export async function GET(request: NextRequest) {
  try {
    const teamMembers = await db.getTeamMembers();
    
    return NextResponse.json({
      success: true,
      data: teamMembers,
      count: teamMembers.length
    });
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch team members',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// POST to create a new team member
export async function POST(request: NextRequest) {
  try {
    const { password, ...member } = await request.json();
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid password' }, { status: 401 });
    }
    
    // Validate required fields
    const requiredFields = ['name', 'title'];
    const missingFields = requiredFields.filter(field => !member[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json({ 
        error: `Invalid team member data - missing required fields: ${missingFields.join(', ')}` 
      }, { status: 400 });
    }
    
    console.log('Creating team member with data:', {
      name: member.name,
      title: member.title,
      isLeader: Boolean(member.isLeader || member.is_leader),
      hasImage: Boolean(member.image_url || member.imageUrl)
    });
    
    // Fill in default values for any undefined fields
    const memberWithDefaults = {
      ...member,
      name: member.name.trim(),
      title: member.title.trim(),
      bio: member.bio ? member.bio.trim() : null,
      // Ensure image field has a value, use placeholder if not provided
      image_url: (member.image_url || member.imageUrl || '/team/placeholder.jpg').trim(),
      email: member.email ? member.email.trim() : null,
      // Handle social media URLs
      linkedin_url: member.linkedin_url || member.linkedinUrl || null,
      github_url: member.github_url || member.githubUrl || null,
      twitter_url: member.twitter_url || member.twitterUrl || null,
      dribbble_url: member.dribbble_url || member.dribbbleUrl || null,
      website_url: member.website_url || member.websiteUrl || null,
      // Handle skills array
      skills: Array.isArray(member.skills) ? member.skills : [],
      // Handle priority and flags
      order_priority: typeof member.order_priority === 'number' ? 
        member.order_priority : (typeof member.orderPriority === 'number' ? member.orderPriority : 0),
      is_leader: Boolean(member.is_leader || member.isLeader),
      active: Boolean(member.active !== false), // Default to true
      // Timestamps
      created_at: new Date().toISOString(),
      last_updated: new Date().toISOString()
    };
    
    // Create the new team member in database
    const result = await db.createTeamMember(memberWithDefaults);
    
    if (!result.success) {
      console.error('Failed to create team member:', result.message);
      return NextResponse.json({ 
        error: result.message,
        details: 'Database creation failed'
      }, { status: 500 });
    }
    
    console.log(`Successfully created team member with ID ${result.id}`);
    
    // Return success with the new team member ID
    return NextResponse.json({
      success: true,
      message: `Team member "${memberWithDefaults.name}" created successfully`,
      id: result.id,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating team member:', error);
    return NextResponse.json({ 
      error: 'Failed to create team member', 
      details: error instanceof Error ? error.message : String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// PUT to update an existing team member
export async function PUT(request: NextRequest) {
  try {
    const { id, password, ...member } = await request.json();
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid password' }, { status: 401 });
    }
    
    // Validate team member ID and data
    if (!id || !member) {
      return NextResponse.json({ error: 'Invalid request - missing team member ID or data' }, { status: 400 });
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
    console.error('Error updating team member:', error);
    return NextResponse.json({ 
      error: 'Failed to update team member', 
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

// DELETE to remove an existing team member
export async function DELETE(request: NextRequest) {
  try {
    const { id, password } = await request.json();
    
    // Validate password - check both passwords for backward compatibility
    if (password !== DB_PASSWORD && password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized - Invalid password' }, { status: 401 });
    }
    
    // Validate team member ID
    if (!id) {
      return NextResponse.json({ error: 'Invalid request - missing team member ID' }, { status: 400 });
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
    console.error('Error deleting team member:', error);
    return NextResponse.json({ 
      error: 'Failed to delete team member',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

