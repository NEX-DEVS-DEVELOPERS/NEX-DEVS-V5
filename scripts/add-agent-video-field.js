const { neon } = require('@neondatabase/serverless');

// Initialize Neon SQL connection
const sql = neon(process.env.DATABASE_URL);

async function addAgentVideoField() {
  try {
    console.log('Adding agent_video_url field to automation_workflows table...');
    
    // Add the new column
    await sql`
      ALTER TABLE automation_workflows 
      ADD COLUMN IF NOT EXISTS agent_video_url TEXT
    `;
    
    console.log('✅ Successfully added agent_video_url field to automation_workflows table');
    
    // Verify the column was added
    const result = await sql`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'automation_workflows' 
      AND column_name = 'agent_video_url'
    `;
    
    if (result.length > 0) {
      console.log('✅ Column verification successful:', result[0]);
    } else {
      console.log('❌ Column verification failed');
    }
    
  } catch (error) {
    console.error('❌ Error adding agent_video_url field:', error);
    process.exit(1);
  }
}

// Run the migration
addAgentVideoField()
  .then(() => {
    console.log('🎉 Migration completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    process.exit(1);
  });