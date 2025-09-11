import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Initialize Neon SQL connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgresby%20neon_owner:npg_rC8EwcA6IXPj@ep-steep-bar-a1qrxdqr-pooler.ap-southeast-1.aws.neon.tech/postgresby%20neon?sslmode=require&channel_binding=require'
const sql = neon(DATABASE_URL)

export async function createAutomationWorkflowsTable() {
  try {
    console.log('🔌 Connecting to Neon database...')
    console.log('📍 Database URL:', DATABASE_URL.substring(0, 50) + '...')
    
    // Test connection first
    const testResult = await sql`SELECT 1 as test`
    console.log('✅ Database connection successful!', testResult)
    
    console.log('📊 Creating automation_workflows table...')
    
    await sql`
      CREATE TABLE IF NOT EXISTS automation_workflows (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        workflow_type VARCHAR(100) NOT NULL, -- 'n8n', 'make', 'zapier', 'custom_ai', 'ai_agent', 'business_automation'
        automation_tools JSONB, -- JSON array of tools used ['n8n', 'OpenAI', 'Webhooks', etc.]
        workflow_diagram_url VARCHAR(500), -- URL to workflow diagram/flowchart image
        demo_video_url VARCHAR(500), -- URL to demo video
        live_demo_url VARCHAR(500), -- URL to live demo if available
        github_workflow_url VARCHAR(500), -- URL to workflow repository/code
        complexity_level VARCHAR(50) DEFAULT 'intermediate', -- 'beginner', 'intermediate', 'advanced', 'expert'
        estimated_setup_time VARCHAR(100), -- e.g., '2-3 hours', '1 day', '1 week'
        business_impact TEXT, -- Description of business impact/ROI
        use_cases JSONB, -- JSON array of use cases
        workflow_steps JSONB, -- JSON array of detailed workflow steps
        input_requirements TEXT, -- What inputs are needed
        output_results TEXT, -- What outputs are generated
        integrations_used JSONB, -- JSON array of integrations/APIs used
        ai_components JSONB, -- JSON array of AI components (GPT-4, Claude, Custom models, etc.)
        automation_triggers JSONB, -- JSON array of trigger types (webhook, schedule, email, etc.)
        cost_efficiency VARCHAR(200), -- Cost savings/efficiency gains
        featured BOOLEAN DEFAULT false,
        status VARCHAR(50) DEFAULT 'active', -- 'active', 'maintenance', 'deprecated'
        industry_tags JSONB, -- JSON array of industry applications
        difficulty_rating INTEGER DEFAULT 3 CHECK (difficulty_rating >= 1 AND difficulty_rating <= 5),
        success_rate_percentage INTEGER DEFAULT 95 CHECK (success_rate_percentage >= 0 AND success_rate_percentage <= 100),
        monthly_executions INTEGER DEFAULT 0, -- Average monthly workflow executions
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        -- Workflow Specific Fields
        workflow_json TEXT, -- Complete workflow configuration in JSON format
        n8n_workflow_id VARCHAR(100), -- n8n workflow ID if applicable
        make_scenario_id VARCHAR(100), -- Make.com scenario ID if applicable
        zapier_zap_id VARCHAR(100), -- Zapier zap ID if applicable
        
        -- AI Agent Specific Fields
        agent_personality TEXT, -- AI agent personality/role description
        agent_capabilities JSONB, -- JSON array of agent capabilities
        agent_model VARCHAR(100), -- AI model used (GPT-4, Claude-3, custom, etc.)
        agent_response_time VARCHAR(50), -- Average response time
        agent_accuracy_rate INTEGER DEFAULT 90 CHECK (agent_accuracy_rate >= 0 AND agent_accuracy_rate <= 100),
        
        -- Performance Metrics
        average_execution_time VARCHAR(50), -- Average workflow execution time
        error_rate_percentage DECIMAL(5,2) DEFAULT 2.0 CHECK (error_rate_percentage >= 0 AND error_rate_percentage <= 100),
        uptime_percentage DECIMAL(5,2) DEFAULT 99.5 CHECK (uptime_percentage >= 0 AND uptime_percentage <= 100),
        
        -- Documentation
        setup_instructions TEXT, -- Step-by-step setup instructions
        troubleshooting_guide TEXT, -- Common issues and solutions
        prerequisites TEXT, -- Required knowledge/tools before setup
        
        -- Showcase Fields
        showcase_order INTEGER DEFAULT 0, -- Order in showcase display
        badge_text VARCHAR(100), -- Custom badge text (e.g., "Most Popular", "Enterprise Ready")
        highlight_color VARCHAR(7) DEFAULT '#8B5CF6' -- Hex color for highlights
      )
    `

    // Create indexes for better query performance
    await sql`CREATE INDEX IF NOT EXISTS idx_automation_workflows_type ON automation_workflows(workflow_type)`
    await sql`CREATE INDEX IF NOT EXISTS idx_automation_workflows_featured ON automation_workflows(featured)`
    await sql`CREATE INDEX IF NOT EXISTS idx_automation_workflows_status ON automation_workflows(status)`
    await sql`CREATE INDEX IF NOT EXISTS idx_automation_workflows_showcase_order ON automation_workflows(showcase_order)`
    await sql`CREATE INDEX IF NOT EXISTS idx_automation_workflows_difficulty ON automation_workflows(difficulty_rating)`
    await sql`CREATE INDEX IF NOT EXISTS idx_automation_workflows_created_at ON automation_workflows(created_at)`

    console.log('✅ automation_workflows table created successfully!')

    // Insert sample data
    console.log('Inserting sample automation workflows...')
    
    await sql`
      INSERT INTO automation_workflows (
        title, description, workflow_type, automation_tools, workflow_diagram_url, 
        complexity_level, estimated_setup_time, business_impact, use_cases, workflow_steps,
        featured, industry_tags, difficulty_rating, success_rate_percentage, monthly_executions,
        showcase_order, badge_text, highlight_color
      ) VALUES 
      (
        'AI-Powered Lead Qualification System',
        'Automated lead scoring and qualification using AI analysis of prospect data, email interactions, and behavioral patterns through n8n workflows.',
        'n8n',
        '["n8n", "OpenAI GPT-4", "HubSpot API", "Gmail API", "Slack API", "Google Sheets"]',
        '/automation/n8n-lead-qualification-diagram.png',
        'intermediate',
        '4-6 hours',
        'Reduces manual lead qualification time by 85%, increases conversion rates by 40%',
        '["Lead Scoring", "CRM Automation", "Email Analysis", "Sales Pipeline Management"]',
        '["Webhook receives lead data", "AI analyzes prospect information", "Scores lead based on criteria", "Updates CRM automatically", "Sends notifications to sales team"]',
        true,
        '["Sales", "Marketing", "B2B", "SaaS"]',
        3,
        92,
        1200,
        1,
        'Most Popular',
        '#10B981'
      ),
      (
        'Customer Support AI Agent',
        'Intelligent customer support agent that handles common queries, escalates complex issues, and maintains conversation context using advanced NLP.',
        'custom_ai',
        '["OpenAI GPT-4", "Pinecone Vector DB", "FastAPI", "WebSocket", "Twilio API"]',
        '/automation/ai-support-agent-flow.png',
        'advanced',
        '1-2 weeks',
        'Handles 70% of support tickets automatically, reduces response time from hours to seconds',
        '["Customer Support", "FAQ Automation", "Ticket Classification", "Multilingual Support"]',
        '["Customer message received", "Intent classification", "Context retrieval", "AI response generation", "Escalation if needed"]',
        true,
        '["E-commerce", "SaaS", "Customer Service", "Retail"]',
        4,
        88,
        3500,
        2,
        'Enterprise Ready',
        '#8B5CF6'
      ),
      (
        'Multi-Platform Content Automation',
        'Automated content creation, scheduling, and cross-platform posting using Make.com workflows with AI-generated copy and visuals.',
        'make',
        '["Make.com", "OpenAI DALL-E", "ChatGPT", "Buffer API", "Canva API", "Google Drive"]',
        '/automation/make-content-automation.png',
        'beginner',
        '2-3 hours',
        'Saves 15 hours per week on content creation, increases social media engagement by 60%',
        '["Social Media Management", "Content Creation", "Brand Consistency", "Multi-Platform Posting"]',
        '["Content brief input", "AI generates copy variations", "Creates visual assets", "Schedules across platforms", "Tracks performance"]',
        true,
        '["Marketing", "Social Media", "Content Creation", "Small Business"]',
        2,
        95,
        800,
        3,
        'Beginner Friendly',
        '#F59E0B'
      ),
      (
        'Invoice Processing & Payment Automation',
        'End-to-end invoice processing system using OCR, AI validation, and automated payment workflows through Zapier integration.',
        'zapier',
        '["Zapier", "OCR API", "QuickBooks", "Stripe", "Gmail", "Google Drive", "Slack"]',
        '/automation/zapier-invoice-automation.png',
        'intermediate',
        '3-4 hours',
        'Reduces invoice processing time by 90%, eliminates manual data entry errors',
        '["Invoice Processing", "Payment Automation", "Expense Management", "Financial Workflows"]',
        '["Invoice received via email", "OCR extracts data", "AI validates information", "Creates entry in accounting", "Processes payment", "Sends confirmation"]',
        false,
        '["Finance", "Accounting", "Small Business", "Freelancing"]',
        3,
        94,
        600,
        4,
        'Time Saver',
        '#EC4899'
      ),
      (
        'Smart E-commerce Inventory Management',
        'AI-driven inventory optimization that predicts demand, automates reordering, and manages supplier communications.',
        'n8n',
        '["n8n", "Machine Learning API", "Shopify API", "Supplier APIs", "Email", "SMS Gateway"]',
        '/automation/inventory-management-ai.png',
        'advanced',
        '1 week',
        'Reduces inventory costs by 25%, prevents stockouts by 95%',
        '["Inventory Optimization", "Demand Forecasting", "Supplier Management", "Cost Reduction"]',
        '["Analyze sales patterns", "Predict future demand", "Check current inventory", "Generate purchase orders", "Send to suppliers", "Track deliveries"]',
        false,
        '["E-commerce", "Retail", "Supply Chain", "Inventory Management"]',
        4,
        91,
        450,
        5,
        'AI Powered',
        '#06B6D4'
      )
    `

    console.log('✅ Sample automation workflows inserted successfully!')
    
    return { success: true, message: 'Automation workflows table created and populated successfully!' }
  } catch (error) {
    console.error('❌ Error creating automation_workflows table:', error)
    return { success: false, error: error.message }
  }
}

// If this file is run directly
if (require.main === module) {
  createAutomationWorkflowsTable()
    .then(result => {
      console.log(result)
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('Failed to create table:', error)
      process.exit(1)
    })
}