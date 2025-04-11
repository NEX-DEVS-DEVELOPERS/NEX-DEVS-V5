import { NextRequest, NextResponse } from 'next/server';

// Check if we're in read-only mode on Vercel
const isVercel = process.env.VERCEL === '1';
const isProduction = process.env.NODE_ENV === 'production';
const READ_ONLY_MODE = isVercel && isProduction;

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const check = url.searchParams.get('check');
    
    // Check if we're just checking read-only mode
    if (check === 'readOnly') {
      return NextResponse.json({
        readOnlyMode: READ_ONLY_MODE,
        vercel: isVercel,
        production: isProduction,
        environment: process.env.NODE_ENV || 'unknown'
      });
    }
    
    // Return overall config
    return NextResponse.json({
      readOnlyMode: READ_ONLY_MODE,
      version: '1.0.0',
      apiVersion: '1',
      environment: process.env.NODE_ENV || 'unknown',
      serverInfo: {
        vercel: isVercel,
        node: process.version,
        platform: process.platform
      }
    });
  } catch (error) {
    console.error('Error fetching config:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch config',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 