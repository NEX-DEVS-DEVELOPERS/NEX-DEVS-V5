// Database inspection script to check Neon database contents
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function inspectDatabase() {
  try {
    console.log('🔍 Inspecting Neon database...');
    console.log('📊 Database URL:', process.env.DATABASE_URL.replace(/:[^:]*@/, ':****@'));
    
    // Check table existence and structure
    console.log('\n📋 Checking table structure...');
    
    // Get all tables
    const tables = await sql`
      SELECT table_name, table_schema 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    console.log('Tables found:');
    tables.forEach(table => {
      console.log(`  - ${table.table_name} (schema: ${table.table_schema})`);
    });
    
    // Check projects table structure
    if (tables.some(t => t.table_name === 'projects')) {
      console.log('\n🏗️ Projects table structure:');
      const projectColumns = await sql`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = 'projects' AND table_schema = 'public'
        ORDER BY ordinal_position
      `;
      
      projectColumns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
      });
      
      // Count projects
      const projectCount = await sql`SELECT COUNT(*) as count FROM projects`;
      console.log(`\n📊 Total projects: ${projectCount[0].count}`);
      
      if (projectCount[0].count > 0) {
        // Show sample projects
        const sampleProjects = await sql`
          SELECT id, title, category, featured, status 
          FROM projects 
          ORDER BY id 
          LIMIT 5
        `;
        
        console.log('\n📋 Sample projects:');
        sampleProjects.forEach(p => {
          console.log(`  ${p.id}: ${p.title} [${p.category}] ${p.featured ? '⭐' : ''} ${p.status ? `(${p.status})` : ''}`);
        });
      } else {
        console.log('⚠️ No projects found in the database!');
      }
    }
    
    // Check team_members table
    if (tables.some(t => t.table_name === 'team_members')) {
      console.log('\n👥 Team members table structure:');
      const teamColumns = await sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns 
        WHERE table_name = 'team_members' AND table_schema = 'public'
        ORDER BY ordinal_position
      `;
      
      teamColumns.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'YES' ? '(nullable)' : '(not null)'}`);
      });
      
      const teamCount = await sql`SELECT COUNT(*) as count FROM team_members`;
      console.log(`\n👨‍💼 Total team members: ${teamCount[0].count}`);
      
      if (teamCount[0].count > 0) {
        const sampleTeam = await sql`
          SELECT id, name, title, is_leader 
          FROM team_members 
          ORDER BY order_priority 
          LIMIT 5
        `;
        
        console.log('\n👥 Sample team members:');
        sampleTeam.forEach(t => {
          console.log(`  ${t.id}: ${t.name} - ${t.title} ${t.is_leader ? '👑' : ''}`);
        });
      } else {
        console.log('⚠️ No team members found in the database!');
      }
    }
    
    // Check indexes
    console.log('\n📊 Database indexes:');
    const indexes = await sql`
      SELECT indexname, tablename 
      FROM pg_indexes 
      WHERE schemaname = 'public' 
      ORDER BY tablename, indexname
    `;
    
    indexes.forEach(idx => {
      console.log(`  - ${idx.indexname} on ${idx.tablename}`);
    });
    
    console.log('\n✅ Database inspection completed!');
    
  } catch (error) {
    console.error('❌ Database inspection failed:', error);
  }
}

inspectDatabase();