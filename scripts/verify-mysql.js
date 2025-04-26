const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function verifyConnection() {
  console.log('Verifying MySQL connection...');
  
  const config = {
    host: process.env.MYSQL_HOST || 'metro.proxy.rlwy.net',
    port: parseInt(process.env.MYSQL_PORT || '28228', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'ippEdXwIlTCRKIYuCzsvnVqeJjmxufIc',
    database: process.env.MYSQL_DATABASE || 'railway',
    ssl: process.env.NODE_ENV === 'production' ? {} : undefined
  };

  try {
    console.log(`Attempting to connect to MySQL at ${config.host}:${config.port}`);
    const connection = await mysql.createConnection(config);
    
    console.log('Successfully connected to MySQL');
    
    // Test query
    const [result] = await connection.execute('SELECT 1 as test');
    console.log('Test query successful:', result);
    
    // Check if projects table exists
    const [tables] = await connection.execute('SHOW TABLES LIKE "projects"');
    if (tables.length === 0) {
      console.log('Projects table does not exist, creating it...');
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
          is_code_screenshot BOOLEAN DEFAULT FALSE,
          code_language VARCHAR(255),
          code_title VARCHAR(255),
          code_content TEXT,
          use_direct_code_input BOOLEAN DEFAULT FALSE,
          last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.log('Projects table created successfully');
    } else {
      console.log('Projects table already exists');
      
      // Count projects
      const [count] = await connection.execute('SELECT COUNT(*) as count FROM projects');
      console.log(`Found ${count[0].count} projects in the database`);
    }
    
    await connection.end();
    console.log('MySQL connection closed');
    return true;
  } catch (error) {
    console.error('MySQL connection error:', error);
    return false;
  }
}

// Run the verification
verifyConnection()
  .then(success => {
    if (!success) {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Verification script error:', error);
    process.exit(1);
  }); 