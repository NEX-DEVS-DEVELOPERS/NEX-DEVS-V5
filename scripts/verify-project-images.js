// Script to verify project images in the Neon PostgreSQL database
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Neon connection - use connection string directly
const NEON_CONNECTION_STRING = 'postgresql://NEX-DEVS%20DATABSE_owner:npg_Av9imV5KFXhy@ep-nameless-frog-a1x6ujuj-pooler.ap-southeast-1.aws.neon.tech/NEX-DEVS%20DATABSE?sslmode=require';
const neonSql = neon(NEON_CONNECTION_STRING);

// Public directory for images
const PUBLIC_DIR = path.join(process.cwd(), 'public');

async function verifyProjectImages() {
  console.log('Verifying project images in Neon PostgreSQL database...');
  
  try {
    // Get all projects from the database
    const projects = await neonSql`SELECT id, title, image_url, second_image FROM projects ORDER BY id`;
    console.log(`Retrieved ${projects.length} projects from the database.`);
    
    // Track image statistics
    const stats = {
      total: projects.length,
      withImages: 0,
      withSecondImages: 0,
      invalidImages: 0,
      invalidSecondImages: 0,
      imagesList: [],
      invalidImagePaths: []
    };
    
    // Check each project's images
    console.log('\nVerifying images for each project:');
    console.log('----------------------------------');
    
    for (const project of projects) {
      console.log(`\nProject ID ${project.id}: "${project.title}"`);
      
      // Check primary image
      if (project.image_url) {
        stats.withImages++;
        stats.imagesList.push(project.image_url);
        
        // Check if the image exists in the public directory
        const imagePath = project.image_url.startsWith('/') 
          ? path.join(PUBLIC_DIR, project.image_url)
          : path.join(PUBLIC_DIR, '/', project.image_url);
        
        const imageExists = fs.existsSync(imagePath);
        
        console.log(`  Primary image: ${project.image_url}`);
        console.log(`  Image exists in public directory: ${imageExists ? 'YES' : 'NO'}`);
        
        if (!imageExists) {
          stats.invalidImages++;
          stats.invalidImagePaths.push(project.image_url);
        }
      } else {
        console.log('  No primary image path found.');
      }
      
      // Check second image
      if (project.second_image) {
        stats.withSecondImages++;
        stats.imagesList.push(project.second_image);
        
        // Check if the second image exists in the public directory
        const secondImagePath = project.second_image.startsWith('/') 
          ? path.join(PUBLIC_DIR, project.second_image)
          : path.join(PUBLIC_DIR, '/', project.second_image);
        
        const secondImageExists = fs.existsSync(secondImagePath);
        
        console.log(`  Secondary image: ${project.second_image}`);
        console.log(`  Secondary image exists in public directory: ${secondImageExists ? 'YES' : 'NO'}`);
        
        if (!secondImageExists) {
          stats.invalidSecondImages++;
          stats.invalidImagePaths.push(project.second_image);
        }
      } else {
        console.log('  No secondary image path found.');
      }
    }
    
    // Print summary
    console.log('\n\nImage Verification Summary:');
    console.log('-------------------------');
    console.log(`Total projects: ${stats.total}`);
    console.log(`Projects with primary images: ${stats.withImages}`);
    console.log(`Projects with secondary images: ${stats.withSecondImages}`);
    console.log(`Invalid primary images: ${stats.invalidImages}`);
    console.log(`Invalid secondary images: ${stats.invalidSecondImages}`);
    
    if (stats.invalidImagePaths.length > 0) {
      console.log('\nInvalid image paths:');
      stats.invalidImagePaths.forEach(path => console.log(`  - ${path}`));
    }
    
    // Get unique image paths
    const uniqueImagePaths = [...new Set(stats.imagesList)];
    console.log(`\nTotal unique image paths: ${uniqueImagePaths.length}`);
    
    return {
      success: true,
      stats: stats
    };
  } catch (error) {
    console.error('Error verifying project images:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the verification
verifyProjectImages().then(result => {
  console.log('\nVerification complete.');
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('Unhandled error during verification:', error);
  process.exit(1);
}); 