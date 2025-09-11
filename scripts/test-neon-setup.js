// Test script to verify database setup
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection and data...');
    
    // Test projects
    const projects = await sql`SELECT id, title, featured, status FROM projects ORDER BY featured DESC, id`;
    console.log('\n📊 Projects in database:');
    projects.forEach(p => {
      console.log(`  - ${p.id}: ${p.title} ${p.featured ? '⭐' : ''} ${p.status ? `(${p.status})` : ''}`);
    });
    
    // Test team members
    const team = await sql`SELECT id, name, title, is_leader FROM team_members ORDER BY is_leader DESC, order_priority`;
    console.log('\n👥 Team members in database:');
    team.forEach(t => {
      console.log(`  - ${t.id}: ${t.name} - ${t.title} ${t.is_leader ? '👑' : ''}`);
    });
    
    console.log(`\n✅ Database test completed successfully!`);
    console.log(`📈 Total projects: ${projects.length}`);
    console.log(`👨‍💼 Total team members: ${team.length}`);
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase();