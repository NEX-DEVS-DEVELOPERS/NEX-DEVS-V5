import mysql from 'mysql2/promise';

async function main() {
  // Connection pool configuration using environment variables
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'metro.proxy.rlwy.net',
    port: parseInt(process.env.MYSQL_PORT || '28228', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'ippEdXwIlTCRKIYuCzsvnVqeJjmxufIc',
    database: process.env.MYSQL_DATABASE || 'railway',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    ssl: process.env.NODE_ENV === 'production' ? {} : undefined
  });

  try {
    console.log('Connected to MySQL database. Starting schema update...');

    // Check if code screenshot columns already exist
    const [columns] = await pool.execute("SHOW COLUMNS FROM projects LIKE 'is_code_screenshot'");
    
    if (columns.length > 0) {
      console.log('Code screenshot fields already exist in the database schema.');
    } else {
      console.log('Adding code screenshot fields to the database schema...');
      
      // Add the new columns for code screenshots
      await pool.execute(`
        ALTER TABLE projects 
        ADD COLUMN is_code_screenshot BOOLEAN DEFAULT FALSE,
        ADD COLUMN code_language VARCHAR(255),
        ADD COLUMN code_title VARCHAR(255),
        ADD COLUMN code_content TEXT,
        ADD COLUMN use_direct_code_input BOOLEAN DEFAULT FALSE
      `);
      
      console.log('Database schema updated successfully!');
    }

    // Test the connection by selecting a few rows
    const [rows] = await pool.execute('SELECT id, title FROM projects LIMIT 5');
    
    console.log('Sample projects from database:');
    rows.forEach(row => {
      console.log(`- ID: ${row.id}, Title: ${row.title}`);
    });

    console.log('Schema update completed successfully!');
  } catch (error) {
    console.error('Error updating database schema:', error);
  } finally {
    await pool.end();
    console.log('Database connection closed.');
  }
}

main().catch(console.error); 