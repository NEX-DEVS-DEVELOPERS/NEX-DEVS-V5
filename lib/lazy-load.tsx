'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

interface LazyLoadProps {
  children: React.ReactNode;
  className?: string;
  threshold?: number;
  once?: boolean;
}

export function LazyLoad({ 
  children, 
  className = "", 
  threshold = 0.1,
  once = true 
}: LazyLoadProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    amount: threshold 
  });
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isInView) {
      setShouldRender(true);
    }
  }, [isInView]);

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : null}
    </div>
  );
}

export function LazyLoadImage({ 
  src, 
  alt,
  width,
  height, 
  className = "",
  threshold = 0.1 
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  threshold?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    amount: threshold 
  });

  return (
    <div ref={ref} className={className}>
      {isInView && (
        <img 
          src={src} 
          alt={alt} 
          width={width}
          height={height}
          loading="lazy"
        />
      )}
    </div>
  );
} 