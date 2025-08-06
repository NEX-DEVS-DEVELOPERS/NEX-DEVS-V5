// ImageKit.io configuration and utilities
import ImageKit from 'imagekit';

// Environment variables validation
const IMAGEKIT_PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY;
const IMAGEKIT_PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY;
const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT;

if (!IMAGEKIT_PUBLIC_KEY || !IMAGEKIT_PRIVATE_KEY || !IMAGEKIT_URL_ENDPOINT) {
  throw new Error('ImageKit.io environment variables are not properly configured');
}

// ImageKit instance for server-side operations
export const imagekit = new ImageKit({
  publicKey: IMAGEKIT_PUBLIC_KEY,
  privateKey: IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
});

// Configuration for client-side usage
export const imagekitConfig = {
  publicKey: IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: IMAGEKIT_URL_ENDPOINT,
  transformationPosition: 'path' as const,
};

// Helper function to generate optimized ImageKit URLs
export function generateImageKitUrl(
  path: string,
  transformations?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    crop?: 'maintain_ratio' | 'force' | 'at_least' | 'at_max';
    focus?: 'auto' | 'face' | 'center';
    blur?: number;
    progressive?: boolean;
  }
): string {
  const baseUrl = `${IMAGEKIT_URL_ENDPOINT}${path.startsWith('/') ? path : `/${path}`}`;
  
  if (!transformations) {
    return baseUrl;
  }

  const params = new URLSearchParams();
  
  // Add transformations
  if (transformations.width) params.append('tr', `w-${transformations.width}`);
  if (transformations.height) params.append('tr', `h-${transformations.height}`);
  if (transformations.quality) params.append('tr', `q-${transformations.quality}`);
  if (transformations.format) params.append('tr', `f-${transformations.format}`);
  if (transformations.crop) params.append('tr', `c-${transformations.crop}`);
  if (transformations.focus) params.append('tr', `fo-${transformations.focus}`);
  if (transformations.blur) params.append('tr', `bl-${transformations.blur}`);
  if (transformations.progressive) params.append('tr', 'pr-true');

  const queryString = params.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

// Predefined transformation presets for common use cases
export const imagePresets = {
  hero: {
    width: 1920,
    height: 1080,
    quality: 85,
    format: 'auto' as const,
    crop: 'maintain_ratio' as const,
    progressive: true,
  },
  project: {
    width: 800,
    height: 600,
    quality: 80,
    format: 'auto' as const,
    crop: 'maintain_ratio' as const,
    progressive: true,
  },
  projectThumbnail: {
    width: 400,
    height: 300,
    quality: 75,
    format: 'auto' as const,
    crop: 'maintain_ratio' as const,
    progressive: true,
  },
  team: {
    width: 300,
    height: 300,
    quality: 80,
    format: 'auto' as const,
    crop: 'force' as const,
    focus: 'face' as const,
    progressive: true,
  },
  logo: {
    width: 200,
    height: 200,
    quality: 90,
    format: 'auto' as const,
    crop: 'maintain_ratio' as const,
    progressive: true,
  },
  icon: {
    width: 64,
    height: 64,
    quality: 90,
    format: 'auto' as const,
    crop: 'maintain_ratio' as const,
  },
};

// Helper function to get responsive image URLs
export function getResponsiveImageUrls(path: string, preset: keyof typeof imagePresets) {
  const basePreset = imagePresets[preset];
  
  return {
    mobile: generateImageKitUrl(path, {
      ...basePreset,
      width: Math.round(basePreset.width * 0.5),
      height: Math.round(basePreset.height * 0.5),
    }),
    tablet: generateImageKitUrl(path, {
      ...basePreset,
      width: Math.round(basePreset.width * 0.75),
      height: Math.round(basePreset.height * 0.75),
    }),
    desktop: generateImageKitUrl(path, basePreset),
    retina: generateImageKitUrl(path, {
      ...basePreset,
      width: basePreset.width * 2,
      height: basePreset.height * 2,
    }),
  };
}

// Error handling for ImageKit operations
export class ImageKitError extends Error {
  constructor(message: string, public originalError?: any) {
    super(message);
    this.name = 'ImageKitError';
  }
}

// Upload file to ImageKit
export async function uploadToImageKit(
  file: Buffer | string,
  fileName: string,
  folder?: string
): Promise<{ url: string; fileId: string; name: string }> {
  try {
    const uploadResponse = await imagekit.upload({
      file,
      fileName,
      folder: folder || 'portfolio',
      useUniqueFileName: true,
      responseFields: ['url', 'fileId', 'name', 'size'],
    });

    return {
      url: uploadResponse.url,
      fileId: uploadResponse.fileId,
      name: uploadResponse.name,
    };
  } catch (error) {
    throw new ImageKitError(`Failed to upload ${fileName} to ImageKit`, error);
  }
}

// Batch upload multiple files
export async function batchUploadToImageKit(
  files: Array<{ file: Buffer | string; fileName: string; folder?: string }>
): Promise<Array<{ url: string; fileId: string; name: string; originalName: string }>> {
  const results = [];
  
  for (const fileData of files) {
    try {
      const result = await uploadToImageKit(fileData.file, fileData.fileName, fileData.folder);
      results.push({
        ...result,
        originalName: fileData.fileName,
      });
      
      // Add small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to upload ${fileData.fileName}:`, error);
      // Continue with other files even if one fails
    }
  }
  
  return results;
}
