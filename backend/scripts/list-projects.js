// Script to list all projects in the database
const db = require('../lib/mysql').default;

async function listProjects() {
  try {
    console.log('Testing database connection...');
    const connectionTest = await db.testConnection();
    console.log('Connection test:', connectionTest);
    
    if (!connectionTest.success) {
      console.error('Database connection failed');
      process.exit(1);
    }
    
    console.log('\nFetching all projects...');
    const projects = await db.getProjects();
    console.log(`Total projects: ${projects.length}`);
    
    console.log('\nProjects summary:');
    projects.forEach((project, index) => {
      console.log(`\n[${index + 1}] ${project.title}`);
      console.log(`  ID: ${project.id}`);
      console.log(`  Category: ${project.category}`);
      console.log(`  Featured: ${project.featured ? 'Yes' : 'No'}`);
      console.log(`  Technologies: ${project.technologies.join(', ')}`);
    });
    
    console.log('\nCategories:');
    const categories = await db.getUniqueCategories();
    console.log(categories);
    
    console.log('\nFeatured projects:');
    const featuredProjects = await db.getFeaturedProjects();
    featuredProjects.forEach((project, index) => {
      console.log(`  ${index + 1}. ${project.title} (ID: ${project.id})`);
    });
    
    console.log('\nNote: A raw database query result for the first project:');
    // Show the raw database result for the first project (for debugging)
    const rawResult = await db.query('SELECT * FROM projects LIMIT 1');
    console.log('Raw DB fields:', Object.keys(rawResult[0]).join(', '));
    
    process.exit(0);
  } catch (error) {
    console.error('Error listing projects:', error);
    process.exit(1);
  }
}

// Run the function
listProjects().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
}); 