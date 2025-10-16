import { neon } from '@neondatabase/serverless'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

// Initialize Neon SQL connection
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://postgresby%20neon_owner:npg_rC8EwcA6IXPj@ep-steep-bar-a1qrxdqr-pooler.ap-southeast-1.aws.neon.tech/postgresby%20neon?sslmode=require&channel_binding=require'
const sql = neon(DATABASE_URL)

export async function addImageColumnToAutomationWorkflows() {
  try {
    console.log('🔌 Connecting to Neon database...')
    
    // Test connection first
    const testResult = await sql`SELECT 1 as test`
    console.log('✅ Database connection successful!', testResult)
    
    console.log('📊 Adding image column to automation_workflows table...')
    
    // Add image column
    await sql`
      ALTER TABLE automation_workflows 
      ADD COLUMN IF NOT EXISTS image_url VARCHAR(500)
    `
    
    console.log('✅ Image column added successfully!')
    
    // Update existing records with placeholder images based on workflow type
    console.log('📝 Updating existing records with placeholder images...')
    
    await sql`
      UPDATE automation_workflows 
      SET image_url = CASE 
        WHEN workflow_type = 'n8n' THEN '/automation/n8n-workflow.png'
        WHEN workflow_type = 'make' THEN '/automation/make-workflow.png'
        WHEN workflow_type = 'zapier' THEN '/automation/zapier-workflow.png'
        WHEN workflow_type = 'custom_ai' THEN '/automation/ai-workflow.png'
        WHEN workflow_type = 'ai_agent' THEN '/automation/ai-agent.png'
        WHEN workflow_type = 'business_automation' THEN '/automation/business-automation.png'
        ELSE '/automation/default-workflow.png'
      END
      WHERE image_url IS NULL
    `
    
    console.log('✅ Existing records updated with placeholder images!')
    
    return { success: true, message: 'Image column added and populated successfully!' }
  } catch (error) {
    console.error('❌ Error adding image column:', error)
    return { success: false, error: error.message }
  }
}

// If this file is run directly
if (require.main === module) {
  addImageColumnToAutomationWorkflows()
    .then(result => {
      console.log(result)
      process.exit(result.success ? 0 : 1)
    })
    .catch(error => {
      console.error('Failed to add image column:', error)
      process.exit(1)
    })
}