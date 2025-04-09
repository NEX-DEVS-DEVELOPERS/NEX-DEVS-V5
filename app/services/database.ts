import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Project } from '../api/projects/index';

// Ensure the database directory exists
const dbDir = path.join(process.cwd(), 'db');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Initialize SQLite database
const dbPath = path.join(dbDir, 'portfolio.db');
let db: Database.Database;

try {
  // Try to open the database
  db = new Database(dbPath, { verbose: console.log });
  
  // Set up the projects table
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      detailedDescription TEXT,
      image TEXT NOT NULL,
      secondImage TEXT,
      showBothImagesInPriority INTEGER DEFAULT 0,
      category TEXT NOT NULL,
      technologies TEXT NOT NULL,
      techDetails TEXT,
      link TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      completionDate TEXT,
      clientName TEXT,
      duration TEXT,
      status TEXT,
      updatedDays INTEGER,
      progress INTEGER,
      developmentProgress INTEGER,
      estimatedCompletion TEXT,
      features TEXT,
      exclusiveFeatures TEXT,
      imagePriority INTEGER DEFAULT 5,
      visualEffects TEXT,
      lastUpdated TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Create indexes for better performance
  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (featured);
    CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
    CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
  `);
  
  // Check if we need to initialize the database with sample data
  const checkInitNeeded = () => {
    try {
      const countStmt = db.prepare('SELECT COUNT(*) as count FROM projects');
      const countResult = countStmt.get() as { count: number };
      return countResult.count === 0;
    } catch (error) {
      console.error('Error checking project count:', error);
      return true;
    }
  };
  
  // Initialize the database with data from projects.json if needed
  if (checkInitNeeded()) {
    console.log('Database is empty, initializing with projects.json data...');
    
    try {
      // Read projects.json
      const projectsFilePath = path.join(process.cwd(), 'app', 'db', 'projects.json');
      if (fs.existsSync(projectsFilePath)) {
        const projectsData = fs.readFileSync(projectsFilePath, 'utf8');
        const projects = JSON.parse(projectsData) as Project[];
        
        // Begin transaction
        db.exec('BEGIN TRANSACTION;');
        
        // Insert projects
        const insertStmt = db.prepare(`
          INSERT INTO projects (
            id, title, description, detailedDescription, image, secondImage, showBothImagesInPriority,
            category, technologies, techDetails, link, featured, completionDate, clientName,
            duration, status, updatedDays, progress, developmentProgress, estimatedCompletion,
            features, exclusiveFeatures, imagePriority, visualEffects, lastUpdated
          ) VALUES (
            @id, @title, @description, @detailedDescription, @image, @secondImage, @showBothImagesInPriority,
            @category, @technologies, @techDetails, @link, @featured, @completionDate, @clientName,
            @duration, @status, @updatedDays, @progress, @developmentProgress, @estimatedCompletion,
            @features, @exclusiveFeatures, @imagePriority, @visualEffects, @lastUpdated
          )
        `);
        
        for (const project of projects) {
          try {
            insertStmt.run(projectToRow(project));
          } catch (insertError) {
            console.error(`Error inserting project ${project.id}:`, insertError);
          }
        }
        
        // Commit transaction
        db.exec('COMMIT;');
        console.log(`Initialized database with ${projects.length} projects`);
      } else {
        console.error('projects.json not found, database will be empty');
        // Create at least one default project so the site doesn't break
        createDefaultProject();
      }
    } catch (initError) {
      console.error('Error initializing database from projects.json:', initError);
      db.exec('ROLLBACK;'); // Roll back in case of error
      createDefaultProject(); // Create a default project
    }
  }
} catch (dbError) {
  console.error('Error initializing database:', dbError);
  // Attempt to create a fallback in-memory database
  console.log('Creating fallback in-memory database');
  db = new Database(':memory:');
  
  // Still set up the basic schema
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      technologies TEXT NOT NULL,
      link TEXT NOT NULL,
      featured INTEGER DEFAULT 0
    );
  `);
  
  // Add a placeholder project
  createDefaultProject();
}

// Function to create a default project if all else fails
function createDefaultProject() {
  try {
    const insertStmt = db.prepare(`
      INSERT INTO projects (title, description, image, category, technologies, link, featured)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    insertStmt.run(
      'Sample Project',
      'This is a placeholder project. Please add real projects to the database.',
      '/projects/placeholder.jpg',
      'Web Development',
      JSON.stringify(['Next.js', 'React']),
      '/',
      1
    );
    
    console.log('Created default project');
  } catch (error) {
    console.error('Failed to create default project:', error);
  }
}

// Helper function to convert project to database row
function projectToRow(project: Project): any {
  // Convert visualEffects to JSON string if it's not already a string
  let visualEffectsJson = null;
  if (project.visualEffects) {
    if (typeof project.visualEffects === 'string') {
      visualEffectsJson = project.visualEffects;
    } else {
      try {
        visualEffectsJson = JSON.stringify(project.visualEffects);
      } catch (e) {
        console.error('Error stringifying visualEffects:', e);
        visualEffectsJson = JSON.stringify({});
      }
    }
  }

  return {
    id: project.id,
    title: project.title,
    description: project.description,
    detailedDescription: project.detailedDescription || null,
    image: project.image,
    secondImage: project.secondImage || null,
    showBothImagesInPriority: project.showBothImagesInPriority ? 1 : 0,
    category: project.category,
    technologies: JSON.stringify(project.technologies || []),
    techDetails: project.techDetails ? JSON.stringify(project.techDetails) : null,
    link: project.link,
    featured: project.featured ? 1 : 0,
    completionDate: project.completionDate || null,
    clientName: project.clientName || null,
    duration: project.duration || null,
    status: project.status || null,
    updatedDays: project.updatedDays || null,
    progress: project.progress || null,
    developmentProgress: project.developmentProgress || null,
    estimatedCompletion: project.estimatedCompletion || null,
    features: project.features ? JSON.stringify(project.features) : null,
    exclusiveFeatures: project.exclusiveFeatures ? JSON.stringify(project.exclusiveFeatures) : null,
    imagePriority: project.imagePriority || 5,
    visualEffects: visualEffectsJson,
    lastUpdated: new Date().toISOString()
  };
}

// Helper function to safely parse JSON with fallback
function safeJsonParse(jsonString: string | null, fallback: any = undefined): any {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing JSON:', e);
    return fallback;
  }
}

// Helper function to convert database row to project
function rowToProject(row: any): Project | null {
  if (!row) return null;
  
  try {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      detailedDescription: row.detailedDescription,
      image: row.image,
      secondImage: row.secondImage,
      showBothImagesInPriority: row.showBothImagesInPriority === 1,
      category: row.category,
      technologies: safeJsonParse(row.technologies, []),
      techDetails: row.techDetails ? safeJsonParse(row.techDetails) : undefined,
      link: row.link,
      featured: row.featured === 1,
      completionDate: row.completionDate,
      clientName: row.clientName,
      duration: row.duration,
      status: row.status,
      updatedDays: row.updatedDays,
      progress: row.progress,
      developmentProgress: row.developmentProgress,
      estimatedCompletion: row.estimatedCompletion,
      features: row.features ? safeJsonParse(row.features) : undefined,
      exclusiveFeatures: row.exclusiveFeatures ? safeJsonParse(row.exclusiveFeatures) : undefined,
      imagePriority: row.imagePriority,
      visualEffects: row.visualEffects ? safeJsonParse(row.visualEffects) : undefined,
      lastUpdated: row.lastUpdated
    };
  } catch (e) {
    console.error('Error converting row to project:', e, row);
    // Return a minimal valid project to prevent the entire request from failing
    return {
      id: row.id || 0,
      title: row.title || 'Error Loading Project',
      description: row.description || 'There was an error loading this project.',
      image: row.image || '/projects/placeholder.jpg',
      category: row.category || 'Uncategorized',
      technologies: [],
      link: row.link || '#',
      featured: false
    };
  }
}

// Wrapper for database operations with retry logic
function executeDatabaseOperation<T>(operation: () => T, fallback: T, maxRetries = 3): T {
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      return operation();
    } catch (error) {
      retries++;
      console.error(`Database operation failed (attempt ${retries}/${maxRetries}):`, error);
      
      if (retries >= maxRetries) {
        console.error('Max retries reached, returning fallback value');
        return fallback;
      }
      
      // Add a small delay before retrying
      const delay = retries * 100;
      console.log(`Retrying in ${delay}ms...`);
      // Simple synchronous delay for server-side operations
      const startTime = new Date().getTime();
      while (new Date().getTime() - startTime < delay) {}
    }
  }
  
  return fallback;
}

// Get all projects
export function getAllProjects(): Project[] {
  return executeDatabaseOperation(() => {
    const stmt = db.prepare('SELECT * FROM projects ORDER BY featured DESC, imagePriority ASC, id DESC');
    const rows = stmt.all();
    return rows.map(rowToProject).filter((project): project is Project => project !== null);
  }, []);
}

// Get project by ID
export function getProjectById(id: number): Project | null {
  return executeDatabaseOperation(() => {
    const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
    const row = stmt.get(id);
    return row ? rowToProject(row) : null;
  }, null);
}

// Create a new project
export function createProject(project: Omit<Project, 'id'>): Project {
  const insertStmt = db.prepare(`
    INSERT INTO projects (
      title, description, detailedDescription, image, secondImage, showBothImagesInPriority,
      category, technologies, techDetails, link, featured, completionDate, clientName,
      duration, status, updatedDays, progress, developmentProgress, estimatedCompletion,
      features, exclusiveFeatures, imagePriority, visualEffects, lastUpdated
    ) VALUES (
      @title, @description, @detailedDescription, @image, @secondImage, @showBothImagesInPriority,
      @category, @technologies, @techDetails, @link, @featured, @completionDate, @clientName,
      @duration, @status, @updatedDays, @progress, @developmentProgress, @estimatedCompletion,
      @features, @exclusiveFeatures, @imagePriority, @visualEffects, @lastUpdated
    )
  `);
  
  const projectData = projectToRow({ ...project, id: 0 });
  const result = insertStmt.run(projectData);
  
  return {
    ...project,
    id: result.lastInsertRowid as number
  };
}

// Update an existing project
export function updateProject(project: Project): boolean {
  const updateStmt = db.prepare(`
    UPDATE projects SET
      title = @title,
      description = @description,
      detailedDescription = @detailedDescription,
      image = @image,
      secondImage = @secondImage,
      showBothImagesInPriority = @showBothImagesInPriority,
      category = @category,
      technologies = @technologies,
      techDetails = @techDetails,
      link = @link,
      featured = @featured,
      completionDate = @completionDate,
      clientName = @clientName,
      duration = @duration,
      status = @status,
      updatedDays = @updatedDays,
      progress = @progress,
      developmentProgress = @developmentProgress,
      estimatedCompletion = @estimatedCompletion,
      features = @features,
      exclusiveFeatures = @exclusiveFeatures,
      imagePriority = @imagePriority,
      visualEffects = @visualEffects,
      lastUpdated = @lastUpdated
    WHERE id = @id
  `);
  
  const result = updateStmt.run(projectToRow(project));
  return result.changes > 0;
}

// Delete a project
export function deleteProject(id: number): boolean {
  const deleteStmt = db.prepare('DELETE FROM projects WHERE id = ?');
  const result = deleteStmt.run(id);
  return result.changes > 0;
}

// Get newly added projects
export function getNewlyAddedProjects(): Project[] {
  return executeDatabaseOperation(() => {
    const stmt = db.prepare(`
      SELECT * FROM projects 
      WHERE title LIKE 'NEWLY ADDED:%' 
      OR status IN ('In Development', 'Beta Testing', 'Recently Launched')
      ORDER BY updatedDays ASC, featured DESC, id DESC
    `);
    const rows = stmt.all();
    return rows.map(rowToProject).filter((project): project is Project => project !== null);
  }, []);
}

// Get regular projects (not newly added)
export function getRegularProjects(): Project[] {
  return executeDatabaseOperation(() => {
    const stmt = db.prepare(`
      SELECT * FROM projects 
      WHERE title NOT LIKE 'NEWLY ADDED:%' 
      AND (status IS NULL OR status NOT IN ('In Development', 'Beta Testing', 'Recently Launched'))
      ORDER BY featured DESC, imagePriority ASC, id DESC
    `);
    const rows = stmt.all();
    return rows.map(rowToProject).filter((project): project is Project => project !== null);
  }, []);
}

// Get featured projects
export function getFeaturedProjects(): Project[] {
  return executeDatabaseOperation(() => {
    const stmt = db.prepare('SELECT * FROM projects WHERE featured = 1 ORDER BY imagePriority ASC, id DESC');
    const rows = stmt.all();
    return rows.map(rowToProject).filter((project): project is Project => project !== null);
  }, []);
}

// Get projects by category
export function getProjectsByCategory(category: string): Project[] {
  return executeDatabaseOperation(() => {
    const stmt = db.prepare('SELECT * FROM projects WHERE category = ? ORDER BY featured DESC, id DESC');
    const rows = stmt.all(category);
    return rows.map(rowToProject).filter((project): project is Project => project !== null);
  }, []);
}

// Get unique categories
export function getUniqueCategories(): string[] {
  return executeDatabaseOperation(() => {
    const stmt = db.prepare('SELECT DISTINCT category FROM projects');
    const rows = stmt.all();
    return rows.map((row: any) => row.category);
  }, []);
}

// Migrate existing JSON data to SQLite (run this once)
export async function migrateJsonToSqlite(): Promise<void> {
  try {
    // Check if migration is needed by counting projects
    const countStmt = db.prepare('SELECT COUNT(*) as count FROM projects');
    const countResult = countStmt.get() as { count: number };
    
    if (countResult.count > 0) {
      console.log('Migration skipped: Database already contains projects');
      return;
    }
    
    // Read JSON file
    const projectsFilePath = path.join(process.cwd(), 'app', 'db', 'projects.json');
    const projectsData = fs.readFileSync(projectsFilePath, 'utf8');
    const projects = JSON.parse(projectsData) as Project[];
    
    // Begin transaction for better performance
    const transaction = db.transaction((projects: Project[]) => {
      for (const project of projects) {
        createProject(project);
      }
    });
    
    transaction(projects);
    console.log(`Migration complete: ${projects.length} projects imported to SQLite`);
  } catch (error) {
    console.error('Error migrating data:', error);
    throw error;
  }
}

export default {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getNewlyAddedProjects,
  getRegularProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getUniqueCategories,
  migrateJsonToSqlite
}; 