// Script to check which projects will be displayed in the ProjectsGrid component
const db = require('../lib/mysql').default;

// This function implements the same filtering logic as the ProjectsGrid component
function shouldDisplayInMainGrid(project) {
  // Projects with 'NEWLY ADDED:' prefix are shown in the NewlyAddedProjects component
  return !project.title.startsWith('NEWLY ADDED:');
}

async function checkProjectsDisplay() {
  try {
    console.log('Checking database connection...');
    const connectionTest = await db.testConnection();
    
    if (!connectionTest.success) {
      console.error('Database connection failed');
      process.exit(1);
    }
    
    console.log('\nFetching all projects...');
    const allProjects = await db.getProjects();
    console.log(`Total projects in database: ${allProjects.length}`);
    
    // Split projects into those shown in main grid and those shown in newly added section
    const mainGridProjects = allProjects.filter(shouldDisplayInMainGrid);
    const newlyAddedProjects = allProjects.filter(p => !shouldDisplayInMainGrid(p));
    
    console.log(`\nProjects to display in main grid: ${mainGridProjects.length}`);
    console.log(`Projects to display in 'Newly Added' section: ${newlyAddedProjects.length}`);
    
    console.log('\n--- PROJECTS IN MAIN GRID ---');
    mainGridProjects.forEach(project => {
      console.log(`- ${project.title} (ID: ${project.id}, Category: ${project.category})`);
    });
    
    console.log('\n--- PROJECTS IN NEWLY ADDED SECTION ---');
    newlyAddedProjects.forEach(project => {
      console.log(`- ${project.title} (ID: ${project.id}, Category: ${project.category})`);
    });
    
    // Check for any projects without valid image URLs
    const missingImages = allProjects.filter(p => !p.image && !p.image_url);
    if (missingImages.length > 0) {
      console.log('\n--- PROJECTS MISSING IMAGES ---');
      missingImages.forEach(project => {
        console.log(`- ${project.title} (ID: ${project.id})`);
      });
    }
    
    // Check for any projects without technologies
    const missingTech = allProjects.filter(p => !p.technologies || p.technologies.length === 0);
    if (missingTech.length > 0) {
      console.log('\n--- PROJECTS MISSING TECHNOLOGIES ---');
      missingTech.forEach(project => {
        console.log(`- ${project.title} (ID: ${project.id})`);
      });
    }
    
    // Get categories summary
    const categories = {};
    allProjects.forEach(p => {
      if (!categories[p.category]) {
        categories[p.category] = {
          total: 0,
          main: 0,
          newlyAdded: 0
        };
      }
      
      categories[p.category].total++;
      if (shouldDisplayInMainGrid(p)) {
        categories[p.category].main++;
      } else {
        categories[p.category].newlyAdded++;
      }
    });
    
    console.log('\n--- CATEGORIES SUMMARY ---');
    Object.entries(categories).forEach(([category, counts]) => {
      console.log(`${category}: ${counts.total} total (${counts.main} in main grid, ${counts.newlyAdded} in newly added)`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking projects display:', error);
    process.exit(1);
  }
}

// Run the function
checkProjectsDisplay().catch(error => {
  console.error('Script error:', error);
  process.exit(1);
}); 