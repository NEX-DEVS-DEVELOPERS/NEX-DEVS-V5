// Cleanup script to remove duplicates and ensure clean data
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function cleanupDatabase() {
  try {
    console.log('🧹 Cleaning up duplicate entries...');

    // Remove duplicate projects - keep the first occurrence of each unique title
    await sql`
      DELETE FROM projects 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM projects 
        GROUP BY title
      )
    `;

    // Remove duplicate team members - keep the first occurrence of each unique name
    await sql`
      DELETE FROM team_members 
      WHERE id NOT IN (
        SELECT MIN(id) 
        FROM team_members 
        GROUP BY name
      )
    `;

    // Get final counts
    const projectCount = await sql`SELECT COUNT(*) as count FROM projects`;
    const teamCount = await sql`SELECT COUNT(*) as count FROM team_members`;
    const featuredCount = await sql`SELECT COUNT(*) as count FROM projects WHERE featured = true`;

    console.log('\n✅ Database cleanup completed!');
    console.log(`📊 Total projects: ${projectCount[0].count}`);
    console.log(`⭐ Featured projects: ${featuredCount[0].count}`);
    console.log(`👥 Total team members: ${teamCount[0].count}`);
    
    // Show final project list
    const projects = await sql`SELECT id, title, featured, status FROM projects ORDER BY featured DESC, id`;
    console.log('\n📋 Final project list:');
    projects.forEach(p => {
      console.log(`  - ${p.title} ${p.featured ? '⭐' : ''} ${p.status ? `(${p.status})` : ''}`);
    });

    // Show final team list
    const team = await sql`SELECT name, title, is_leader FROM team_members ORDER BY is_leader DESC, order_priority`;
    console.log('\n👥 Final team list:');
    team.forEach(t => {
      console.log(`  - ${t.name} - ${t.title} ${t.is_leader ? '👑' : ''}`);
    });

  } catch (error) {
    console.error('❌ Cleanup failed:', error);
  }
}

cleanupDatabase();