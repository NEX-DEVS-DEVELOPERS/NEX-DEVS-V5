import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

// Admin password for authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const secret = searchParams?.get('secret');
    const path = searchParams?.get('path');
    
    // Check authorization
    if (secret !== ADMIN_PASSWORD) {
      console.error('Unauthorized revalidation attempt');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    if (!path) {
      console.error('No path specified for revalidation');
      return NextResponse.json({ error: 'Path required' }, { status: 400 });
    }
    
    console.log(`Revalidating path: ${path}`);
    
    // Revalidate the specified path
    revalidatePath(path);
    
    // Also revalidate some common paths that might be affected
    if (path !== '/') revalidatePath('/');
    if (path !== '/projects') revalidatePath('/projects');
    if (path !== '/admin/projects') revalidatePath('/admin/projects');
    
    console.log('Revalidation complete');
    
    return NextResponse.json({ 
      revalidated: true,
      now: Date.now(),
      paths: [path, '/', '/projects', '/admin/projects']
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json({ 
      error: 'Failed to revalidate',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 