import mysql from 'mysql2/promise';
import mysqlDb from '../lib/mysql.js';

async function main() {
  console.log('Starting database repair script...');
  
  try {
    // Step 1: Initialize database
    console.log('Step 1: Initializing database...');
    const initialized = await mysqlDb.initDatabase();
    if (!initialized) {
      throw new Error('Failed to initialize database');
    }
    console.log('✅ Database initialized successfully');
    
    // Step 2: Test connection
    console.log('Step 2: Testing database connection...');
    const connection = await mysqlDb.testConnection();
    if (!connection.success) {
      throw new Error('Database connection test failed');
    }
    console.log('✅ Database connection working properly');
    
    // Step 3: Add a test project with code screenshot data (for testing)
    console.log('Step 3: Creating test project with code screenshot data...');
    const testProject = {
      title: `TEST_CODE_SCREENSHOT_${Date.now()}`,
      description: 'This is a test project with code screenshot data',
      image: '/projects/placeholder.jpg',
      category: 'Test',
      technologies: ['Test'],
      link: 'https://example.com',
      isCodeScreenshot: true,
      codeLanguage: 'javascript',
      codeTitle: 'test.js',
      codeContent: 'console.log("Hello world");',
      useDirectCodeInput: true
    };
    
    const newProject = await mysqlDb.createProject(testProject);
    console.log('✅ Test project created successfully with ID:', newProject.id);
    
    // Step 4: Verify the test project
    console.log('Step 4: Verifying the test project...');
    const retrievedProject = await mysqlDb.getProjectById(newProject.id);
    
    if (!retrievedProject) {
      throw new Error('Could not retrieve test project');
    }
    
    console.log('Retrieved test project data:', {
      id: retrievedProject.id,
      title: retrievedProject.title,
      isCodeScreenshot: retrievedProject.isCodeScreenshot,
      codeLanguage: retrievedProject.codeLanguage,
      codeTitle: retrievedProject.codeTitle
    });
    
    if (!retrievedProject.isCodeScreenshot) {
      throw new Error('Code screenshot flag not saved correctly');
    }
    
    console.log('✅ Test project verified successfully');
    
    // Step 5: Clean up test project
    console.log('Step 5: Cleaning up test project...');
    await mysqlDb.deleteProject(newProject.id);
    console.log('✅ Test project cleaned up successfully');
    
    // Step 6: Check for any existing code screenshot projects
    console.log('Step 6: Checking for existing code screenshot projects...');
    const allProjects = await mysqlDb.getProjects();
    const codeScreenshotProjects = allProjects.filter(p => p.isCodeScreenshot);
    
    console.log(`Found ${codeScreenshotProjects.length} code screenshot projects in the database:`);
    codeScreenshotProjects.forEach(p => {
      console.log(`- ID: ${p.id}, Title: ${p.title}, Code Title: ${p.codeTitle || 'none'}`);
    });
    
    console.log('\n✅ Database repair completed successfully! Your code screenshot features should now work correctly.');
    console.log('You can now restart your application and add code screenshots in the admin panel.');
    
  } catch (error) {
    console.error('❌ Error repairing database:', error);
    process.exit(1);
  }
}

main().catch(console.error); 