const fs = require('fs');
const path = require('path');
const glob = require('glob');

console.log('Fixing import paths for AdminAuthCheck component...');

// Helper function to read, fix, and write back a file
function fixImportsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file imports AdminAuthCheck with the problematic path
    if (content.includes("import AdminAuthCheck from '@/app/components/AdminAuthCheck'")) {
      // Simple string replacement for the import path
      const fixedContent = content.replace(
        "import AdminAuthCheck from '@/app/components/AdminAuthCheck'",
        "import AdminAuthCheck from '../../components/AdminAuthCheck'"
      );
      
      fs.writeFileSync(filePath, fixedContent);
      console.log(`✅ Fixed imports in ${filePath}`);
      return true;
    }
    return false;
  } catch (err) {
    console.error(`❌ Error processing ${filePath}:`, err);
    return false;
  }
}

// Find all files in the admin directory that might import the component
const adminFiles = glob.sync('./app/admin/**/*.{ts,tsx,js,jsx}');
console.log(`Found ${adminFiles.length} admin files to check`);

let fixedFiles = 0;
for (const file of adminFiles) {
  if (fixImportsInFile(file)) {
    fixedFiles++;
  }
}

console.log(`Fixed imports in ${fixedFiles} files`);

// Also copy the component to a common location to ensure it's accessible
const sourceComponentPath = path.join(__dirname, '..', 'app', 'components', 'AdminAuthCheck.tsx');
const commonComponentsDir = path.join(__dirname, '..', 'components');
const targetComponentPath = path.join(commonComponentsDir, 'AdminAuthCheck.tsx');

if (!fs.existsSync(commonComponentsDir)) {
  fs.mkdirSync(commonComponentsDir, { recursive: true });
  console.log(`✅ Created components directory at ${commonComponentsDir}`);
}

try {
  const componentContent = fs.readFileSync(sourceComponentPath, 'utf8');
  fs.writeFileSync(targetComponentPath, componentContent);
  console.log(`✅ Copied AdminAuthCheck component to ${targetComponentPath}`);
} catch (err) {
  console.error('❌ Error copying component:', err);
}

console.log('Import path fixing completed!'); 