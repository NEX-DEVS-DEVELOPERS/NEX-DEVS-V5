'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminAuthCheck from '@/app/components/AdminAuthCheck'
import { toast, Toaster } from 'react-hot-toast'
import DebugPanelWrapper from '@/app/components/DebugPanelWrapper'
import { carouselReviews, planReviews } from '@/app/components/ReviewsData'

// Type definition for a review
type Review = {
  id: string;
  planTitle: string;
  author: string;
  role: string;
  company?: string;
  country?: string;
  rating: number;
  text: string;
  date: string;
  avatar?: string;
  projectType?: string;
  successMetrics?: {
    label: string;
    value: string;
  }[];
  isVerified?: boolean;
  isInternational?: boolean;
  source?: string; // Added to fix linter errors - can be 'static', 'carousel', or undefined for API reviews
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isReadOnly, setIsReadOnly] = useState(false)

  // Add a check for read-only mode
  useEffect(() => {
    // Check if we're running on Vercel in production
    const checkReadOnlyMode = async () => {
      try {
        const response = await fetch('/api/config?check=readOnly', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setIsReadOnly(data.readOnlyMode || false);
        }
      } catch (error) {
        console.error('Error checking read-only mode:', error);
      }
    };
    
    checkReadOnlyMode();
  }, []);

  // Fetch reviews on component mount
  useEffect(() => {
    fetchReviews()
  }, [])

  // Function to fetch reviews
  const fetchReviews = async () => {
    setIsLoading(true)
    try {
      // First try to fetch from API
      const timestamp = new Date().getTime();
      const randomValue = Math.floor(Math.random() * 10000000);
      const cache = `nocache=${timestamp}-${randomValue}`;
      const response = await fetch(`/api/reviews?t=${timestamp}&r=${randomValue}&${cache}`, {
        method: 'GET',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Force-Refresh': 'true',
          'X-Random-Value': randomValue.toString()
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && Array.isArray(data.reviews)) {
          // Combine API reviews with static data
          const combinedReviews = [
            ...data.reviews,
            ...planReviews.map(review => ({
              ...review,
              source: 'static' // Flag to indicate this is from static data
            })),
            ...carouselReviews.map(review => ({
              id: `carousel-${review.author.replace(/\s+/g, '-').toLowerCase()}`,
              planTitle: review.projectType || 'General',
              author: review.author,
              role: review.role,
              company: review.company,
              rating: review.rating,
              text: review.text,
              date: new Date().toISOString().split('T')[0],
              isVerified: review.isVerified,
              source: 'carousel' // Flag to indicate this is from carousel data
            }))
          ];
          
          // Remove duplicates (prefer API version over static)
          const idSet = new Set();
          const uniqueReviews = combinedReviews.filter(review => {
            if (idSet.has(review.id)) return false;
            idSet.add(review.id);
            return true;
          });
          
          setReviews(uniqueReviews);
        } else {
          setReviews([...planReviews, ...carouselReviews.map(review => ({
            id: `carousel-${review.author.replace(/\s+/g, '-').toLowerCase()}`,
            planTitle: review.projectType || 'General',
            author: review.author,
            role: review.role,
            company: review.company,
            rating: review.rating,
            text: review.text,
            date: new Date().toISOString().split('T')[0], 
            isVerified: review.isVerified,
            source: 'carousel'
          }))]);
        }
      } else {
        // Fallback to static data if API fails
        setReviews([...planReviews, ...carouselReviews.map(review => ({
          id: `carousel-${review.author.replace(/\s+/g, '-').toLowerCase()}`,
          planTitle: review.projectType || 'General',
          author: review.author,
          role: review.role,
          company: review.company,
          rating: review.rating,
          text: review.text,
          date: new Date().toISOString().split('T')[0],
          isVerified: review.isVerified,
          source: 'carousel'
        }))]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
      
      // Fallback to static data if API fails
      setReviews([...planReviews, ...carouselReviews.map(review => ({
        id: `carousel-${review.author.replace(/\s+/g, '-').toLowerCase()}`,
        planTitle: review.projectType || 'General',
        author: review.author,
        role: review.role,
        company: review.company,
        rating: review.rating,
        text: review.text,
        date: new Date().toISOString().split('T')[0],
        isVerified: review.isVerified,
        source: 'carousel'
      }))]);
    } finally {
      setIsLoading(false);
    }
  }

  // Function to toggle verified status
  const toggleVerified = async (review: Review) => {
    const updatedReview = { ...review, isVerified: !review.isVerified };
    
    try {
      // If the review has a "source" property, it's from static data, so we can't update it
      if (review.source === 'static' || review.source === 'carousel') {
        toast.error("Cannot update static review data. Only API-sourced reviews can be modified.");
        return;
      }
      
      const response = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedReview),
      });
      
      if (response.ok) {
        setReviews(
          reviews.map(r => r.id === review.id ? updatedReview : r)
        );
        toast.success(`Review ${updatedReview.isVerified ? 'verified' : 'unverified'} successfully`);
        
        // Revalidate pages
        const password = sessionStorage.getItem('adminPassword') || 'nex-devs919';
        await fetch(`/api/revalidate?path=/&secret=${password}`);
      } else {
        toast.error('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      toast.error('Error updating review');
    }
  }

  // Function to delete a review
  const handleDeleteReview = async (id: string, source?: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }
    
    // If the review is from static data, we can't delete it
    if (source === 'static' || source === 'carousel') {
      toast.error("Cannot delete static review data. Only API-sourced reviews can be modified.");
      return;
    }
    
    try {
      toast.loading('Deleting review...');
      
      // Get the admin password from session storage or prompt for it
      let password = sessionStorage.getItem('adminPassword');
      
      // If no password found in session storage, prompt the user and save it
      if (!password) {
        password = prompt('Enter admin password to confirm deletion:');
        if (!password) {
          toast.dismiss();
          toast.error('Password required for deletion');
          return;
        }
        // Store password in session for future operations
        sessionStorage.setItem('adminPassword', password);
      }
      
      const response = await fetch(`/api/reviews/${id}?password=${encodeURIComponent(password || '')}`, {
        method: 'DELETE',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'Authorization': `Bearer ${password}`
        }
      });
      
      toast.dismiss();
      
      if (response.ok) {
        setReviews(reviews.filter(review => review.id !== id));
        toast.success('Review deleted successfully');
        
        // Revalidate pages
        await fetch(`/api/revalidate?path=/&secret=${password}`);
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete review');
      }
    } catch (error) {
      toast.dismiss();
      console.error('Error deleting review:', error);
      toast.error('Error connecting to the server. Please try again.');
    }
  }

  return (
    <AdminAuthCheck>
      <div className="min-h-screen bg-[#0a0a0a] pt-32 p-6">
        <Toaster position="top-right" />
        
        {isReadOnly && (
          <div className="mb-6 bg-amber-900/30 border border-amber-500/30 text-amber-200 rounded-lg p-4 shadow-lg">
            <div className="flex items-start">
              <svg className="w-5 h-5 mr-2 mt-0.5 text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-semibold text-amber-300">Read-Only Mode</h3>
                <p className="mt-1">
                  This admin dashboard is in read-only mode on the live deployment.
                  Changes to reviews from static data won't be saved. Only API-sourced reviews can be modified.
                </p>
              </div>
            </div>
          </div>
        )}
        
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-purple-400 to-blue-500 bg-clip-text text-transparent">
                Client Reviews Admin
              </h1>
              <p className="text-gray-400 mt-2">Manage client testimonials and reviews</p>
            </div>
            
            <div className="flex gap-4">
              <Link
                href="/hasnaat"
                className="bg-gray-700 hover:bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                <span>Admin Home</span>
              </Link>
              
              <Link
                href="/hasnaat/projects"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
                  />
                </svg>
                <span>Projects</span>
              </Link>

              <Link
                href="/admin/reviews/new"
                className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                <span>Add New Review</span>
              </Link>

              <button
                onClick={fetchReviews}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                <span>Refresh Data</span>
              </button>
              
              <Link
                href="/"
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg flex items-center space-x-2 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
                <span>View Site</span>
              </Link>
            </div>
          </div>

          {/* Debug Information (simplified) */}
          <div className="mb-6 bg-gray-900/50 rounded-xl border border-purple-500/20 p-4">
            <div className="flex items-center gap-2 text-purple-300 mb-2">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Debug Information</span>
            </div>
            <div className="text-gray-400 text-xs">
              Reviews loaded: {reviews.length} | 
              API Reviews: {reviews.filter(r => !r.source).length} | 
              Static Reviews: {reviews.filter(r => r.source === 'static').length + reviews.filter(r => r.source === 'carousel').length}
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-900/50 rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-800">
                  <thead className="bg-gray-900/70">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Author
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Plan Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Rating
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Review Text
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Verified
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Source
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-900/30 divide-y divide-gray-800">
                    {reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {review.id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          <div>
                            {review.author}
                            <div className="text-xs text-gray-400">{review.role}</div>
                            {review.company && (
                              <div className="text-xs text-gray-500">{review.company}</div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {review.planTitle}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <div className="flex text-yellow-500">
                            {'★'.repeat(review.rating)}
                            {'☆'.repeat(5 - review.rating)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-300">
                          <div className="max-w-md line-clamp-2">
                            {review.text}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <button 
                            onClick={() => toggleVerified(review)}
                            disabled={review.source === 'static' || review.source === 'carousel'}
                            className={`px-2 py-1 text-xs rounded-full cursor-pointer ${
                              review.isVerified 
                                ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30' 
                                : 'bg-gray-500/20 text-gray-400 hover:bg-gray-500/30 border border-gray-500/30'
                            } ${(review.source === 'static' || review.source === 'carousel') && 'opacity-50 cursor-not-allowed'}`}
                          >
                            {review.isVerified ? 'Verified' : 'Not Verified'}
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            !review.source
                              ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                              : review.source === 'carousel'
                                ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}>
                            {!review.source ? 'API' : review.source === 'carousel' ? 'Carousel' : 'Static'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/reviews/edit/${review.id}`}
                              className={`text-purple-400 hover:text-purple-300 transition-colors ${
                                (review.source === 'static' || review.source === 'carousel') && 'opacity-50 cursor-not-allowed'
                              }`}
                              onClick={(e) => {
                                if (review.source === 'static' || review.source === 'carousel') {
                                  e.preventDefault();
                                  toast.error("Cannot edit static review data. Only API-sourced reviews can be modified.");
                                }
                              }}
                            >
                              Edit
                            </Link>
                            <button
                              onClick={() => handleDeleteReview(review.id, review.source)}
                              className={`text-red-400 hover:text-red-300 transition-colors ${
                                (review.source === 'static' || review.source === 'carousel') && 'opacity-50 cursor-not-allowed'
                              }`}
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminAuthCheck>
  )
} 