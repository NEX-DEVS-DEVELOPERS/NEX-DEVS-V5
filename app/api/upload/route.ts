import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Set a password for admin operations (same as projects API)
const ADMIN_PASSWORD = 'nex-devs.org889123';

export async function POST(request: NextRequest) {
  try {
    // Verify password from headers
    const password = request.headers.get('AdminAuth');
    
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }

    // Process the form data
    const formData = await request.formData();
    const file = formData.get('image') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Check if the file is an image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({ error: 'File must be an image' }, { status: 400 });
    }

    // Create a unique filename to avoid conflicts
    const fileExtension = file.name.split('.').pop();
    const uniqueFilename = `${uuidv4()}.${fileExtension}`;
    
    // Define the path where the image will be saved
    const projectsDir = path.join(process.cwd(), 'public', 'projects');
    const filePath = path.join(projectsDir, uniqueFilename);
    
    // Make sure the directory exists
    if (!fs.existsSync(projectsDir)) {
      fs.mkdirSync(projectsDir, { recursive: true });
    }
    
    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Write the file to disk
    fs.writeFileSync(filePath, buffer);
    
    // Return the path that can be used in the project data
    const relativePath = `/projects/${uniqueFilename}`;
    
    return NextResponse.json({ 
      success: true, 
      imagePath: relativePath,
      filename: file.name,
      size: file.size
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 