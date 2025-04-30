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
  ssl: {
    // This is needed to work with self-signed certificates
    rejectUnauthorized: false
  }
});

// Maximum number of retries for database operations
const MAX_RETRIES = 5; // Increased from 3 to 5
const RETRY_DELAY = 1000; // 1 second

// Add debug status object for monitoring
const dbDebugStatus = {
  lastConnectTime: null,
  connectionAttempts: 0,
  successfulConnections: 0,
  failedConnections: 0,
  lastError: null,
  lastSuccessfulOperation: null,
  isVercel: process.env.VERCEL === '1',
  environment: process.env.NODE_ENV,
  operationLog: []
};

// Log operations with timestamp
function logOperation(operation, status, details = null) {
  const timestamp = new Date().toISOString();
  const logEntry = { timestamp, operation, status, details };
  
  // Keep only last 20 operations
  dbDebugStatus.operationLog.unshift(logEntry);
  if (dbDebugStatus.operationLog.length > 20) {
    dbDebugStatus.operationLog.pop();
  }
  
  dbDebugStatus.lastSuccessfulOperation = status === 'success' ? 
    { operation, timestamp } : dbDebugStatus.lastSuccessfulOperation;
    
  return logEntry;
}

// Helper function to implement retry logic with better logging
async function withRetry(operation) {
  let lastError;
  dbDebugStatus.connectionAttempts++;
  
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      dbDebugStatus.lastConnectTime = new Date().toISOString();
      const result = await operation();
      dbDebugStatus.successfulConnections++;
      logOperation('database operation', 'success', { attempt });
      return result;
    } catch (error) {
      lastError = error;
      dbDebugStatus.lastError = {
        message: error.message,
        code: error.code,
        time: new Date().toISOString(),
        attempt
      };
      
      logOperation('database operation', 'failed', { 
        attempt, 
        error: error.message,
        code: error.code
      });
      
      // Only retry on connection errors or deadlocks
      if (!error.code || !['ETIMEDOUT', 'ECONNREFUSED', 'PROTOCOL_CONNECTION_LOST', 'ER_LOCK_DEADLOCK'].includes(error.code)) {
        throw error;
      }
      
      if (attempt < MAX_RETRIES) {
        const delay = RETRY_DELAY * attempt;
        console.log(`Retrying database operation in ${delay}ms (attempt ${attempt}/${MAX_RETRIES})...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      dbDebugStatus.failedConnections++;
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
      logOperation('connection test', 'success');
    } catch (connError) {
      console.error('MySQL connection test failed:', connError);
      logOperation('connection test', 'failed', { error: connError.message });
      
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
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    logOperation('table creation', 'success');
    
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
      logOperation('column check', 'failed', { error: columnError.message });
    }
    
    console.log('Database initialization complete!');
    return true;
  } catch (error) {
    console.error('Database initialization error:', error);
    logOperation('initialization', 'failed', { error: error.message });
    return false;
  }
}

// Execute a SQL query with parameters and retry logic - enhanced with better debugging
export async function query(sql, params) {
  const start = Date.now();
  const operation = sql.substring(0, 30) + (sql.length > 30 ? '...' : '');
  
  try {
    const result = await withRetry(async () => {
      try {
        const [results] = await pool.execute(sql, params);
        
        // Log successful query with timing
        const duration = Date.now() - start;
        console.log(`MySQL query success (${duration}ms): ${operation}`);
        
        logOperation('query', 'success', { 
          operation, 
          duration,
          rowCount: results?.length
        });
        
        return results;
      } catch (error) {
        // Enhanced error logging
        const duration = Date.now() - start;
        console.error(`MySQL query error (${duration}ms): ${operation}`, {
          error: error.message,
          code: error.code
        });
        
        // Handle connection loss by forcing a new connection
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
          try {
            console.log('Connection lost. Attempting to reconnect...');
            await pool.end();
            await pool.getConnection(); // This will create a new connection
            console.log('Successfully reconnected');
          } catch (reconnectError) {
            console.error('Failed to reconnect:', reconnectError);
          }
        }
        
        throw error;
      }
    });
    
    return result;
  } catch (error) {
    // Log the final error
    logOperation('query', 'failed', { 
      operation, 
      duration: Date.now() - start,
      error: error.message,
      code: error.code
    });
    
    throw error;
  }
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
    console.log('Creating new project:', project.title);
    
    // Create consistent field names for both snake_case and camelCase clients
    const normalizedProject = normalizeProject(project);
    
    // Extract all the fields needed for the insert
    const {
      title, description, detailed_description, image_url, second_image,
      show_both_images_in_priority, category, technologies, tech_details,
      project_link, featured, completion_date, client_name, duration,
      status, updated_days, progress, development_progress, estimated_completion,
      features, exclusive_features, image_priority, visual_effects,
      is_code_screenshot, code_language, code_title, code_content, use_direct_code_input
    } = normalizedProject;
    
    // Convert arrays and objects to JSON strings
    const technologiesJson = Array.isArray(technologies) ? JSON.stringify(technologies) : technologies;
    const featuresJson = features ? (Array.isArray(features) ? JSON.stringify(features) : features) : null;
    const exclusiveFeaturesJson = exclusive_features ? (Array.isArray(exclusive_features) ? JSON.stringify(exclusive_features) : exclusive_features) : null;
    const techDetailsJson = tech_details ? (typeof tech_details === 'object' ? JSON.stringify(tech_details) : tech_details) : null;
    const visualEffectsJson = visual_effects ? (typeof visual_effects === 'object' ? JSON.stringify(visual_effects) : visual_effects) : null;
    
    // Log the operation start
    const logEntry = logOperation('create project', 'started', { title });
    
    // Insert the project with explicit field names
    const result = await query(
      `INSERT INTO projects (
        title, description, detailed_description, image_url, second_image,
        show_both_images_in_priority, category, technologies, tech_details,
        project_link, featured, completion_date, client_name, duration,
        status, updated_days, progress, development_progress, estimated_completion,
        features, exclusive_features, image_priority, visual_effects,
        is_code_screenshot, code_language, code_title, code_content, use_direct_code_input
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title, description, detailed_description, image_url, second_image,
        show_both_images_in_priority, category, technologiesJson, techDetailsJson,
        project_link, featured, completion_date, client_name, duration,
        status, updated_days, progress, development_progress, estimated_completion,
        featuresJson, exclusiveFeaturesJson, image_priority, visualEffectsJson,
        is_code_screenshot, code_language, code_title, code_content, use_direct_code_input
      ]
    );
    
    // Log the operation completion
    logOperation('create project', 'success', { 
      title, 
      id: result.insertId,
      affectedRows: result.affectedRows
    });

    if (result.affectedRows > 0) {
      // Get the newly created project to return
      const newProject = await getProjectById(result.insertId);
      console.log(`Project created successfully with ID: ${result.insertId}`);
      return newProject;
    }

    console.error(`Failed to create project: ${title}`);
    throw new Error('Failed to create project - no rows affected');
  } catch (error) {
    console.error('Error creating project:', error);
    logOperation('create project', 'failed', { 
      error: error.message,
      project: project.title
    });
    throw error;
  }
}

// Update an existing project
export async function updateProject(id, project) {
  try {
    console.log(`Updating project ID: ${id}, Title: ${project.title}`);
    
    // Create consistent field names for both snake_case and camelCase clients
    const normalizedProject = normalizeProject(project);
    
    // Log the operation start
    const logEntry = logOperation('update project', 'started', { id, title: project.title });
    
    // Create SET clauses and parameters dynamically based on what's provided
    const updates = [];
    const params = [];
    
    // Define fields to check for updates
    const fields = [
      { db: 'title', value: normalizedProject.title },
      { db: 'description', value: normalizedProject.description },
      { db: 'detailed_description', value: normalizedProject.detailed_description },
      { db: 'image_url', value: normalizedProject.image_url },
      { db: 'second_image', value: normalizedProject.second_image },
      { db: 'show_both_images_in_priority', value: normalizedProject.show_both_images_in_priority },
      { db: 'category', value: normalizedProject.category },
      { db: 'technologies', value: normalizedProject.technologies, isJson: true },
      { db: 'tech_details', value: normalizedProject.tech_details, isJson: true },
      { db: 'project_link', value: normalizedProject.project_link },
      { db: 'featured', value: normalizedProject.featured },
      { db: 'completion_date', value: normalizedProject.completion_date },
      { db: 'client_name', value: normalizedProject.client_name },
      { db: 'duration', value: normalizedProject.duration },
      { db: 'status', value: normalizedProject.status },
      { db: 'updated_days', value: normalizedProject.updated_days },
      { db: 'progress', value: normalizedProject.progress },
      { db: 'development_progress', value: normalizedProject.development_progress },
      { db: 'estimated_completion', value: normalizedProject.estimated_completion },
      { db: 'features', value: normalizedProject.features, isJson: true },
      { db: 'exclusive_features', value: normalizedProject.exclusive_features, isJson: true },
      { db: 'image_priority', value: normalizedProject.image_priority },
      { db: 'visual_effects', value: normalizedProject.visual_effects, isJson: true },
      { db: 'is_code_screenshot', value: normalizedProject.is_code_screenshot },
      { db: 'code_language', value: normalizedProject.code_language },
      { db: 'code_title', value: normalizedProject.code_title },
      { db: 'code_content', value: normalizedProject.code_content },
      { db: 'use_direct_code_input', value: normalizedProject.use_direct_code_input }
    ];
    
    // Add each field that's present to the updates
    for (const field of fields) {
      if (field.value !== undefined) {
        let value = field.value;
        
        // Convert arrays/objects to JSON if needed
        if (field.isJson && value !== null) {
          if (Array.isArray(value) || typeof value === 'object') {
            value = JSON.stringify(value);
          }
        }
        
        updates.push(`${field.db} = ?`);
        params.push(value);
      }
    }
    
    // Force update of last_updated
    updates.push(`last_updated = CURRENT_TIMESTAMP`);
    
    // If no fields to update, return
    if (updates.length === 0) {
      console.log(`No fields to update for project ${id}`);
      return null;
    }
    
    // Add id to params
    params.push(id);
    
    // Execute update
    const result = await query(
      `UPDATE projects SET ${updates.join(', ')} WHERE id = ?`,
      params
    );
    
    // Log the operation completion
    logOperation('update project', 'success', { 
      id, 
      affectedRows: result.affectedRows 
    });
    
    if (result.affectedRows > 0) {
      // Get the updated project to return
      const updatedProject = await getProjectById(id);
      console.log(`Project ${id} updated successfully`);
      return updatedProject;
    }
    
    console.log(`Project ${id} not found for update`);
    return null;
  } catch (error) {
    console.error(`Error updating project ${id}:`, error);
    logOperation('update project', 'failed', { 
      id, 
      error: error.message 
    });
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
    // Find projects with "NEWLY ADDED" in title or with recent status
    const projects = await query(`
      SELECT * FROM projects 
      WHERE title LIKE 'NEWLY ADDED:%' 
      OR status IN ('In Development', 'Beta Testing', 'Recently Launched')
      ORDER BY updated_days ASC, id DESC
    `);
    
    logOperation('get newly added projects', 'success', { count: projects.length });
    
    // Normalize the projects
    return projects.map(normalizeProject);
  } catch (error) {
    console.error('Error fetching newly added projects:', error);
    logOperation('get newly added projects', 'failed', { error: error.message });
    return [];
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

// Get debug status information for the database
export async function getDebugStatus() {
  // Update with current time
  const now = new Date().toISOString();
  return {
    ...dbDebugStatus,
    currentTime: now,
    uptime: dbDebugStatus.lastConnectTime ? 
      (new Date(now) - new Date(dbDebugStatus.lastConnectTime)) : null,
    connectionPool: {
      connectionLimit: pool.config.connectionLimit,
      queueLimit: pool.config.queueLimit
    },
    databaseInfo: {
      host: process.env.MYSQL_HOST || 'metro.proxy.rlwy.net',
      database: process.env.MYSQL_DATABASE || 'railway'
    }
  };
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
  getUniqueCategories,
  getDebugStatus
}; 