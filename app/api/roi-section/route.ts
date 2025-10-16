import { NextRequest, NextResponse } from 'next/server';
import { getROISection } from '@/backend/lib/neon';

// GET ROI section with cards (public endpoint)
export async function GET(request: NextRequest) {
  try {
    console.log('Fetching ROI section data...');
    
    const roiSection = await getROISection();
    
    if (!roiSection) {
      return NextResponse.json({ 
        error: 'ROI section not found or not published',
        message: 'No ROI section data available'
      }, { 
        status: 404,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
    }

    // Return the ROI section data in the format expected by the frontend
    const responseData = {
      id: roiSection.id,
      main_heading: roiSection.main_heading,
      sub_heading: roiSection.sub_heading,
      video_url: roiSection.video_url,
      image_one: roiSection.image_one,
      image_two: roiSection.image_two,
      cards: roiSection.cards || []
    };

    console.log('ROI section data retrieved successfully:', {
      id: roiSection.id,
      main_heading: roiSection.main_heading,
      cards_count: roiSection.cards?.length || 0
    });

    return NextResponse.json(responseData, {
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store',
        'X-Accel-Expires': '0',
        'Last-Modified': new Date().toUTCString()
      }
    });
  } catch (error) {
    console.error('Error fetching ROI section:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch ROI section',
      message: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  }
}
