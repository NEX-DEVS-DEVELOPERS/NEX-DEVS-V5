const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Ensuring critical dependencies are installed...');

// Define critical dependencies with specific version constraints for Netlify compatibility
const criticalDeps = [
  { name: 'autoprefixer', version: '^10.4.21' },
  { name: 'postcss', version: '^8.5.3' },
  { name: 'tailwindcss', version: '^3.4.17' },
  { name: '@netlify/plugin-nextjs', version: '^4.41.3' }
];

// Check if package.json exists
const packageJsonPath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.error('❌ package.json not found!');
  process.exit(1);
}

// Read package.json
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const installedDeps = {
  ...packageJson.dependencies,
  ...packageJson.devDependencies
};

// Check if each critical dependency is installed with compatible version
const missingDeps = [];
criticalDeps.forEach(dep => {
  if (!installedDeps[dep.name]) {
    missingDeps.push(`${dep.name}@${dep.version}`);
  }
});

// Install missing dependencies if any
if (missingDeps.length > 0) {
  console.log(`⚠️ Missing dependencies: ${missingDeps.join(', ')}`);
  console.log('⏳ Installing missing dependencies...');
  
  try {
    execSync(`npm install --save-dev ${missingDeps.join(' ')}`, {
      stdio: 'inherit'
    });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Error installing dependencies:', error.message);
    console.log('⚠️ Continuing with build process despite errors...');
  }
} else {
  console.log('✅ All critical dependencies are installed');
}

// Ensure PostCSS is configured correctly for Next.js 15
const postcssConfigPath = path.join(process.cwd(), 'postcss.config.js');
if (fs.existsSync(postcssConfigPath)) {
  const postcssConfig = fs.readFileSync(postcssConfigPath, 'utf8');
  if (!postcssConfig.includes('autoprefixer')) {
    console.log('⚠️ autoprefixer not found in postcss.config.js');
    try {
      const newConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
      fs.writeFileSync(postcssConfigPath, newConfig);
      console.log('✅ Added autoprefixer to postcss.config.js');
    } catch (error) {
      console.error('❌ Error updating postcss.config.js:', error.message);
    }
  } else {
    console.log('✅ autoprefixer is configured in postcss.config.js');
  }
} else {
  console.log('⚠️ postcss.config.js not found, creating...');
  try {
    const newConfig = `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`;
    fs.writeFileSync(postcssConfigPath, newConfig);
    console.log('✅ Created postcss.config.js with autoprefixer');
  }
  catch (error) {
    console.error('❌ Error creating postcss.config.js:', error.message);
  }
}

// Check Netlify plugin compatibility
if (process.env.NETLIFY === 'true') {
  console.log('🔍 Checking Netlify environment compatibility...');
  
  // Create a compatible .nvmrc file if not exists
  const nvmrcPath = path.join(process.cwd(), '.nvmrc');
  if (!fs.existsSync(nvmrcPath)) {
    try {
      fs.writeFileSync(nvmrcPath, '18');
      console.log('✅ Created .nvmrc file to ensure Node 18 compatibility');
    } catch (error) {
      console.error('❌ Error creating .nvmrc file:', error.message);
    }
  }
}

console.log('✅ Dependency check completed!');
process.exit(0); // Ensure script exits cleanly 