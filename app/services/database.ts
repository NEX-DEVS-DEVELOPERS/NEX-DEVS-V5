// Install required dependencies for SQLite
// npm install sqlite sqlite3 --save
// Comment out the imports that are causing errors if not installed
// import sqlite3 from 'sqlite3';
// import { open, Database } from 'sqlite';
import path from 'path';
import fs from 'fs/promises';
import { existsSync } from 'fs';

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

// Constants
const DB_FILE = path.join(process.cwd(), 'projects.db');
const JSON_FALLBACK_FILE = path.join(process.cwd(), 'projects.json');
const NETLIFY_ENV = process.env.NETLIFY || false;
const IS_PROD = process.env.NODE_ENV === 'production';
const USE_JSON_FALLBACK = IS_PROD || NETLIFY_ENV;

// Store in-memory version of projects when in production
let cachedProjects: Project[] = [];
let jsonLastModified: Date | null = null;

// Log environment info
console.log(`Database mode: ${USE_JSON_FALLBACK ? 'JSON fallback' : 'SQLite'}`);
console.log(`Running in ${IS_PROD ? 'production' : 'development'} environment`);
console.log(`Netlify environment: ${NETLIFY_ENV ? 'true' : 'false'}`);

class DatabaseService {
  private db: Database | null = null;
  
  constructor() {
    if (!USE_JSON_FALLBACK) {
      // Initialize SQLite in development
      this.initSqlite().catch(err => {
        console.error('Failed to initialize SQLite database:', err);
      });
    } else {
      // Initialize JSON fallback in production
      this.loadJsonData().catch(err => {
        console.error('Failed to load JSON data:', err);
      });
    }
  }
  
  // Initialize SQLite database
  private async initSqlite(): Promise<void> {
    try {
      // For Vercel deployment, we'll primarily use JSON fallback
      // This code will only run in development environment
      if (USE_JSON_FALLBACK) {
        console.log('Using JSON fallback, skipping SQLite initialization');
        return;
      }
      
      try {
        // Dynamically import SQLite modules
        const sqlite3 = await import('sqlite3').then(m => m.default);
        const { open } = await import('sqlite');
        
        this.db = await open({
          filename: DB_FILE,
          driver: sqlite3.Database
        });
        
        console.log('SQLite database opened successfully');
      } catch (importError) {
        console.error('Failed to import SQLite modules:', importError);
        console.log('Falling back to JSON storage');
        return;
      }
      
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
      console.error('Error initializing database:', error);
      console.log('Falling back to JSON storage due to initialization error');
    }
  }
  
  // Load JSON data for production environment
  private async loadJsonData(): Promise<void> {
    try {
      // Check if JSON file exists
      const jsonExists = existsSync(JSON_FALLBACK_FILE);
      
      if (jsonExists) {
        // Get file stats to check last modified time
        const stats = await fs.stat(JSON_FALLBACK_FILE);
        const fileModified = stats.mtime;
        
        // Only reload if the file has been modified or we haven't loaded it yet
        if (!jsonLastModified || fileModified > jsonLastModified) {
          console.log('Loading projects from JSON file');
          const jsonData = await fs.readFile(JSON_FALLBACK_FILE, 'utf-8');
          cachedProjects = JSON.parse(jsonData);
          jsonLastModified = fileModified;
          console.log(`Loaded ${cachedProjects.length} projects from JSON`);
        } else {
          console.log('Using cached projects (JSON file has not changed)');
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
    if (USE_JSON_FALLBACK) {
      try {
        console.log('Saving projects to JSON file');
        await fs.writeFile(JSON_FALLBACK_FILE, JSON.stringify(cachedProjects, null, 2));
        jsonLastModified = new Date();
        console.log(`Saved ${cachedProjects.length} projects to JSON`);
      } catch (error) {
        console.error('Error saving JSON data:', error);
      }
    }
  }
  
  // Get all projects
  async getAllProjects(): Promise<Project[]> {
    try {
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