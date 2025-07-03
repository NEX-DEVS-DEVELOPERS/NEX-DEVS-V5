import React from 'react';
import { motion } from 'framer-motion';
import { PlanReview } from './ReviewsDrawer';

interface PlanReviewsProps {
  planTitle: string;
  reviews: PlanReview[];
}

const PlanReviews: React.FC<PlanReviewsProps> = ({ planTitle, reviews }) => {
  // Filter reviews for this plan
  const planReviews = reviews.filter(review => review.planTitle === planTitle);
  
  // Calculate average rating
  const averageRating = planReviews.length > 0
    ? planReviews.reduce((sum, review) => sum + review.rating, 0) / planReviews.length
    : 0;
  
  // Get the most recent review
  const latestReview = planReviews[0];
  
  if (!latestReview) return null;
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="text-yellow-400 text-sm flex">
            {'★'.repeat(Math.round(averageRating))}
          </div>
          <span className="text-xs text-gray-400">
            ({planReviews.length} {planReviews.length === 1 ? 'review' : 'reviews'})
          </span>
        </div>
      </div>
      
      {latestReview && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 rounded-lg p-3 border border-purple-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center text-white text-sm font-medium">
              {latestReview.author.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-medium text-white">{latestReview.author}</p>
              <p className="text-xs text-gray-400">{latestReview.role}</p>
            </div>
          </div>
          <p className="text-sm text-gray-300 line-clamp-2">{latestReview.text}</p>
          {latestReview.successMetrics && latestReview.successMetrics.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {latestReview.successMetrics.slice(0, 2).map((metric, index) => (
                <div 
                  key={index}
                  className="bg-purple-500/10 px-2 py-1 rounded text-xs text-purple-300 border border-purple-500/20"
                >
                  {metric.label}: {metric.value}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default PlanReviews;