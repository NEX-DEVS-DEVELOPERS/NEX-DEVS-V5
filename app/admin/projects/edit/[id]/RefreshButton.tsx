'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';

// The admin password
const ADMIN_PASSWORD = 'nex-devs.org889123';

export default function RefreshButton({ projectId }: { projectId: number }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (!projectId) return;
    
    try {
      setIsRefreshing(true);
      toast.loading('Refreshing project data...');
      
      // Add timestamp to prevent caching
      const timestamp = new Date().getTime();
      
      // Call the force-refresh API endpoint
      const response = await fetch(
        `/api/projects/force-refresh?id=${projectId}&password=${ADMIN_PASSWORD}&t=${timestamp}`,
        {
          method: 'GET',
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        }
      );
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to refresh project');
      }
      
      const result = await response.json();
      
      // Clear any existing toasts
      toast.dismiss();
      
      // Show success message
      toast.success('Project data refreshed successfully!');

      // Use Barba.js for smooth transition instead of reload
      if (typeof window !== 'undefined' && window.barba) {
        window.barba.go(window.location.href);
      } else {
        // Fallback: trigger a custom event for data refresh
        window.dispatchEvent(new CustomEvent('projectDataRefreshed', { detail: result }));
      }
    } catch (error) {
      console.error('Error refreshing project:', error);
      toast.dismiss();
      toast.error('Failed to refresh project data');
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isRefreshing}
      className="px-4 py-2 bg-purple-600 text-white rounded font-medium text-sm hover:bg-purple-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
    >
      {isRefreshing ? (
        <>
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Refreshing...
        </>
      ) : (
        <>
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            ></path>
          </svg>
          Refresh Data
        </>
      )}
    </button>
  );
} 