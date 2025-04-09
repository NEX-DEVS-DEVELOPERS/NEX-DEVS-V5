import db from '../services/database';

// Initialize the database when the app starts
let initialized = false;

export async function initializeDatabase() {
  if (initialized) {
    return;
  }
  
  try {
    // Only run on the server
    if (typeof window === 'undefined') {
      console.log('Initializing database...');
      
      // Force database initialization by getting all projects
      await db.getAllProjects();
      
      console.log('Database initialization completed');
    }
    
    initialized = true;
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Export a function to check if the DB is ready
export function isDatabaseReady() {
  return initialized;
} 