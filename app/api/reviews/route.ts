import { NextResponse } from 'next/server';
import { PlanReview } from '@/frontend/components/ReviewsDrawer';
import fs from 'fs';
import path from 'path';

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

export async function POST(request: Request) {
  try {
    const reviewData = await request.json() as Partial<PlanReview>;
    
    // Validate required fields
    if (!reviewData.author || !reviewData.text || !reviewData.rating || !reviewData.planTitle) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create a new review
    const newReview: PlanReview = {
      id: `review-${Date.now()}`,
      author: reviewData.author,
      role: reviewData.role || 'Client',
      company: reviewData.company,
      country: reviewData.country,
      rating: reviewData.rating,
      text: reviewData.text,
      planTitle: reviewData.planTitle,
      projectType: reviewData.projectType,
      date: new Date().toISOString().split('T')[0],
      successMetrics: reviewData.successMetrics?.filter(metric => metric.label && metric.value),
      isVerified: true,
      isInternational: reviewData.country ? reviewData.country.toLowerCase() !== 'pakistan' : undefined
    };
    
    // Get existing reviews and add the new one
    const existingReviews = getStoredReviews();
    const updatedReviews = [newReview, ...existingReviews];
    
    // Save to file
    saveReviews(updatedReviews);
    
    // Calculate updated stats
    const stats = generateReviewStats(updatedReviews);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Review submitted successfully',
      review: newReview,
      stats
    });
  } catch (error) {
    console.error('Error submitting review:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit review' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const reviews = getStoredReviews();
  return NextResponse.json({ 
    success: true, 
    reviews,
    stats: generateReviewStats(reviews)
  });
}

function generateReviewStats(reviews: PlanReview[]) {
  if (reviews.length === 0) return null;
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  const ratingDistribution = {
    5: reviews.filter(r => r.rating === 5).length,
    4: reviews.filter(r => r.rating === 4).length,
    3: reviews.filter(r => r.rating === 3).length,
    2: reviews.filter(r => r.rating === 2).length,
    1: reviews.filter(r => r.rating === 1).length
  };
  
  const packageCounts: Record<string, number> = {};
  reviews.forEach(review => {
    const planTitle = review.planTitle || 'Unknown';
    packageCounts[planTitle] = (packageCounts[planTitle] || 0) + 1;
  });
  
  // Calculate satisfaction rate
  const satisfactionRate = ((ratingDistribution[5] + ratingDistribution[4]) / reviews.length) * 100;
  
  return {
    totalReviews: reviews.length,
    averageRating,
    ratingDistribution,
    packageDistribution: packageCounts,
    internationalPercentage: (reviews.filter(r => r.isInternational).length / reviews.length) * 100,
    satisfactionRate: Math.round(satisfactionRate * 10) / 10
  };
} 
