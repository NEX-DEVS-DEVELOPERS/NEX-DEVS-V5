// Script to test MySQL connection and set up database tables
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function main() {
  console.log('MySQL Connection Test');
  console.log('--------------------');
  console.log('Connection details:');
  console.log(`Host: ${process.env.MYSQL_HOST || 'metro.proxy.rlwy.net'}`);
  console.log(`Port: ${process.env.MYSQL_PORT || '28228'}`);
  console.log(`User: ${process.env.MYSQL_USER || 'root'}`);
  console.log(`Database: ${process.env.MYSQL_DATABASE || 'railway'}`);
  console.log('--------------------');

  let connection;
  
  try {
    // Create connection
    connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST || 'metro.proxy.rlwy.net',
      port: parseInt(process.env.MYSQL_PORT || '28228', 10),
      user: process.env.MYSQL_USER || 'root',
      password: process.env.MYSQL_PASSWORD || 'ippEdXwIlTCRKIYuCzsvnVqeJjmxufIc',
      database: process.env.MYSQL_DATABASE || 'railway'
    });
    
    console.log('✓ Connection successful!');
    
    // Test query
    const [result] = await connection.execute('SELECT 1+1 AS sum');
    console.log('✓ Test query successful:', result);
    
    // Create projects table
    console.log('Creating projects table if it doesn\'t exist...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        detailed_description TEXT,
        image_url TEXT NOT NULL,
        second_image TEXT,
        show_both_images_in_priority BOOLEAN DEFAULT FALSE,
        category VARCHAR(255) NOT NULL,
        technologies TEXT NOT NULL,
        tech_details TEXT,
        project_link TEXT NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        completion_date VARCHAR(255),
        client_name VARCHAR(255),
        duration VARCHAR(255),
        status VARCHAR(100),
        updated_days INT,
        progress INT,
        development_progress INT,
        estimated_completion VARCHAR(255),
        features TEXT,
        exclusive_features TEXT,
        image_priority INT DEFAULT 5,
        visual_effects TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table creation/verification successful');
    
    // Check if table exists and has data
    const [tables] = await connection.execute('SHOW TABLES');
    console.log('Available tables:', tables.map(t => Object.values(t)[0]).join(', '));
    
    // Insert test data if table is empty
    const [count] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    
    if (count[0].count === 0) {
      try {
        console.log('Inserting test project data...');
        await connection.execute(`
          INSERT INTO projects (
            title, description, image_url, category, technologies, project_link
          ) 
          VALUES (?, ?, ?, ?, ?, ?)
        `, [
          'Test Project', 
          'This is a test project from Railway integration', 
          'https://example.com/image.jpg',
          'Test',
          JSON.stringify(['Node.js', 'MySQL']),
          'https://example.com/project'
        ]);
        console.log('✓ Test data inserted successfully');
      } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
      }
    } else {
      console.log(`Table already has ${count[0].count} records.`);
    }
    
    // Retrieve projects
    const [projects] = await connection.execute('SELECT * FROM projects');
    console.log('Projects:', projects);
    
    console.log('--------------------');
    console.log('✅ All tests passed! MySQL connection and database are working correctly.');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed');
    }
  }
}

main(); 