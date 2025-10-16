const { neon } = require('@neondatabase/serverless');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function createTeamTable() {
  try {
    console.log('Starting team_members table creation...');
    
    // Check if the table already exists
    const checkTable = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name = 'team_members'
    `;
    
    if (checkTable.length > 0) {
      console.log('✓ team_members table already exists');
      return;
    }
    
    // Create team_members table
    console.log('Creating team_members table...');
    await sql`
      CREATE TABLE team_members (
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
      )
    `;
    
    console.log('✓ team_members table created successfully');
    
    // Insert sample data from existing team.json if it exists
    console.log('Inserting sample team data...');
    
    // Sample team leader
    await sql`
      INSERT INTO team_members (
        name, title, bio, image_url, linkedin_url, github_url, twitter_url, dribbble_url,
        skills, order_priority, is_leader, active
      ) VALUES (
        'Ali Hasnaat',
        'Founder & Lead Developer',
        'Full-stack developer with expertise in AI integration and modern web technologies. Passionate about creating exceptional digital experiences and innovative solutions.',
        '/team/ali.jpg',
        'https://linkedin.com/in/alihasnaat',
        'https://github.com/NEX-DEVS-DEVELOPERS',
        'https://twitter.com/alihasnaat',
        'https://dribbble.com/alihasnaat',
        '["Full Stack Development", "AI Integration", "System Architecture", "Cloud Infrastructure", "Team Leadership"]',
        1,
        true,
        true
      )
    `;
    
    // Sample team members
    await sql`
      INSERT INTO team_members (
        name, title, image_url, linkedin_url, github_url,
        skills, order_priority, is_leader, active
      ) VALUES 
      (
        'Mdassir-Ahmad',
        'Senior Frontend Developer',
        '/team/zain.jpg',
        'https://linkedin.com/in/zainahmed',
        'https://github.com/zainahmed',
        '["React", "Next.js", "UI/UX"]',
        2,
        false,
        true
      ),
      (
        'Faizan-khan',
        'UI/UX Designer',
        '/team/fatima.jpg',
        'https://linkedin.com/in/fatimakhan',
        null,
        '["Figma", "User Research", "Motion Design"]',
        3,
        false,
        true
      ),
      (
        'Eman-Ali',
        'Backend Developer',
        '/team/hassan.jpg',
        'https://linkedin.com/in/hassanali',
        'https://github.com/hassanali',
        '["Node.js", "Python", "DevOps"]',
        4,
        false,
        true
      )
    `;
    
    console.log('✓ Sample team data inserted successfully');
    
    // Verify the data was inserted
    const teamCount = await sql`
      SELECT COUNT(*) as count FROM team_members WHERE active = true
    `;
    
    console.log(`✓ Team members table migration completed successfully!`);
    console.log(`✓ Total active team members: ${teamCount[0].count}`);
    
  } catch (error) {
    console.error('Error during team table migration:', error);
    process.exit(1);
  }
}

// Run the migration
createTeamTable();
