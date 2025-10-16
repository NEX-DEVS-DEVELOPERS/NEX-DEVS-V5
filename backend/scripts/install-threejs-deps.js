#!/usr/bin/env node

/**
 * Install Three.js Dependencies Script
 * 
 * This script installs all necessary dependencies for the 3D iPhone mockup component.
 * 
 * Usage: node scripts/install-threejs-deps.js
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Installing Three.js dependencies for modern iPhone mockup...');

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found in the current directory');
  console.log('Please run this script from the project root directory');
  process.exit(1);
}

// Dependencies to install
const dependencies = [
  'three@0.161.0',
  '@react-three/fiber@8.15.16',
  '@react-three/drei@9.102.6',
  '@types/three@0.161.2'
];

try {
  // Install dependencies using npm
  console.log('📦 Installing the following packages:');
  dependencies.forEach(dep => console.log(`  - ${dep}`));
  
  const command = `npm install ${dependencies.join(' ')} --save`;
  console.log(`\n📝 Running command: ${command}\n`);
  
  execSync(command, { stdio: 'inherit' });
  
  console.log('\n✅ Successfully installed Three.js dependencies!');
  console.log('\n🔍 You can now use the ModernIPhoneMockup component in your project.');
  console.log('   Import it with: import ModernIPhoneMockup from \'./components/ModernIPhoneMockup\'');
  
  // Update tsconfig.json if needed to support Three.js
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    console.log('\n🔧 Checking tsconfig.json configuration...');
    
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    
    // Ensure compilerOptions exists
    if (!tsconfig.compilerOptions) {
      tsconfig.compilerOptions = {};
    }
    
    // Add necessary compiler options for Three.js
    let configUpdated = false;
    
    if (!tsconfig.compilerOptions.moduleResolution) {
      tsconfig.compilerOptions.moduleResolution = "node";
      configUpdated = true;
    }
    
    if (!tsconfig.compilerOptions.esModuleInterop) {
      tsconfig.compilerOptions.esModuleInterop = true;
      configUpdated = true;
    }
    
    // Save updated config if needed
    if (configUpdated) {
      fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
      console.log('✅ Updated tsconfig.json for Three.js compatibility');
    } else {
      console.log('✅ tsconfig.json already properly configured');
    }
  }
  
  console.log('\n🎉 Setup complete! Your project now supports 3D iPhone mockups.');
  
} catch (error) {
  console.error('\n❌ Error installing dependencies:', error.message);
  console.log('\n📋 Troubleshooting tips:');
  console.log('  1. Make sure you have npm installed and properly configured');
  console.log('  2. Check your internet connection');
  console.log('  3. Try installing the dependencies manually:');
  console.log(`     npm install ${dependencies.join(' ')} --save`);
  process.exit(1);
}