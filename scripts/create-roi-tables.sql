-- Execute this SQL script directly in your Neon database console
-- Copy and paste this entire file into the SQL editor

-- Drop existing tables if they exist
DROP TABLE IF EXISTS roi_metrics CASCADE;
DROP TABLE IF EXISTS roi_cards CASCADE;
DROP TABLE IF EXISTS roi_case_studies CASCADE;
DROP TABLE IF EXISTS roi_industry_benchmarks CASCADE;
DROP TABLE IF EXISTS roi_section CASCADE;

-- Main ROI Section Table
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
);

-- ROI Cards Table with Enhanced Metrics
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
);

-- AI-Based ROI Metrics Table
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
);

-- Case Studies Table
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
);

-- Industry Benchmarks Table
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
);

-- Create indexes
CREATE INDEX idx_roi_cards_section ON roi_cards(roi_section_id);
CREATE INDEX idx_roi_cards_category ON roi_cards(category);
CREATE INDEX idx_roi_cards_featured ON roi_cards(is_featured);
CREATE INDEX idx_roi_metrics_card ON roi_metrics(roi_card_id);
CREATE INDEX idx_roi_case_studies_section ON roi_case_studies(roi_section_id);
CREATE INDEX idx_roi_case_studies_published ON roi_case_studies(is_published);
CREATE INDEX idx_roi_benchmarks_industry ON roi_industry_benchmarks(industry_name);
CREATE INDEX idx_roi_benchmarks_metric ON roi_industry_benchmarks(metric_name);

-- Insert demo data
INSERT INTO roi_section (main_heading, sub_heading, video_url, image_one, image_two, is_published) 
VALUES (
  'Maximize Your ROI with AI-Powered Solutions',
  'See how our cutting-edge AI technologies deliver measurable results for your business',
  'https://res.cloudinary.com/demo/video/upload/v1/roi-demo.mp4',
  'https://res.cloudinary.com/demo/image/upload/v1/roi-dashboard-1.jpg',
  'https://res.cloudinary.com/demo/image/upload/v1/roi-dashboard-2.jpg',
  TRUE
);

-- Insert demo ROI cards
INSERT INTO roi_cards (roi_section_id, title, value, description, category, metric_type, trend, trend_percentage, time_period, icon_url)
VALUES 
  (1, 'Increased Conversion Rate', '+45%', 'Our AI-driven optimization strategies have helped clients achieve significant improvements in conversion rates.', 'conversion', 'percentage', 'up', 45.00, 'Last 6 months', 'https://api.iconify.design/mdi/chart-line-variant.svg'),
  (1, 'Revenue Growth', '+$2.4M', 'Average revenue increase across all AI implementation projects in the past year.', 'revenue', 'currency', 'up', 180.00, 'Past year', 'https://api.iconify.design/mdi/currency-usd.svg'),
  (1, 'Time Saved with Automation', '1,200 hrs', 'Total hours saved per month through our intelligent automation solutions.', 'efficiency', 'time', 'up', 320.00, 'Per month', 'https://api.iconify.design/mdi/clock-fast.svg'),
  (1, 'Customer Satisfaction', '94%', 'Client satisfaction rate with our AI-powered customer service implementations.', 'engagement', 'percentage', 'up', 12.00, 'Current quarter', 'https://api.iconify.design/mdi/emoticon-happy.svg'),
  (1, 'Lead Generation Improvement', '+280%', 'Increase in qualified leads through AI-optimized marketing campaigns.', 'conversion', 'percentage', 'up', 280.00, 'Last 90 days', 'https://api.iconify.design/mdi/target-account.svg'),
  (1, 'Cost Reduction', '-38%', 'Average operational cost reduction through process automation and optimization.', 'efficiency', 'percentage', 'down', 38.00, 'Annual average', 'https://api.iconify.design/mdi/cash-minus.svg');

-- Insert demo AI metrics
INSERT INTO roi_metrics (roi_card_id, metric_name, metric_value, metric_unit, baseline_value, target_value, achievement_rate, confidence_score, data_source, is_ai_generated, ai_insight)
VALUES 
  (1, 'Average Order Value', 165.50, '$', 125.00, 180.00, 73.64, 92.5, 'E-commerce Analytics Platform', TRUE, 'AI analysis shows that personalized product recommendations are driving 45% of the AOV increase.'),
  (1, 'Cart Abandonment Rate', 28.5, '%', 42.0, 25.0, 79.41, 88.3, 'Shopping Cart Analytics', TRUE, 'Machine learning-powered email recovery sequences have reduced abandonment by 32%.'),
  (1, 'Page Load Speed', 1.2, 'seconds', 3.5, 1.0, 120.00, 95.7, 'Performance Monitoring Tool', TRUE, 'AI-optimized image delivery and caching strategies improved load times by 66%.');

-- Insert industry benchmarks
INSERT INTO roi_industry_benchmarks (industry_name, metric_name, benchmark_value, metric_unit, year, quarter, percentile_50, percentile_75, percentile_90, source)
VALUES 
  ('E-commerce', 'Conversion Rate', 2.5, '%', 2024, 'Q4', 2.5, 3.8, 5.2, 'Industry Research Report 2024'),
  ('E-commerce', 'Average Order Value', 125.00, '$', 2024, 'Q4', 125.00, 165.00, 210.00, 'E-commerce Analytics Study'),
  ('SaaS', 'Customer Acquisition Cost', 450.00, '$', 2024, 'Q4', 450.00, 650.00, 850.00, 'SaaS Metrics Report'),
  ('SaaS', 'Churn Rate', 5.2, '%', 2024, 'Q4', 5.2, 3.8, 2.5, 'SaaS Retention Study'),
  ('Digital Marketing', 'Cost Per Lead', 85.00, '$', 2024, 'Q4', 85.00, 65.00, 45.00, 'Marketing ROI Analysis'),
  ('Automation', 'Time Savings', 35.0, '%', 2024, 'Q4', 35.0, 52.0, 68.0, 'Automation Impact Study');

-- Insert demo case study
INSERT INTO roi_case_studies (
  roi_section_id, 
  client_name, 
  client_industry, 
  project_type, 
  duration_months, 
  initial_investment, 
  roi_percentage, 
  total_return, 
  net_profit,
  key_improvements,
  success_metrics,
  client_testimonial,
  is_featured,
  is_published
)
VALUES (
  1,
  'TechStyle E-commerce',
  'Fashion & Retail',
  'AI-Powered Personalization Engine',
  6,
  75000.00,
  320.00,
  240000.00,
  165000.00,
  '[
    {"area": "Conversion Rate", "improvement": "45%"},
    {"area": "Average Order Value", "improvement": "32%"},
    {"area": "Customer Lifetime Value", "improvement": "67%"}
  ]'::jsonb,
  '{
    "monthly_revenue_increase": 40000,
    "customer_retention_improvement": "28%",
    "cart_abandonment_reduction": "32%"
  }'::jsonb,
  'The AI implementation exceeded our expectations. We saw immediate improvements in conversion rates and the ROI has been outstanding.',
  TRUE,
  TRUE
);

-- Create update trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers
CREATE TRIGGER update_roi_section_updated_at BEFORE UPDATE ON roi_section FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roi_cards_updated_at BEFORE UPDATE ON roi_cards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roi_case_studies_updated_at BEFORE UPDATE ON roi_case_studies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify data
SELECT 'roi_section' as table_name, COUNT(*) as count FROM roi_section
UNION ALL
SELECT 'roi_cards', COUNT(*) FROM roi_cards
UNION ALL
SELECT 'roi_metrics', COUNT(*) FROM roi_metrics
UNION ALL
SELECT 'roi_case_studies', COUNT(*) FROM roi_case_studies
UNION ALL
SELECT 'roi_industry_benchmarks', COUNT(*) FROM roi_industry_benchmarks;

