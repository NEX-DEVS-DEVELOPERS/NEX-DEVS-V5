const fs = require('fs');
const path = require('path');

console.log('Fixing import paths for AdminAuthCheck component...');

// Helper function to read, fix, and write back a file
function fixImportsInFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if the file imports AdminAuthCheck with the problematic path
    if (content.includes("import AdminAuthCheck from '@/app/components/AdminAuthCheck'")) {
      // Simple string replacement for the import path
      // Calculate the relative path based on file depth
      const relativePath = path.relative(path.dirname(filePath), path.join(process.cwd(), 'app', 'components')).replace(/\\/g, '/');
      const fixedContent = content.replace(
        "import AdminAuthCheck from '@/app/components/AdminAuthCheck'",
        `import AdminAuthCheck from '${relativePath}/AdminAuthCheck'`
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

// Recursively find all files in directory
function findFiles(dir, fileList = []) {
  try {
    if (!fs.existsSync(dir)) {
      console.log(`Directory not found: ${dir}`);
      return fileList;
    }
    
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      try {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          findFiles(filePath, fileList);
        } else if (/\.(ts|tsx|js|jsx)$/.test(file)) {
          fileList.push(filePath);
        }
      } catch (err) {
        console.error(`Error processing file ${file}:`, err);
      }
    });
  } catch (err) {
    console.error(`Error reading directory ${dir}:`, err);
  }
  
  return fileList;
}

// Find all files in the admin directory that might import the component
const adminFiles = findFiles(path.join(process.cwd(), 'app', 'admin'));
console.log(`Found ${adminFiles.length} admin files to check`);

let fixedFiles = 0;
for (const file of adminFiles) {
  if (fixImportsInFile(file)) {
    fixedFiles++;
  }
}

console.log(`Fixed imports in ${fixedFiles} files`);

// Also copy the component to a common location to ensure it's accessible
const sourceComponentPath = path.join(process.cwd(), 'app', 'components', 'AdminAuthCheck.tsx');
const commonComponentsDir = path.join(process.cwd(), 'components');
const targetComponentPath = path.join(commonComponentsDir, 'AdminAuthCheck.tsx');

if (!fs.existsSync(commonComponentsDir)) {
  fs.mkdirSync(commonComponentsDir, { recursive: true });
  console.log(`✅ Created components directory at ${commonComponentsDir}`);
}

try {
  if (fs.existsSync(sourceComponentPath)) {
    const componentContent = fs.readFileSync(sourceComponentPath, 'utf8');
    fs.writeFileSync(targetComponentPath, componentContent);
    console.log(`✅ Copied AdminAuthCheck component to ${targetComponentPath}`);
  } else {
    console.log(`⚠️ Source component not found at ${sourceComponentPath}`);
  }
} catch (err) {
  console.error('❌ Error copying component:', err);
}

console.log('Import path fixing completed!'); 