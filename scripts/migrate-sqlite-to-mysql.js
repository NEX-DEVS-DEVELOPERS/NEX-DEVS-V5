const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

// MySQL connection configuration
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

// Possible paths to SQLite database
const possibleSqlitePaths = [
  path.join(process.cwd(), 'projects.db'),
  path.join(process.cwd(), 'app/db/projects.db'),
  path.join(process.cwd(), 'app/db/portfolio.db'),
  path.join(process.cwd(), 'db/projects.db'),
  path.join(process.cwd(), '.next/server/db/projects.db'),
  path.join(process.cwd(), '.next/server/db/portfolio.db')
];

// Check root database directly
const rootDbPath = path.join(process.cwd(), 'projects.db');
if (fs.existsSync(rootDbPath)) {
  console.log(`Root SQLite database exists at: ${rootDbPath}`);
  console.log(`File size: ${fs.statSync(rootDbPath).size} bytes`);
}

async function findSqliteDb() {
  for (const dbPath of possibleSqlitePaths) {
    if (fs.existsSync(dbPath)) {
      console.log(`Found SQLite database at: ${dbPath}`);
      return dbPath;
    }
  }
  throw new Error("Couldn't find SQLite database file");
}

async function migrateData() {
  console.log('Starting migration from SQLite to MySQL...');
  
  try {
    // Find SQLite database
    const SQLITE_DB_PATH = await findSqliteDb();
    
    // Create SQLite connection
    const sqliteDb = new Promise((resolve, reject) => {
      const db = new sqlite3.Database(SQLITE_DB_PATH, sqlite3.OPEN_READONLY, (err) => {
        if (err) reject(err);
        else resolve(db);
      });
    });
    
    const db = await sqliteDb;
    console.log('Connected to SQLite database');
    
    // Create MySQL connection pool
    const pool = mysql.createPool(mysqlConfig);
    console.log('Connected to MySQL database');
    
    // Create projects table in MySQL if it doesn't exist
    await pool.execute(`
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
    console.log('Created projects table in MySQL (if it didn\'t exist)');
    
    // Get all projects from SQLite
    const getProjects = () => {
      return new Promise((resolve, reject) => {
        db.all('SELECT * FROM projects', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    };
    
    // Get SQLite table structure to understand columns
    const getTableInfo = () => {
      return new Promise((resolve, reject) => {
        db.all('PRAGMA table_info(projects)', [], (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });
    };
    
    // Get table structure
    const tableInfo = await getTableInfo();
    console.log('SQLite table structure:');
    console.log(tableInfo.map(col => col.name).join(', '));
    
    // Get projects from SQLite
    const projects = await getProjects();
    console.log(`Found ${projects.length} projects in SQLite`);
    
    // Check if there are existing projects in MySQL and ask to clear
    const [existingProjects] = await pool.execute('SELECT COUNT(*) as count FROM projects');
    const existingCount = existingProjects[0].count;
    
    if (existingCount > 0) {
      console.log(`MySQL database already has ${existingCount} projects.`);
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      
      const answer = await new Promise((resolve) => {
        readline.question('Do you want to clear existing projects in MySQL before importing? (y/n): ', resolve);
      });
      readline.close();
      
      if (answer.toLowerCase() === 'y') {
        await pool.execute('TRUNCATE TABLE projects');
        console.log('Cleared existing projects from MySQL');
      } else {
        console.log('Keeping existing projects in MySQL');
      }
    }
    
    // Perform migration
    let successCount = 0;
    let errorCount = 0;
    
    for (const project of projects) {
      try {
        // Map SQLite fields to MySQL fields
        const title = project.title || '';
        const description = project.description || '';
        const detailedDescription = project.detailedDescription || null;
        
        // Handle image fields
        const imageUrl = project.image || '';
        const secondImage = project.secondImage || null;
        const showBothImagesInPriority = project.showBothImagesInPriority ? 1 : 0;
        
        // Handle category and technologies
        const category = project.category || '';
        
        // Handle technologies (could be string or array in JSON)
        let technologies = '';
        if (project.technologies) {
          if (typeof project.technologies === 'string') {
            try {
              // Try to parse if it's a JSON string
              technologies = JSON.stringify(JSON.parse(project.technologies));
            } catch (e) {
              // If not a valid JSON, use as is
              technologies = project.technologies;
            }
          } else if (Array.isArray(project.technologies)) {
            technologies = JSON.stringify(project.technologies);
          } else {
            technologies = JSON.stringify(project.technologies);
          }
        }
        
        // Handle tech details
        const techDetails = project.techDetails || null;
        
        // Handle link field
        const projectLink = project.link || '';
        
        // Handle boolean fields
        const featured = project.featured ? 1 : 0;
        
        // Handle additional fields
        const completionDate = project.completionDate || null;
        const clientName = project.clientName || null;
        const duration = project.duration || null;
        const status = project.status || null;
        const updatedDays = project.updatedDays || null;
        const progress = project.progress || null;
        const developmentProgress = project.developmentProgress || null;
        const estimatedCompletion = project.estimatedCompletion || null;
        
        // Handle features
        let features = null;
        if (project.features) {
          if (typeof project.features === 'string') {
            try {
              features = JSON.stringify(JSON.parse(project.features));
            } catch (e) {
              features = project.features;
            }
          } else if (Array.isArray(project.features)) {
            features = JSON.stringify(project.features);
          } else {
            features = JSON.stringify(project.features);
          }
        }
        
        // Handle exclusive features
        let exclusiveFeatures = null;
        if (project.exclusiveFeatures) {
          if (typeof project.exclusiveFeatures === 'string') {
            try {
              exclusiveFeatures = JSON.stringify(JSON.parse(project.exclusiveFeatures));
            } catch (e) {
              exclusiveFeatures = project.exclusiveFeatures;
            }
          } else if (Array.isArray(project.exclusiveFeatures)) {
            exclusiveFeatures = JSON.stringify(project.exclusiveFeatures);
          } else {
            exclusiveFeatures = JSON.stringify(project.exclusiveFeatures);
          }
        }
        
        // Handle image priority
        const imagePriority = project.imagePriority || 5;
        
        // Handle visual effects
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
        
        // Insert into MySQL with all fields
        await pool.execute(
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
        console.error(`Failed to migrate project ID ${project.id}:`, error);
        errorCount++;
      }
    }
    
    console.log(`Migration complete: ${successCount} projects migrated successfully, ${errorCount} failed`);
    
    // Close connections
    db.close();
    await pool.end();
    
    console.log('All connections closed. Migration process completed.');
  } catch (error) {
    console.error('Error during migration:', error);
    process.exit(1);
  }
}

migrateData(); 