// This script ensures database is properly prepared for Netlify deployment
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

async function main() {
  try {
    console.log('🚀 Starting Netlify specialized build script');
    
    // 1. Check if SQLite database exists
    const dbPath = path.join(process.cwd(), 'db', 'portfolio.db');
    const dbExists = await fs.pathExists(dbPath);
    
    if (!dbExists) {
      console.error('❌ Database file not found:', dbPath);
      process.exit(1);
    }
    
    console.log('✅ Database file found:', dbPath);
    
    // 2. Check for WAL mode files
    const walPath = `${dbPath}-wal`;
    const shmPath = `${dbPath}-shm`;
    
    const walExists = await fs.pathExists(walPath);
    const shmExists = await fs.pathExists(shmPath);
    
    if (walExists || shmExists) {
      console.log('ℹ️ Database is in WAL mode, converting to normal mode for deployment');
      
      // Create a temporary script to checkpoint the database
      const tempScriptPath = path.join(process.cwd(), 'temp-checkpoint.js');
      await fs.writeFile(
        tempScriptPath,
        `
        const Database = require('better-sqlite3');
        const db = new Database('${dbPath.replace(/\\/g, '\\\\')}');
        try {
          // Execute PRAGMA to checkpoint the database (merge WAL into main db file)
          db.pragma('wal_checkpoint(FULL)');
          // Turn off WAL mode
          db.pragma('journal_mode = DELETE');
          console.log('Database checkpoint completed and WAL mode disabled');
        } catch (err) {
          console.error('Error during database checkpoint:', err);
        } finally {
          db.close();
        }
        `
      );
      
      // Execute the script
      try {
        execSync(`node "${tempScriptPath}"`, { stdio: 'inherit' });
        console.log('✅ Successfully prepared database for deployment');
      } catch (error) {
        console.error('❌ Error preparing database:', error);
      } finally {
        // Clean up the temporary script
        await fs.remove(tempScriptPath);
      }
    }
    
    // 3. Run the Next.js build command
    console.log('📦 Running Next.js build');
    execSync('npx next build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
    
    // 4. Ensure the database is copied to the server directory
    const destDir = path.join(process.cwd(), '.next', 'server', 'db');
    await fs.ensureDir(destDir);
    
    const destPath = path.join(destDir, 'portfolio.db');
    await fs.copy(dbPath, destPath);
    console.log(`✅ Database copied to ${destPath}`);
    
  } catch (error) {
    console.error('❌ Build script error:', error);
    process.exit(1);
  }
}

main(); 