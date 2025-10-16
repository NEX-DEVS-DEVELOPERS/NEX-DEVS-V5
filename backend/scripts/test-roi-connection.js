/**
 * Test ROI Database Connection and Data
 */

const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = 'postgresql://postgresby%20neon_owner:npg_rC8EwcA6IXPj@ep-steep-bar-a1qrxdqr-pooler.ap-southeast-1.aws.neon.tech/postgresby%20neon?sslmode=require';

const sql = neon(DATABASE_URL, {
  fetchOptions: {
    cache: 'no-store',
  }
});

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...\n');

    // Test basic connection
    console.log('1️⃣ Testing basic query...');
    const test = await sql`SELECT NOW() as current_time`;
    console.log('✅ Connection successful!');
    console.log('   Current time:', test[0].current_time);

    // Check if tables exist
    console.log('\n2️⃣ Checking ROI tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'roi_%'
      ORDER BY table_name
    `;
    
    if (tables.length === 0) {
      console.log('❌ No ROI tables found!');
      console.log('   Run: node scripts/create-all-roi-tables.js');
      return;
    }

    console.log(`✅ Found ${tables.length} ROI tables:`);
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });

    // Check ROI section data
    console.log('\n3️⃣ Checking ROI section data...');
    const sections = await sql`SELECT * FROM roi_section`;
    console.log(`✅ Found ${sections.length} ROI section(s)`);
    
    if (sections.length > 0) {
      const section = sections[0];
      console.log('\n📋 Section Details:');
      console.log(`   ID: ${section.id}`);
      console.log(`   Heading: ${section.main_heading}`);
      console.log(`   Published: ${section.is_published ? '✅ YES' : '❌ NO'}`);
      console.log(`   Created: ${section.created_at}`);

      // Check cards
      console.log('\n4️⃣ Checking ROI cards...');
      const cards = await sql`
        SELECT * FROM roi_cards 
        WHERE roi_section_id = ${section.id}
        ORDER BY id
      `;
      console.log(`✅ Found ${cards.length} ROI card(s)`);
      
      if (cards.length > 0) {
        console.log('\n📊 Card Details:');
        cards.forEach((card, index) => {
          console.log(`   ${index + 1}. ${card.title} - ${card.value}`);
          console.log(`      Category: ${card.category || 'N/A'}`);
          console.log(`      Trend: ${card.trend || 'N/A'}`);
        });
      }

      // If not published, publish it
      if (!section.is_published) {
        console.log('\n⚠️  ROI section is NOT published!');
        console.log('📝 Publishing section...');
        await sql`
          UPDATE roi_section 
          SET is_published = true 
          WHERE id = ${section.id}
        `;
        console.log('✅ Section published successfully!');
      }

      console.log('\n🎉 Everything looks good!');
      console.log('\n✅ Next steps:');
      console.log('   1. Restart your dev server');
      console.log('   2. Visit: http://localhost:3000');
      console.log('   3. Scroll to ROI section');
      console.log('');

    } else {
      console.log('\n❌ No ROI sections found in database!');
      console.log('   Run: node scripts/create-all-roi-tables.js');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nDetails:', error);
    
    if (error.message.includes('timeout')) {
      console.log('\n💡 Connection timeout. Possible solutions:');
      console.log('   1. Check your internet connection');
      console.log('   2. Try again in a few moments');
      console.log('   3. Check if Neon database is accessible');
    }
  }
}

testConnection();


