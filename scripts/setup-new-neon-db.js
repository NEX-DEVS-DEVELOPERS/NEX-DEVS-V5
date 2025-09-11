// Complete Migration Script for New Neon Database
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

console.log('🚀 Starting database migration...');

async function runMigration() {
  try {
    // Test connection
    console.log('📡 Testing connection...');
    await sql`SELECT 1 as test`;
    console.log('✅ Connection successful!');

    // Create projects table
    console.log('🏗️ Creating projects table...');
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        detailed_description TEXT,
        image_url TEXT NOT NULL,
        second_image TEXT,
        show_both_images_in_priority BOOLEAN DEFAULT FALSE,
        category VARCHAR(255) NOT NULL,
        technologies JSONB NOT NULL,
        tech_details JSONB,
        project_link TEXT,
        featured BOOLEAN DEFAULT FALSE,
        completion_date VARCHAR(255),
        client_name VARCHAR(255),
        duration VARCHAR(255),
        status VARCHAR(100),
        updated_days INTEGER,
        progress INTEGER,
        development_progress INTEGER,
        estimated_completion VARCHAR(255),
        features JSONB,
        exclusive_features JSONB,
        image_priority INTEGER DEFAULT 5,
        visual_effects JSONB,
        is_code_screenshot BOOLEAN DEFAULT FALSE,
        code_language VARCHAR(255),
        code_title VARCHAR(255),
        code_content TEXT,
        use_direct_code_input BOOLEAN DEFAULT FALSE,
        github_link TEXT,
        github_client_link TEXT,
        github_server_link TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create team_members table
    console.log('👥 Creating team_members table...');
    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url TEXT NOT NULL,
        email VARCHAR(255),
        linkedin_url TEXT,
        github_url TEXT,
        twitter_url TEXT,
        dribbble_url TEXT,
        website_url TEXT,
        skills JSONB,
        order_priority INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        is_leader BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Create indexes
    console.log('📊 Creating indexes...');
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active)`;

    console.log('✅ Database schema created successfully!');
    console.log('🎯 Run the data insertion script next to populate with projects and team data.');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

runMigration();