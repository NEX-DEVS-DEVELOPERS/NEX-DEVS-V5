import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { PlanReview } from '@/frontend/components/ReviewsDrawer';

// Store reviews in a JSON file
const REVIEWS_FILE_PATH = path.join(process.cwd(), 'data', 'reviews.json');

// Ensure the data directory exists
if (!fs.existsSync(path.join(process.cwd(), 'data'))) {
  fs.mkdirSync(path.join(process.cwd(), 'data'));
}

// Initialize reviews file if it doesn't exist
if (!fs.existsSync(REVIEWS_FILE_PATH)) {
  fs.writeFileSync(REVIEWS_FILE_PATH, JSON.stringify([], null, 2));
}

// Read reviews from file
function getStoredReviews(): PlanReview[] {
  try {
    const data = fs.readFileSync(REVIEWS_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading reviews:', error);
    return [];
  }
}

// Write reviews to file
function saveReviews(reviews: PlanReview[]) {
  try {
    fs.writeFileSync(REVIEWS_FILE_PATH, JSON.stringify(reviews, null, 2));
  } catch (error) {
    console.error('Error saving reviews:', error);
  }
}

// Verify admin password
const verifyAdminPassword = (password?: string) => {
  const validPassword = process.env.ADMIN_PASSWORD || 'nex-devs919';
  return password === validPassword;
};

// GET a single review by ID
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const reviews = getStoredReviews();
  const review = reviews.find(r => r.id === params.id);

  if (!review) {
    return NextResponse.json(
      { success: false, message: 'Review not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true, review });
}

// UPDATE a review
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const reviews = getStoredReviews();
    const reviewIndex = reviews.findIndex(r => r.id === params.id);
    
    if (reviewIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Get updated review data
    const updatedReview = await request.json() as PlanReview;
    
    // Validate required fields
    if (!updatedReview.author || !updatedReview.text || !updatedReview.rating || !updatedReview.planTitle) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Update the review
    reviews[reviewIndex] = {
      ...reviews[reviewIndex],
      ...updatedReview,
      id: params.id, // Ensure ID doesn't change
    };
    
    // Save updated reviews
    saveReviews(reviews);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Review updated successfully',
      review: reviews[reviewIndex]
    });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update review' },
      { status: 500 }
    );
  }
}

// DELETE a review
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    // Verify admin password
    const { searchParams } = new URL(request.url);
    const password = searchParams.get('password');
    
    if (!verifyAdminPassword(password || undefined)) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const reviews = getStoredReviews();
    const reviewIndex = reviews.findIndex(r => r.id === params.id);
    
    if (reviewIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Review not found' },
        { status: 404 }
      );
    }
    
    // Remove the review
    reviews.splice(reviewIndex, 1);
    
    // Save updated reviews
    saveReviews(reviews);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete review' },
      { status: 500 }
    );
  }
} 