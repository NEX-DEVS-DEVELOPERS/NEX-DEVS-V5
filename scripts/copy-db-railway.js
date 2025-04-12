// Script to ensure SQLite database is available in Railway environment
const fs = require('fs');
const path = require('path');

console.log('Preparing SQLite database for Railway deployment...');

// Define paths
const dataDir = '/data';
const dbFilePath = path.join(dataDir, 'database.sqlite');

// Check if /data directory exists (Railway volume mount point)
if (!fs.existsSync(dataDir)) {
  try {
    console.log(`Creating ${dataDir} directory...`);
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`Created ${dataDir} directory successfully.`);
  } catch (error) {
    console.error(`Error creating ${dataDir} directory:`, error);
  }
}

// Check if database file exists, create an empty one if not
if (!fs.existsSync(dbFilePath)) {
  try {
    console.log('Creating empty SQLite database file...');
    fs.writeFileSync(dbFilePath, '');
    console.log(`Created empty database file at ${dbFilePath}`);
  } catch (error) {
    console.error('Error creating SQLite database file:', error);
  }
}

// Set proper permissions
try {
  fs.chmodSync(dbFilePath, 0o666);
  console.log('Set database file permissions');
} catch (error) {
  console.error('Error setting file permissions:', error);
}

console.log('SQLite database preparation completed'); 