// Script to seed the database with test projects
const db = require('../lib/mysql').default;

// Array of test projects
const testProjects = [
  {
    title: 'Test Project 1',
    description: 'This is a test project to demonstrate the portfolio',
    image_url: '/placeholder-image.jpg',
    category: 'Web Development',
    technologies: ['React', 'Next.js', 'TailwindCSS'],
    project_link: 'https://example.com/project1',
    featured: true
  },
  {
    title: 'Test Project 2',
    description: 'Another test project with different category',
    image_url: '/placeholder-image.jpg',
    category: 'Mobile App',
    technologies: ['React Native', 'Firebase', 'TypeScript'],
    project_link: 'https://example.com/project2',
    featured: false
  },
  {
    title: 'Test Project 3',
    description: 'A featured project in design category',
    image_url: '/placeholder-image.jpg',
    category: 'Design',
    technologies: ['Figma', 'Photoshop', 'Illustrator'],
    project_link: 'https://example.com/project3',
    featured: true
  },
  {
    title: 'NEX-WEBS Tools',
    description: 'A comprehensive suite of web tools for developers and marketers',
    image_url: '/placeholder-image.jpg',
    category: 'Web Development',
    technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
    project_link: 'https://example.com/nex-webs',
    featured: true
  },
  {
    title: 'NEXTJS-WEBSITE',
    description: 'A creative portfolio website with interactive elements',
    image_url: '/placeholder-image.jpg',
    category: 'Web Development',
    technologies: ['Next.js', 'TailwindCSS', 'Framer Motion'],
    project_link: 'https://example.com/nextjs-website',
    featured: false
  }
];

// Function to seed the database
async function seedProjects() {
  console.log('Starting database initialization...');
  const initialized = await db.initDatabase();
  
  if (!initialized) {
    console.error('Failed to initialize database');
    process.exit(1);
  }
  
  console.log('Database initialized successfully');
  
  // Check connection
  const connectionTest = await db.testConnection();
  console.log('Connection test:', connectionTest);
  
  if (!connectionTest.success) {
    console.error('Database connection failed');
    process.exit(1);
  }
  
  console.log('Adding test projects...');
  
  // Clear existing projects (optional)
  try {
    // Careful! This deletes all projects
    // console.log('Clearing existing projects...');
    // await db.query('DELETE FROM projects');
    
    // Instead, let's just check if we already have projects
    const existingProjects = await db.getProjects();
    console.log(`Found ${existingProjects.length} existing projects`);
    
    if (existingProjects.length > 0) {
      console.log('Projects already exist. Skipping seed...');
      const categories = await db.getUniqueCategories();
      console.log('Current categories:', categories);
      process.exit(0);
    }
  } catch (error) {
    console.error('Error checking existing projects:', error);
  }
  
  // Add each test project
  for (const project of testProjects) {
    try {
      console.log(`Adding project: ${project.title}`);
      await db.createProject(project);
    } catch (error) {
      console.error(`Error adding project ${project.title}:`, error);
    }
  }
  
  // Verify projects were added
  const projects = await db.getProjects();
  console.log(`Total projects in database: ${projects.length}`);
  
  console.log('Seed completed successfully!');
  process.exit(0);
}

// Run the seed function
seedProjects().catch(error => {
  console.error('Seed script error:', error);
  process.exit(1);
}); 