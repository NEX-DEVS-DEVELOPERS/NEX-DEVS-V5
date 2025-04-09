// Install required dependencies for SQLite
// npm install sqlite sqlite3 --save
// Comment out the imports that are causing errors if not installed
// import sqlite3 from 'sqlite3';
// import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

// Constants and environment detection
const isServer = typeof window === 'undefined';
const NETLIFY_ENV = process.env.NETLIFY === 'true';
const VERCEL_ENV = process.env.VERCEL === 'true';
const IS_PROD = process.env.NODE_ENV === 'production';
const IS_SERVERLESS = NETLIFY_ENV || VERCEL_ENV || IS_PROD;
const USE_JSON_FALLBACK = IS_SERVERLESS;

// Determine storage locations for different environments
const TEMP_DIR = process.env.TEMP || process.env.TMP || '/tmp';
const DB_FILE = isServer ? path.join(process.cwd(), 'projects.db') : ':memory:';
// Make sure JSON_FALLBACK_FILE is never null to avoid TypeScript errors
const JSON_FALLBACK_FILE = isServer ? path.join(process.cwd(), 'projects.json') : path.join(process.cwd(), 'projects.json');

// Netlify specific settings - use tmp directory for server functions
const NETLIFY_STORAGE_DIR = NETLIFY_ENV ? TEMP_DIR : process.cwd();
const STORAGE_FILE = NETLIFY_ENV && isServer
  ? path.join(NETLIFY_STORAGE_DIR, 'projects.json')
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

// In-memory cache for projects data
let cachedProjects: Project[] = [];
let cacheInitialized = false;
let lastCacheUpdate = 0;

// Log environment info for debugging
console.log(`Database settings:
  - Environment: ${NETLIFY_ENV ? 'Netlify' : VERCEL_ENV ? 'Vercel' : IS_PROD ? 'Production' : 'Development'}
  - Storage Type: ${USE_JSON_FALLBACK ? 'JSON fallback' : 'SQLite'}
  - Storage File: ${STORAGE_FILE || 'None (in-memory only)'}
  - Is Server: ${isServer}
`);

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
    // Skip if not on server side
    if (!isServer) {
      console.log('Client-side detected, using in-memory cache only');
      return;
    }
    
    try {
      // If cached data is recent (less than 10 seconds old), use it
      const now = Date.now();
      if (cacheInitialized && (now - lastCacheUpdate < 10000)) {
        console.log('Using recent in-memory cache');
        return;
      }
      
      // Netlify-specific handling for persistent storage
      if (NETLIFY_ENV) {
        let jsonData = '[]';
        let storageFile = STORAGE_FILE;
        
        // Try multiple possible file locations
        const possibleLocations = [
          STORAGE_FILE,
          path.join('/tmp', 'projects.json'),
          path.join(process.cwd(), '.tmp', 'projects.json'),
          path.join(process.cwd(), 'projects.json')
        ];
        
        for (const location of possibleLocations) {
          try {
            if (existsSync(location)) {
              jsonData = await fs.readFile(location, 'utf-8');
              storageFile = location;
              console.log(`Found and loaded projects data from: ${location}`);
              break;
            }
          } catch (err) {
            console.log(`No data at ${location}`);
          }
        }
        
        // Parse the JSON data
        try {
          const parsedData = JSON.parse(jsonData);
          if (Array.isArray(parsedData)) {
            cachedProjects = parsedData;
            cacheInitialized = true;
            lastCacheUpdate = now;
            console.log(`Loaded ${cachedProjects.length} projects from ${storageFile}`);
          } else {
            console.error('Invalid JSON data format, expected array');
            cachedProjects = [];
          }
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          // Default to empty array if parsing fails
          cachedProjects = [];
        }
        
        // If no projects found, try to create the storage file
        if (cachedProjects.length === 0) {
          try {
            // Ensure the directory exists
            await fs.mkdir(path.dirname(STORAGE_FILE), { recursive: true }).catch(() => {});
            
            // Create empty projects file if it doesn't exist
            if (!existsSync(STORAGE_FILE)) {
              await fs.writeFile(STORAGE_FILE, JSON.stringify([]), 'utf-8');
              console.log(`Created empty projects file at ${STORAGE_FILE}`);
            }
          } catch (createError) {
            console.warn('Error creating storage file:', createError);
          }
        }
        
        return;
      }
      
      // Standard JSON loading for non-Netlify environments
      if (JSON_FALLBACK_FILE && existsSync(JSON_FALLBACK_FILE)) {
        const jsonData = await fs.readFile(JSON_FALLBACK_FILE, 'utf-8');
        
        try {
          const parsedData = JSON.parse(jsonData);
          if (Array.isArray(parsedData)) {
            cachedProjects = parsedData;
            cacheInitialized = true;
            lastCacheUpdate = now;
            console.log(`Loaded ${cachedProjects.length} projects from JSON file`);
          } else {
            console.error('Invalid JSON data format, expected array');
            cachedProjects = [];
          }
        } catch (jsonError) {
          console.error('JSON parsing error:', jsonError);
          cachedProjects = [];
        }
      } else {
        console.log('JSON fallback file does not exist, using empty projects array');
        cachedProjects = [];
      }
    } catch (error) {
      console.error('Error loading JSON data:', error);
      cachedProjects = [];
    }
  }
  
  // Save JSON data for production environment
  private async saveJsonData(): Promise<void> {
    // Skip if not server-side
    if (!isServer) {
      console.log('Client-side detected, not saving JSON data');
      return;
    }
    
    // Update cache timestamp
    lastCacheUpdate = Date.now();
    
    // If using JSON fallback in production
    if (USE_JSON_FALLBACK) {
      try {
        console.log('Saving projects to JSON storage');
        
        // For Netlify, use the temp directory
        if (NETLIFY_ENV) {
          const storageFile = STORAGE_FILE;
          
          try {
            // Ensure directory exists
            await fs.mkdir(path.dirname(storageFile), { recursive: true }).catch(() => {});
            
            // Write projects data to storage file
            await fs.writeFile(storageFile, JSON.stringify(cachedProjects, null, 2), 'utf-8');
            console.log(`Saved ${cachedProjects.length} projects to ${storageFile}`);
            
            // Also try to write to alternative locations as backup
            if (storageFile.includes('/tmp/')) {
              try {
                // Try to write to the root projects.json as well
                const altFile = path.join(process.cwd(), 'projects.json');
                await fs.writeFile(altFile, JSON.stringify(cachedProjects, null, 2), 'utf-8');
                console.log(`Also saved to ${altFile} as backup`);
              } catch (altError) {
                console.log('Could not save to alternate location:', altError);
              }
            }
          } catch (writeError) {
            console.error(`Error writing to ${storageFile}:`, writeError);
            
            // Try fallback location
            try {
              const fallbackFile = path.join('/tmp', 'projects.json');
              await fs.writeFile(fallbackFile, JSON.stringify(cachedProjects, null, 2), 'utf-8');
              console.log(`Saved to fallback location ${fallbackFile}`);
            } catch (fallbackError) {
              console.error('Error saving to fallback location:', fallbackError);
              throw fallbackError;
            }
          }
        } else if (JSON_FALLBACK_FILE) {
          // Standard file saving for non-Netlify environments
          await fs.writeFile(JSON_FALLBACK_FILE, JSON.stringify(cachedProjects, null, 2), 'utf-8');
          console.log(`Saved ${cachedProjects.length} projects to JSON file`);
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