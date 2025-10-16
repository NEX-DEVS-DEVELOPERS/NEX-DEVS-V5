// Script to ensure SQLite database is available in Vercel serverless environment
const fs = require('fs');
const path = require('path');

// Define paths - database could be in different locations
const possibleDbPaths = [
  path.join(process.cwd(), 'app', 'db'),
  path.join(process.cwd(), 'db'),
  path.join(process.cwd(), '.next', 'db')
];

// Destination for Vercel serverless functions
const destPaths = [
  path.join(process.cwd(), '.vercel', 'output', 'functions'),
  path.join(process.cwd(), '.vercel', 'output', 'server'),
  path.join(process.cwd(), '.next', 'server'),
  path.join(process.cwd(), '.next', 'cache')
];

console.log('Starting SQLite database copy for Vercel deployment...');

// Create a simple database if none exists yet
let dbSourcePath = null;
let dbFound = false;

// Check each possible source location
for (const sourcePath of possibleDbPaths) {
  if (fs.existsSync(sourcePath)) {
    const files = fs.readdirSync(sourcePath);
    const dbFiles = files.filter(file => file.endsWith('.db') || file.endsWith('.sqlite'));
    
    if (dbFiles.length > 0) {
      dbSourcePath = sourcePath;
      dbFound = true;
      console.log(`Found database files in ${sourcePath}`);
      break;
    }
  }
}

// If no DB exists, create a simple empty one
if (!dbFound) {
  console.log('No existing database found, creating an empty one...');
  dbSourcePath = path.join(process.cwd(), 'app', 'db');
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dbSourcePath)) {
    fs.mkdirSync(dbSourcePath, { recursive: true });
  }
  
  // Create empty database file
  fs.writeFileSync(path.join(dbSourcePath, 'projects.db'), '');
  console.log('Created empty database file');
}

// Copy to all possible destination locations
for (const destPath of destPaths) {
  try {
    if (!fs.existsSync(destPath)) {
      continue;
    }
    
    const files = fs.readdirSync(dbSourcePath);
    const dbFiles = files.filter(file => file.endsWith('.db') || file.endsWith('.sqlite'));
    
    for (const dbFile of dbFiles) {
      // Make sure target directory exists
      const targetDir = path.join(destPath, 'db');
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }
      
      // Copy the database file
      const sourceFile = path.join(dbSourcePath, dbFile);
      const targetFile = path.join(targetDir, dbFile);
      
      fs.copyFileSync(sourceFile, targetFile);
      console.log(`Copied ${dbFile} to ${targetDir}`);
    }
  } catch (error) {
    console.error(`Error copying to ${destPath}:`, error);
  }
}

console.log('Database copy process completed'); 