import { useState, useEffect, RefObject, useRef } from 'react';

interface IntersectionObserverOptions {
  root?: Element | null;
  rootMargin?: string;
  threshold?: number | number[];
  once?: boolean;
}

export function useAdvancedIntersectionObserver(
  options: IntersectionObserverOptions = {}
): [React.Dispatch<Element | null>, boolean] {
  const { root = null, rootMargin = '0px', threshold = 0, once = false } = options;
  const [target, setTarget] = useState<Element | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    if (!target) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && once) {
          observer.unobserve(entry.target);
        }
      },
      { root, rootMargin, threshold }
    );

    observer.observe(target);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [target, root, rootMargin, threshold, once]);

  return [setTarget, isIntersecting];
} 