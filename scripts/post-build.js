const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Define paths
const dbDir = path.join(__dirname, '..', 'db');
const destDir = path.join(__dirname, '..', '.next', 'server', 'db');
const publicDir = path.join(__dirname, '..', 'public');
const nextDir = path.join(__dirname, '..', '.next');

console.log('======================================');
console.log('Running post-build deployment script...');
console.log('======================================');

function copyDatabaseFiles() {
  console.log('\n📁 Copying SQLite database files...');

  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destDir)) {
    console.log(`Creating directory: ${destDir}`);
    fs.mkdirSync(destDir, { recursive: true });
  }

  // Check if source directory exists
  if (!fs.existsSync(dbDir)) {
    console.log(`Database directory not found: ${dbDir}`);
    console.log('Creating empty database directory');
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // Copy all database files including WAL and SHM files
  try {
    const files = fs.readdirSync(dbDir);
    console.log(`Found ${files.length} files in database directory`);
    
    // Copy database and related files
    let copiedCount = 0;
    for (const file of files) {
      if (file.endsWith('.db') || file.endsWith('.sqlite') || 
          file.endsWith('.db-shm') || file.endsWith('.db-wal')) {
        const srcPath = path.join(dbDir, file);
        const destPath = path.join(destDir, file);
        
        console.log(`Copying: ${srcPath} -> ${destPath}`);
        fs.copyFileSync(srcPath, destPath);
        copiedCount++;
      }
    }
    
    console.log(`Successfully copied ${copiedCount} database files`);

    // Create a blank database file if none was found
    if (copiedCount === 0) {
      console.log('No database files found. Creating an empty portfolio.db file');
      const emptyDbPath = path.join(destDir, 'portfolio.db');
      fs.writeFileSync(emptyDbPath, '');
      console.log(`Created empty file at: ${emptyDbPath}`);
    }

  } catch (error) {
    console.error('❌ Error copying database files:', error);
  }
}

function checkBuildOutput() {
  console.log('\n🔍 Checking build output...');
  
  if (!fs.existsSync(nextDir)) {
    console.error('❌ .next directory not found. Build may have failed.');
    return false;
  }
  
  console.log('✅ .next directory exists');
  return true;
}

function printNetlifyConfig() {
  console.log('\n📋 Netlify configuration:');
  
  const netlifyTomlPath = path.join(__dirname, '..', 'netlify.toml');
  if (fs.existsSync(netlifyTomlPath)) {
    console.log('✅ netlify.toml file found');
    console.log('Contents:');
    console.log('-'.repeat(40));
    try {
      const config = fs.readFileSync(netlifyTomlPath, 'utf8');
      // Print just the first few lines to confirm structure
      console.log(config.split('\n').slice(0, 10).join('\n') + '\n[...]');
      console.log('-'.repeat(40));
    } catch (error) {
      console.error('❌ Error reading netlify.toml:', error);
    }
  } else {
    console.warn('⚠️ netlify.toml file not found');
  }
}

function verifyEnvironment() {
  console.log('\n🌐 Verifying environment...');
  console.log(`Node version: ${process.version}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}

function createNetlifyRedirects() {
  console.log('\n🔄 Creating Netlify _redirects file...');
  
  const redirectsContent = `
# Netlify redirects file
# Redirect domain aliases to primary domain
https://www.example.com/* https://example.com/:splat 301!

# Handle SPA routing
/* /index.html 200

# Handle 404
/* /404.html 404
`;

  const redirectsPath = path.join(publicDir, '_redirects');
  try {
    fs.writeFileSync(redirectsPath, redirectsContent.trim());
    console.log('✅ Created _redirects file');
  } catch (error) {
    console.error('❌ Error creating _redirects file:', error);
  }
}

// Run all deployment tasks
function runDeploymentTasks() {
  try {
    verifyEnvironment();
    
    if (checkBuildOutput()) {
      copyDatabaseFiles();
      createNetlifyRedirects();
      printNetlifyConfig();
      
      console.log('\n✅ Post-build tasks completed successfully!');
    } else {
      console.error('\n❌ Post-build failed due to missing build output');
    }
  } catch (error) {
    console.error('\n❌ Post-build error:', error);
    process.exit(1);
  }
}

runDeploymentTasks(); 