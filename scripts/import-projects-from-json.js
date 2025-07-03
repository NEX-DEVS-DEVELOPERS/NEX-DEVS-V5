// Script to import projects from JSON file to Neon PostgreSQL database
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Neon connection - use connection string directly
const NEON_CONNECTION_STRING = 'postgresql://NEX-DEVS%20DATABSE_owner:npg_Av9imV5KFXhy@ep-nameless-frog-a1x6ujuj-pooler.ap-southeast-1.aws.neon.tech/NEX-DEVS%20DATABSE?sslmode=require';
const neonSql = neon(NEON_CONNECTION_STRING);

// Path to the projects.json file
const PROJECTS_JSON_PATH = path.join(process.cwd(), 'app', 'db', 'projects.json');

// Create a backup directory to store JSON backups
const BACKUP_DIR = path.join(process.cwd(), 'backups');
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function createNeonTables() {
  console.log('Creating projects table in Neon PostgreSQL if it doesn\'t exist...');
  
  // Create projects table in PostgreSQL
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

// Helper function to parse JSON fields
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
  
  return JSON.stringify(field); // Ensure it's a JSON string for PostgreSQL JSONB
}

async function importProjectsFromJson() {
  console.log('Starting import of projects from JSON to Neon PostgreSQL...');
  
  try {
    // Read projects from JSON file
    console.log(`Reading projects from ${PROJECTS_JSON_PATH}...`);
    const projectsData = fs.readFileSync(PROJECTS_JSON_PATH, 'utf8');
    const projects = JSON.parse(projectsData);
    console.log(`Found ${projects.length} projects in JSON file.`);
    
    // Create backup of the original JSON data
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFilePath = path.join(BACKUP_DIR, `projects-json-backup-${timestamp}.json`);
    fs.writeFileSync(backupFilePath, projectsData);
    console.log(`Backup saved to ${backupFilePath}`);
    
    // Create tables if they don't exist
    await createNeonTables();
    
    // Clear existing data in Neon
    const shouldClearExisting = process.argv.includes('--clear') || true; // Default to clearing
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
        // Map the project fields to PostgreSQL compatible format
        const processedProject = {
          title: project.title,
          description: project.description,
          detailed_description: project.detailedDescription,
          image_url: project.image, // Use the image path as is
          second_image: project.secondImage,
          show_both_images_in_priority: Boolean(project.showBothImagesInPriority),
          category: project.category,
          technologies: parseJsonField(project.technologies),
          tech_details: parseJsonField(project.techDetails),
          project_link: project.link,
          featured: Boolean(project.featured),
          completion_date: project.completionDate,
          client_name: project.clientName,
          duration: project.duration,
          status: project.status,
          updated_days: project.updatedDays,
          progress: project.progress,
          development_progress: project.developmentProgress,
          estimated_completion: project.estimatedCompletion,
          features: parseJsonField(project.features),
          exclusive_features: parseJsonField(project.exclusiveFeatures),
          image_priority: project.imagePriority || 5,
          visual_effects: parseJsonField(project.visualEffects),
          is_code_screenshot: Boolean(project.isCodeScreenshot),
          code_language: project.codeLanguage,
          code_title: project.codeTitle,
          code_content: project.codeContent,
          use_direct_code_input: Boolean(project.useDirectCodeInput),
          last_updated: new Date().toISOString(),
          created_at: new Date().toISOString()
        };
        
        // Build SQL query
        const fields = Object.keys(processedProject).filter(key => processedProject[key] !== undefined);
        const placeholders = fields.map((_, i) => `$${i + 1}`).join(', ');
        const values = fields.map(field => processedProject[field]);
        const fieldsClause = fields.join(', ');
        
        // Insert using query method
        const query = `
          INSERT INTO projects (${fieldsClause})
          VALUES (${placeholders})
          RETURNING id
        `;
        
        const result = await neonSql.query(query, values);
        const newId = result[0]?.id;
        
        console.log(`✅ Imported project "${project.title}" with new ID: ${newId}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to import project "${project.title}":`, error);
        errorCount++;
      }
    }
    
    console.log(`Import complete. ${successCount} projects imported successfully, ${errorCount} failed.`);
    
    // Query to verify the data
    console.log('Verifying data in Neon PostgreSQL...');
    const importedProjects = await neonSql`SELECT id, title, featured FROM projects ORDER BY id`;
    console.log('Projects now in database:', importedProjects);
    
    return { success: successCount, errors: errorCount, total: projects.length };
  } catch (error) {
    console.error('Import failed:', error);
    return { success: 0, errors: 1, error: error.message };
  }
}

// Run the import
importProjectsFromJson().then(result => {
  console.log('Import stats:', result);
  process.exit(result.errors === result.total ? 1 : 0);
}).catch(error => {
  console.error('Unhandled error during import:', error);
  process.exit(1);
}); 