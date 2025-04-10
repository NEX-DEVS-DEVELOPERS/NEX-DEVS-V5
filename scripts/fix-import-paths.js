const fs = require('fs');
const path = require('path');

console.log('Fixing import paths for AdminAuthCheck component...');

// Verify critical dependencies
function verifyDependencies() {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check for autoprefixer in dependencies
      const hasAutoprefixer = 
        (packageJson.dependencies && packageJson.dependencies.autoprefixer) || 
        (packageJson.devDependencies && packageJson.devDependencies.autoprefixer);
      
      if (!hasAutoprefixer) {
        console.warn('⚠️ WARNING: autoprefixer is not found in dependencies. This may cause build failures.');
        console.warn('Please install it with: npm install autoprefixer --save-dev');
      } else {
        console.log('✅ autoprefixer dependency found');
      }

      // Verify other critical dependencies
      const criticalDeps = ['next', 'react', 'react-dom', 'autoprefixer', 'postcss', 'tailwindcss'];
      const missingDeps = [];
      
      criticalDeps.forEach(dep => {
        const hasDep = 
          (packageJson.dependencies && packageJson.dependencies[dep]) || 
          (packageJson.devDependencies && packageJson.devDependencies[dep]);
        
        if (!hasDep) {
          missingDeps.push(dep);
        }
      });
      
      if (missingDeps.length > 0) {
        console.warn(`⚠️ WARNING: Some critical dependencies are missing: ${missingDeps.join(', ')}`);
      } else {
        console.log('✅ All critical dependencies found');
      }
    } else {
      console.error('❌ package.json not found!');
    }
  } catch (err) {
    console.error('❌ Error checking dependencies:', err);
    // Continue despite errors
  }
}

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

// Check for critical config files
function verifyConfigFiles() {
  const criticalFiles = [
    { path: 'postcss.config.js', fix: createPostcssConfig },
    { path: 'tailwind.config.js', fix: null }, // No auto-fix for tailwind
    { path: 'next.config.js', fix: null } // No auto-fix for next config
  ];
  
  criticalFiles.forEach(file => {
    const filePath = path.join(process.cwd(), file.path);
    if (!fs.existsSync(filePath)) {
      console.warn(`⚠️ WARNING: ${file.path} not found!`);
      if (file.fix) {
        try {
          file.fix();
          console.log(`✅ Created missing ${file.path}`);
        } catch (err) {
          console.error(`❌ Error creating ${file.path}:`, err);
        }
      }
    } else {
      console.log(`✅ ${file.path} found`);
      
      // Check PostCSS config for autoprefixer
      if (file.path === 'postcss.config.js') {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          if (!content.includes('autoprefixer')) {
            console.warn('⚠️ WARNING: autoprefixer not found in postcss.config.js');
            try {
              const fixedContent = content.replace(
                /plugins\s*:\s*{([^}]*)}/,
                'plugins: {$1\n    autoprefixer: {},\n  }'
              );
              fs.writeFileSync(filePath, fixedContent);
              console.log('✅ Added autoprefixer to postcss.config.js');
            } catch (err) {
              console.error('❌ Error updating postcss.config.js:', err);
            }
          } else {
            console.log('✅ autoprefixer found in postcss.config.js');
          }
        } catch (err) {
          console.error('❌ Error reading postcss.config.js:', err);
        }
      }
    }
  });
}

// Create a basic PostCSS config if missing
function createPostcssConfig() {
  const config = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
  fs.writeFileSync(path.join(process.cwd(), 'postcss.config.js'), config);
}

// Run verifications
verifyDependencies();
verifyConfigFiles();

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
    // Try to create a basic version
    try {
      const basicComponent = `'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminAuthCheck({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    try {
      const auth = sessionStorage.getItem('adminAuth')
      if (auth === 'true') {
        setIsAuthenticated(true)
      } else {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Authentication check error:', error)
      router.push('/admin/login')
    } finally {
      setIsLoading(false)
    }
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div>Loading...</div>
      </div>
    )
  }

  return isAuthenticated ? children : null
}`;
      fs.writeFileSync(targetComponentPath, basicComponent);
      console.log(`✅ Created basic AdminAuthCheck component at ${targetComponentPath}`);
    } catch (createErr) {
      console.error('❌ Error creating basic component:', createErr);
    }
  }
} catch (err) {
  console.error('❌ Error copying component:', err);
}

console.log('Import path fixing completed!'); 