import { initDatabase } from '@/backend/lib/neon';

// Initialize the database when the app starts
let initialized = false;
let initPromise: Promise<void> | null = null;

export async function initializeDatabase() {
  // Return existing promise if initialization is already in progress
  if (initPromise) {
    return initPromise;
  }
  
  // Return immediately if already initialized
  if (initialized) {
    return Promise.resolve();
  }
  
  // Create the initialization promise
  initPromise = (async () => {
    try {
      // Only run on the server
      if (typeof window === 'undefined') {
        console.log('Initializing Neon PostgreSQL database (singleton)...');
        await initDatabase();
        console.log('Database initialization completed (singleton)');
        initialized = true;
      }
    } catch (error) {
      console.error('Error initializing database:', error);
      // Reset the promise so we can try again
      initPromise = null;
      throw error;
    }
  })();
  
  return initPromise;
}

// Export a function to check if the DB is ready
export function isDatabaseReady() {
  return initialized;
} 