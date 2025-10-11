import { NextRequest, NextResponse } from 'next/server';
import { neon } from '@neondatabase/serverless';

// Initialize Neon SQL connection
const NEON_CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://NEX-DEVS%20DATABSE_owner:npg_Av9imV5KFXhy@ep-nameless-frog-a1x6ujuj-pooler.ap-southeast-1.aws.neon.tech/NEX-DEVS%20DATABSE?sslmode=require';
const sql = neon(NEON_CONNECTION_STRING);

// POST to toggle publish status of ROI section
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    if (!data.id) {
      return NextResponse.json({ 
        success: false,
        error: 'ROI section ID is required'
      }, { status: 400 });
    }
    
    // Update publish status
    const result = await sql`
      UPDATE roi_section
      SET 
        is_published = ${data.is_published},
        updated_at = NOW()
      WHERE id = ${data.id}
      RETURNING *
    `;
    
    if (result.rows.length === 0) {
      return NextResponse.json({ 
        success: false,
        error: 'ROI section not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({ 
      success: true,
      data: result.rows[0]
    });
    
  } catch (error: any) {
    console.error('Error updating ROI section publish status:', error);
    return NextResponse.json({ 
      success: false,
      error: error.message
    }, { status: 500 });
  }
}