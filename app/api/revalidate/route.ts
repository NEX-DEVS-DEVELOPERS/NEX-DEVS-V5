import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Same password as the projects API for consistency
const ADMIN_PASSWORD = 'nex-devs.org889123';

export async function GET(request: NextRequest) {
  try {
    // Get path and secret from query parameters
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path') || '/';
    const secret = searchParams.get('secret');

    // Validate the secret
    if (secret !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Invalid secret token' },
        { status: 401 }
      );
    }

    // Clear the cache for the specified path
    revalidatePath(path);

    // Additionally revalidate other important paths
    revalidatePath('/projects');
    revalidatePath('/admin/projects');
    
    // Return a success response
    return NextResponse.json(
      { 
        success: true, 
        message: `Cache revalidated for path: ${path}`,
        timestamp: new Date().toISOString() 
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      }
    );
  } catch (error) {
    console.error('Error revalidating path:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate cache' },
      { status: 500 }
    );
  }
} 