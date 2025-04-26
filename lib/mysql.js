import mysql from 'mysql2/promise';

// Connection pool configuration using environment variables
const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'metro.proxy.rlwy.net',
  port: parseInt(process.env.MYSQL_PORT || '28228', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || 'ippEdXwIlTCRKIYuCzsvnVqeJjmxufIc',
  database: process.env.MYSQL_DATABASE || 'railway',
  waitForConnections: true,
  connectionLimit: 5, // Reduced for serverless environment
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  connectTimeout: 20000, // 20 seconds
  ssl: process.env.NODE_ENV === 'production' ? {} : undefined
});

// Maximum number of retries for database operations
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

// Helper function to implement retry logic
async function withRetry(operation) {
  let lastError;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      
      // Only retry on connection errors
      if (!error.code || !['ETIMEDOUT', 'ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST'].includes(error.code)) {
        throw error;
      }
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
        continue;
      }
    }
  }
  
  throw lastError;
}

// Initialize database by creating tables if they don't exist
export async function initDatabase() {
  try {
    console.log('Initializing MySQL database...');
    console.log(`Connection details: host=${process.env.MYSQL_HOST || 'metro.proxy.rlwy.net'}, database=${process.env.MYSQL_DATABASE || 'railway'}`);
    
    // Test connection first
    try {
      const testResult = await pool.execute('SELECT 1 as test');
      console.log('MySQL connection test successful:', testResult[0][0]);
    } catch (connError) {
      console.error('MySQL connection test failed:', connError);
      // Try to close and recreate the pool
      try {
        await pool.end();
        console.log('Recreating connection pool after failure...');
      } catch (e) {
        // Ignore errors from pool.end()
      }
    }
    
    // Create projects table if it doesn't exist with expanded schema matching SQLite
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        detailed_description TEXT,
        image_url TEXT NOT NULL,
        second_image TEXT,
        show_both_images_in_priority BOOLEAN DEFAULT FALSE,
        category VARCHAR(255) NOT NULL,
        technologies TEXT NOT NULL,
        tech_details TEXT,
        project_link TEXT NOT NULL,
        featured BOOLEAN DEFAULT FALSE,
        completion_date VARCHAR(255),
        client_name VARCHAR(255),
        duration VARCHAR(255),
        status VARCHAR(100),
        updated_days INT,
        progress INT,
        development_progress INT,
        estimated_completion VARCHAR(255),
        features TEXT,
        exclusive_features TEXT,
        image_priority INT DEFAULT 5,
        visual_effects TEXT,
        is_code_screenshot BOOLEAN DEFAULT FALSE,
        code_language VARCHAR(255),
        code_title VARCHAR(255),
        code_content TEXT,
        use_direct_code_input BOOLEAN DEFAULT FALSE,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Create indexes for better performance
    try {
      await pool.execute(`CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects (featured)`);
      await pool.execute(`CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status)`);
      await pool.execute(`CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category)`);
    } catch (indexError) {
      console.warn('Note: Some indexes may not have been created due to MySQL version constraints:', indexError);
    }
    
    // Verify all code screenshot columns exist
    try {
      const [columns] = await pool.execute("SHOW COLUMNS FROM projects LIKE 'is_code_screenshot'");
      if (columns.length > 0) {
        console.log('Code screenshot columns already exist in table schema.');
      } else {
        console.log('Code screenshot columns not found, adding them...');
        await pool.execute(`
          ALTER TABLE projects 
          ADD COLUMN is_code_screenshot BOOLEAN DEFAULT FALSE,
          ADD COLUMN code_language VARCHAR(255),
          ADD COLUMN code_title VARCHAR(255),
          ADD COLUMN code_content TEXT,
          ADD COLUMN use_direct_code_input BOOLEAN DEFAULT FALSE
        `);
        console.log('Code screenshot columns added successfully.');
      }
    } catch (columnError) {
      console.error('Error checking or adding code screenshot columns:', columnError);
    }
    
    console.log('Database initialization complete!');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}

// Execute a SQL query with parameters and retry logic
export async function query(sql, params) {
  return withRetry(async () => {
    try {
      const [results] = await pool.execute(sql, params);
      return results;
    } catch (error) {
      if (error.code === 'PROTOCOL_CONNECTION_LOST') {
        // Handle connection loss by forcing a new connection
        await pool.end();
        pool.getConnection(); // This will create a new connection
      }
      throw error;
    }
  });
}

// Get all projects
export async function getProjects() {
  try {
    const projects = await query(
      `SELECT * FROM projects ORDER BY created_at DESC`
    );
    
    // Process any JSON fields
    return projects.map(project => {
      return normalizeProject(project);
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
}

// Get a single project by ID
export async function getProjectById(id) {
  try {
    const projects = await query(
      `SELECT * FROM projects WHERE id = ?`, [id]
    );
    
    if (projects.length === 0) {
      return null;
    }
    
    return normalizeProject(projects[0]);
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
}

// Helper function to normalize project data from MySQL
function normalizeProject(project) {
  try {
    // Create a consistent normalized object with all the fields needed by the React components
    const normalizedProject = {
      id: project.id,
      title: project.title || '',
      description: project.description || '',
      detailedDescription: project.detailed_description || project.detailedDescription || null,
      // Image URLs - use both field names for compatibility 
      image: project.image || project.image_url || '',
      image_url: project.image || project.image_url || '',
      secondImage: project.second_image || project.secondImage || null,
      second_image: project.second_image || project.secondImage || null,
      showBothImagesInPriority: Boolean(project.show_both_images_in_priority || project.showBothImagesInPriority || false),
      show_both_images_in_priority: Boolean(project.show_both_images_in_priority || project.showBothImagesInPriority || false),
      category: project.category || '',
      // Ensure technologies is always an array
      technologies: [],
      tech_details: project.tech_details || project.techDetails || null,
      techDetails: project.tech_details || project.techDetails || null,
      // Link URLs - use both field names for compatibility
      link: project.project_link || project.link || '',
      project_link: project.project_link || project.link || '',
      featured: Boolean(project.featured || false),
      completionDate: project.completion_date || project.completionDate || null,
      completion_date: project.completion_date || project.completionDate || null,
      clientName: project.client_name || project.clientName || null,
      client_name: project.client_name || project.clientName || null,
      duration: project.duration || null,
      status: project.status || null,
      updatedDays: project.updated_days || project.updatedDays || null,
      updated_days: project.updated_days || project.updatedDays || null,
      progress: project.progress || null,
      developmentProgress: project.development_progress || project.developmentProgress || null,
      development_progress: project.development_progress || project.developmentProgress || null,
      estimatedCompletion: project.estimated_completion || project.estimatedCompletion || null,
      estimated_completion: project.estimated_completion || project.estimatedCompletion || null,
      features: [],
      exclusiveFeatures: [],
      exclusive_features: [],
      imagePriority: project.image_priority || project.imagePriority || 5,
      image_priority: project.image_priority || project.imagePriority || 5,
      visualEffects: {},
      visual_effects: {},
      // Code screenshot related fields
      isCodeScreenshot: Boolean(project.is_code_screenshot || project.isCodeScreenshot || false),
      is_code_screenshot: Boolean(project.is_code_screenshot || project.isCodeScreenshot || false),
      codeLanguage: project.code_language || project.codeLanguage || null,
      code_language: project.code_language || project.codeLanguage || null,
      codeTitle: project.code_title || project.codeTitle || null,
      code_title: project.code_title || project.codeTitle || null,
      codeContent: project.code_content || project.codeContent || null,
      code_content: project.code_content || project.codeContent || null,
      useDirectCodeInput: Boolean(project.use_direct_code_input || project.useDirectCodeInput || false),
      use_direct_code_input: Boolean(project.use_direct_code_input || project.useDirectCodeInput || false),
      // Keep the timestamps as is
      last_updated: project.last_updated || null,
      created_at: project.created_at || null
    };

    // Process technologies (could be string, array, or JSON)
    if (project.technologies) {
      if (typeof project.technologies === 'string') {
        try {
          normalizedProject.technologies = JSON.parse(project.technologies);
      } catch (e) {
          normalizedProject.technologies = project.technologies.split(',').map(t => t.trim());
        }
      } else if (Array.isArray(project.technologies)) {
        normalizedProject.technologies = project.technologies;
      }
    }
    
    // Process features
    if (project.features) {
      if (typeof project.features === 'string') {
      try {
          normalizedProject.features = JSON.parse(project.features);
      } catch (e) {
          normalizedProject.features = [];
        }
      } else if (Array.isArray(project.features)) {
        normalizedProject.features = project.features;
      }
    }
    
    // Process exclusive features
    if (project.exclusive_features || project.exclusiveFeatures) {
      const exclusiveFeatures = project.exclusive_features || project.exclusiveFeatures;
      if (typeof exclusiveFeatures === 'string') {
      try {
          normalizedProject.exclusiveFeatures = JSON.parse(exclusiveFeatures);
          normalizedProject.exclusive_features = normalizedProject.exclusiveFeatures;
      } catch (e) {
          normalizedProject.exclusiveFeatures = [];
          normalizedProject.exclusive_features = [];
        }
      } else if (Array.isArray(exclusiveFeatures)) {
        normalizedProject.exclusiveFeatures = exclusiveFeatures;
        normalizedProject.exclusive_features = exclusiveFeatures;
      }
    }
    
    // Process visual effects
    if (project.visual_effects || project.visualEffects) {
      const visualEffects = project.visual_effects || project.visualEffects;
      if (typeof visualEffects === 'string') {
        try {
          normalizedProject.visualEffects = JSON.parse(visualEffects);
          normalizedProject.visual_effects = normalizedProject.visualEffects;
      } catch (e) {
          normalizedProject.visualEffects = {};
          normalizedProject.visual_effects = {};
        }
      } else if (typeof visualEffects === 'object') {
        normalizedProject.visualEffects = visualEffects;
        normalizedProject.visual_effects = visualEffects;
      }
    }
    
    return normalizedProject;
  } catch (error) {
    console.error('Error normalizing project:', error);
    // If normalization fails, ensure we at least have valid values for critical fields
    return {
      ...project,
      id: project.id || 0,
      title: project.title || '',
      description: project.description || '',
      image: project.image || project.image_url || '',
      image_url: project.image || project.image_url || '',
      link: project.project_link || project.link || '',
      project_link: project.project_link || project.link || '',
      category: project.category || '',
      technologies: Array.isArray(project.technologies) ? project.technologies : []
    };
  }
}

// Create a new project
export async function createProject(project) {
  try {
    // Handle data from both field naming conventions 
    const title = project.title || '';
    const description = project.description || '';
    
    // Handle image field variations
    const imageUrl = project.image_url || project.image || '';
    
    // Handle link field variations
    const projectLink = project.project_link || project.link || '';
    
    // Handle optional fields
    const category = project.category || '';
    
    // Handle technologies (could be string, array, or JSON)
    let technologies = '';
    if (project.technologies) {
      if (typeof project.technologies === 'string') {
        technologies = project.technologies;
      } else if (Array.isArray(project.technologies)) {
        technologies = JSON.stringify(project.technologies);
      } else {
        try {
          technologies = JSON.stringify(project.technologies);
        } catch (e) {
          technologies = String(project.technologies);
        }
      }
    }
    
    // Handle other JSON fields
    const features = Array.isArray(project.features) ? 
      JSON.stringify(project.features) : 
      (project.features || '[]');
      
    const exclusiveFeatures = Array.isArray(project.exclusive_features || project.exclusiveFeatures) ? 
      JSON.stringify(project.exclusive_features || project.exclusiveFeatures) : 
      ((project.exclusive_features || project.exclusiveFeatures) || '[]');
    
    // Handle boolean fields
    const featured = project.featured ? 1 : 0;
    const showBothImages = (project.show_both_images_in_priority || project.showBothImagesInPriority) ? 1 : 0;
    
    // Handle numeric fields
    const imagePriority = project.image_priority || project.imagePriority || 5;
    const progress = project.progress || 0;
    const developmentProgress = project.development_progress || project.developmentProgress || 0;
    const updatedDays = project.updated_days || project.updatedDays || 0;
    
    // Handle other text fields
    const status = project.status || '';
    const secondImage = project.second_image || project.secondImage || '';
    const estimatedCompletion = project.estimated_completion || project.estimatedCompletion || '';
    const visualEffects = typeof project.visual_effects === 'string' ? 
      project.visual_effects : 
      (typeof project.visualEffects === 'string' ? 
        project.visualEffects : 
        JSON.stringify(project.visual_effects || project.visualEffects || {}));
    
    // Handle code screenshot fields
    const isCodeScreenshot = project.isCodeScreenshot || project.is_code_screenshot ? 1 : 0;
    const codeLanguage = project.codeLanguage || project.code_language || '';
    const codeTitle = project.codeTitle || project.code_title || '';
    const codeContent = project.codeContent || project.code_content || '';
    const useDirectCodeInput = project.useDirectCodeInput || project.use_direct_code_input ? 1 : 0;
    
    // Prepare SQL query with all fields
    const sql = `
      INSERT INTO projects (
        title, description, image_url, project_link, 
        category, technologies, featured, status,
        second_image, show_both_images_in_priority, 
        progress, development_progress, updated_days,
        estimated_completion, features, exclusive_features,
        image_priority, visual_effects, is_code_screenshot,
        code_language, code_title, code_content, use_direct_code_input
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      title, description, imageUrl, projectLink,
      category, technologies, featured, status,
      secondImage, showBothImages,
      progress, developmentProgress, updatedDays,
      estimatedCompletion, features, exclusiveFeatures,
      imagePriority, visualEffects, isCodeScreenshot,
      codeLanguage, codeTitle, codeContent, useDirectCodeInput
    ];
    
    console.log("MySQL query params:", params);
    
    const result = await query(sql, params);
    
    return { 
      id: result.insertId, 
      ...project,
      image_url: imageUrl, 
      project_link: projectLink,
      title,
      description,
      category,
      status
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
}

// Update an existing project
export async function updateProject(id, project) {
  try {
    // Handle data from both field naming conventions
    const projectId = typeof id === 'object' && id.id ? id.id : id;
    const projectData = typeof id === 'object' ? id : project;
    
    // Extract fields with compatibility for both naming conventions
    const title = projectData.title || '';
    const description = projectData.description || '';
    
    // Handle image field variations
    const imageUrl = projectData.image_url || projectData.image || '';
    
    // Handle link field variations
    const projectLink = projectData.project_link || projectData.link || '';
    
    // Handle optional fields
    const category = projectData.category || '';
    
    // Handle technologies (could be string, array, or JSON)
    let technologies = '';
    if (projectData.technologies) {
      if (typeof projectData.technologies === 'string') {
        technologies = projectData.technologies;
      } else if (Array.isArray(projectData.technologies)) {
        technologies = JSON.stringify(projectData.technologies);
      } else {
        try {
          technologies = JSON.stringify(projectData.technologies);
        } catch (e) {
          technologies = String(projectData.technologies);
        }
      }
    }
    
    // Handle other JSON fields
    const features = Array.isArray(projectData.features) ? 
      JSON.stringify(projectData.features) : 
      (projectData.features || '[]');
      
    const exclusiveFeatures = Array.isArray(projectData.exclusive_features || projectData.exclusiveFeatures) ? 
      JSON.stringify(projectData.exclusive_features || projectData.exclusiveFeatures) : 
      ((projectData.exclusive_features || projectData.exclusiveFeatures) || '[]');
    
    // Handle boolean fields
    const featured = projectData.featured ? 1 : 0;
    const showBothImages = (projectData.show_both_images_in_priority || projectData.showBothImagesInPriority) ? 1 : 0;
    
    // Handle numeric fields
    const imagePriority = projectData.image_priority || projectData.imagePriority || 5;
    const progress = projectData.progress || 0;
    const developmentProgress = projectData.development_progress || projectData.developmentProgress || 0;
    const updatedDays = projectData.updated_days || projectData.updatedDays || 0;
    
    // Handle other text fields
    const status = projectData.status || '';
    const secondImage = projectData.second_image || projectData.secondImage || '';
    const estimatedCompletion = projectData.estimated_completion || projectData.estimatedCompletion || '';
    const visualEffects = typeof projectData.visual_effects === 'string' ? 
      projectData.visual_effects : 
      (typeof projectData.visualEffects === 'string' ? 
        projectData.visualEffects : 
        JSON.stringify(projectData.visual_effects || projectData.visualEffects || {}));
        
    // Handle code screenshot fields
    const isCodeScreenshot = projectData.isCodeScreenshot || projectData.is_code_screenshot ? 1 : 0;
    const codeLanguage = projectData.codeLanguage || projectData.code_language || '';
    const codeTitle = projectData.codeTitle || projectData.code_title || '';
    const codeContent = projectData.codeContent || projectData.code_content || '';
    const useDirectCodeInput = projectData.useDirectCodeInput || projectData.use_direct_code_input ? 1 : 0;
        
    // Prepare SQL query with all fields
    const sql = `
      UPDATE projects SET 
        title = ?, description = ?, image_url = ?, project_link = ?,
        category = ?, technologies = ?, featured = ?, status = ?,
        second_image = ?, show_both_images_in_priority = ?,
        progress = ?, development_progress = ?, updated_days = ?,
        estimated_completion = ?, features = ?, exclusive_features = ?,
        image_priority = ?, visual_effects = ?, is_code_screenshot = ?,
        code_language = ?, code_title = ?, code_content = ?, use_direct_code_input = ?
      WHERE id = ?
    `;
    
    const params = [
      title, description, imageUrl, projectLink,
      category, technologies, featured, status,
      secondImage, showBothImages,
      progress, developmentProgress, updatedDays,
      estimatedCompletion, features, exclusiveFeatures,
      imagePriority, visualEffects, isCodeScreenshot,
      codeLanguage, codeTitle, codeContent, useDirectCodeInput,
      projectId
    ];
    
    console.log("MySQL update params:", params);
    
    await query(sql, params);
    
    return { 
      id: projectId, 
      ...projectData,
      image_url: imageUrl, 
      project_link: projectLink,
      title,
      description,
      category,
      status
    };
  } catch (error) {
    console.error(`Error updating project with ID ${typeof id === 'object' && id.id ? id.id : id}:`, error);
    throw error;
  }
}

// Delete a project
export async function deleteProject(id) {
  try {
    await query('DELETE FROM projects WHERE id = ?', [id]);
    return { id };
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
}

// Test database connection with retry logic
export async function testConnection() {
  return withRetry(async () => {
    const connection = await pool.getConnection();
    try {
      await connection.ping();
      return true;
    } finally {
      connection.release();
    }
  });
}

// Get all projects (alias to getProjects for compatibility)
export async function getAllProjects() {
  return getProjects();
}

// Get newly added projects
export async function getNewlyAddedProjects() {
  try {
    const projects = await query(
      `SELECT * FROM projects WHERE title LIKE 'NEWLY ADDED:%' ORDER BY created_at DESC`
    );
    
    return projects.map(project => normalizeProject(project));
  } catch (error) {
    console.error('Error fetching newly added projects:', error);
    throw error;
  }
}

// Get featured projects
export async function getFeaturedProjects() {
  try {
    const projects = await query(
      `SELECT * FROM projects WHERE featured = 1 ORDER BY image_priority ASC, created_at DESC`
    );
    
    return projects.map(project => normalizeProject(project));
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    throw error;
  }
}

// Get projects by category
export async function getProjectsByCategory(category) {
  try {
    const projects = await query(
      `SELECT * FROM projects WHERE category = ? ORDER BY featured DESC, image_priority ASC, created_at DESC`,
      [category]
    );
    
    return projects.map(project => normalizeProject(project));
  } catch (error) {
    console.error(`Error fetching projects for category ${category}:`, error);
    throw error;
  }
}

// Get unique categories
export async function getUniqueCategories() {
  try {
    const results = await query(
      `SELECT DISTINCT category FROM projects ORDER BY category`
    );
    
    return results.map(row => row.category);
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
}

export default {
  query,
  getProjects,
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  initDatabase,
  testConnection,
  getNewlyAddedProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getUniqueCategories
}; 