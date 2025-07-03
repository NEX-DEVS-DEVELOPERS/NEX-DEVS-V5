const { neon } = require('@neondatabase/serverless');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function addGithubFields() {
  try {
    console.log('Starting GitHub fields migration...');
    
    // Check if the columns already exist
    const checkColumns = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name IN ('github_link', 'github_client_link', 'github_server_link')
    `;
    
    const existingColumns = checkColumns.map(row => row.column_name);
    console.log('Existing GitHub columns:', existingColumns);
    
    // Add github_link column if it doesn't exist
    if (!existingColumns.includes('github_link')) {
      console.log('Adding github_link column...');
      await sql`
        ALTER TABLE projects 
        ADD COLUMN github_link TEXT
      `;
      console.log('✓ github_link column added');
    } else {
      console.log('✓ github_link column already exists');
    }
    
    // Add github_client_link column if it doesn't exist
    if (!existingColumns.includes('github_client_link')) {
      console.log('Adding github_client_link column...');
      await sql`
        ALTER TABLE projects 
        ADD COLUMN github_client_link TEXT
      `;
      console.log('✓ github_client_link column added');
    } else {
      console.log('✓ github_client_link column already exists');
    }
    
    // Add github_server_link column if it doesn't exist
    if (!existingColumns.includes('github_server_link')) {
      console.log('Adding github_server_link column...');
      await sql`
        ALTER TABLE projects 
        ADD COLUMN github_server_link TEXT
      `;
      console.log('✓ github_server_link column added');
    } else {
      console.log('✓ github_server_link column already exists');
    }
    
    console.log('GitHub fields migration completed successfully!');
    
    // Verify the columns were added
    const finalCheck = await sql`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'projects' 
      AND column_name IN ('github_link', 'github_client_link', 'github_server_link')
      ORDER BY column_name
    `;
    
    console.log('Final verification - GitHub columns in database:', finalCheck.map(row => row.column_name));
    
  } catch (error) {
    console.error('Error during GitHub fields migration:', error);
    process.exit(1);
  }
}

// Run the migration
addGithubFields();
