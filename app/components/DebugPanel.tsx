'use client'

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'react-hot-toast'

// Define types for system info and projects
type SystemInfo = {
  nodeVersion?: string;
  platform?: string;
  nextVersion?: string;
  nodeEnv?: string;
  performanceMetrics?: {
    memory: {
      used: number;
      total: number;
      percentage: number;
      freeMemory: number;
    };
    cpu: {
      cores: number;
      model: string;
      speed: string | number;
      loadAverage: number[];
    };
    uptime: {
      raw: number;
      formatted: string;
    };
    process: {
      pid: number;
      ppid: number;
      title: string;
      arch: string;
    };
  };
  database?: {
    type: string;
    host: string;
    database: string;
    port: string | number;
    isConnected: boolean;
    connectionType: string;
    ssl: boolean;
    localUrl: string | null;
    productionUrl: string | null;
  };
  websiteUrls?: {
    current: string;
    local: string;
    production: string | null;
    preview: string | null;
    environment: string;
    isVercel: boolean;
    branch: string;
  };
  apiResponseTime?: string;
  error?: string;
}

type Project = {
  id: number;
  title: string;
  featured?: boolean;
  status?: string;
  [key: string]: any;
}

export default function DebugPanel({ projects }: { projects: Project[] }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [systemInfo, setSystemInfo] = useState<SystemInfo | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [updateInterval, setUpdateInterval] = useState<number>(5000) // 5 seconds default
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchSystemInfo = useCallback(async () => {
    try {
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/debug?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setSystemInfo(data);
        setLastUpdated(new Date());
      } else {
        throw new Error('Failed to fetch system info');
      }
    } catch (error) {
      console.error('Error fetching system info:', error);
      toast.error('Failed to update system information');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch and setup interval
  useEffect(() => {
    if (isExpanded) {
      fetchSystemInfo();
      const interval = setInterval(fetchSystemInfo, updateInterval);
      return () => clearInterval(interval);
    }
  }, [isExpanded, updateInterval, fetchSystemInfo]);

  const copyDebugInfo = () => {
    try {
      const debugText = JSON.stringify({
        systemInfo,
        projectStats: {
          totalProjects: projects.length,
          featuredProjects: projects.filter(p => p.featured).length,
          inDevelopmentProjects: projects.filter(p => p.status === 'In Development').length,
        },
        lastUpdated: lastUpdated.toISOString(),
      }, null, 2);
      
      navigator.clipboard.writeText(debugText);
      toast.success('Debug information copied to clipboard');
    } catch (error) {
      console.error('Failed to copy debug info:', error);
      toast.error('Failed to copy debug information');
    }
  };

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    if (gb >= 1) return `${gb.toFixed(2)} GB`;
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  };

  return (
    <div className="w-full mb-6 bg-gray-900/70 rounded-xl border border-purple-500/20 overflow-hidden">
      <button 
        className="w-full px-4 py-3 flex items-center justify-between text-left bg-black/30 hover:bg-black/40 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
          </svg>
          <span className="font-medium text-purple-300">Debug Information</span>
          {isExpanded && (
            <span className="ml-2 text-xs text-gray-400">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
        </div>
        <svg className={`w-5 h-5 text-gray-400 transform transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isExpanded && (
        <div className="px-4 py-4 text-sm">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Website URLs */}
              <div>
                <h3 className="text-white font-medium mb-3">Website URLs</h3>
                <div className="grid grid-cols-1 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Current URL: </span>
                    <span className="text-gray-300">{systemInfo?.websiteUrls?.current || window.location.href}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Local Development: </span>
                    <span className="text-gray-300">{systemInfo?.websiteUrls?.local}</span>
                  </div>
                  {systemInfo?.websiteUrls?.production && (
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Production URL: </span>
                      <span className="text-green-400">{systemInfo.websiteUrls.production}</span>
                    </div>
                  )}
                  {systemInfo?.websiteUrls?.preview && (
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Preview URL: </span>
                      <span className="text-blue-400">{systemInfo.websiteUrls.preview}</span>
                    </div>
                  )}
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Environment: </span>
                    <span className={`font-medium ${
                      systemInfo?.websiteUrls?.environment === 'production' 
                        ? 'text-green-400' 
                        : systemInfo?.websiteUrls?.environment === 'preview'
                          ? 'text-blue-400'
                          : 'text-yellow-400'
                    }`}>
                      {systemInfo?.websiteUrls?.environment || 'development'}
                    </span>
                    {systemInfo?.websiteUrls?.isVercel && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-purple-500/20 text-purple-300 rounded">
                        Vercel
                      </span>
                    )}
                  </div>
                  {systemInfo?.websiteUrls?.branch !== 'N/A' && (
                    <div className="bg-black/20 p-2 rounded-md">
                      <span className="text-gray-400">Git Branch: </span>
                      <span className="text-purple-300">{systemInfo.websiteUrls.branch}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* System Information */}
              <div>
                <h3 className="text-white font-medium mb-3">System Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Node Version: </span>
                    <span className="text-gray-300">{systemInfo?.nodeVersion || 'N/A'}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Platform: </span>
                    <span className="text-gray-300">{systemInfo?.platform || navigator.platform}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Next.js Version: </span>
                    <span className="text-gray-300">{systemInfo?.nextVersion || 'N/A'}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Environment: </span>
                    <span className="text-gray-300">{systemInfo?.nodeEnv || process.env.NODE_ENV || 'development'}</span>
                  </div>
                </div>
              </div>

              {/* Database Information */}
              <div>
                <h3 className="text-white font-medium mb-3">Database Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Type: </span>
                    <span className={`font-medium ${systemInfo?.database?.isConnected ? 'text-green-400' : 'text-yellow-400'}`}>
                      {systemInfo?.database?.type || 'N/A'}
                    </span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Connection: </span>
                    <span className="text-gray-300">{systemInfo?.database?.connectionType || 'N/A'}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md col-span-2">
                    <span className="text-gray-400">Host: </span>
                    <span className="text-gray-300">{systemInfo?.database?.host || 'N/A'}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Database: </span>
                    <span className="text-gray-300">{systemInfo?.database?.database || 'N/A'}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Port: </span>
                    <span className="text-gray-300">{systemInfo?.database?.port || 'N/A'}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">SSL: </span>
                    <span className={`font-medium ${systemInfo?.database?.ssl ? 'text-green-400' : 'text-gray-300'}`}>
                      {systemInfo?.database?.ssl ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  {systemInfo?.database?.localUrl && (
                    <div className="bg-black/20 p-2 rounded-md col-span-2">
                      <span className="text-gray-400">Local URL: </span>
                      <span className="text-yellow-400">{systemInfo.database.localUrl}</span>
                    </div>
                  )}
                  {systemInfo?.database?.productionUrl && (
                    <div className="bg-black/20 p-2 rounded-md col-span-2">
                      <span className="text-gray-400">Production URL: </span>
                      <span className="text-green-400">{systemInfo.database.productionUrl}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Performance Metrics */}
              <div>
                <h3 className="text-white font-medium mb-3">Performance Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Memory Usage: </span>
                    <div className="mt-1">
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${systemInfo?.performanceMetrics?.memory.percentage || 0}%` }}
                        />
                      </div>
                      <div className="mt-1 text-gray-300">
                        {systemInfo?.performanceMetrics?.memory.used || 0}MB / {systemInfo?.performanceMetrics?.memory.total || 0}MB
                        <span className="text-purple-400 ml-1">
                          ({systemInfo?.performanceMetrics?.memory.percentage || 0}%)
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">CPU Info: </span>
                    <div className="mt-1 space-y-1">
                      <div className="text-gray-300">
                        Cores: {systemInfo?.performanceMetrics?.cpu.cores || 'N/A'}
                      </div>
                      <div className="text-gray-300">
                        Load Avg: {systemInfo?.performanceMetrics?.cpu.loadAverage?.map(load => load.toFixed(2)).join(', ') || 'N/A'}
                      </div>
                    </div>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Uptime: </span>
                    <span className="text-gray-300">{systemInfo?.performanceMetrics?.uptime.formatted || 'N/A'}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">API Response: </span>
                    <span className="text-gray-300">{systemInfo?.apiResponseTime || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Project Statistics */}
              <div>
                <h3 className="text-white font-medium mb-3">Project Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Total Projects: </span>
                    <span className="text-purple-300 font-medium">{projects.length}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Featured Projects: </span>
                    <span className="text-purple-300 font-medium">{projects.filter(p => p.featured).length}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">In Development: </span>
                    <span className="text-purple-300 font-medium">{projects.filter(p => p.status === 'In Development').length}</span>
                  </div>
                  <div className="bg-black/20 p-2 rounded-md">
                    <span className="text-gray-400">Update Interval: </span>
                    <select 
                      value={updateInterval}
                      onChange={(e) => setUpdateInterval(Number(e.target.value))}
                      className="bg-transparent text-purple-300 border-none outline-none"
                    >
                      <option value={1000}>1s</option>
                      <option value={5000}>5s</option>
                      <option value={10000}>10s</option>
                      <option value={30000}>30s</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <button
                  onClick={copyDebugInfo}
                  className="px-3 py-1.5 bg-purple-600/30 text-purple-300 text-xs rounded hover:bg-purple-600/40 transition-colors"
                >
                  Copy Debug Info
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 