// Script to check and fix projects with invalid technologies arrays
const db = require('../lib/mysql').default;

async function fixTechnologies() {
  try {
    console.log('Testing database connection...');
    const connectionTest = await db.testConnection();
    
    if (!connectionTest.success) {
      console.error('Database connection failed');
      process.exit(1);
    }
    
    console.log('\nFetching all projects from database directly...');
    const rawProjects = await db.query('SELECT id, title, technologies FROM projects');
    console.log(`Found ${rawProjects.length} projects`);
    
    // Check each project for technology issues
    let fixCount = 0;
    for (const project of rawProjects) {
      console.log(`\nChecking project ID ${project.id}: ${project.title}`);
      console.log(`Raw technologies value: ${JSON.stringify(project.technologies)}`);
      
      let needsFix = false;
      let fixedTechnologies;
      
      // Try to parse technologies if it's a string
      if (typeof project.technologies === 'string') {
        try {
          fixedTechnologies = JSON.parse(project.technologies);
          console.log('Successfully parsed technologies JSON string');
          
          // Check if it's an array after parsing
          if (!Array.isArray(fixedTechnologies)) {
            console.log('Parsed value is not an array, converting to array');
            if (typeof fixedTechnologies === 'string') {
              fixedTechnologies = [fixedTechnologies];
            } else {
              fixedTechnologies = ['Unknown'];
            }
            needsFix = true;
          }
        } catch (e) {
          console.log('Failed to parse technologies as JSON, treating as comma-separated string');
          // Try to split by commas
          fixedTechnologies = project.technologies.split(',').map(t => t.trim());
          needsFix = true;
        }
      } else if (!Array.isArray(project.technologies)) {
        console.log('Technologies is not an array or string, setting default');
        fixedTechnologies = ['Unknown'];
        needsFix = true;
      } else {
        console.log('Technologies is already an array, no fix needed');
      }
      
      // Fix the project if needed
      if (needsFix) {
        console.log(`Fixing technologies for project ${project.id}`);
        console.log(`New technologies value: ${JSON.stringify(fixedTechnologies)}`);
        
        try {
          // Update the project in the database
          await db.query(
            'UPDATE projects SET technologies = ? WHERE id = ?', 
            [JSON.stringify(fixedTechnologies), project.id]
          );
          console.log('Update successful');
          fixCount++;
        } catch (error) {
          console.error('Error updating project:', error);
        }
      }
    }
    
    console.log(`\nFixed ${fixCount} projects`);
    
    // Verify all projects now have valid technologies
    console.log('\nVerifying all projects...');
    const projects = await db.getProjects();
    let allValid = true;
    
    for (const project of projects) {
      if (!Array.isArray(project.technologies)) {
        console.error(`Project ${project.id} still has invalid technologies: ${JSON.stringify(project.technologies)}`);
        allValid = false;
      }
    }
    
    if (allValid) {
      console.log('All projects now have valid technologies arrays');
    } else {
      console.log('Some projects still have issues, may need manual intervention');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Script error:', error);
    process.exit(1);
  }
}

// Run the function
fixTechnologies().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(1);
}); 