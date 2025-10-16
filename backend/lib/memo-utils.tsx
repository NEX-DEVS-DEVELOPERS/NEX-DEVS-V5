import { memo } from 'react';

// Helper function to create a memoized component with proper display name
export function memoize<T>(Component: T, displayName?: string): T {
  const MemoizedComponent = memo(Component as any) as any;
  
  // Set the display name for better debugging
  if (displayName) {
    MemoizedComponent.displayName = displayName;
  } else if ((Component as any).displayName) {
    MemoizedComponent.displayName = `Memo(${(Component as any).displayName})`;
  } else if ((Component as any).name) {
    MemoizedComponent.displayName = `Memo(${(Component as any).name})`;
  }
  
  return MemoizedComponent as T;
}

// Custom equality function for complex props
export function arePropsEqual(prevProps: any, nextProps: any): boolean {
  const prevKeys = Object.keys(prevProps);
  const nextKeys = Object.keys(nextProps);
  
  if (prevKeys.length !== nextKeys.length) {
    return false;
  }
  
  return prevKeys.every(key => {
    // Simple equality check for primitive values
    if (typeof prevProps[key] !== 'object' || prevProps[key] === null) {
      return Object.is(prevProps[key], nextProps[key]);
    }
    
    // For arrays, check if they're referentially equal
    if (Array.isArray(prevProps[key])) {
      if (!Array.isArray(nextProps[key]) || prevProps[key].length !== nextProps[key].length) {
        return false;
      }
      
      return prevProps[key].every((item: any, index: number) => 
        Object.is(item, nextProps[key][index])
      );
    }
    
    // For objects, check if they're referentially equal
    return Object.is(prevProps[key], nextProps[key]);
  });
}

// Example usage for complex components:
// const MemoizedComponent = memo(MyComponent, arePropsEqual); 