// Script to seed Railway MySQL database with sample projects
require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

const sampleProjects = [
  {
    title: 'Portfolio Website',
    description: 'A modern portfolio website built with Next.js and Tailwind CSS',
    image_url: '/projects/portfolio.jpg',
    category: 'Web Development',
    technologies: JSON.stringify(['Next.js', 'React', 'Tailwind CSS', 'MySQL']),
    project_link: 'https://nex-devs.vercel.app',
    featured: true,
    status: 'Completed',
    progress: 100,
    development_progress: 100
  },
  {
    title: 'E-commerce Platform',
    description: 'A full-featured e-commerce platform with modern design',
    image_url: '/projects/ecommerce.jpg',
    category: 'E-commerce',
    technologies: JSON.stringify(['React', 'Node.js', 'Express', 'MongoDB']),
    project_link: 'https://example.com/ecommerce',
    featured: true,
    status: 'In Development',
    progress: 75,
    development_progress: 80
  }
];

async function seedDatabase() {
  console.log('Starting database seeding...');
  
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'metro.proxy.rlwy.net',
    port: parseInt(process.env.MYSQL_PORT || '28228', 10),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'ippEdXwIlTCRKIYuCzsvnVqeJjmxufIc',
    database: process.env.MYSQL_DATABASE || 'railway',
    ssl: {
      // This is needed to work with self-signed certificates
      rejectUnauthorized: false
    }
  });

  try {
    // Check if table exists and create if it doesn't
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

    // Check if we already have projects
    const [existingProjects] = await connection.execute('SELECT COUNT(*) as count FROM projects');
    
    if (existingProjects[0].count === 0) {
      console.log('No existing projects found, seeding sample data...');
      
      // Insert sample projects
      for (const project of sampleProjects) {
        await connection.execute(`
          INSERT INTO projects (
            title, description, image_url, category, technologies,
            project_link, featured, status, progress, development_progress
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
          project.title,
          project.description,
          project.image_url,
          project.category,
          project.technologies,
          project.project_link,
          project.featured,
          project.status,
          project.progress,
          project.development_progress
        ]);
      }
      
      console.log('Sample projects seeded successfully!');
    } else {
      console.log(`Found ${existingProjects[0].count} existing projects, skipping seeding.`);
    }

    // Verify the data
    const [projects] = await connection.execute('SELECT * FROM projects');
    console.log(`Total projects in database: ${projects.length}`);
    projects.forEach(project => {
      console.log(`- ${project.title} (${project.category})`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the seeding
seedDatabase()
  .then(() => {
    console.log('Database seeding completed successfully');
    process.exit(0);
  })
  .catch(error => {
    console.error('Database seeding failed:', error);
    process.exit(1);
  }); 