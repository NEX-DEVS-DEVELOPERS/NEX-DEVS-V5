// Script to upload local images to ImageKit.io
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');
const ImageKit = require('imagekit');

// ImageKit configuration
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

// Upload function
async function uploadToImageKit(file, fileName, folder) {
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
    throw new Error(`Failed to upload ${fileName} to ImageKit: ${error.message}`);
  }
}

// Configuration
const PUBLIC_DIR = path.join(process.cwd(), 'public');
const UPLOAD_BATCH_SIZE = 5; // Upload 5 files at a time to avoid rate limiting

// Image directories to process (in priority order)
const IMAGE_DIRECTORIES = [
  {
    localPath: 'projects',
    imagekitFolder: 'projects',
    priority: 2,
    description: 'Project images'
  },
  {
    localPath: 'team',
    imagekitFolder: 'team',
    priority: 3,
    description: 'Team member photos'
  },
  {
    localPath: 'logos',
    imagekitFolder: 'logos',
    priority: 4,
    description: 'Company logos'
  },
  {
    localPath: 'icons',
    imagekitFolder: 'icons',
    priority: 5,
    description: 'Icon files'
  },
  {
    localPath: 'images',
    imagekitFolder: 'images',
    priority: 6,
    description: 'General images'
  }
];

// Supported image formats
const SUPPORTED_FORMATS = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];

// Statistics tracking
const stats = {
  totalFiles: 0,
  uploadedFiles: 0,
  failedFiles: 0,
  skippedFiles: 0,
  totalSize: 0,
  uploadedSize: 0,
  errors: [],
  uploadedUrls: []
};

// Helper function to get file size in bytes
function getFileSize(filePath) {
  try {
    const stats = fs.statSync(filePath);
    return stats.size;
  } catch (error) {
    return 0;
  }
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Get all image files from a directory
function getImageFiles(dirPath) {
  const files = [];
  
  try {
    const items = fs.readdirSync(dirPath);
    
    for (const item of items) {
      const fullPath = path.join(dirPath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (SUPPORTED_FORMATS.includes(ext)) {
          files.push({
            name: item,
            path: fullPath,
            size: stat.size,
            ext: ext
          });
        }
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error.message);
  }
  
  return files;
}

// Upload a single file to ImageKit
async function uploadSingleFile(fileInfo, imagekitFolder) {
  try {
    console.log(`  Uploading: ${fileInfo.name} (${formatFileSize(fileInfo.size)})`);
    
    const fileBuffer = fs.readFileSync(fileInfo.path);
    const result = await uploadToImageKit(fileBuffer, fileInfo.name, imagekitFolder);
    
    stats.uploadedFiles++;
    stats.uploadedSize += fileInfo.size;
    stats.uploadedUrls.push({
      originalPath: fileInfo.path.replace(PUBLIC_DIR, ''),
      imagekitUrl: result.url,
      fileName: result.name,
      fileId: result.fileId,
      size: fileInfo.size
    });
    
    console.log(`  ✅ Uploaded: ${result.name} -> ${result.url}`);
    return result;
    
  } catch (error) {
    stats.failedFiles++;
    stats.errors.push({
      file: fileInfo.name,
      error: error.message
    });
    console.error(`  ❌ Failed: ${fileInfo.name} - ${error.message}`);
    return null;
  }
}

// Process a directory
async function processDirectory(dirConfig) {
  const dirPath = path.join(PUBLIC_DIR, dirConfig.localPath);
  
  console.log(`\n📁 Processing ${dirConfig.description} from: ${dirConfig.localPath}`);
  console.log(`   ImageKit folder: ${dirConfig.imagekitFolder}`);
  
  if (!fs.existsSync(dirPath)) {
    console.log(`   ⚠️  Directory not found: ${dirPath}`);
    return;
  }
  
  const files = getImageFiles(dirPath);
  
  if (files.length === 0) {
    console.log(`   ℹ️  No image files found in directory`);
    return;
  }
  
  console.log(`   Found ${files.length} image files`);
  
  // Update total stats
  stats.totalFiles += files.length;
  stats.totalSize += files.reduce((sum, file) => sum + file.size, 0);
  
  // Upload files in batches
  for (let i = 0; i < files.length; i += UPLOAD_BATCH_SIZE) {
    const batch = files.slice(i, i + UPLOAD_BATCH_SIZE);
    console.log(`\n   Batch ${Math.floor(i / UPLOAD_BATCH_SIZE) + 1}/${Math.ceil(files.length / UPLOAD_BATCH_SIZE)}:`);
    
    // Upload files in parallel within the batch
    const uploadPromises = batch.map(file => uploadSingleFile(file, dirConfig.imagekitFolder));
    await Promise.all(uploadPromises);
    
    // Small delay between batches to avoid rate limiting
    if (i + UPLOAD_BATCH_SIZE < files.length) {
      console.log(`   ⏳ Waiting 2 seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
}

// Generate mapping file for easy reference
function generateMappingFile() {
  const mappingPath = path.join(process.cwd(), 'imagekit-mapping.json');
  const mapping = {
    generatedAt: new Date().toISOString(),
    stats: {
      totalFiles: stats.totalFiles,
      uploadedFiles: stats.uploadedFiles,
      failedFiles: stats.failedFiles,
      totalSize: formatFileSize(stats.totalSize),
      uploadedSize: formatFileSize(stats.uploadedSize),
      successRate: `${((stats.uploadedFiles / stats.totalFiles) * 100).toFixed(1)}%`
    },
    mappings: stats.uploadedUrls,
    errors: stats.errors
  };
  
  fs.writeFileSync(mappingPath, JSON.stringify(mapping, null, 2));
  console.log(`\n📄 Mapping file generated: ${mappingPath}`);
}

// Main upload function
async function uploadAllImages() {
  console.log('🚀 Starting ImageKit.io upload process...');
  console.log(`📂 Scanning directories in: ${PUBLIC_DIR}`);
  
  // Sort directories by priority
  const sortedDirectories = IMAGE_DIRECTORIES.sort((a, b) => a.priority - b.priority);
  
  for (const dirConfig of sortedDirectories) {
    await processDirectory(dirConfig);
  }
  
  // Generate final report
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPLOAD SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total files found: ${stats.totalFiles}`);
  console.log(`Successfully uploaded: ${stats.uploadedFiles}`);
  console.log(`Failed uploads: ${stats.failedFiles}`);
  console.log(`Total size: ${formatFileSize(stats.totalSize)}`);
  console.log(`Uploaded size: ${formatFileSize(stats.uploadedSize)}`);
  console.log(`Success rate: ${((stats.uploadedFiles / stats.totalFiles) * 100).toFixed(1)}%`);
  
  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    stats.errors.forEach(error => {
      console.log(`   ${error.file}: ${error.error}`);
    });
  }
  
  // Generate mapping file
  generateMappingFile();
  
  console.log('\n✅ Upload process completed!');
  return {
    success: stats.failedFiles === 0,
    stats: stats
  };
}

// Run the upload process
if (require.main === module) {
  uploadAllImages()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Upload process failed:', error);
      process.exit(1);
    });
}

module.exports = {
  uploadAllImages,
  processDirectory,
  stats
};
