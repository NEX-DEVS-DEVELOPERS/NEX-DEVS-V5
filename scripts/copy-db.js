const fs = require('fs');
const path = require('path');

// Define paths
const dbDir = path.join(__dirname, '..', 'db');
const destDir = path.join(__dirname, '..', '.next', 'server', 'db');

console.log('Copying SQLite database files for Netlify deployment...');

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

// Copy database files
try {
  const files = fs.readdirSync(dbDir);
  console.log(`Found ${files.length} files in database directory`);
  
  // Copy all files with .db or .sqlite extension
  let copiedCount = 0;
  for (const file of files) {
    if (file.endsWith('.db') || file.endsWith('.sqlite')) {
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

  console.log('Database preparation for Netlify complete');
} catch (error) {
  console.error('Error copying database files:', error);
  process.exit(1);
} 