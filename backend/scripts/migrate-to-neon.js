// Script to migrate data from Railway MySQL to Neon PostgreSQL
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// MySQL connection configuration
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'metro.proxy.rlwy.net',
  port: parseInt(process.env.MYSQL_PORT || '28228', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'ippEdXwIlTCRKIYuCzsvnVqeJjmxufIc',
  database: process.env.MYSQL_DATABASE || 'railway',
  ssl: {
    rejectUnauthorized: false
  }
};

// Neon connection - use connection string directly
const NEON_CONNECTION_STRING = 'postgresql://NEX-DEVS%20DATABSE_owner:npg_Av9imV5KFXhy@ep-nameless-frog-a1x6ujuj-pooler.ap-southeast-1.aws.neon.tech/NEX-DEVS%20DATABSE?sslmode=require';
const neonSql = neon(NEON_CONNECTION_STRING);

// Create a backup directory to store JSON backups
const BACKUP_DIR = path.join(process.cwd(), 'backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function createNeonTables() {
  console.log('Creating projects table in Neon PostgreSQL if it doesn\'t exist...');
  
  // Create projects table in PostgreSQL with a schema similar to MySQL
  await neonSql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      detailed_description TEXT,
      image_url TEXT NOT NULL,
      second_image TEXT,
      show_both_images_in_priority BOOLEAN DEFAULT FALSE,
      category VARCHAR(255) NOT NULL,
      technologies JSONB NOT NULL,
      tech_details JSONB,
      project_link TEXT NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      completion_date VARCHAR(255),
      client_name VARCHAR(255),
      duration VARCHAR(255),
      status VARCHAR(100),
      updated_days INTEGER,
      progress INTEGER,
      development_progress INTEGER,
      estimated_completion VARCHAR(255),
      features JSONB,
      exclusive_features JSONB,
      image_priority INTEGER DEFAULT 5,
      visual_effects JSONB,
      is_code_screenshot BOOLEAN DEFAULT FALSE,
      code_language VARCHAR(255),
      code_title VARCHAR(255),
      code_content TEXT,
      use_direct_code_input BOOLEAN DEFAULT FALSE,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('Projects table created/verified in Neon PostgreSQL.');
}

async function migrateProjects() {
  console.log('Starting migration from MySQL to Neon PostgreSQL...');
  
  try {
    // Connect to MySQL
    console.log('Connecting to MySQL database...');
    const mysqlConnection = await mysql.createConnection(mysqlConfig);
    console.log('Successfully connected to MySQL database.');
    
    // Get all projects from MySQL
    console.log('Fetching projects from MySQL...');
    const [projects] = await mysqlConnection.execute('SELECT * FROM projects');
    console.log(`Retrieved ${projects.length} projects from MySQL.`);
    
    // Create backup of the data
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(BACKUP_DIR, `mysql-export-${timestamp}.json`);
    fs.writeFileSync(backupFilePath, JSON.stringify(projects, null, 2));
    console.log(`Backup saved to ${backupFilePath}`);
    
    // Check if Neon tables exist, create if not
    await createNeonTables();
    
    // Clear existing data in Neon if requested
    const shouldClearExisting = process.argv.includes('--clear');
    if (shouldClearExisting) {
      console.log('Clearing existing projects from Neon PostgreSQL...');
      await neonSql`TRUNCATE TABLE projects RESTART IDENTITY`;
      console.log('Existing projects cleared from Neon PostgreSQL.');
    }
    
    // Insert each project into Neon
    console.log('Inserting projects into Neon PostgreSQL...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const project of projects) {
      try {
        // Convert array fields from MySQL string format to proper JSON objects for PostgreSQL
        const processedProject = {
          ...project,
          // Parse JSON strings into objects for PostgreSQL JSONB columns
          technologies: parseJsonField(project.technologies),
          tech_details: parseJsonField(project.tech_details),
          features: parseJsonField(project.features),
          exclusive_features: parseJsonField(project.exclusive_features),
          visual_effects: parseJsonField(project.visual_effects)
        };
        
        // Skip ID if we're not clearing the existing data
        if (!shouldClearExisting) {
          delete processedProject.id;
        }
        
        // Insert into PostgreSQL
        const result = await neonSql`
          INSERT INTO projects ${neonSql(processedProject)}
          RETURNING id
        `;
        
        console.log(`✅ Migrated project "${project.title}" with new ID: ${result[0].id}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to migrate project "${project.title}":`, error);
        errorCount++;
      }
    }
    
    console.log(`Migration complete. ${successCount} projects migrated successfully, ${errorCount} failed.`);
    
    // Close MySQL connection
    await mysqlConnection.end();
    console.log('MySQL connection closed.');
    
    return { success: successCount, errors: errorCount };
  } catch (error) {
    console.error('Migration failed:', error);
    return { success: 0, errors: 1, error: error.message };
  }
}

// Helper function to parse JSON strings into objects
function parseJsonField(field) {
  if (!field) return null;
  
  if (typeof field === 'string') {
    try {
      return JSON.parse(field);
    } catch (e) {
      // If not valid JSON, return as array with single string item
      return [field];
    }
  }
  
  return field;
}

// Run the migration
migrateProjects().then(result => {
  console.log('Migration stats:', result);
  process.exit(result.errors ? 1 : 0);
}).catch(error => {
  console.error('Unhandled error during migration:', error);
  process.exit(1);
}); 