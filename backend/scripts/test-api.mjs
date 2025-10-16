// Simple script to test the API endpoints for projects
// Using ES modules (.mjs) for native fetch support

async function testApi() {
  try {
    console.log('Testing API endpoints...\n');
    
    // Test GET project by ID
    console.log('1. Testing GET project by ID (ID: 1)');
    const getResponse = await fetch('http://localhost:3000/api/projects/1');
    const project = await getResponse.json();
    console.log(`Status: ${getResponse.status} ${getResponse.statusText}`);
    console.log('Project data:', {
      id: project.id,
      title: project.title,
      description: project.description.substring(0, 50) + '...',
      image: project.image,
      featured: project.featured,
      technologies: project.technologies
    });
    console.log('\n');
    
    // Test PUT project update
    console.log('2. Testing PUT project update (ID: 1)');
    const updateData = {
      title: 'NEX-WEBS Tools (API Test)',
      description: 'Updated via API test script',
      password: 'nex-devs919'
    };
    
    const updateResponse = await fetch('http://localhost:3000/api/projects/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    });
    
    const updateResult = await updateResponse.json();
    console.log(`Status: ${updateResponse.status} ${updateResponse.statusText}`);
    console.log('Update result:', updateResult);
    console.log('\n');
    
    // Test GET project again to verify update
    console.log('3. Testing GET project again to verify update (ID: 1)');
    const verifyResponse = await fetch('http://localhost:3000/api/projects/1');
    const updatedProject = await verifyResponse.json();
    console.log(`Status: ${verifyResponse.status} ${verifyResponse.statusText}`);
    console.log('Updated project data:', {
      id: updatedProject.id,
      title: updatedProject.title,
      description: updatedProject.description,
      image: updatedProject.image,
      featured: updatedProject.featured,
      technologies: updatedProject.technologies
    });
    
  } catch (error) {
    console.error('Error testing API:', error);
  }
}

testApi(); 