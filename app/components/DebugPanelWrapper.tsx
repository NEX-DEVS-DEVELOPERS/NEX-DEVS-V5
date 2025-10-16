'use client'

import { useEffect, useState } from 'react'
import DebugPanel from './DebugPanel'
import { toast } from 'react-hot-toast'

type Project = {
  id: number;
  title: string;
  featured?: boolean;
  status?: string;
  [key: string]: any;
}

export default function DebugPanelWrapper({ projects }: { projects: Project[] }) {
  const [showDebug, setShowDebug] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isProduction, setIsProduction] = useState(false)

  useEffect(() => {
    // Check if the component is mounted in the browser
    if (typeof window !== 'undefined' && !isInitialized) {
      try {
        // Detect environment
        const hostname = window.location.hostname;
        const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
        const isProd = !isLocalhost && (hostname.includes('.vercel.app') || !hostname.includes('localhost'));
        setIsProduction(isProd);
        
        console.log(`Environment detected: ${isProd ? 'Production' : 'Development'}`);
        
        // Force debug mode on for admin users - this ensures it works in production
        const isAdmin = sessionStorage.getItem('adminAuth') === 'true';
        if (isAdmin) {
          sessionStorage.setItem('debugMode', 'true');
          console.log('Debug mode automatically enabled for admin user');
          
          // Ensure the admin password is set (helpful in production)
          if (!sessionStorage.getItem('adminPassword')) {
            sessionStorage.setItem('adminPassword', 'nex-devs919');
          }
        }
        
        // Show debug panel in any of these conditions:
        // 1. In development environment
        // 2. For authenticated admin users
        // 3. If debug mode is explicitly enabled
        const isDev = process.env.NODE_ENV === 'development' || !isProd;
        const isDebugEnabled = sessionStorage.getItem('debugMode') === 'true';
        
        const shouldShowDebug = isAdmin || isDev || isDebugEnabled;
        setShowDebug(shouldShowDebug);
        
        if (shouldShowDebug) {
          console.log('Debug panel enabled:', { isAdmin, isDev, isDebugEnabled, isProd });
        }
        
        // Listen for changes to admin auth status
        const handleStorageChange = (event: StorageEvent | CustomEvent) => {
          // Check if this is our custom event or a regular storage event
          const isCustomEvent = event.type === 'storageChanged';
          const key = isCustomEvent 
            ? (event as CustomEvent).detail?.key 
            : (event as StorageEvent).key;
          
          if (key === 'adminAuth' || key === 'debugMode' || !key) {
            const isAdminUpdated = sessionStorage.getItem('adminAuth') === 'true';
            const isDebugEnabledUpdated = sessionStorage.getItem('debugMode') === 'true';
            setShowDebug(isAdminUpdated || isDev || isDebugEnabledUpdated);
          }
        };
        
        window.addEventListener('storage', handleStorageChange as EventListener);
        // Also listen for our custom storage event
        window.addEventListener('storageChanged', handleStorageChange as EventListener);
        
        setIsInitialized(true);
        
        return () => {
          window.removeEventListener('storage', handleStorageChange as EventListener);
          window.removeEventListener('storageChanged', handleStorageChange as EventListener);
        };
      } catch (error) {
        console.error('Error initializing debug panel:', error);
        // Try recovery by enabling debug for admins
        try {
          if (sessionStorage.getItem('adminAuth') === 'true') {
            setShowDebug(true);
          }
        } catch (e) {
          // Last resort - can't use sessionStorage
        }
        return () => {};
      }
    }
    return () => {};
  }, [isInitialized]);

  // If debug is enabled but not showing, check for possible issues with sessionStorage
  useEffect(() => {
    if (isInitialized && !showDebug) {
      try {
        // Attempt to detect admin login via alternate methods if sessionStorage failed
        const adminAuth = document.cookie.includes('adminAuth=true');
        if (adminAuth) {
          console.log('Admin detected via cookie, enabling debug panel');
          setShowDebug(true);
          sessionStorage.setItem('adminAuth', 'true');
          sessionStorage.setItem('debugMode', 'true');
        }
      } catch (error) {
        console.error('Error in secondary debug panel check:', error);
      }
    }
  }, [isInitialized, showDebug]);

  if (!showDebug) return null;

  return (
    <>
      <DebugPanel 
        projects={projects} 
        autoExpand={false}
      />
    </>
  );
} 
