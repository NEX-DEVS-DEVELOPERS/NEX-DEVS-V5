const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

// Configuration
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'metro.proxy.rlwy.net',
  port: parseInt(process.env.MYSQL_PORT || '28228', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'ippEdXwIlTCRKIYuCzsvnVqeJjmxufIc',
  database: process.env.MYSQL_DATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

const jsonFilePath = path.join(process.cwd(), 'app', 'db', 'projects.json');

async function migrateJsonToMysql() {
  console.log('Starting migration from JSON to MySQL...');

  // Check if JSON file exists
  if (!fs.existsSync(jsonFilePath)) {
    console.error(`JSON file not found at ${jsonFilePath}`);
    process.exit(1);
  }

  // Read JSON data
  try {
    const jsonData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf8'));
    console.log(`Found ${jsonData.length} projects in JSON file`);

    if (jsonData.length === 0) {
      console.log('No projects to migrate. Exiting.');
      process.exit(0);
    }

    // Create MySQL connection
    const connection = await mysql.createConnection(mysqlConfig);
    console.log('Connected to MySQL database');
    
    // Create table if it doesn't exist
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        detailed_description TEXT,
        image_url TEXT NOT NULL,
        second_image TEXT,
        show_both_images_in_priority BOOLEAN DEFAULT FALSE,
        category VARCHAR(255) NOT NULL,
        technologies TEXT NOT NULL,
        tech_details TEXT,
        project_link TEXT NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        completion_date VARCHAR(255),
        client_name VARCHAR(255),
        duration VARCHAR(255),
        status VARCHAR(100),
        updated_days INT,
        progress INT,
        development_progress INT,
        estimated_completion VARCHAR(255),
        features TEXT,
        exclusive_features TEXT,
        image_priority INT DEFAULT 5,
        visual_effects TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Check if there are existing records
    const [rows] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    const count = rows[0].count;
    
    if (count > 0) {
      console.log(`Found ${count} existing projects in MySQL`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });

      const answer = await new Promise(resolve => {
        readline.question('Do you want to clear existing data before importing? (y/n): ', resolve);
      });
      readline.close();

      if (answer.toLowerCase() === 'y') {
        await connection.execute('TRUNCATE TABLE projects');
        console.log('Existing data cleared');
      } else {
        console.log('Keeping existing data');
      }
    }

    // Insert projects
    let successCount = 0;
    let errorCount = 0;

    for (let project of jsonData) {
      try {
        // Map JSON fields to database fields
        const title = project.title || '';
        const description = project.description || '';
        const detailedDescription = project.detailedDescription || null;
        
        // Image handling
        const imageUrl = project.image || '';
        const secondImage = project.secondImage || null;
        const showBothImagesInPriority = project.showBothImagesInPriority ? 1 : 0;
        
        // Category and tech
        const category = project.category || '';
        
        // Process technologies (ensure it's a JSON string)
        let technologies = '[]';
        if (project.technologies) {
          if (typeof project.technologies === 'string') {
            try {
              // Try to parse it to validate JSON then stringify again
              technologies = JSON.stringify(JSON.parse(project.technologies));
            } catch (e) {
              // If not valid JSON, convert from comma separated or create JSON array
              technologies = JSON.stringify(project.technologies.split(',').map(t => t.trim()));
            }
          } else if (Array.isArray(project.technologies)) {
            technologies = JSON.stringify(project.technologies);
          } else {
            technologies = JSON.stringify([String(project.technologies)]);
          }
        }
        
        // Other fields
        const techDetails = project.techDetails || null;
        const projectLink = project.link || '';
        const featured = project.featured ? 1 : 0;
        
        // Additional metadata
        const completionDate = project.completionDate || null;
        const clientName = project.clientName || null;
        const duration = project.duration || null;
        const status = project.status || null;
        const updatedDays = project.updatedDays || null;
        const progress = project.progress || null;
        const developmentProgress = project.developmentProgress || null;
        const estimatedCompletion = project.estimatedCompletion || null;
        
        // Features
        let features = null;
        if (project.features) {
          if (typeof project.features === 'string') {
            try {
              features = JSON.stringify(JSON.parse(project.features));
            } catch (e) {
              features = JSON.stringify([project.features]);
            }
          } else if (Array.isArray(project.features)) {
            features = JSON.stringify(project.features);
          } else {
            features = JSON.stringify([String(project.features)]);
          }
        }
        
        // Exclusive features
        let exclusiveFeatures = null;
        if (project.exclusiveFeatures) {
          if (typeof project.exclusiveFeatures === 'string') {
            try {
              exclusiveFeatures = JSON.stringify(JSON.parse(project.exclusiveFeatures));
            } catch (e) {
              exclusiveFeatures = JSON.stringify([project.exclusiveFeatures]);
            }
          } else if (Array.isArray(project.exclusiveFeatures)) {
            exclusiveFeatures = JSON.stringify(project.exclusiveFeatures);
          } else {
            exclusiveFeatures = JSON.stringify([String(project.exclusiveFeatures)]);
          }
        }
        
        // Visual settings
        const imagePriority = project.imagePriority || 5;
        
        let visualEffects = null;
        if (project.visualEffects) {
          if (typeof project.visualEffects === 'string') {
            try {
              visualEffects = JSON.stringify(JSON.parse(project.visualEffects));
            } catch (e) {
              visualEffects = project.visualEffects;
            }
          } else {
            visualEffects = JSON.stringify(project.visualEffects);
          }
        }
        
        // Insert into MySQL
        await connection.execute(
          `INSERT INTO projects (
            title, description, detailed_description, image_url, second_image,
            show_both_images_in_priority, category, technologies, tech_details,
            project_link, featured, completion_date, client_name, duration,
            status, updated_days, progress, development_progress, estimated_completion,
            features, exclusive_features, image_priority, visual_effects
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title, description, detailedDescription, imageUrl, secondImage,
            showBothImagesInPriority, category, technologies, techDetails,
            projectLink, featured, completionDate, clientName, duration,
            status, updatedDays, progress, developmentProgress, estimatedCompletion,
            features, exclusiveFeatures, imagePriority, visualEffects
          ]
        );
        
        successCount++;
        console.log(`Migrated project: ${title}`);
      } catch (error) {
        console.error(`Failed to migrate project "${project.title}":`, error.message);
        errorCount++;
      }
    }

    console.log(`Migration complete: ${successCount} projects migrated successfully, ${errorCount} failed`);
    
    // Verify the data
    const [projects] = await connection.execute('SELECT * FROM projects');
    console.log(`Verification: ${projects.length} projects in MySQL database`);
    
    // Close connection
    await connection.end();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  }
}

// Run the migration
migrateJsonToMysql(); 