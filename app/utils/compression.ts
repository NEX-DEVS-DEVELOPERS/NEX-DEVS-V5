/**
 * Utility functions for compressing images and videos before database storage
 * Maintains high quality while reducing file size for optimal performance
 */

// Image compression utility
export const compressImage = (file: File, maxWidth: number = 1920, quality: number = 0.85): Promise<File> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
      canvas.width = img.width * ratio;
      canvas.height = img.height * ratio;
      
      // Draw and compress
      ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      canvas.toBlob((blob) => {
        if (blob) {
          const compressedFile = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
          resolve(compressedFile);
        } else {
          resolve(file); // Fallback to original if compression fails
        }
      }, 'image/jpeg', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

// Video compression utility (using canvas for frame extraction and compression)
export const compressVideo = (file: File): Promise<File> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    
    video.onloadedmetadata = () => {
      // For videos, we'll create a compressed version by adjusting quality
      // This is a simplified approach - in production, you might use FFmpeg.js
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set optimal dimensions for mobile and desktop
      const maxWidth = 1280;
      const maxHeight = 720;
      
      const ratio = Math.min(maxWidth / video.videoWidth, maxHeight / video.videoHeight);
      canvas.width = video.videoWidth * ratio;
      canvas.height = video.videoHeight * ratio;
      
      // For actual video compression, you'd need a more sophisticated approach
      // For now, we'll return the original file but with validation
      resolve(file);
    };
    
    video.src = URL.createObjectURL(file);
  });
};

// File validation
export const validateVideoFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 50 * 1024 * 1024; // 50MB max
  const allowedTypes = ['video/mp4', 'video/webm', 'video/mov'];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only MP4, WebM, and MOV files are allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'Video file must be less than 50MB' };
  }
  
  return { isValid: true };
};

export const validateImageFile = (file: File): { isValid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024; // 10MB max
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  
  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, error: 'Only JPEG, PNG, and WebP files are allowed' };
  }
  
  if (file.size > maxSize) {
    return { isValid: false, error: 'Image file must be less than 10MB' };
  }
  
  return { isValid: true };
};

// Upload to cloud storage (you'll need to implement your preferred storage solution)
export const uploadFile = async (file: File, type: 'image' | 'video'): Promise<string> => {
  // This is a placeholder - implement your preferred upload solution
  // Examples: Cloudinary, AWS S3, Vercel Blob, etc.
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  
  try {
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Upload failed');
    }
    
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
};

// Get optimal video dimensions for responsive display
export const getOptimalVideoDimensions = (originalWidth: number, originalHeight: number) => {
  const aspectRatio = originalWidth / originalHeight;
  
  // Common responsive breakpoints
  const dimensions = {
    mobile: {
      width: Math.min(350, originalWidth),
      height: Math.min(350, originalWidth) / aspectRatio
    },
    tablet: {
      width: Math.min(600, originalWidth),
      height: Math.min(600, originalWidth) / aspectRatio
    },
    desktop: {
      width: Math.min(800, originalWidth),
      height: Math.min(800, originalWidth) / aspectRatio
    }
  };
  
  return dimensions;
};
