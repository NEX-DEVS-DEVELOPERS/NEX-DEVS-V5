// Script to update local image references with ImageKit.io URLs
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// Configuration
const PROJECT_ROOT = process.cwd();
const IMAGEKIT_MAPPING_FILE = path.join(PROJECT_ROOT, 'imagekit-mapping.json');
const IMAGEKIT_BASE_URL = process.env.IMAGEKIT_URL_ENDPOINT;

// Files and directories to scan for image references
const SCAN_PATTERNS = [
  'app/**/*.{tsx,ts,jsx,js}',
  'components/**/*.{tsx,ts,jsx,js}',
  'pages/**/*.{tsx,ts,jsx,js}',
  'lib/**/*.{tsx,ts,jsx,js}',
  'styles/**/*.{css,scss}',
  '*.{tsx,ts,jsx,js,json}',
];

// Directories to scan
const SCAN_DIRECTORIES = [
  'app',
  'components', 
  'lib',
  'styles',
  'hooks',
  'scripts'
];

// Statistics tracking
const stats = {
  filesScanned: 0,
  filesUpdated: 0,
  referencesUpdated: 0,
  errors: [],
  updatedFiles: []
};

// Load ImageKit mapping
function loadImageKitMapping() {
  try {
    if (!fs.existsSync(IMAGEKIT_MAPPING_FILE)) {
      console.error(`❌ ImageKit mapping file not found: ${IMAGEKIT_MAPPING_FILE}`);
      console.log('Please run the upload script first to generate the mapping file.');
      return null;
    }
    
    const mappingData = JSON.parse(fs.readFileSync(IMAGEKIT_MAPPING_FILE, 'utf8'));
    console.log(`📄 Loaded ImageKit mapping with ${mappingData.mappings.length} entries`);
    
    // Create a lookup map for faster searching
    const lookupMap = new Map();
    mappingData.mappings.forEach(mapping => {
      // Create multiple lookup keys for different path formats
      const originalPath = mapping.originalPath;
      const fileName = path.basename(originalPath);
      
      lookupMap.set(originalPath, mapping.imagekitUrl);
      lookupMap.set(originalPath.replace(/^\//, ''), mapping.imagekitUrl); // without leading slash
      lookupMap.set(fileName, mapping.imagekitUrl); // just filename
      
      // Handle different path formats
      if (originalPath.startsWith('/projects/')) {
        lookupMap.set(originalPath.replace('/projects/', ''), mapping.imagekitUrl);
      }
      if (originalPath.startsWith('/team/')) {
        lookupMap.set(originalPath.replace('/team/', ''), mapping.imagekitUrl);
      }
      if (originalPath.startsWith('/logos/')) {
        lookupMap.set(originalPath.replace('/logos/', ''), mapping.imagekitUrl);
      }
    });
    
    return lookupMap;
  } catch (error) {
    console.error('❌ Error loading ImageKit mapping:', error.message);
    return null;
  }
}

// Get all files to scan
function getFilesToScan() {
  const files = [];
  
  function scanDirectory(dirPath) {
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const fullPath = path.join(dirPath, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          // Skip node_modules, .git, .next, etc.
          if (!item.startsWith('.') && item !== 'node_modules' && item !== 'public') {
            scanDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          const ext = path.extname(item).toLowerCase();
          if (['.tsx', '.ts', '.jsx', '.js', '.css', '.scss', '.json'].includes(ext)) {
            files.push(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error scanning directory ${dirPath}:`, error.message);
    }
  }
  
  // Scan specific directories
  for (const dir of SCAN_DIRECTORIES) {
    const dirPath = path.join(PROJECT_ROOT, dir);
    if (fs.existsSync(dirPath)) {
      scanDirectory(dirPath);
    }
  }
  
  // Also scan root level files
  try {
    const rootItems = fs.readdirSync(PROJECT_ROOT);
    for (const item of rootItems) {
      const fullPath = path.join(PROJECT_ROOT, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isFile()) {
        const ext = path.extname(item).toLowerCase();
        if (['.tsx', '.ts', '.jsx', '.js', '.json'].includes(ext)) {
          files.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.error('Error scanning root directory:', error.message);
  }
  
  return files;
}

// Update image references in a file
function updateImageReferences(filePath, lookupMap) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;
    let fileUpdated = false;
    let referencesInFile = 0;
    
    // Patterns to match image references
    const patterns = [
      // src="/projects/filename.ext"
      /src=["']\/projects\/([^"']+)["']/g,
      // src="/team/filename.ext"
      /src=["']\/team\/([^"']+)["']/g,
      // src="/logos/filename.ext"
      /src=["']\/logos\/([^"']+)["']/g,
      // src="/icons/filename.ext"
      /src=["']\/icons\/([^"']+)["']/g,
      // src="/images/filename.ext"
      /src=["']\/images\/([^"']+)["']/g,
      // image: "/projects/filename.ext"
      /image:\s*["']\/projects\/([^"']+)["']/g,
      // image: "/team/filename.ext"
      /image:\s*["']\/team\/([^"']+)["']/g,
      // "image": "/projects/filename.ext"
      /"image":\s*["']\/projects\/([^"']+)["']/g,
      // "image_url": "/projects/filename.ext"
      /"image_url":\s*["']\/projects\/([^"']+)["']/g,
      // background-image: url(/projects/filename.ext)
      /background-image:\s*url\(["']?\/projects\/([^"')]+)["']?\)/g,
    ];
    
    patterns.forEach(pattern => {
      updatedContent = updatedContent.replace(pattern, (match, filename) => {
        // Try different lookup keys
        const lookupKeys = [
          `/projects/${filename}`,
          `/team/${filename}`,
          `/logos/${filename}`,
          `/icons/${filename}`,
          `/images/${filename}`,
          filename
        ];
        
        for (const key of lookupKeys) {
          if (lookupMap.has(key)) {
            const imagekitUrl = lookupMap.get(key);
            referencesInFile++;
            fileUpdated = true;
            
            // Return the updated reference
            if (match.includes('src=')) {
              return match.replace(/\/[^"']+/, imagekitUrl.replace(IMAGEKIT_BASE_URL, ''));
            } else if (match.includes('image:') || match.includes('"image"')) {
              return match.replace(/\/[^"']+/, imagekitUrl.replace(IMAGEKIT_BASE_URL, ''));
            } else if (match.includes('background-image')) {
              return match.replace(/\/[^"')]+/, imagekitUrl.replace(IMAGEKIT_BASE_URL, ''));
            }
            
            return match.replace(/\/[^"']+/, imagekitUrl.replace(IMAGEKIT_BASE_URL, ''));
          }
        }
        
        return match; // No replacement found
      });
    });
    
    if (fileUpdated) {
      fs.writeFileSync(filePath, updatedContent, 'utf8');
      stats.filesUpdated++;
      stats.referencesUpdated += referencesInFile;
      stats.updatedFiles.push({
        file: path.relative(PROJECT_ROOT, filePath),
        references: referencesInFile
      });
      
      console.log(`✅ Updated ${referencesInFile} references in: ${path.relative(PROJECT_ROOT, filePath)}`);
    }
    
    return fileUpdated;
    
  } catch (error) {
    stats.errors.push({
      file: filePath,
      error: error.message
    });
    console.error(`❌ Error updating ${filePath}:`, error.message);
    return false;
  }
}

// Main function
async function updateAllImageReferences() {
  console.log('🔄 Starting image reference update process...');
  
  // Load ImageKit mapping
  const lookupMap = loadImageKitMapping();
  if (!lookupMap) {
    return { success: false, message: 'Failed to load ImageKit mapping' };
  }
  
  // Get files to scan
  const files = getFilesToScan();
  console.log(`📁 Found ${files.length} files to scan`);
  
  // Update references in each file
  for (const filePath of files) {
    stats.filesScanned++;
    updateImageReferences(filePath, lookupMap);
  }
  
  // Generate final report
  console.log('\n' + '='.repeat(60));
  console.log('📊 UPDATE SUMMARY');
  console.log('='.repeat(60));
  console.log(`Files scanned: ${stats.filesScanned}`);
  console.log(`Files updated: ${stats.filesUpdated}`);
  console.log(`Total references updated: ${stats.referencesUpdated}`);
  
  if (stats.updatedFiles.length > 0) {
    console.log('\n✅ UPDATED FILES:');
    stats.updatedFiles.forEach(file => {
      console.log(`   ${file.file}: ${file.references} references`);
    });
  }
  
  if (stats.errors.length > 0) {
    console.log('\n❌ ERRORS:');
    stats.errors.forEach(error => {
      console.log(`   ${error.file}: ${error.error}`);
    });
  }
  
  console.log('\n✅ Image reference update completed!');
  return {
    success: stats.errors.length === 0,
    stats: stats
  };
}

// Run the update process
if (require.main === module) {
  updateAllImageReferences()
    .then(result => {
      process.exit(result.success ? 0 : 1);
    })
    .catch(error => {
      console.error('❌ Update process failed:', error);
      process.exit(1);
    });
}

module.exports = {
  updateAllImageReferences,
  stats
};
