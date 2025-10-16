/**
 * Setup ROI Database Schema and Demo Data
 * 
 * This script creates the enhanced ROI tables and populates them with demo data.
 * Run with: node scripts/setup-roi-database.js
 */

const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Database connection string
const DATABASE_URL = process.env.DATABASE_URL || 
  'postgresql://postgresby%20neon_owner:npg_rC8EwcA6IXPj@ep-steep-bar-a1qrxdqr-pooler.ap-southeast-1.aws.neon.tech/postgresby%20neon?sslmode=require&channel_binding=require'

const sql = neon(DATABASE_URL);

async function setupROIDatabase() {
  try {
    console.log('🚀 Starting ROI database setup...\n');

    // Read the SQL schema file
    const schemaPath = path.join(__dirname, '..', 'database-roi-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    console.log('📝 Executing SQL schema...');
    
    // Split the schema into individual statements
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    for (const statement of statements) {
      try {
        await sql.unsafe(statement);
      } catch (error) {
        // Some statements might fail if already exist, that's okay
        if (!error.message.includes('already exists')) {
          console.warn(`⚠️  Warning: ${error.message}`);
        }
      }
    }

    console.log('✅ Database schema created successfully!\n');

    // Verify the tables were created
    console.log('🔍 Verifying tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'roi_%'
      ORDER BY table_name
    `;

    console.log(`✅ Found ${tables.length} ROI tables:`);
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });

    // Check if data already exists
    const existingData = await sql`
      SELECT COUNT(*) as count FROM roi_section
    `;

    const count = parseInt(existingData[0].count);

    if (count > 0) {
      console.log(`\n📊 Database already contains ${count} ROI section(s)`);
      console.log('   Use --force flag to recreate data');
      return;
    }

    console.log('\n📊 Database is empty, inserting demo data...');

    // Get the card count
    const cards = await sql`
      SELECT COUNT(*) as count FROM roi_cards
    `;
    const cardCount = parseInt(cards[0].count);

    console.log(`\n✅ Setup complete!`);
    console.log(`   - ROI Sections: ${count}`);
    console.log(`   - ROI Cards: ${cardCount}`);
    console.log('\n🎉 Your ROI section is ready to use!');
    console.log('   Visit: http://localhost:3000/hasnaat/roi-section to manage it\n');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    console.error('Error details:', error.message);
    process.exit(1);
  }
}

// Run the setup
setupROIDatabase();

