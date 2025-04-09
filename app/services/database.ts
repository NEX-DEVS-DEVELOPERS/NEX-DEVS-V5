// Install required dependencies for SQLite
// npm install sqlite sqlite3 --save
// Comment out the imports that are causing errors if not installed
// import sqlite3 from 'sqlite3';
// import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// Constants
const DB_FILE = path.join(process.cwd(), 'projects.db');
const JSON_FALLBACK_FILE = path.join(process.cwd(), 'projects.json');
const TEMP_DIR = process.env.TEMP || process.env.TMP || '/tmp';
const NETLIFY_ENV = process.env.NETLIFY || false;
const VERCEL_ENV = process.env.VERCEL || false;
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_SERVERLESS = NETLIFY_ENV || VERCEL_ENV || IS_PROD;
const USE_JSON_FALLBACK = IS_SERVERLESS;

// If on Netlify, use a temporary directory that's writable
const STORAGE_FILE = NETLIFY_ENV 
  ? path.join(TEMP_DIR, 'projects.json')
  : JSON_FALLBACK_FILE;

// Define Project type locally to avoid import issues
type Project = {
  id: number;
  title: string;
  description: string;
  image: string;
  secondImage?: string;
  showBothImagesInPriority?: boolean;
  category: string;
  technologies: string[];
  link: string;
  features?: string[];
  exclusiveFeatures?: string[];
  featured: boolean;
  status?: string;
  updatedDays?: number;
  progress?: number;
  developmentProgress?: number;
  estimatedCompletion?: string;
  imagePriority?: number;
  visualEffects?: any;
  lastUpdated?: string;
};

// Type for Database
type Database = any;

// Store in-memory version of projects in production
let cachedProjects: Project[] = [];
let jsonLastModified: Date | null = null;

// Log environment info
console.log(`Database mode: ${USE_JSON_FALLBACK ? 'JSON fallback' : 'SQLite'}`);
console.log(`Running in ${IS_PROD ? 'production' : 'development'} environment`);
console.log(`Serverless environment: ${IS_SERVERLESS ? 'true' : 'false'}`);

class DatabaseService {
  private db: Database | null = null;
  private initialized = false;
  
  constructor() {
    // Initialize database system
    this.initialize().catch(err => {
      console.error('Failed to initialize database system:', err);
    });
  }
  
  // Initialize the appropriate database system
  private async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      if (USE_JSON_FALLBACK) {
        await this.loadJsonData();
      } else {
        await this.initSqlite();
      }
      this.initialized = true;
    } catch (error) {
      console.error('Database initialization error:', error);
      // If SQLite initialization fails, fall back to JSON
      if (!USE_JSON_FALLBACK) {
        console.log('Falling back to JSON storage');
        await this.loadJsonData();
        this.initialized = true;
      }
    }
  }
  
  // Initialize SQLite database (only for local development)
  private async initSqlite(): Promise<void> {
    if (USE_JSON_FALLBACK) {
      console.log('Using JSON fallback, skipping SQLite initialization');
      return;
    }
    
    try {
      // Only import SQLite modules if we're not in a serverless environment
      const sqlite3Module = await import('sqlite3').catch(() => null);
      const sqliteModule = await import('sqlite').catch(() => null);
      
      if (!sqlite3Module || !sqliteModule) {
        throw new Error('SQLite modules not available');
      }
      
      const sqlite3 = sqlite3Module.default;
      const { open } = sqliteModule;
      
      this.db = await open({
        filename: DB_FILE,
        driver: sqlite3.Database
      });
      
      console.log('SQLite database opened successfully');
      
      // Create tables if they don't exist
      await this.db.exec(`
        CREATE TABLE IF NOT EXISTS projects (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          image TEXT NOT NULL,
          secondImage TEXT,
          showBothImagesInPriority INTEGER DEFAULT 0,
          category TEXT NOT NULL,
          technologies TEXT DEFAULT '[]',
          link TEXT NOT NULL,
          features TEXT DEFAULT '[]',
          exclusiveFeatures TEXT DEFAULT '[]',
          featured INTEGER DEFAULT 0,
          visualEffects TEXT DEFAULT '{"animation":"none","showBadge":false}',
          imagePriority INTEGER DEFAULT 5,
          status TEXT,
          updatedDays INTEGER,
          progress INTEGER,
          developmentProgress INTEGER,
          estimatedCompletion TEXT,
          lastUpdated TEXT
        )
      `);
      
      console.log('Database tables initialized');
    } catch (error) {
      console.error('Error initializing SQLite database:', error);
      throw error; // Re-throw so we can fall back to JSON if needed
    }
  }
  
  // Method to ensure the database is initialized 
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
  
  // Load JSON data for production environment
  private async loadJsonData(): Promise<void> {
    try {
      // First check if the appropriate storage file exists
      let jsonExists = existsSync(STORAGE_FILE);
      let fileToUse = STORAGE_FILE;
      
      // On Netlify, also check for the fallback location
      if (!jsonExists && NETLIFY_ENV && !STORAGE_FILE.includes('/tmp/')) {
        const fallbackFile = path.join('/tmp', 'projects.json');
        if (existsSync(fallbackFile)) {
          jsonExists = true;
          fileToUse = fallbackFile;
          console.log(`Using fallback storage location: ${fallbackFile}`);
        }
      }
      
      if (jsonExists) {
        // Get file stats to check last modified time
        const stats = await fs.stat(fileToUse);
        const fileModified = stats.mtime;
        
        // Only reload if the file has been modified or we haven't loaded it yet
        if (!jsonLastModified || fileModified > jsonLastModified) {
          console.log(`Loading projects from JSON file: ${fileToUse}`);
          const jsonData = await fs.readFile(fileToUse, 'utf-8');
          
          try {
            const parsedData = JSON.parse(jsonData);
            if (Array.isArray(parsedData)) {
              cachedProjects = parsedData;
              jsonLastModified = fileModified;
              console.log(`Loaded ${cachedProjects.length} projects from JSON`);
            } else {
              console.error('Invalid JSON data format, not an array');
              // If data is invalid, use empty array
              cachedProjects = [];
            }
          } catch (parseError) {
            console.error('Error parsing JSON data:', parseError);
            cachedProjects = [];
          }
        } else {
          console.log('Using cached projects (JSON file has not changed)');
        }
      } else {
        console.log('JSON fallback file does not exist, using empty projects array');
        cachedProjects = [];
        
        // Try to create an empty file
        try {
          const storageDir = path.dirname(STORAGE_FILE);
          await fs.mkdir(storageDir, { recursive: true });
          await fs.writeFile(STORAGE_FILE, JSON.stringify([]), 'utf-8');
          console.log(`Created empty JSON file at ${STORAGE_FILE}`);
        } catch (createError) {
          console.warn('Could not create empty JSON file:', createError);
          
          // Try fallback location on Netlify
          if (NETLIFY_ENV) {
            try {
              const fallbackFile = path.join('/tmp', 'projects.json');
              await fs.writeFile(fallbackFile, JSON.stringify([]), 'utf-8');
              console.log(`Created empty JSON file at fallback location ${fallbackFile}`);
            } catch (fallbackError) {
              console.error('Error creating fallback JSON file:', fallbackError);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading JSON data:', error);
      cachedProjects = [];
    }
  }
  
  // Save JSON data for production environment
  private async saveJsonData(): Promise<void> {
    if (USE_JSON_FALLBACK) {
      try {
        console.log('Saving projects to JSON file');
        
        // Create directory if it doesn't exist
        const storageDir = path.dirname(STORAGE_FILE);
        try {
          await fs.mkdir(storageDir, { recursive: true });
        } catch (mkdirError) {
          console.warn('Warning creating directory:', mkdirError);
          // Continue anyway
        }
        
        try {
          // Write to the appropriate storage location
          await fs.writeFile(STORAGE_FILE, JSON.stringify(cachedProjects, null, 2));
          jsonLastModified = new Date();
          console.log(`Saved ${cachedProjects.length} projects to ${STORAGE_FILE}`);
        } catch (writeError) {
          console.error(`Error writing to ${STORAGE_FILE}:`, writeError);
          
          // If writing to the primary location fails, try a fallback location
          if (NETLIFY_ENV && !STORAGE_FILE.includes('/tmp/')) {
            const fallbackFile = path.join('/tmp', 'projects.json');
            console.log(`Trying fallback location: ${fallbackFile}`);
            await fs.writeFile(fallbackFile, JSON.stringify(cachedProjects, null, 2));
            console.log(`Saved to fallback location ${fallbackFile}`);
          }
        }
      } catch (error) {
        console.error('Error saving JSON data:', error);
      }
    }
  }
  
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    try {
      await this.ensureInitialized();
      
      if (USE_JSON_FALLBACK) {
        // Reload JSON data if needed
        await this.loadJsonData();
        return cachedProjects;
      }
      
      if (!this.db) {
        await this.initSqlite();
      }
      
      if (!this.db) {
        throw new Error('Database is not initialized');
      }
      
      const projects = await this.db.all(`
        SELECT * FROM projects
        ORDER BY 
          featured DESC,
          imagePriority ASC, 
          id DESC
      `) as any[];
      
      return this.processProjectsFromDb(projects);
    } catch (error) {
      console.error('Error getting all projects:', error);
      return [];
    }
  }
  
  // Get projects by category
  async getProjectsByCategory(category: string): Promise<Project[]> {
    try {
      await this.ensureInitialized();
      
      if (USE_JSON_FALLBACK) {
        // Reload JSON data if needed
        await this.loadJsonData();
        return cachedProjects.filter(project => project.category === category);
      }
      
      if (!this.db) {
        await this.initSqlite();
      }
      
      if (!this.db) {
        throw new Error('Database is not initialized');
      }
      
      const projects = await this.db.all(`
        SELECT * FROM projects
        WHERE category = ?
        ORDER BY 
          featured DESC, 
          imagePriority ASC,
          id DESC
      `, category) as any[];
      
      return this.processProjectsFromDb(projects);
    } catch (error) {
      console.error(`Error getting projects by category '${category}':`, error);
      return [];
    }
  }
  
  // Get featured projects
  async getFeaturedProjects(): Promise<Project[]> {
    try {
      await this.ensureInitialized();
      
      if (USE_JSON_FALLBACK) {
        // Reload JSON data if needed
        await this.loadJsonData();
        return cachedProjects.filter(project => project.featured);
      }
      
      if (!this.db) {
        await this.initSqlite();
      }
      
      if (!this.db) {
        throw new Error('Database is not initialized');
      }
      
      const projects = await this.db.all(`
        SELECT * FROM projects
        WHERE featured = 1
        ORDER BY 
          imagePriority ASC,
          id DESC
      `) as any[];
      
      return this.processProjectsFromDb(projects);
    } catch (error) {
      console.error('Error getting featured projects:', error);
      return [];
    }
  }
  
  // Get newly added projects
  async getNewlyAddedProjects(): Promise<Project[]> {
    try {
      await this.ensureInitialized();
      
      if (USE_JSON_FALLBACK) {
        // Reload JSON data if needed
        await this.loadJsonData();
        return cachedProjects.filter(project => 
          project.title.startsWith('NEWLY ADDED:') || 
          (project.status && project.updatedDays)
        );
      }
      
      if (!this.db) {
        await this.initSqlite();
      }
      
      if (!this.db) {
        throw new Error('Database is not initialized');
      }
      
      const projects = await this.db.all(`
        SELECT * FROM projects
        WHERE 
          title LIKE 'NEWLY ADDED:%' OR
          (status IS NOT NULL AND updatedDays IS NOT NULL)
        ORDER BY 
          imagePriority ASC,
          id DESC
      `) as any[];
      
      return this.processProjectsFromDb(projects);
    } catch (error) {
      console.error('Error getting newly added projects:', error);
      return [];
    }
  }
  
  // Get a project by ID
  async getProjectById(id: number): Promise<Project | null> {
    try {
      await this.ensureInitialized();
      
      if (USE_JSON_FALLBACK) {
        // Reload JSON data if needed
        await this.loadJsonData();
        const project = cachedProjects.find(p => p.id === id);
        return project || null;
      }
      
      if (!this.db) {
        await this.initSqlite();
      }
      
      if (!this.db) {
        throw new Error('Database is not initialized');
      }
      
      const project = await this.db.get(`
        SELECT * FROM projects
        WHERE id = ?
      `, id) as any;
      
      if (!project) {
        return null;
      }
      
      return this.processProjectFromDb(project);
    } catch (error) {
      console.error(`Error getting project by ID ${id}:`, error);
      return null;
    }
  }
  
  // Get unique categories
  async getUniqueCategories(): Promise<string[]> {
    try {
      await this.ensureInitialized();
      
      if (USE_JSON_FALLBACK) {
        // Reload JSON data if needed
        await this.loadJsonData();
        const categoriesSet = new Set(cachedProjects.map(project => project.category));
        return Array.from(categoriesSet);
      }
      
      if (!this.db) {
        await this.initSqlite();
      }
      
      if (!this.db) {
        throw new Error('Database is not initialized');
      }
      
      const categories = await this.db.all(`
        SELECT DISTINCT category FROM projects
      `) as Array<{category: string}>;
      
      return categories.map((c: { category: string }) => c.category);
    } catch (error) {
      console.error('Error getting unique categories:', error);
      return [];
    }
  }
  
  // Create a new project
  async createProject(project: Omit<Project, 'id'>): Promise<Project> {
    try {
      await this.ensureInitialized();
      
      if (USE_JSON_FALLBACK) {
        // Reload JSON data to ensure we have the latest
        await this.loadJsonData();
        
        // Generate a new ID
        const newId = cachedProjects.length > 0 
          ? Math.max(...cachedProjects.map(p => p.id)) + 1 
          : 1;
        
        // Ensure technologies are parsed as JSON if needed
        const technologies = this.ensureArray(project.technologies);
        const features = this.ensureArray(project.features);
        const exclusiveFeatures = this.ensureArray(project.exclusiveFeatures);
        
        // Ensure visualEffects is a proper object
        const visualEffects = this.ensureObject(project.visualEffects);
        
        // Create new project
        const newProject: Project = {
          ...project,
          id: newId,
          technologies,
          features,
          exclusiveFeatures,
          visualEffects,
          featured: Boolean(project.featured),
          lastUpdated: new Date().toISOString()
        };
        
        // Add to cache
        cachedProjects.push(newProject);
        
        // Save to JSON file
        await this.saveJsonData();
        
        return newProject;
      }
      
      if (!this.db) {
        await this.initSqlite();
      }
      
      if (!this.db) {
        throw new Error('Database is not initialized');
      }
      
      // Convert arrays to JSON for storage
      const technologies = JSON.stringify(project.technologies || []);
      const features = JSON.stringify(project.features || []);
      const exclusiveFeatures = JSON.stringify(project.exclusiveFeatures || []);
      
      // Ensure visualEffects is stored as a string
      const visualEffects = typeof project.visualEffects === 'string' 
        ? project.visualEffects 
        : JSON.stringify(project.visualEffects || {animation: 'none', showBadge: false});
      
      const result = await this.db.run(`
        INSERT INTO projects (
          title, description, image, secondImage, showBothImagesInPriority,
          category, technologies, link, features, exclusiveFeatures,
          featured, visualEffects, imagePriority, status, updatedDays,
          progress, developmentProgress, estimatedCompletion, lastUpdated
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, 
      project.title,
      project.description,
      project.image,
      project.secondImage || null,
      project.showBothImagesInPriority ? 1 : 0,
      project.category,
      technologies,
      project.link,
      features,
      exclusiveFeatures,
      project.featured ? 1 : 0,
      visualEffects,
      project.imagePriority || 5,
      project.status || null,
      project.updatedDays || null,
      project.progress || null,
      project.developmentProgress || null,
      project.estimatedCompletion || null,
      project.lastUpdated || new Date().toISOString()
      );
      
      // Get the created project
      if (result.lastID) {
        const createdProject = await this.getProjectById(result.lastID);
        if (createdProject) {
          return createdProject;
        }
      }
      
      throw new Error('Failed to retrieve created project');
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  }
  
  // Update a project
  async updateProject(project: Project): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      if (USE_JSON_FALLBACK) {
        // Reload JSON data to ensure we have the latest
        await this.loadJsonData();
        
        // Find project index
        const index = cachedProjects.findIndex(p => p.id === project.id);
        
        if (index === -1) {
          return false;
        }
        
        // Ensure arrays are properly formatted
        const technologies = this.ensureArray(project.technologies);
        const features = this.ensureArray(project.features);
        const exclusiveFeatures = this.ensureArray(project.exclusiveFeatures);
        
        // Ensure visualEffects is properly formatted
        const visualEffects = this.ensureObject(project.visualEffects);
        
        // Update project
        cachedProjects[index] = {
          ...project,
          technologies,
          features,
          exclusiveFeatures,
          visualEffects,
          featured: Boolean(project.featured),
          lastUpdated: new Date().toISOString()
        };
        
        // Save to JSON file
        await this.saveJsonData();
        
        return true;
      }
      
      if (!this.db) {
        await this.initSqlite();
      }
      
      if (!this.db) {
        throw new Error('Database is not initialized');
      }
      
      // First check if the project exists
      const existingProject = await this.db.get(`
        SELECT id FROM projects WHERE id = ?
      `, project.id);
      
      if (!existingProject) {
        return false;
      }
      
      // Convert arrays to JSON for storage
      const technologies = JSON.stringify(project.technologies || []);
      const features = JSON.stringify(project.features || []);
      const exclusiveFeatures = JSON.stringify(project.exclusiveFeatures || []);
      
      // Ensure visualEffects is stored as a string
      const visualEffects = typeof project.visualEffects === 'string' 
        ? project.visualEffects 
        : JSON.stringify(project.visualEffects || {animation: 'none', showBadge: false});
      
      await this.db.run(`
        UPDATE projects SET
          title = ?,
          description = ?,
          image = ?,
          secondImage = ?,
          showBothImagesInPriority = ?,
          category = ?,
          technologies = ?,
          link = ?,
          features = ?,
          exclusiveFeatures = ?,
          featured = ?,
          visualEffects = ?,
          imagePriority = ?,
          status = ?,
          updatedDays = ?,
          progress = ?,
          developmentProgress = ?,
          estimatedCompletion = ?,
          lastUpdated = ?
        WHERE id = ?
      `,
      project.title,
      project.description,
      project.image,
      project.secondImage || null,
      project.showBothImagesInPriority ? 1 : 0,
      project.category,
      technologies,
      project.link,
      features,
      exclusiveFeatures,
      project.featured ? 1 : 0,
      visualEffects,
      project.imagePriority || 5,
      project.status || null,
      project.updatedDays || null,
      project.progress || null,
      project.developmentProgress || null,
      project.estimatedCompletion || null,
      project.lastUpdated || new Date().toISOString(),
      project.id
      );
      
      return true;
    } catch (error) {
      console.error(`Error updating project with ID ${project.id}:`, error);
      throw error;
    }
  }
  
  // Delete a project
  async deleteProject(id: number): Promise<boolean> {
    try {
      await this.ensureInitialized();
      
      if (USE_JSON_FALLBACK) {
        // Reload JSON data to ensure we have the latest
        await this.loadJsonData();
        
        // Find project index
        const index = cachedProjects.findIndex(p => p.id === id);
        
        if (index === -1) {
          return false;
        }
        
        // Remove from cache
        cachedProjects.splice(index, 1);
        
        // Save to JSON file
        await this.saveJsonData();
        
        return true;
      }
      
      if (!this.db) {
        await this.initSqlite();
      }
      
      if (!this.db) {
        throw new Error('Database is not initialized');
      }
      
      // First check if the project exists
      const existingProject = await this.db.get(`
        SELECT id FROM projects WHERE id = ?
      `, id);
      
      if (!existingProject) {
        return false;
      }
      
      await this.db.run(`
        DELETE FROM projects WHERE id = ?
      `, id);
      
      return true;
    } catch (error) {
      console.error(`Error deleting project with ID ${id}:`, error);
      throw error;
    }
  }
  
  // Process projects from database to ensure proper types
  private processProjectsFromDb(projects: any[]): Project[] {
    return projects.map(project => this.processProjectFromDb(project));
  }
  
  // Process a single project from database
  private processProjectFromDb(project: any): Project {
    try {
      // Parse JSON strings from the database
      const technologies = this.parseJson(project.technologies, []);
      const features = this.parseJson(project.features, []);
      const exclusiveFeatures = this.parseJson(project.exclusiveFeatures, []);
      const visualEffects = this.parseJson(project.visualEffects, {animation: 'none', showBadge: false});
      
      // Convert numeric values
      const featured = Boolean(project.featured);
      const showBothImagesInPriority = Boolean(project.showBothImagesInPriority);
      
      return {
        ...project,
        technologies,
        features,
        exclusiveFeatures,
        visualEffects,
        featured,
        showBothImagesInPriority
      };
    } catch (error) {
      console.error('Error processing project from DB:', error);
      // Return the project as is if processing fails
      return project;
    }
  }
  
  // Helper to parse JSON with a fallback
  private parseJson(jsonString: string, fallback: any): any {
    if (!jsonString) return fallback;
    
    try {
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Error parsing JSON:', error);
      return fallback;
    }
  }
  
  // Helper to ensure a value is an array
  private ensureArray(value: any): any[] {
    if (Array.isArray(value)) {
      return value;
    }
    
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch (e) {
        return [];
      }
    }
    
    return [];
  }
  
  // Helper to ensure a value is an object
  private ensureObject(value: any): any {
    if (value === null || value === undefined) {
      return {animation: 'none', showBadge: false};
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      return value;
    }
    
    if (typeof value === 'string') {
      try {
        const parsed = JSON.parse(value);
        return typeof parsed === 'object' && !Array.isArray(parsed) ? 
          parsed : {animation: 'none', showBadge: false};
      } catch (e) {
        return {animation: 'none', showBadge: false};
      }
    }
    
    return {animation: 'none', showBadge: false};
  }
}

const db = new DatabaseService();
export default db; 