import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { Project } from '../api/projects/index';

// Determine if we're in production (Netlify) or development
const isProduction = process.env.NODE_ENV === 'production';
console.log(`Environment: ${isProduction ? 'Production' : 'Development'}`);

// Initialize the database
let db: Database.Database;
let dbPath: string = '';
let dbDir: string = '';

// Get database path based on environment
function getDbPaths() {
  const isVercel = process.env.VERCEL === '1';
  const cwd = process.cwd();
  
  // Add more possible paths for Vercel deployment
  return [
    // Vercel specific paths
    isVercel ? path.join(cwd, '.vercel', 'output', 'functions', 'db', 'projects.db') : null,
    isVercel ? path.join(cwd, '.vercel', 'output', 'server', 'db', 'projects.db') : null,
    // Regular paths
    path.join(cwd, 'app', 'db', 'projects.db'),
    path.join(cwd, 'db', 'projects.db'),
    path.join(cwd, '.next', 'server', 'db', 'projects.db'),
    path.join(cwd, '.next', 'cache', 'db', 'projects.db'),
    // Default in-memory as last resort
    ':memory:'
  ].filter(Boolean) as string[];
}

try {
  // Primary path for local development
  dbDir = path.join(process.cwd(), 'db');
  
  // Ensure the database directory exists
  if (!fs.existsSync(dbDir)) {
    console.log(`Creating database directory at ${dbDir}`);
    fs.mkdirSync(dbDir, { recursive: true });
  }
  
  // Try multiple possible database locations
  const possiblePaths = getDbPaths();
  
  // Log possible locations for debugging
  console.log('Trying database paths:', possiblePaths);
  
  // Try each path until we find one that works
  let dbInstance: Database.Database | null = null;
  let dbPathSuccess: string | null = null;
  
  for (const potentialPath of possiblePaths) {
    try {
      console.log(`Attempting to open database at: ${potentialPath}`);
      
      // If we're in production and this is the temp path, try to copy from the deployment
      if (isProduction && potentialPath.includes('/tmp') && !fs.existsSync(potentialPath)) {
        const sourceDbPath = path.join(process.cwd(), '.next', 'server', 'db', 'portfolio.db');
        if (fs.existsSync(sourceDbPath)) {
          console.log(`Copying database from ${sourceDbPath} to ${potentialPath}`);
          fs.copyFileSync(sourceDbPath, potentialPath);
        }
      }
      
      dbInstance = new Database(potentialPath);
      dbPathSuccess = potentialPath;
      console.log(`Successfully opened database at: ${potentialPath}`);
      break;
    } catch (error) {
      console.error(`Failed to open database at ${potentialPath}:`, error);
      // Continue to the next path
    }
  }
  
  // If we couldn't open the database with any path, throw an error
  if (!dbInstance) {
    throw new Error('Could not open database with any of the possible paths');
  }
  
  // Successfully opened the database
  db = dbInstance;
  dbPath = dbPathSuccess as string;

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

} catch (error) {
  console.error('Critical database initialization error:', error);
  // Initialize an in-memory database as a last resort
  console.warn('Falling back to in-memory SQLite database');
  db = new Database(':memory:');
  dbPath = ':memory:';
  
  // Set up the basic schema for in-memory database
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      technologies TEXT NOT NULL,
      link TEXT NOT NULL,
      featured INTEGER DEFAULT 0,
      lastUpdated TEXT DEFAULT CURRENT_TIMESTAMP
    );
  `);
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

// Helper function to convert database row to project
function rowToProject(row: any): Project {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    detailedDescription: row.detailedDescription,
    image: row.image,
    secondImage: row.secondImage,
    showBothImagesInPriority: row.showBothImagesInPriority === 1,
    category: row.category,
    technologies: JSON.parse(row.technologies || '[]'),
    techDetails: row.techDetails ? JSON.parse(row.techDetails) : undefined,
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
    features: row.features ? JSON.parse(row.features) : undefined,
    exclusiveFeatures: row.exclusiveFeatures ? JSON.parse(row.exclusiveFeatures) : undefined,
    imagePriority: row.imagePriority,
    visualEffects: row.visualEffects ? JSON.parse(row.visualEffects) : undefined,
    lastUpdated: row.lastUpdated
  };
}

// Get all projects
export function getAllProjects(): Project[] {
  const stmt = db.prepare('SELECT * FROM projects ORDER BY featured DESC, imagePriority ASC, id DESC');
  const rows = stmt.all();
  return rows.map(rowToProject);
}

// Get project by ID
export function getProjectById(id: number): Project | null {
  const stmt = db.prepare('SELECT * FROM projects WHERE id = ?');
  const row = stmt.get(id);
  return row ? rowToProject(row) : null;
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
  const stmt = db.prepare(`
    SELECT * FROM projects 
    WHERE title LIKE 'NEWLY ADDED:%' 
    OR status IN ('In Development', 'Beta Testing', 'Recently Launched')
    ORDER BY updatedDays ASC, featured DESC, id DESC
  `);
  const rows = stmt.all();
  return rows.map(rowToProject);
}

// Get regular projects (not newly added)
export function getRegularProjects(): Project[] {
  const stmt = db.prepare(`
    SELECT * FROM projects 
    WHERE title NOT LIKE 'NEWLY ADDED:%' 
    AND (status IS NULL OR status NOT IN ('In Development', 'Beta Testing', 'Recently Launched'))
    ORDER BY featured DESC, imagePriority ASC, id DESC
  `);
  const rows = stmt.all();
  return rows.map(rowToProject);
}

// Get featured projects
export function getFeaturedProjects(): Project[] {
  const stmt = db.prepare('SELECT * FROM projects WHERE featured = 1 ORDER BY imagePriority ASC, id DESC');
  const rows = stmt.all();
  return rows.map(rowToProject);
}

// Get projects by category
export function getProjectsByCategory(category: string): Project[] {
  const stmt = db.prepare('SELECT * FROM projects WHERE category = ? ORDER BY featured DESC, id DESC');
  const rows = stmt.all(category);
  return rows.map(rowToProject);
}

// Get unique categories
export function getUniqueCategories(): string[] {
  const stmt = db.prepare('SELECT DISTINCT category FROM projects');
  const rows = stmt.all();
  return rows.map((row: any) => row.category);
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

// Update the initializeDatabase function to be more resilient
export async function initializeDatabase() {
  // Try multiple possible database paths
  const possiblePaths = getDbPaths();
  let dbInstance = null;
  let dbPathSuccess = null;
  let openAttempts = 0;
  
  console.log('Attempting to initialize database...');
  
  for (const dbPath of possiblePaths) {
    try {
      openAttempts++;
      console.log(`Attempt ${openAttempts}: Opening database at ${dbPath}`);
      
      // Create directory if it doesn't exist (except for in-memory)
      if (dbPath !== ':memory:') {
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
          console.log(`Created directory ${dbDir}`);
        }
      }
      
      // Try to open the database
      dbInstance = new Database(dbPath, { verbose: console.log });
      dbPathSuccess = dbPath;
      console.log(`Successfully opened database at ${dbPath}`);
      break;
    } catch (error) {
      console.error(`Failed to open database at ${dbPath}:`, error);
    }
  }

  // ... existing code ...
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