import { NextRequest, NextResponse } from 'next/server';
import { updateROICard, deleteROICard } from '@/backend/lib/neon';

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

// PUT to update ROI card
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate authentication
    if (!validateAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const cardId = parseInt(params.id);
    if (isNaN(cardId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid card ID' },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.value || !data.description) {
      return NextResponse.json(
        { 
          success: false,
          message: 'Title, value, and description are required'
        },
        { status: 400 }
      );
    }

    const result = await updateROICard(cardId, data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          message: result.message || 'Failed to update ROI card'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        data: result.data,
        message: 'ROI card updated successfully'
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

// DELETE ROI card
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Validate authentication
    if (!validateAdminAuth(request)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const cardId = parseInt(params.id);
    if (isNaN(cardId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid card ID' },
        { status: 400 }
      );
    }

    const result = await deleteROICard(cardId);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false,
          message: result.message || 'Failed to delete ROI card'
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true,
        message: 'ROI card deleted successfully'
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

