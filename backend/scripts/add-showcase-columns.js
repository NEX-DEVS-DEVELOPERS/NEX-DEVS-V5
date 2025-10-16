#!/usr/bin/env node

/**
 * Migration Script: Add showcase_location and display_type columns
 * 
 * This script adds the necessary columns for the enhanced project showcase functionality:
 * - showcase_location: Determines where the project appears (ai_solutions, mobile_showcase, etc.)
 * - display_type: Determines how the project is visually presented (ai_product, mobile_app, etc.)
 * 
 * Usage: node scripts/add-showcase-columns.js
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

async function addShowcaseColumns() {
  try {
    console.log('🚀 Starting showcase columns migration...');
    console.log('📊 Connection string:', connectionString.replace(/:[^:@]+@/, ':****@'));

    // Check if the projects table exists
    console.log('\n📋 Checking if projects table exists...');
    const tablesResult = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'projects'
    `;

    if (tablesResult.length === 0) {
      console.error('❌ Projects table not found!');
      console.log('Please ensure the main database schema is set up first.');
      process.exit(1);
    }
    console.log('✅ Projects table found');

    // Check existing columns
    console.log('\n🔍 Checking existing columns in projects table...');
    const columnsResult = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'projects'
      ORDER BY ordinal_position
    `;

    console.log('📋 Current columns:');
    columnsResult.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type}${col.is_nullable === 'YES' ? ' (nullable)' : ' (not null)'}${col.column_default ? ` default: ${col.column_default}` : ''}`);
    });

    // Check if showcase_location column exists
    const hasShowcaseLocation = columnsResult.some(col => col.column_name === 'showcase_location');
    const hasDisplayType = columnsResult.some(col => col.column_name === 'display_type');

    console.log(`\n🔍 Column status:`);
    console.log(`  - showcase_location: ${hasShowcaseLocation ? '✅ exists' : '❌ missing'}`);
    console.log(`  - display_type: ${hasDisplayType ? '✅ exists' : '❌ missing'}`);

    // Add showcase_location column if it doesn't exist
    if (!hasShowcaseLocation) {
      console.log('\n➕ Adding showcase_location column...');
      await sql`
        ALTER TABLE projects 
        ADD COLUMN showcase_location VARCHAR(50) DEFAULT 'regular_grid'
      `;
      console.log('✅ showcase_location column added successfully');

      // Set default values for existing records
      console.log('🔄 Setting default values for existing projects...');
      const updateResult = await sql`
        UPDATE projects 
        SET showcase_location = 'regular_grid' 
        WHERE showcase_location IS NULL
      `;
      console.log(`✅ Updated ${updateResult.length || 0} existing records with default showcase_location`);
    } else {
      console.log('ℹ️ showcase_location column already exists, skipping...');
    }

    // Add display_type column if it doesn't exist
    if (!hasDisplayType) {
      console.log('\n➕ Adding display_type column...');
      await sql`
        ALTER TABLE projects 
        ADD COLUMN display_type VARCHAR(50) DEFAULT 'standard'
      `;
      console.log('✅ display_type column added successfully');

      // Set default values for existing records
      console.log('🔄 Setting default values for existing projects...');
      const updateResult = await sql`
        UPDATE projects 
        SET display_type = 'standard' 
        WHERE display_type IS NULL
      `;
      console.log(`✅ Updated ${updateResult.length || 0} existing records with default display_type`);
    } else {
      console.log('ℹ️ display_type column already exists, skipping...');
    }

    // Verify the changes
    console.log('\n🔍 Verifying the migration...');
    const updatedColumns = await sql`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_schema = 'public' AND table_name = 'projects'
        AND column_name IN ('showcase_location', 'display_type')
      ORDER BY column_name
    `;

    console.log('📋 New columns added:');
    updatedColumns.forEach(col => {
      console.log(`  ✅ ${col.column_name}: ${col.data_type}${col.is_nullable === 'YES' ? ' (nullable)' : ' (not null)'}${col.column_default ? ` default: ${col.column_default}` : ''}`);
    });

    // Test the new columns with a sample query
    console.log('\n🧪 Testing the new columns...');
    const testResult = await sql`
      SELECT id, title, showcase_location, display_type 
      FROM projects 
      LIMIT 3
    `;

    console.log('📋 Sample data:');
    testResult.forEach(project => {
      console.log(`  - ID: ${project.id}, Title: "${project.title}", Showcase: "${project.showcase_location}", Type: "${project.display_type}"`);
    });

    // Add index for better performance (optional)
    console.log('\n📊 Adding performance indexes...');
    try {
      await sql`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_showcase_location 
        ON projects (showcase_location)
      `;
      console.log('✅ Index on showcase_location created');
    } catch (error) {
      console.log('ℹ️ Index on showcase_location already exists or couldn\'t be created');
    }

    try {
      await sql`
        CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_projects_display_type 
        ON projects (display_type)
      `;
      console.log('✅ Index on display_type created');
    } catch (error) {
      console.log('ℹ️ Index on display_type already exists or couldn\'t be created');
    }

    console.log('\n🎉 Migration completed successfully!');
    console.log('\n📋 Summary:');
    console.log('  ✅ showcase_location column: Available for project location management');
    console.log('  ✅ display_type column: Available for project display styling');
    console.log('  ✅ Default values set for existing projects');
    console.log('  ✅ Performance indexes created');
    console.log('\n🚀 The enhanced project showcase system is now ready to use!');

  } catch (error) {
    console.error('\n❌ Migration failed:', error);
    console.error('Stack trace:', error.stack);
    process.exit(1);
  }
}

// Run the migration
if (require.main === module) {
  addShowcaseColumns()
    .then(() => {
      console.log('\n✨ Migration script completed successfully');
      process.exit(0);
    })
    .catch(error => {
      console.error('\n💥 Migration script failed:', error);
      process.exit(1);
    });
}

module.exports = { addShowcaseColumns };