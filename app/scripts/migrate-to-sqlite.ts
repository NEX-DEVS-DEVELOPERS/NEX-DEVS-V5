import { migrateJsonToSqlite } from '../services/database';

// Run the migration
async function runMigration() {
  console.log('Starting migration from JSON to SQLite...');
  
  try {
    await migrateJsonToSqlite();
    console.log('Migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

// Execute the migration
runMigration(); 
