/**
 * Netlify Pre-install script
 * This script runs before the Netlify build process
 * It ensures proper setup for the JSON storage
 */

const fs = require('fs');
const path = require('path');

console.log('Running Netlify pre-install script...');

// Create tmp directory if it doesn't exist
const tempDir = path.join('/tmp');
if (!fs.existsSync(tempDir)) {
  try {
    fs.mkdirSync(tempDir, { recursive: true });
    console.log('Created /tmp directory');
  } catch (err) {
    console.warn('Warning: Could not create /tmp directory:', err.message);
  }
}

// Create empty projects.json file in tmp directory
const projectsJsonPath = path.join(tempDir, 'projects.json');
if (!fs.existsSync(projectsJsonPath)) {
  try {
    fs.writeFileSync(projectsJsonPath, JSON.stringify([]));
    console.log('Created empty projects.json file in /tmp directory');
  } catch (err) {
    console.warn('Warning: Could not create projects.json file:', err.message);
  }
}

// Create projects.json file in root directory
const rootProjectsJsonPath = path.join(process.cwd(), 'projects.json');
if (!fs.existsSync(rootProjectsJsonPath)) {
  try {
    fs.writeFileSync(rootProjectsJsonPath, JSON.stringify([]));
    console.log('Created empty projects.json file in root directory');
  } catch (err) {
    console.warn('Warning: Could not create projects.json file in root:', err.message);
  }
}

console.log('Netlify pre-install script completed'); 