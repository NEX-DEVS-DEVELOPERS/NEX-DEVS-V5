import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Set admin password for authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'nex-devs.org889123';

export async function POST(request: NextRequest) {
  try {
    // Process the form data
    const formData = await request.formData();
    
    // Get password from form data
    const password = formData.get('password') as string;
    const file = formData.get('file') as File;
    
    // Verify password
    if (password !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
    }
    
    if (!file) {
      // If no file is provided, return a placeholder image path
      return NextResponse.json({ 
        success: true, 
        imagePath: '/team/placeholder.jpg',
        isPlaceholder: true
      });
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.' 
      }, { status: 400 });
    }
    
    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }
    
    // Generate unique filename
    const fileExtension = path.extname(file.name);
    const uniqueFilename = `${uuidv4()}${fileExtension}`;
    
    try {
      // Define the path where the image will be saved
      const teamDir = path.join(process.cwd(), 'public', 'team');
      const filePath = path.join(teamDir, uniqueFilename);
      
      // Make sure the directory exists
      if (!fs.existsSync(teamDir)) {
        fs.mkdirSync(teamDir, { recursive: true });
      }
      
      // Convert the file to a buffer
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Write the file to disk
      fs.writeFileSync(filePath, buffer);
      
      // Return the path that can be used in the team member data
      const relativePath = `/team/${uniqueFilename}`;
      
      return NextResponse.json({ 
        success: true, 
        imagePath: relativePath,
        filename: file.name,
        size: file.size,
        type: file.type
      });
    } catch (fileError) {
      console.error('Error saving file:', fileError);
      return NextResponse.json({ 
        error: 'Failed to save uploaded file',
        details: fileError instanceof Error ? fileError.message : String(fileError)
      }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in team member image upload:', error);
    return NextResponse.json({ 
      error: 'Failed to process image upload',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}
