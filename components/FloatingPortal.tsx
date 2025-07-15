'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface FloatingPortalProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

/**
 * FloatingPortal component renders its children directly into document.body
 * to ensure proper fixed positioning regardless of parent container styles.
 * 
 * @param children The content to render in the portal
 * @param id Optional ID for the portal container
 * @param className Optional CSS class for styling
 */
export default function FloatingPortal({ children, id, className = 'fixed-portal' }: FloatingPortalProps) {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
    
    return () => setMounted(false);
  }, []);
  
  // Create portal container if it doesn't exist
  useEffect(() => {
    if (mounted) {
      const portalId = id || 'floating-portal';
      let portalContainer = document.getElementById(portalId);
      
      if (!portalContainer) {
        portalContainer = document.createElement('div');
        portalContainer.id = portalId;
        portalContainer.className = className;
        document.body.appendChild(portalContainer);
      }
      
      return () => {
        // Only remove if we created it and it's empty
        if (portalId !== 'floating-portal') {
          const container = document.getElementById(portalId);
          if (container && container.childNodes.length === 0) {
            document.body.removeChild(container);
          }
        }
      };
    }
    return undefined;
  }, [mounted, id, className]);
  
  // Only render on the client after mount
  if (!mounted) return null;
  
  // Create portal to body
  const target = id ? 
    document.getElementById(id) || document.getElementById('floating-portal') || document.body :
    document.getElementById('floating-portal') || document.body;
  
  return createPortal(
    <div className="fixed-element">
      {children}
    </div>,
    target
  );
} 