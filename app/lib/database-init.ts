import { initDatabase } from '@/lib/neon';

// Initialize the database when the app starts
let initialized = false;

export async function initializeDatabase() {
  if (initialized) {
    return;
  }
  
  try {
    // Only run on the server
    if (typeof window === 'undefined') {
      console.log('Initializing Neon PostgreSQL database...');
      await initDatabase();
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