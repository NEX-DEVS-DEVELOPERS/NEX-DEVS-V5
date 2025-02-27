import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

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
  const [isLoading, setLoading] = useState(true);
  const [imgSrc, setImgSrc] = useState(src);

  // Reset loading state when src changes
  useEffect(() => {
    setImgSrc(src);
    setLoading(true);
  }, [src]);

  return (
    <div className={cn("overflow-hidden relative", aspectRatio, wrapperClassName)}>
      <Image
        src={imgSrc}
        alt={alt}
        className={cn(
          "transition-all duration-300",
          isLoading ? "scale-110 blur-sm" : "scale-100 blur-0",
          className
        )}
        onLoad={() => setLoading(false)}
        onError={() => {
          setImgSrc(fallbackSrc);
        }}
        priority={priority}
        {...props}
      />
    </div>
  );
} 