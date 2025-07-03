// Script to load sample data to Neon PostgreSQL
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

// Neon connection - use connection string directly
const NEON_CONNECTION_STRING = 'postgresql://NEX-DEVS%20DATABSE_owner:npg_Av9imV5KFXhy@ep-nameless-frog-a1x6ujuj-pooler.ap-southeast-1.aws.neon.tech/NEX-DEVS%20DATABSE?sslmode=require';
const neonSql = neon(NEON_CONNECTION_STRING);

// Sample projects data
const sampleProjects = [
  {
    title: "Portfolio Website",
    description: "A personal portfolio website showcasing my projects and skills",
    detailed_description: "A responsive portfolio website built with Next.js and Tailwind CSS. Features include dark mode, animations, and a contact form.",
    image_url: "https://example.com/portfolio.jpg",
    second_image: "https://example.com/portfolio-2.jpg",
    show_both_images_in_priority: false,
    category: "Web Development",
    technologies: JSON.stringify(["Next.js", "React", "Tailwind CSS", "Framer Motion"]),
    tech_details: JSON.stringify({
      frontend: "Next.js, React, Tailwind CSS",
      backend: "Next.js API Routes",
      database: "PostgreSQL",
      deployment: "Vercel"
    }),
    project_link: "https://example.com",
    featured: true,
    completion_date: "2023-12-01",
    client_name: "Personal Project",
    duration: "2 months",
    status: "Completed",
    updated_days: 5,
    progress: 100,
    development_progress: 100,
    estimated_completion: "Completed",
    features: JSON.stringify(["Responsive Design", "Dark Mode", "Project Showcase", "Contact Form"]),
    exclusive_features: JSON.stringify(["Custom Animations", "SEO Optimization"]),
    image_priority: 1,
    visual_effects: JSON.stringify(["Parallax Scrolling", "Smooth Transitions"]),
    is_code_screenshot: false
  },
  {
    title: "E-commerce Platform",
    description: "A full-featured e-commerce platform with payment integration",
    detailed_description: "An e-commerce platform built with Next.js, featuring product listings, cart functionality, user authentication, and Stripe payment integration.",
    image_url: "https://example.com/ecommerce.jpg",
    second_image: "https://example.com/ecommerce-2.jpg",
    show_both_images_in_priority: true,
    category: "Web Development",
    technologies: JSON.stringify(["Next.js", "React", "MongoDB", "Stripe"]),
    tech_details: JSON.stringify({
      frontend: "Next.js, React, Tailwind CSS",
      backend: "Next.js API Routes, Node.js",
      database: "MongoDB",
      payment: "Stripe",
      deployment: "Vercel"
    }),
    project_link: "https://example.com/ecommerce",
    featured: true,
    completion_date: "2023-10-15",
    client_name: "E-Shop Inc.",
    duration: "4 months",
    status: "Completed",
    updated_days: 10,
    progress: 100,
    development_progress: 100,
    estimated_completion: "Completed",
    features: JSON.stringify(["Product Listings", "Shopping Cart", "User Authentication", "Payment Processing"]),
    exclusive_features: JSON.stringify(["Wishlist", "Order Tracking", "Admin Dashboard"]),
    image_priority: 2,
    visual_effects: JSON.stringify(["Image Zoom", "Cart Animation"]),
    is_code_screenshot: false
  },
  {
    title: "Task Management App",
    description: "A Trello-like task management application",
    detailed_description: "A drag-and-drop task management application with boards, lists, and cards. Features include user authentication, task assignments, due dates, and notifications.",
    image_url: "https://example.com/taskapp.jpg",
    second_image: null,
    show_both_images_in_priority: false,
    category: "Web Application",
    technologies: JSON.stringify(["React", "Node.js", "Express", "MongoDB"]),
    tech_details: JSON.stringify({
      frontend: "React, Redux, Material-UI",
      backend: "Node.js, Express",
      database: "MongoDB",
      deployment: "Heroku"
    }),
    project_link: "https://example.com/taskapp",
    featured: false,
    completion_date: "2023-08-20",
    client_name: "TaskMaster LLC",
    duration: "3 months",
    status: "Completed",
    updated_days: 30,
    progress: 100,
    development_progress: 100,
    estimated_completion: "Completed",
    features: JSON.stringify(["Drag-and-Drop Interface", "Task Lists", "User Authentication", "Task Assignments"]),
    exclusive_features: JSON.stringify(["Due Date Reminders", "Activity Log"]),
    image_priority: 3,
    visual_effects: JSON.stringify(["Drag Animation", "Card Flip"]),
    is_code_screenshot: false
  }
];

// Create projects table if it doesn't exist
async function createNeonTables() {
  console.log('Creating projects table in Neon PostgreSQL if it doesn\'t exist...');
  
  // Create projects table in PostgreSQL
  await neonSql`
    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      detailed_description TEXT,
      image_url TEXT NOT NULL,
      second_image TEXT,
      show_both_images_in_priority BOOLEAN DEFAULT FALSE,
      category VARCHAR(255) NOT NULL,
      technologies JSONB NOT NULL,
      tech_details JSONB,
      project_link TEXT NOT NULL,
      featured BOOLEAN DEFAULT FALSE,
      completion_date VARCHAR(255),
      client_name VARCHAR(255),
      duration VARCHAR(255),
      status VARCHAR(100),
      updated_days INTEGER,
      progress INTEGER,
      development_progress INTEGER,
      estimated_completion VARCHAR(255),
      features JSONB,
      exclusive_features JSONB,
      image_priority INTEGER DEFAULT 5,
      visual_effects JSONB,
      is_code_screenshot BOOLEAN DEFAULT FALSE,
      code_language VARCHAR(255),
      code_title VARCHAR(255),
      code_content TEXT,
      use_direct_code_input BOOLEAN DEFAULT FALSE,
      last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;
  console.log('Projects table created/verified in Neon PostgreSQL.');
}

async function loadSampleData() {
  console.log('Starting sample data load to Neon PostgreSQL...');
  
  try {
    // Create tables if they don't exist
    await createNeonTables();
    
    // Check if we should clear existing data
    const shouldClearExisting = process.argv.includes('--clear');
    if (shouldClearExisting) {
      console.log('Clearing existing projects from Neon PostgreSQL...');
      await neonSql`TRUNCATE TABLE projects RESTART IDENTITY`;
      console.log('Existing projects cleared from Neon PostgreSQL.');
    }
    
    // Insert sample projects
    console.log('Inserting sample projects into Neon PostgreSQL...');
    let successCount = 0;
    let errorCount = 0;
    
    for (const project of sampleProjects) {
      try {
        // Insert using proper tagged template syntax
        const result = await neonSql`
          INSERT INTO projects (
            title, description, detailed_description, image_url, second_image,
            show_both_images_in_priority, category, technologies, tech_details,
            project_link, featured, completion_date, client_name, duration,
            status, updated_days, progress, development_progress, estimated_completion,
            features, exclusive_features, image_priority, visual_effects, is_code_screenshot
          ) VALUES (
            ${project.title}, ${project.description}, ${project.detailed_description}, 
            ${project.image_url}, ${project.second_image}, ${project.show_both_images_in_priority},
            ${project.category}, ${project.technologies}, ${project.tech_details},
            ${project.project_link}, ${project.featured}, ${project.completion_date},
            ${project.client_name}, ${project.duration}, ${project.status},
            ${project.updated_days}, ${project.progress}, ${project.development_progress},
            ${project.estimated_completion}, ${project.features}, ${project.exclusive_features},
            ${project.image_priority}, ${project.visual_effects}, ${project.is_code_screenshot}
          )
          RETURNING id
        `;
        
        console.log(`✅ Inserted sample project "${project.title}" with ID: ${result[0].id}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to insert project "${project.title}":`, error);
        errorCount++;
      }
    }
    
    console.log(`Sample data load complete. ${successCount} projects inserted successfully, ${errorCount} failed.`);
    
    // Query to verify the data
    console.log('Verifying data in Neon PostgreSQL...');
    const projects = await neonSql`SELECT id, title, featured FROM projects ORDER BY id`;
    console.log('Projects in database:', projects);
    
    return { success: successCount, errors: errorCount };
  } catch (error) {
    console.error('Sample data load failed:', error);
    return { success: 0, errors: 1, error: error.message };
  }
}

// Run the data load
loadSampleData().then(result => {
  console.log('Sample data load stats:', result);
  process.exit(result.errors ? 1 : 0);
}).catch(error => {
  console.error('Unhandled error during sample data load:', error);
  process.exit(1);
}); 