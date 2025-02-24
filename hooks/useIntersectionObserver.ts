import { useEffect, useState, useRef, RefObject } from 'react';
import { hasIntersectionObserver } from '../lib/utils';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}

export function useIntersectionObserver<T extends Element>({
  threshold = 0,
  rootMargin = '0px',
  enabled = true,
}: UseIntersectionObserverProps = {}): [RefObject<T>, boolean] {
  const [isIntersecting, setIntersecting] = useState(false);
  const elementRef = useRef<T>(null);

  useEffect(() => {
    if (!hasIntersectionObserver || !enabled) {
      setIntersecting(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);

        // Once the element is visible, stop observing
        if (entry.isIntersecting) {
          observer.unobserve(element);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, enabled]);

  return [elementRef, isIntersecting];
} 