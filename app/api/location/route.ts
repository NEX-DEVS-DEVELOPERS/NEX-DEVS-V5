import { NextRequest, NextResponse } from 'next/server';
import { getLocationData, adjustPriceForCountry } from '@/app/utils/pricing';

export async function GET(request: NextRequest) {
  try {
    // Get IP from X-Forwarded-For header or fallback to client IP
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : request.ip || '';
    
    // Get location data
    const locationData = await getLocationData(ip);
    
    return NextResponse.json({
      success: true,
      data: locationData
    });
  } catch (error) {
    console.error('Error in location API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to get location data'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { basePrice } = await request.json();
    
    // Get IP and location data
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : request.ip || '';
    const locationData = await getLocationData(ip);
    
    // Adjust price based on location
    const adjustedPrice = adjustPriceForCountry(
      basePrice,
      locationData.country,
      locationData.currency,
      locationData.exchangeRate
    );
    
    return NextResponse.json({
      success: true,
      data: {
        ...locationData,
        ...adjustedPrice
      }
    });
  } catch (error) {
    console.error('Error in price adjustment API:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to adjust price'
    }, { status: 500 });
  }
} 