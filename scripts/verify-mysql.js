const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

// MySQL connection configuration
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'metro.proxy.rlwy.net',
  port: parseInt(process.env.MYSQL_PORT || '28228', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'ippEdXwIlTCRKIYuCzsvnVqeJjmxufIc',
  database: process.env.MYSQL_DATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function verifyMysqlData() {
  console.log('Starting MySQL verification...');
  console.log('Connection details:');
  console.log(`Host: ${mysqlConfig.host}`);
  console.log(`Port: ${mysqlConfig.port}`);
  console.log(`User: ${mysqlConfig.user}`);
  console.log(`Database: ${mysqlConfig.database}`);
  console.log('-------------------');
  
  try {
    // Create connection
    const connection = await mysql.createConnection(mysqlConfig);
    console.log('Connected to MySQL database ✅');
    
    // Check if projects table exists
    const [tables] = await connection.execute("SHOW TABLES LIKE 'projects'");
    if (tables.length === 0) {
      console.log('❌ Projects table not found!');
      await connection.end();
      return;
    }
    console.log('Projects table exists ✅');
    
    // Count records
    const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    const count = countResult[0].count;
    console.log(`Found ${count} projects in the database ✅`);
    
    if (count > 0) {
      // Get project titles
      const [projects] = await connection.execute('SELECT id, title, category FROM projects');
      console.log('\nProject List:');
      console.log('-------------------');
      projects.forEach(project => {
        console.log(`${project.id}. ${project.title} (${project.category})`);
      });
      
      // Show sample project data
      const [sampleProject] = await connection.execute('SELECT * FROM projects LIMIT 1');
      console.log('\nSample Project Data:');
      console.log('-------------------');
      const project = sampleProject[0];
      
      // Show key fields in a more readable format
      console.log(`ID: ${project.id}`);
      console.log(`Title: ${project.title}`);
      console.log(`Description: ${project.description.substring(0, 100)}...`);
      console.log(`Category: ${project.category}`);
      
      try {
        const technologies = JSON.parse(project.technologies);
        console.log(`Technologies: ${Array.isArray(technologies) ? technologies.join(', ') : technologies}`);
      } catch {
        console.log(`Technologies: ${project.technologies}`);
      }
      
      console.log(`Featured: ${project.featured ? 'Yes' : 'No'}`);
      console.log(`Status: ${project.status || 'Not set'}`);
      console.log(`Last Updated: ${project.last_updated}`);
    }
    
    // Show column information
    const [columns] = await connection.execute('SHOW COLUMNS FROM projects');
    console.log('\nTable Schema:');
    console.log('-------------------');
    columns.forEach(column => {
      console.log(`${column.Field} (${column.Type}${column.Null === 'NO' ? ', NOT NULL' : ''}${column.Key === 'PRI' ? ', PRIMARY KEY' : ''})`);
    });
    
    // Close connection
    await connection.end();
    console.log('\nVerification complete ✅');
    
  } catch (error) {
    console.error('Error during verification:', error);
  }
}

verifyMysqlData(); 