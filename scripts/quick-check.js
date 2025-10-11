#!/usr/bin/env node

/**
 * Quick ROI Section Health Check
 * Run this to verify everything is working
 */

const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = 'postgresql://postgresby%20neon_owner:npg_rC8EwcA6IXPj@ep-steep-bar-a1qrxdqr-pooler.ap-southeast-1.aws.neon.tech/postgresby%20neon?sslmode=require';

async function quickCheck() {
  const checks = {
    connection: '❌',
    tables: '❌',
    section: '❌',
    cards: '❌',
    published: '❌'
  };

  try {
    const sql = neon(DATABASE_URL, { fetchOptions: { cache: 'no-store' } });

    // Check 1: Connection
    try {
      await sql`SELECT 1`;
      checks.connection = '✅';
    } catch (e) {
      console.error('Connection failed:', e.message);
    }

    // Check 2: Tables
    try {
      const tables = await sql`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name LIKE 'roi_%'
      `;
      if (parseInt(tables[0].count) >= 5) {
        checks.tables = '✅';
      }
    } catch (e) {
      console.error('Tables check failed:', e.message);
    }

    // Check 3: Section exists
    try {
      const sections = await sql`SELECT COUNT(*) as count FROM roi_section`;
      if (parseInt(sections[0].count) > 0) {
        checks.section = '✅';
      }
    } catch (e) {
      console.error('Section check failed:', e.message);
    }

    // Check 4: Cards exist
    try {
      const cards = await sql`SELECT COUNT(*) as count FROM roi_cards`;
      if (parseInt(cards[0].count) > 0) {
        checks.cards = '✅';
      }
    } catch (e) {
      console.error('Cards check failed:', e.message);
    }

    // Check 5: Published
    try {
      const published = await sql`
        SELECT is_published 
        FROM roi_section 
        WHERE is_published = true 
        LIMIT 1
      `;
      if (published.length > 0) {
        checks.published = '✅';
      }
    } catch (e) {
      console.error('Published check failed:', e.message);
    }

    // Display results
    console.log('\n🔍 ROI Section Health Check\n');
    console.log('═'.repeat(40));
    console.log(`${checks.connection} Database Connection`);
    console.log(`${checks.tables} ROI Tables Exist`);
    console.log(`${checks.section} ROI Section Created`);
    console.log(`${checks.cards} ROI Cards Present`);
    console.log(`${checks.published} Section Published`);
    console.log('═'.repeat(40));

    const allGood = Object.values(checks).every(check => check === '✅');
    
    if (allGood) {
      console.log('\n✅ Everything looks good!');
      console.log('\n📋 Summary:');
      const section = await sql`SELECT * FROM roi_section LIMIT 1`;
      const cards = await sql`SELECT COUNT(*) as count FROM roi_cards`;
      console.log(`   Heading: ${section[0].main_heading}`);
      console.log(`   Cards: ${cards[0].count}`);
      console.log(`   Status: Published`);
      console.log('\n🎉 Your ROI section is ready!');
      console.log('   Visit: http://localhost:3000\n');
    } else {
      console.log('\n⚠️  Some checks failed!');
      console.log('\n🔧 To fix:');
      console.log('   1. Run: node scripts/create-all-roi-tables.js');
      console.log('   2. Restart your dev server');
      console.log('   3. Run this check again\n');
    }

  } catch (error) {
    console.error('\n❌ Health check failed:', error.message);
    console.log('\n💡 Try:');
    console.log('   1. Check your internet connection');
    console.log('   2. Verify DATABASE_URL is correct');
    console.log('   3. Run: node scripts/test-roi-connection.js\n');
  }
}

quickCheck();


