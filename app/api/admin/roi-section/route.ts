import { NextRequest, NextResponse } from 'next/server';
import { getAllROISections, createROISection, updateROISection } from '@/backend/lib/neon';
import crypto from 'crypto';

// Security: Admin password from environment
// For development, default password is "password"
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('[AUTH] No Authorization header or invalid format');
    return false;
  }
  
  const token = authHeader.substring(7);
  
  // Direct password comparison (password is already validated during login)
  const isValid = token === ADMIN_PASSWORD;
  
  if (!isValid) {
    console.log('[AUTH] Invalid password');
  }
  
  return isValid;
}

// GET all ROI sections for admin
export async function GET(request: NextRequest) {
  try {
    // Validate authentication
    if (!validateAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
          }
        }
      );
    }

    const roiSections = await getAllROISections();

    return NextResponse.json(
      { 
        success: true,
        data: roiSections
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error'
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        }
      }
    );
  }
}

// POST to create new ROI section
export async function POST(request: NextRequest) {
  try {
    // Validate authentication
    if (!validateAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.main_heading) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Main heading is required'
        },
        { status: 400 }
      );
    }

    const result = await createROISection(data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          message: result.message || 'Failed to create ROI section'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        data: result.data,
        message: 'ROI section created successfully'
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// PUT to update existing ROI section
export async function PUT(request: NextRequest) {
  try {
    // Validate authentication
    if (!validateAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.id) {
      return NextResponse.json(
        { 
          success: false,
          message: 'ROI section ID is required'
        },
        { status: 400 }
      );
    }

    const result = await updateROISection(data.id, data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          message: result.message || 'Failed to update ROI section'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        data: result.data,
        message: 'ROI section updated successfully'
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { 
        success: false,
        message: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

