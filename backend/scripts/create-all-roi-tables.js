/**
 * Create ALL ROI Tables in Neon Database
 * This script creates all 5 ROI tables with demo data
 */

const { neon } = require('@neondatabase/serverless');

const DATABASE_URL = 'postgresql://postgresby%20neon_owner:npg_rC8EwcA6IXPj@ep-steep-bar-a1qrxdqr-pooler.ap-southeast-1.aws.neon.tech/postgresby%20neon?sslmode=require&channel_binding=require';

const sql = neon(DATABASE_URL);

async function createAllTables() {
  try {
    console.log('🚀 Creating ALL ROI tables...\n');

    // Drop existing tables
    console.log('🗑️  Dropping existing tables (if any)...');
    await sql`DROP TABLE IF EXISTS roi_metrics CASCADE`;
    await sql`DROP TABLE IF EXISTS roi_cards CASCADE`;
    await sql`DROP TABLE IF EXISTS roi_case_studies CASCADE`;
    await sql`DROP TABLE IF EXISTS roi_industry_benchmarks CASCADE`;
    await sql`DROP TABLE IF EXISTS roi_section CASCADE`;
    console.log('✅ Old tables dropped\n');

    // Create roi_section table
    console.log('📝 Creating roi_section table...');
    await sql`
      CREATE TABLE roi_section (
        id SERIAL PRIMARY KEY,
        main_heading VARCHAR(500) NOT NULL,
        sub_heading TEXT,
        video_url TEXT,
        image_one TEXT,
        image_two TEXT,
        image_three TEXT,
        background_pattern VARCHAR(100) DEFAULT 'gradient',
        theme_color VARCHAR(50) DEFAULT 'purple',
        is_published BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ roi_section table created');

    // Create roi_cards table
    console.log('📝 Creating roi_cards table...');
    await sql`
      CREATE TABLE roi_cards (
        id SERIAL PRIMARY KEY,
        roi_section_id INTEGER NOT NULL REFERENCES roi_section(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        value VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        icon_url TEXT,
        metric_type VARCHAR(100) DEFAULT 'percentage',
        trend VARCHAR(50) DEFAULT 'up',
        trend_percentage DECIMAL(10,2),
        previous_value VARCHAR(100),
        time_period VARCHAR(100),
        category VARCHAR(100),
        display_order INTEGER DEFAULT 0,
        is_featured BOOLEAN DEFAULT FALSE,
        background_color VARCHAR(50),
        border_style VARCHAR(50),
        animation_type VARCHAR(50) DEFAULT 'fade',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ roi_cards table created');

    // Create roi_metrics table
    console.log('📝 Creating roi_metrics table...');
    await sql`
      CREATE TABLE roi_metrics (
        id SERIAL PRIMARY KEY,
        roi_card_id INTEGER NOT NULL REFERENCES roi_cards(id) ON DELETE CASCADE,
        metric_name VARCHAR(255) NOT NULL,
        metric_value DECIMAL(20,4) NOT NULL,
        metric_unit VARCHAR(50),
        baseline_value DECIMAL(20,4),
        target_value DECIMAL(20,4),
        achievement_rate DECIMAL(5,2),
        confidence_score DECIMAL(5,2),
        data_source VARCHAR(255),
        calculation_method TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_ai_generated BOOLEAN DEFAULT FALSE,
        ai_insight TEXT,
        predicted_trend VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ roi_metrics table created');

    // Create roi_case_studies table
    console.log('📝 Creating roi_case_studies table...');
    await sql`
      CREATE TABLE roi_case_studies (
        id SERIAL PRIMARY KEY,
        roi_section_id INTEGER NOT NULL REFERENCES roi_section(id) ON DELETE CASCADE,
        client_name VARCHAR(255),
        client_industry VARCHAR(100),
        project_type VARCHAR(100),
        duration_months INTEGER,
        initial_investment DECIMAL(15,2),
        roi_percentage DECIMAL(10,2) NOT NULL,
        total_return DECIMAL(15,2),
        net_profit DECIMAL(15,2),
        key_improvements JSONB,
        success_metrics JSONB,
        client_testimonial TEXT,
        before_metrics JSONB,
        after_metrics JSONB,
        timeline_milestones JSONB,
        technologies_used JSONB,
        challenges_overcome TEXT,
        is_featured BOOLEAN DEFAULT FALSE,
        is_published BOOLEAN DEFAULT FALSE,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ roi_case_studies table created');

    // Create roi_industry_benchmarks table
    console.log('📝 Creating roi_industry_benchmarks table...');
    await sql`
      CREATE TABLE roi_industry_benchmarks (
        id SERIAL PRIMARY KEY,
        industry_name VARCHAR(100) NOT NULL,
        metric_name VARCHAR(255) NOT NULL,
        benchmark_value DECIMAL(20,4) NOT NULL,
        metric_unit VARCHAR(50),
        source VARCHAR(255),
        year INTEGER,
        quarter VARCHAR(10),
        percentile_25 DECIMAL(20,4),
        percentile_50 DECIMAL(20,4),
        percentile_75 DECIMAL(20,4),
        percentile_90 DECIMAL(20,4),
        sample_size INTEGER,
        geographic_region VARCHAR(100),
        company_size_segment VARCHAR(100),
        data_collection_method VARCHAR(255),
        confidence_interval DECIMAL(5,2),
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    console.log('✅ roi_industry_benchmarks table created');

    // Create indexes
    console.log('\n📝 Creating indexes...');
    await sql`CREATE INDEX idx_roi_cards_section ON roi_cards(roi_section_id)`;
    await sql`CREATE INDEX idx_roi_cards_category ON roi_cards(category)`;
    await sql`CREATE INDEX idx_roi_cards_featured ON roi_cards(is_featured)`;
    await sql`CREATE INDEX idx_roi_metrics_card ON roi_metrics(roi_card_id)`;
    await sql`CREATE INDEX idx_roi_case_studies_section ON roi_case_studies(roi_section_id)`;
    await sql`CREATE INDEX idx_roi_case_studies_published ON roi_case_studies(is_published)`;
    await sql`CREATE INDEX idx_roi_benchmarks_industry ON roi_industry_benchmarks(industry_name)`;
    await sql`CREATE INDEX idx_roi_benchmarks_metric ON roi_industry_benchmarks(metric_name)`;
    console.log('✅ Indexes created');

    // Insert demo data
    console.log('\n📝 Inserting demo data...');
    
    // Insert ROI section
    const sectionResult = await sql`
      INSERT INTO roi_section (main_heading, sub_heading, video_url, image_one, image_two, is_published) 
      VALUES (
        'Maximize Your ROI with AI-Powered Solutions',
        'See how our cutting-edge AI technologies deliver measurable results for your business',
        'https://res.cloudinary.com/demo/video/upload/v1/roi-demo.mp4',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        TRUE
      )
      RETURNING id
    `;
    const sectionId = sectionResult[0].id;
    console.log(`✅ ROI section created with ID: ${sectionId}`);

    // Insert ROI cards
    console.log('📝 Inserting ROI cards...');
    const cards = [
      {
        title: 'Increased Conversion Rate',
        value: '+45%',
        description: 'Our AI-driven optimization strategies have helped clients achieve significant improvements in conversion rates.',
        category: 'conversion',
        metric_type: 'percentage',
        trend: 'up',
        trend_percentage: 45.00,
        time_period: 'Last 6 months',
        icon_url: 'https://api.iconify.design/mdi/chart-line-variant.svg'
      },
      {
        title: 'Revenue Growth',
        value: '+$2.4M',
        description: 'Average revenue increase across all AI implementation projects in the past year.',
        category: 'revenue',
        metric_type: 'currency',
        trend: 'up',
        trend_percentage: 180.00,
        time_period: 'Past year',
        icon_url: 'https://api.iconify.design/mdi/currency-usd.svg'
      },
      {
        title: 'Time Saved with Automation',
        value: '1,200 hrs',
        description: 'Total hours saved per month through our intelligent automation solutions.',
        category: 'efficiency',
        metric_type: 'time',
        trend: 'up',
        trend_percentage: 320.00,
        time_period: 'Per month',
        icon_url: 'https://api.iconify.design/mdi/clock-fast.svg'
      },
      {
        title: 'Customer Satisfaction',
        value: '94%',
        description: 'Client satisfaction rate with our AI-powered customer service implementations.',
        category: 'engagement',
        metric_type: 'percentage',
        trend: 'up',
        trend_percentage: 12.00,
        time_period: 'Current quarter',
        icon_url: 'https://api.iconify.design/mdi/emoticon-happy.svg'
      },
      {
        title: 'Lead Generation Improvement',
        value: '+280%',
        description: 'Increase in qualified leads through AI-optimized marketing campaigns.',
        category: 'conversion',
        metric_type: 'percentage',
        trend: 'up',
        trend_percentage: 280.00,
        time_period: 'Last 90 days',
        icon_url: 'https://api.iconify.design/mdi/target-account.svg'
      },
      {
        title: 'Cost Reduction',
        value: '-38%',
        description: 'Average operational cost reduction through process automation and optimization.',
        category: 'efficiency',
        metric_type: 'percentage',
        trend: 'down',
        trend_percentage: 38.00,
        time_period: 'Annual average',
        icon_url: 'https://api.iconify.design/mdi/cash-minus.svg'
      }
    ];

    for (const card of cards) {
      await sql`
        INSERT INTO roi_cards (
          roi_section_id, title, value, description, category, metric_type, 
          trend, trend_percentage, time_period, icon_url
        )
        VALUES (
          ${sectionId}, ${card.title}, ${card.value}, ${card.description},
          ${card.category}, ${card.metric_type}, ${card.trend}, 
          ${card.trend_percentage}, ${card.time_period}, ${card.icon_url}
        )
      `;
    }
    console.log(`✅ Inserted ${cards.length} ROI cards`);

    // Verify all tables
    console.log('\n🔍 Verifying tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name LIKE 'roi_%'
      ORDER BY table_name
    `;

    console.log(`\n✅ Found ${tables.length} ROI tables:`);
    tables.forEach(table => {
      console.log(`   - ${table.table_name}`);
    });

    // Count records
    const sectionCount = await sql`SELECT COUNT(*) as count FROM roi_section`;
    const cardCount = await sql`SELECT COUNT(*) as count FROM roi_cards`;
    
    console.log('\n📊 Data Summary:');
    console.log(`   - ROI Sections: ${sectionCount[0].count}`);
    console.log(`   - ROI Cards: ${cardCount[0].count}`);
    
    console.log('\n🎉 SUCCESS! All ROI tables created with demo data!');
    console.log('\n✅ Next steps:');
    console.log('   1. Visit: http://localhost:3000 (see ROI section on homepage)');
    console.log('   2. Admin: http://localhost:3000/hasnaat/login');
    console.log('   3. Default password: "password" (change in production!)');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('Details:', error.message);
    process.exit(1);
  }
}

createAllTables();


