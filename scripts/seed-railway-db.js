// Script to seed Railway MySQL database with sample projects
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

// Sample projects data
const sampleProjects = [
  {
    title: 'E-commerce Platform',
    description: 'A fully-featured e-commerce platform built with Next.js and MySQL',
    image_url: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?ixlib=rb-4.0.3&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    project_link: 'https://example.com/ecommerce'
  },
  {
    title: 'Portfolio Website',
    description: 'A modern portfolio website showcasing my work and skills',
    image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80',
    project_link: 'https://example.com/portfolio'
  },
  {
    title: 'Task Management App',
    description: 'A productivity app to manage tasks and projects with team collaboration features',
    image_url: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1744&q=80',
    project_link: 'https://example.com/tasks'
  },
  {
    title: 'Weather Dashboard',
    description: 'Real-time weather information dashboard with interactive maps and forecasts',
    image_url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1665&q=80',
    project_link: 'https://example.com/weather'
  },
  {
    title: 'Social Media App',
    description: 'A social networking platform with real-time messaging and content sharing',
    image_url: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1674&q=80',
    project_link: 'https://example.com/social'
  }
];

async function seedDatabase() {
  console.log('Railway MySQL Database Seeder');
  console.log('-----------------------------');
  console.log('Connection details:');
  console.log(`Host: ${process.env.MYSQL_HOST || 'metro.proxy.rlwy.net'}`);
  console.log(`Port: ${process.env.MYSQL_PORT || '28228'}`);
  console.log(`User: ${process.env.MYSQL_USER || 'root'}`);
  console.log(`Database: ${process.env.MYSQL_DATABASE || 'railway'}`);
  console.log('-----------------------------');

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
    
    // Create projects table if it doesn't exist
    console.log('Creating projects table if it doesn\'t exist...');
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_url TEXT NOT NULL,
        project_link TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Table creation/verification successful');
    
    // Check existing projects
    const [existingProjects] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    const count = existingProjects[0].count;
    
    // Ask if user wants to clear existing projects
    if (count > 0) {
      console.log(`Database already has ${count} projects.`);
      const prompt = await askQuestion('Would you like to clear existing projects before seeding? (y/n): ');
      
      if (prompt.toLowerCase() === 'y') {
        console.log('Clearing existing projects...');
        await connection.execute('TRUNCATE TABLE projects');
        console.log('✓ Projects table cleared');
      } else {
        console.log('Keeping existing projects, will add sample projects');
      }
    }
    
    // Seed sample projects
    console.log('Seeding sample projects...');
    for (const project of sampleProjects) {
      await connection.execute(`
        INSERT INTO projects (title, description, image_url, project_link) 
        VALUES (?, ?, ?, ?)
      `, [
        project.title,
        project.description,
        project.image_url,
        project.project_link
      ]);
    }
    console.log(`✓ Successfully added ${sampleProjects.length} sample projects`);
    
    // Retrieve projects
    const [projects] = await connection.execute('SELECT id, title FROM projects');
    console.log('Current projects in database:');
    projects.forEach(p => console.log(`- [${p.id}] ${p.title}`));
    
    console.log('-----------------------------');
    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    if (connection) {
      await connection.end();
      console.log('Connection closed');
    }
    process.exit(0);
  }
}

// Simple function to ask a question and get a response
function askQuestion(question) {
  const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve => {
    readline.question(question, answer => {
      readline.close();
      resolve(answer);
    });
  });
}

seedDatabase(); 