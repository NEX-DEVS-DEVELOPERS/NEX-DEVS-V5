// Script to fix any issues with projects that would prevent them from displaying
const db = require('../lib/mysql').default;

async function fixDisplay() {
  try {
    console.log('Testing database connection...');
    const connectionTest = await db.testConnection();
    
    if (!connectionTest.success) {
      console.error('Database connection failed');
      process.exit(1);
    }
    
    console.log('Connection successful, proceeding with fixes...');
    
    // 1. Fix technologies to ensure they're all arrays
    console.log('\n1. Fixing technologies arrays...');
    const projects = await db.query('SELECT id, title, technologies FROM projects');
    for (const project of projects) {
      let technologies = project.technologies;
      let needsUpdate = false;
      
      if (typeof technologies === 'string') {
        try {
          technologies = JSON.parse(technologies);
          if (!Array.isArray(technologies)) {
            technologies = [String(technologies)];
            needsUpdate = true;
          }
        } catch (e) {
          technologies = technologies.split(',').map(t => t.trim());
          needsUpdate = true;
        }
      } else if (!Array.isArray(technologies)) {
        technologies = ['Default Technology'];
        needsUpdate = true;
      } else if (technologies.length === 0) {
        technologies = ['Default Technology'];
        needsUpdate = true;
      }
      
      if (needsUpdate) {
        console.log(`Updating technologies for project ${project.id}: ${project.title}`);
        await db.query(
          'UPDATE projects SET technologies = ? WHERE id = ?',
          [JSON.stringify(technologies), project.id]
        );
      }
    }
    
    // 2. Fix any missing images
    console.log('\n2. Fixing missing image URLs...');
    await db.query("UPDATE projects SET image_url = '/placeholder-image.jpg' WHERE image_url IS NULL OR image_url = ''");
    
    // 3. Fix any missing links
    console.log('\n3. Fixing missing project links...');
    await db.query("UPDATE projects SET project_link = 'https://example.com' WHERE project_link IS NULL OR project_link = ''");
    
    // 4. Fix any missing categories
    console.log('\n4. Fixing missing categories...');
    await db.query("UPDATE projects SET category = 'Uncategorized' WHERE category IS NULL OR category = ''");
    
    // 5. Create a fresh test project
    console.log('\n5. Adding a fresh test project...');
    const testProject = {
      title: 'Fresh Test Project',
      description: 'This is a fresh test project added to ensure display works properly',
      image_url: '/placeholder-image.jpg',
      category: 'Testing',
      technologies: ['React', 'Next.js', 'Node.js'],
      project_link: 'https://example.com/test',
      featured: true,
      status: 'In Development',
      updatedDays: 1,
      progress: 75
    };
    
    try {
      const createdProject = await db.createProject(testProject);
      console.log(`Created test project with ID: ${createdProject.id}`);
    } catch (error) {
      console.error('Error creating test project:', error);
    }
    
    // 6. Verify all projects now
    console.log('\n6. Verifying all projects...');
    const allProjects = await db.getProjects();
    console.log(`Total projects: ${allProjects.length}`);
    
    // Count projects by category for main grid (non-newly added)
    const mainGridProjects = allProjects.filter(p => !p.title.startsWith('NEWLY ADDED:'));
    const newlyAddedProjects = allProjects.filter(p => p.title.startsWith('NEWLY ADDED:'));
    
    console.log(`\nProjects for main grid: ${mainGridProjects.length}`);
    console.log(`Projects for newly added section: ${newlyAddedProjects.length}`);
    
    // Count by category
    const categoryCounts = {};
    allProjects.forEach(project => {
      const category = project.category || 'Uncategorized';
      categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    
    console.log('\nProjects by category:');
    Object.entries(categoryCounts).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} projects`);
    });
    
    console.log('\nFix completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

fixDisplay().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 