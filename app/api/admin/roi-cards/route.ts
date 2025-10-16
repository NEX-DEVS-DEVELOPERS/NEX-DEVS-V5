import { NextRequest, NextResponse } from 'next/server';
import { createROICard } from '@/backend/lib/neon';

// Security: Admin password from environment
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'password';

function validateAdminAuth(request: NextRequest): boolean {
  const authHeader = request.headers.get('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  return token === ADMIN_PASSWORD;
}

// POST to create new ROI card
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
    if (!data.roi_section_id || !data.title || !data.value || !data.description) {
      return NextResponse.json(
        { 
          success: false,
          message: 'ROI section ID, title, value, and description are required'
        },
        { status: 400 }
      );
    }

    const result = await createROICard(data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          message: result.message || 'Failed to create ROI card'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        data: result.data,
        message: 'ROI card created successfully'
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


