#!/usr/bin/env node

/**
 * Update Project Showcase Fields Script
 * 
 * This script updates existing projects with the showcase_location and display_type fields
 * based on project categories and titles.
 * 
 * Usage: node scripts/update-project-showcase-fields.js
 */

const { neon } = require('@neondatabase/serverless');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ DATABASE_URL not found in environment variables');
  console.log('Please check your .env.local file');
  process.exit(1);
}

const sql = neon(connectionString);

async function updateProjectShowcaseFields() {
  try {
    console.log('🚀 Starting project showcase fields update...');
    console.log('📊 Using database connection:', connectionString.replace(/:[^:@]+@/, ':****@'));
    
    // Check if the columns exist first
    const columnsResult = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'projects' 
        AND column_name IN ('showcase_location', 'display_type')
      ORDER BY column_name
    `;
    
    if (columnsResult.length < 2) {
      console.error('❌ One or both required columns are missing!');
      console.log('showcase_location exists:', columnsResult.some(c => c.column_name === 'showcase_location'));
      console.log('display_type exists:', columnsResult.some(c => c.column_name === 'display_type'));
      console.log('Please run the add-showcase-columns.js script first');
      process.exit(1);
    }
    
    console.log('✅ Required columns exist');
    
    // Get all projects
    console.log('\n📋 Fetching all projects...');
    const projects = await sql`
      SELECT id, title, category, description 
      FROM projects
    `;
    
    console.log(`Found ${projects.length} projects to process`);
    
    // Process each project
    console.log('\n🔄 Processing projects...');
    let updates = {
      aiProjects: 0,
      mobileProjects: 0,
      featuredProjects: 0,
      regularProjects: 0,
      errors: 0
    };
    
    for (const project of projects) {
      try {
        console.log(`\nProcessing project: "${project.title}" (ID: ${project.id})`);
        
        // Determine showcase_location based on category and title
        let showcase_location = 'regular_grid';
        let display_type = 'standard';
        
        const title = project.title.toLowerCase();
        const category = (project.category || '').toLowerCase();
        const description = (project.description || '').toLowerCase();
        
        // AI Solutions criteria
        if (
          category.includes('ai') || 
          category.includes('ml') || 
          category.includes('machine learning') ||
          title.includes('ai') ||
          title.includes('ml') ||
          title.includes('intelligent') ||
          title.includes('machine learning') ||
          description.includes('artificial intelligence') ||
          description.includes('machine learning')
        ) {
          showcase_location = 'ai_solutions';
          display_type = 'ai_product';
          updates.aiProjects++;
          console.log('✅ Identified as AI project');
        }
        // Mobile Apps criteria
        else if (
          category.includes('mobile') ||
          category.includes('app') ||
          title.includes('mobile') ||
          title.includes('app') ||
          description.includes('mobile') ||
          description.includes('ios') ||
          description.includes('android')
        ) {
          showcase_location = 'mobile_showcase';
          display_type = 'mobile_app';
          updates.mobileProjects++;
          console.log('✅ Identified as Mobile project');
        }
        // Feature projects based on title
        else if (title.startsWith('featured') || title.includes('flagship')) {
          showcase_location = 'featured_hero';
          display_type = 'standard';
          updates.featuredProjects++;
          console.log('✅ Identified as Featured project');
        }
        else {
          updates.regularProjects++;
          console.log('✅ Identified as Regular project');
        }
        
        // Special handling for newly added projects
        if (title.startsWith('newly added')) {
          if (showcase_location === 'ai_solutions') {
            display_type = 'ai_product_new';
          } else if (showcase_location === 'mobile_showcase') {
            display_type = 'mobile_app_new';
          } else {
            display_type = 'newly_added';
          }
          console.log('  → Also identified as Newly Added');
        }
        
        // Update the project
        console.log(`  → Setting showcase_location=${showcase_location}, display_type=${display_type}`);
        await sql`
          UPDATE projects 
          SET showcase_location = ${showcase_location}, 
              display_type = ${display_type} 
          WHERE id = ${project.id}
        `;
      } catch (error) {
        console.error(`❌ Error processing project ID ${project.id}:`, error);
        updates.errors++;
      }
    }
    
    // Summary
    console.log('\n🎉 Project updates completed!');
    console.log('\n📊 Update Summary:');
    console.log(`  AI Projects: ${updates.aiProjects}`);
    console.log(`  Mobile Projects: ${updates.mobileProjects}`);
    console.log(`  Featured Projects: ${updates.featuredProjects}`);
    console.log(`  Regular Projects: ${updates.regularProjects}`);
    console.log(`  Errors: ${updates.errors}`);
    console.log(`  Total: ${updates.aiProjects + updates.mobileProjects + updates.featuredProjects + updates.regularProjects}`);
    
    // Verify updates
    console.log('\n🔍 Verifying updates...');
    const aiResults = await sql`
      SELECT COUNT(*) as count FROM projects WHERE showcase_location = 'ai_solutions'
    `;
    
    const mobileResults = await sql`
      SELECT COUNT(*) as count FROM projects WHERE showcase_location = 'mobile_showcase'
    `;
    
    const featuredResults = await sql`
      SELECT COUNT(*) as count FROM projects WHERE showcase_location = 'featured_hero'
    `;
    
    console.log(`  AI Projects in database: ${aiResults[0].count}`);
    console.log(`  Mobile Projects in database: ${mobileResults[0].count}`);
    console.log(`  Featured Projects in database: ${featuredResults[0].count}`);
    
    return {
      success: true,
      message: 'Project showcase fields updated successfully'
    };
  } catch (error) {
    console.error('\n❌ Error updating project showcase fields:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

// Run the update
if (require.main === module) {
  updateProjectShowcaseFields()
    .then((result) => {
      console.log(`\n${result.success ? '✅' : '❌'} ${result.message}`);
      process.exit(result.success ? 0 : 1);
    })
    .catch((error) => {
      console.error('\n💥 Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { updateProjectShowcaseFields };