import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/backend/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoadingComplete'> {
  fallbackSrc?: string;
  aspectRatio?: string;
  wrapperClassName?: string;
}

export default function OptimizedImage({
  src,
  alt,
  fallbackSrc = '/icons/placeholder.svg',
  aspectRatio = 'aspect-auto',
  wrapperClassName,
  className,
  priority = false,
  ...props
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // Reset src when it changes
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <div className={cn("overflow-hidden relative", aspectRatio, wrapperClassName)}>
      <Image
        src={imgSrc}
        alt={alt}
        className={cn(
          "optimized-image", // Use our performance-optimized class
          className
        )}
        onError={() => {
          setImgSrc(fallbackSrc);
        }}
        priority={priority}
        {...props}
      />
    </div>
  );
}