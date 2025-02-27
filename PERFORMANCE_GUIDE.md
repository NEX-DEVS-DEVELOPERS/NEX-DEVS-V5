# Next.js Performance Optimization Guide

This guide outlines the performance optimizations implemented in this project and provides tips for maintaining and improving site speed.

## Implemented Optimizations

### 1. Image Optimization

- Using Next.js Image component with automatic WebP/AVIF format conversion
- Lazy loading images that are below the fold
- Proper image sizing based on viewport
- Preloading critical images with the `priority` attribute

```jsx
// Example usage
import { OptimizedImage } from '@/components/ui/optimized-image';

<OptimizedImage 
  src="/path/to/image.jpg" 
  alt="Description" 
  width={800} 
  height={600} 
  priority={isHeroImage} 
/>
```

### 2. Component Lazy Loading

- Code-splitting with dynamic imports for components not needed on initial load
- Using the custom `LazyLoad` component to defer rendering until visible

```jsx
// Example usage
import { LazyLoad } from '@/lib/lazy-load';

<LazyLoad>
  <HeavyComponent />
</LazyLoad>
```

### 3. Memoization for Preventing Re-renders

- Using React.memo and custom memoization utilities to prevent unnecessary re-renders
- Custom equality functions for complex props

```jsx
// Example usage
import { memoize, arePropsEqual } from '@/lib/memo-utils';

const MemoizedComponent = memoize(MyComponent);
// or
const ComplexComponent = memo(MyComponent, arePropsEqual);
```

### 4. Optimized Animations

- Using lightweight CSS transitions when possible
- Hardware-accelerated animations with transform/opacity properties
- Respecting user preferences for reduced motion

```jsx
// Example usage
import { FadeIn, SlideUp } from '@/components/ui/smooth-animation';

<FadeIn delay={0.2}>
  <YourComponent />
</FadeIn>
```

### 5. Font Optimization

- Font display swap for immediate text visibility
- Preloading and preconnecting to font providers
- Variable fonts where appropriate to reduce file size

### 6. Data Caching

- Using custom cache utilities to prevent redundant API calls
- SWR for data fetching with built-in caching

```jsx
// Example usage
import { fetchWithCache } from '@/lib/cache-utils';

const data = await fetchWithCache('/api/endpoint', {}, 
  { ttl: 60000, tags: ['user-data'] }
);
```

### 7. Build Optimizations

- Bundle optimization with package imports optimization
- CSS optimization with the experimental flag
- Console removal in production builds

## Development Best Practices

1. **Always use Next.js Image component** instead of HTML `<img>` tags
2. **Lazy load below-the-fold content** with the `LazyLoad` component
3. **Memoize heavy components** or those that don't need frequent updates
4. **Keep animations simple** and use the provided animation components
5. **Cache API responses** using the provided cache utilities
6. **Measure performance** with Chrome DevTools and Lighthouse
7. **Test on mobile devices and slower connections** regularly

## Performance Testing

Use the built-in `usePerformance` hook to measure Core Web Vitals:

```jsx
import { usePerformance } from '@/hooks/usePerformance';

function MyComponent() {
  const metrics = usePerformance(true); // Pass true to log metrics to console
  
  // Use metrics data for custom reporting or UI
  return <div>{/* Your component */}</div>;
}
```

## Common Performance Issues and Solutions

| Issue | Solution |
|-------|----------|
| Large images | Use `OptimizedImage` component with proper sizing |
| Slow initial load | Code-split with dynamic imports and the `LazyLoad` component |
| Layout shifts | Set explicit width/height on images and use placeholders |
| Janky animations | Use `SmoothAnimation` components with simple transforms |
| Redundant API calls | Implement caching with `fetchWithCache` |
| Slow font loading | Configure font display swap in your font configuration |

## Resources

- [Next.js Performance Documentation](https://nextjs.org/docs/advanced-features/measuring-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Chrome DevTools Performance Panel](https://developer.chrome.com/docs/devtools/performance/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) 