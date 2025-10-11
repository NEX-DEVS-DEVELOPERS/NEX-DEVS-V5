import { neon, NeonQueryFunction } from '@neondatabase/serverless';

// Enhanced debug status object for comprehensive monitoring
const dbDebugStatus = {
  lastConnectTime: null as string | null,
  connectionAttempts: 0,
  successfulConnections: 0,
  failedConnections: 0,
  lastError: null as any,
  lastSuccessfulOperation: null as any,
  environment: process.env.NODE_ENV,
  operationLog: [] as any[],
  queryMetrics: {
    totalQueries: 0,
    successfulQueries: 0,
    failedQueries: 0,
    averageResponseTime: 0,
    slowQueries: [] as any[],
    recentQueries: [] as any[]
  },
  connectionPool: {
    activeConnections: 0,
    idleConnections: 0,
    totalConnections: 0,
    maxConnections: 10,
    connectionErrors: 0
  },
  performance: {
    lastQueryTime: 0,
    fastestQuery: Infinity,
    slowestQuery: 0,
    queryTimes: [] as number[]
  }
};

// Initialize Neon SQL connection with environment variable
const NEON_CONNECTION_STRING = process.env.DATABASE_URL || 'postgresql://postgresby%20neon_owner:npg_rC8EwcA6IXPj@ep-steep-bar-a1qrxdqr-pooler.ap-southeast-1.aws.neon.tech/postgresby%20neon?sslmode=require';

// Configure Neon with increased timeout and connection pooling
const sql = neon(NEON_CONNECTION_STRING, {
  fetchOptions: {
    cache: 'no-store',
  },
});

// Log operations with timestamp
function logOperation(operation: string, status: string, details: any = null) {
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

// Get ROI section with associated cards, metrics, and case studies
export async function getROISection() {
  const startTime = Date.now();
  
  // Retry logic for connection issues
  const maxRetries = 3;
  let lastError: any = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[getROISection] Attempt ${attempt}/${maxRetries}...`);
      
      // Get the published ROI section with timeout
      const roiSectionResult = await Promise.race([
        sql`
          SELECT * FROM roi_section 
          WHERE is_published = true 
          ORDER BY display_order ASC, id DESC 
          LIMIT 1
        `,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Query timeout')), 15000)
        )
      ]) as any[];
      
      if (!roiSectionResult || roiSectionResult.length === 0) {
        console.log('[getROISection] No published section found');
        return null;
      }
      
      const roiSection = roiSectionResult[0];
      console.log(`[getROISection] Found section ID: ${roiSection.id}`);
      
      // Get associated cards - simpler query without metrics for better performance
      const cardsResult = await Promise.race([
        sql`
          SELECT * FROM roi_cards 
          WHERE roi_section_id = ${roiSection.id} 
          ORDER BY display_order ASC, is_featured DESC, id ASC
        `,
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Cards query timeout')), 10000)
        )
      ]) as any[];
      
      console.log(`[getROISection] Found ${cardsResult.length} cards`);
      
      // Fetch metrics for each card
      const cardsWithMetrics = await Promise.all(
        cardsResult.map(async (card) => {
          try {
            const metrics = await sql`
              SELECT * FROM roi_metrics 
              WHERE roi_card_id = ${card.id}
              ORDER BY id ASC
            `;
            return {
              ...card,
              metrics: metrics || []
            };
          } catch (error) {
            console.error(`Failed to fetch metrics for card ${card.id}:`, error);
            return {
              ...card,
              metrics: []
            };
          }
        })
      );
      
      // Fetch case studies for the section
      let caseStudies: any[] = [];
      try {
        const caseStudiesResult = await sql`
          SELECT * FROM roi_case_studies 
          WHERE roi_section_id = ${roiSection.id}
          AND is_published = true
          ORDER BY display_order ASC, is_featured DESC
        `;
        caseStudies = caseStudiesResult || [];
      } catch (error) {
        console.error('Failed to fetch case studies:', error);
      }
      
      // Combine all data
      const result = {
        ...roiSection,
        cards: cardsWithMetrics || [],
        caseStudies: caseStudies || []
      };
      
      // Log success
      trackQueryPerformance('getROISection', startTime, true);
      logOperation('getROISection', 'success', {
        id: roiSection.id,
        cardsCount: cardsWithMetrics.length,
        attempt
      });
      
      console.log('[getROISection] Success!');
      return result;
      
    } catch (error: any) {
      lastError = error;
      console.error(`[getROISection] Attempt ${attempt} failed:`, error.message);
      
      // If not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        const waitTime = attempt * 1000; // Progressive backoff
        console.log(`[getROISection] Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  // All retries failed
  console.error('[getROISection] All attempts failed:', lastError?.message);
  trackQueryPerformance('getROISection', startTime, false, lastError);
  logOperation('getROISection', 'failed', {
    error: lastError?.message,
    attempts: maxRetries
  });
  
  return null;
}

// Get all ROI sections for admin (including unpublished)
export async function getAllROISections() {
  const startTime = Date.now();
  try {
    const roiSections = await sql`
      SELECT * FROM roi_section 
      ORDER BY display_order ASC, id DESC
    `;
    
    const sectionsWithData = await Promise.all(
      roiSections.map(async (section) => {
        const cards = await sql`
          SELECT * FROM roi_cards 
          WHERE roi_section_id = ${section.id} 
          ORDER BY display_order ASC, id ASC
        `;
        
        const caseStudies = await sql`
          SELECT * FROM roi_case_studies 
          WHERE roi_section_id = ${section.id} 
          ORDER BY display_order ASC, id DESC
        `;
        
        return {
          ...section,
          cards: cards || [],
          caseStudies: caseStudies || []
        };
      })
    );
    
    trackQueryPerformance('getAllROISections', startTime, true);
    return sectionsWithData;
  } catch (error: any) {
    console.error('Error fetching all ROI sections:', error);
    trackQueryPerformance('getAllROISections', startTime, false, error);
    return [];
  }
}

// Create ROI section
export async function createROISection(data: any) {
  const startTime = Date.now();
  try {
    const result = await sql`
      INSERT INTO roi_section (
        main_heading, 
        sub_heading, 
        video_url, 
        image_one, 
        image_two,
        image_three,
        background_pattern,
        theme_color,
        is_published,
        display_order
      ) 
      VALUES (
        ${data.main_heading},
        ${data.sub_heading || null},
        ${data.video_url || null},
        ${data.image_one || null},
        ${data.image_two || null},
        ${data.image_three || null},
        ${data.background_pattern || 'gradient'},
        ${data.theme_color || 'purple'},
        ${data.is_published || false},
        ${data.display_order || 0}
      )
      RETURNING *
    `;
    
    trackQueryPerformance('createROISection', startTime, true);
    logOperation('createROISection', 'success', { id: result[0].id });
    
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error('Error creating ROI section:', error);
    trackQueryPerformance('createROISection', startTime, false, error);
    return { success: false, message: error.message };
  }
}

// Update ROI section
export async function updateROISection(id: number, data: any) {
  const startTime = Date.now();
  try {
    const result = await sql`
      UPDATE roi_section
      SET 
        main_heading = ${data.main_heading},
        sub_heading = ${data.sub_heading || null},
        video_url = ${data.video_url || null},
        image_one = ${data.image_one || null},
        image_two = ${data.image_two || null},
        image_three = ${data.image_three || null},
        background_pattern = ${data.background_pattern || 'gradient'},
        theme_color = ${data.theme_color || 'purple'},
        is_published = ${data.is_published !== undefined ? data.is_published : false},
        display_order = ${data.display_order || 0},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    
    trackQueryPerformance('updateROISection', startTime, true);
    logOperation('updateROISection', 'success', { id });
    
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error('Error updating ROI section:', error);
    trackQueryPerformance('updateROISection', startTime, false, error);
    return { success: false, message: error.message };
  }
}

// Create ROI card
export async function createROICard(data: any) {
  const startTime = Date.now();
  try {
    const result = await sql`
      INSERT INTO roi_cards (
        roi_section_id,
        title,
        value,
        description,
        icon_url,
        metric_type,
        trend,
        trend_percentage,
        previous_value,
        time_period,
        category,
        display_order,
        is_featured,
        background_color,
        border_style,
        animation_type
      )
      VALUES (
        ${data.roi_section_id},
        ${data.title},
        ${data.value},
        ${data.description},
        ${data.icon_url || null},
        ${data.metric_type || 'percentage'},
        ${data.trend || 'up'},
        ${data.trend_percentage || null},
        ${data.previous_value || null},
        ${data.time_period || null},
        ${data.category || null},
        ${data.display_order || 0},
        ${data.is_featured || false},
        ${data.background_color || null},
        ${data.border_style || null},
        ${data.animation_type || 'fade'}
      )
      RETURNING *
    `;
    
    trackQueryPerformance('createROICard', startTime, true);
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error('Error creating ROI card:', error);
    trackQueryPerformance('createROICard', startTime, false, error);
    return { success: false, message: error.message };
  }
}

// Update ROI card
export async function updateROICard(id: number, data: any) {
  const startTime = Date.now();
  try {
    const result = await sql`
      UPDATE roi_cards
      SET 
        title = ${data.title},
        value = ${data.value},
        description = ${data.description},
        icon_url = ${data.icon_url || null},
        metric_type = ${data.metric_type || 'percentage'},
        trend = ${data.trend || 'up'},
        trend_percentage = ${data.trend_percentage || null},
        previous_value = ${data.previous_value || null},
        time_period = ${data.time_period || null},
        category = ${data.category || null},
        display_order = ${data.display_order || 0},
        is_featured = ${data.is_featured || false},
        background_color = ${data.background_color || null},
        border_style = ${data.border_style || null},
        animation_type = ${data.animation_type || 'fade'},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    
    trackQueryPerformance('updateROICard', startTime, true);
    return { success: true, data: result[0] };
  } catch (error: any) {
    console.error('Error updating ROI card:', error);
    trackQueryPerformance('updateROICard', startTime, false, error);
    return { success: false, message: error.message };
  }
}

// Delete ROI card
export async function deleteROICard(id: number) {
  const startTime = Date.now();
  try {
    await sql`DELETE FROM roi_cards WHERE id = ${id}`;
    
    trackQueryPerformance('deleteROICard', startTime, true);
    return { success: true, message: 'ROI card deleted successfully' };
  } catch (error: any) {
    console.error('Error deleting ROI card:', error);
    trackQueryPerformance('deleteROICard', startTime, false, error);
    return { success: false, message: error.message };
  }
}

// Helper function to track query performance
function trackQueryPerformance(queryType: string, startTime: number, success: boolean, error?: any) {
  const endTime = Date.now();
  const duration = endTime - startTime;

  // Update query metrics
  dbDebugStatus.queryMetrics.totalQueries++;
  if (success) {
    dbDebugStatus.queryMetrics.successfulQueries++;
  } else {
    dbDebugStatus.queryMetrics.failedQueries++;
  }

  // Track performance metrics
  dbDebugStatus.performance.lastQueryTime = duration;
  dbDebugStatus.performance.queryTimes.push(duration);

  // Keep only last 100 query times for average calculation
  if (dbDebugStatus.performance.queryTimes.length > 100) {
    dbDebugStatus.performance.queryTimes.shift();
  }

  // Update fastest/slowest queries
  if (duration < dbDebugStatus.performance.fastestQuery) {
    dbDebugStatus.performance.fastestQuery = duration;
  }
  if (duration > dbDebugStatus.performance.slowestQuery) {
    dbDebugStatus.performance.slowestQuery = duration;
  }

  // Calculate average response time
  dbDebugStatus.queryMetrics.averageResponseTime =
    dbDebugStatus.performance.queryTimes.reduce((sum, time) => sum + time, 0) /
    dbDebugStatus.performance.queryTimes.length;

  // Track slow queries (> 1000ms)
  if (duration > 1000) {
    dbDebugStatus.queryMetrics.slowQueries.unshift({
      queryType,
      duration,
      timestamp: new Date().toISOString(),
      error: error?.message
    });

    // Keep only last 10 slow queries
    if (dbDebugStatus.queryMetrics.slowQueries.length > 10) {
      dbDebugStatus.queryMetrics.slowQueries = dbDebugStatus.queryMetrics.slowQueries.slice(0, 10);
    }
  }

  // Track recent queries
  dbDebugStatus.queryMetrics.recentQueries.unshift({
    queryType,
    duration,
    success,
    timestamp: new Date().toISOString(),
    error: error?.message
  });

  // Keep only last 20 recent queries
  if (dbDebugStatus.queryMetrics.recentQueries.length > 20) {
    dbDebugStatus.queryMetrics.recentQueries = dbDebugStatus.queryMetrics.recentQueries.slice(0, 20);
  }
}

// Test the database connection with performance tracking
export async function testConnection() {
  const startTime = Date.now();

  try {
    dbDebugStatus.connectionAttempts++;
    dbDebugStatus.lastConnectTime = new Date().toISOString();

    const result = await sql`SELECT 1 as test`;

    dbDebugStatus.successfulConnections++;
    trackQueryPerformance('connection test', startTime, true);
    logOperation('connection test', 'success');

    return {
      success: true,
      message: 'Connected to Neon PostgreSQL database',
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime,
      result
    };
  } catch (error: any) {
    dbDebugStatus.failedConnections++;
    dbDebugStatus.lastError = {
      message: error.message,
      time: new Date().toISOString()
    };

    trackQueryPerformance('connection test', startTime, false, error);
    logOperation('connection test', 'failed', {
      error: error.message
    });

    return {
      success: false,
      message: `Failed to connect to Neon PostgreSQL database: ${error.message}`,
      timestamp: new Date().toISOString(),
      responseTime: Date.now() - startTime
    };
  }
}

// Initialize database by creating tables if they don't exist
export async function initDatabase() {
  try {
    console.log('Initializing Neon PostgreSQL database...');
    
    // Test connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      throw new Error(`Database connection failed: ${connectionTest.message}`);
    }
    
    // Create projects table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        detailed_description TEXT,
        image_url TEXT NOT NULL,
        second_image TEXT,
        show_both_images_in_priority BOOLEAN DEFAULT FALSE,
        category VARCHAR(255) NOT NULL,
        technologies JSONB NOT NULL,
        tech_details JSONB,
        project_link TEXT,
        featured BOOLEAN DEFAULT FALSE,
        completion_date VARCHAR(255),
        client_name VARCHAR(255),
        duration VARCHAR(255),
        status VARCHAR(100),
        updated_days INTEGER,
        progress INTEGER,
        development_progress INTEGER,
        estimated_completion VARCHAR(255),
        features JSONB,
        exclusive_features JSONB,
        image_priority INTEGER DEFAULT 5,
        visual_effects JSONB,
        is_code_screenshot BOOLEAN DEFAULT FALSE,
        code_language VARCHAR(255),
        code_title VARCHAR(255),
        code_content TEXT,
        use_direct_code_input BOOLEAN DEFAULT FALSE,
        github_link TEXT,
        github_client_link TEXT,
        github_server_link TEXT,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Migration: Allow NULL values for project_link column (for projects in development)
    try {
      await sql`
        ALTER TABLE projects ALTER COLUMN project_link DROP NOT NULL;
      `;
      console.log('Migration: project_link column updated to allow NULL values');
    } catch (error) {
      // This might fail if the column is already nullable or if there are other constraints
      console.log('Migration note: project_link column may already allow NULL values or migration not needed');
    }

    // Create team_members table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS team_members (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        bio TEXT,
        image_url TEXT NOT NULL,
        email VARCHAR(255),
        linkedin_url TEXT,
        github_url TEXT,
        twitter_url TEXT,
        dribbble_url TEXT,
        website_url TEXT,
        skills JSONB,
        order_priority INTEGER DEFAULT 0,
        active BOOLEAN DEFAULT TRUE,
        is_leader BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    logOperation('table creation', 'success');
    console.log('Database initialization complete!');
    return true;
  } catch (error: any) {
    console.error('Database initialization error:', error);
    logOperation('initialization', 'failed', { error: error.message });
    return false;
  }
}

// Get all projects
export async function getProjects() {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      ORDER BY featured DESC, image_priority ASC, id DESC
    `;
    
    return projects.map(normalizeProject);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
}

// Get project by ID
export async function getProjectById(id: number) {
  try {
    const projects = await sql`
      SELECT * FROM projects 
      WHERE id = ${id}
    `;
    
    if (projects.length === 0) {
      return null;
    }
    
    return normalizeProject(projects[0]);
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    return null;
  }
}

// Normalize project data for frontend consistency
function normalizeProject(project: any) {
  // Reduced logging frequency for better performance
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.05) {
    console.log('Normalizing project data:', {
      id: project.id,
      title: project.title,
      hasImageUrl: Boolean(project.image_url),
      hasImage: Boolean(project.image),
    });
  }
  
  const normalized = {
    ...project,
    // Ensure these fields use the camelCase version for rendering
    image: project.image_url || project.image || '/projects/placeholder.jpg',
    image_url: project.image_url || project.image || '/projects/placeholder.jpg', // Ensure both fields are present
    secondImage: project.second_image || project.secondImage || null,
    second_image: project.second_image || project.secondImage || null, // Ensure both fields are present
    link: project.project_link || project.link || project.projectLink || '',
    project_link: project.project_link || project.link || project.projectLink || '', // Ensure both fields are present
    projectLink: project.project_link || project.link || project.projectLink || '',
    updatedDays: project.updated_days || project.updatedDays || 0,
    updated_days: project.updated_days || project.updatedDays || 0, // Ensure both fields are present
    developmentProgress: project.development_progress || project.developmentProgress || 0,
    development_progress: project.development_progress || project.developmentProgress || 0, // Ensure both fields are present
    showBothImagesInPriority: Boolean(project.show_both_images_in_priority || project.showBothImagesInPriority),
    show_both_images_in_priority: Boolean(project.show_both_images_in_priority || project.showBothImagesInPriority),
    isCodeScreenshot: Boolean(project.is_code_screenshot || project.isCodeScreenshot),
    is_code_screenshot: Boolean(project.is_code_screenshot || project.isCodeScreenshot),
    // Ensure we have consistent field structures even if null
    visualEffects: project.visual_effects || {},
    visual_effects: project.visual_effects || project.visualEffects || {},
    features: project.features || [],
    exclusiveFeatures: project.exclusive_features || [],
    exclusive_features: project.exclusive_features || project.exclusiveFeatures || [],
    technologies: project.technologies || [],
    // Handle GitHub-related fields
    githubLink: project.github_link || project.githubLink || null,
    github_link: project.github_link || project.githubLink || null,
    githubClientLink: project.github_client_link || project.githubClientLink || null,
    github_client_link: project.github_client_link || project.githubClientLink || null,
    githubServerLink: project.github_server_link || project.githubServerLink || null,
    github_server_link: project.github_server_link || project.githubServerLink || null
  };
  
  // Debug log only for few normalizations in development
  if (process.env.NODE_ENV === 'development' && Math.random() < 0.03) {
    console.log('Sample normalized project:', {
      id: normalized.id,
      title: normalized.title
    });
  }
  
  return normalized;
}

// TEAM MEMBERS FUNCTIONS

// Get all team members
export async function getTeamMembers() {
  try {
    const teamMembers = await sql`
      SELECT * FROM team_members
      WHERE active = true
      ORDER BY is_leader DESC, order_priority ASC, id ASC
    `;

    return teamMembers.map(normalizeTeamMember);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

// Get team member by ID
export async function getTeamMemberById(id: number) {
  try {
    const teamMembers = await sql`
      SELECT * FROM team_members
      WHERE id = ${id}
    `;

    if (teamMembers.length === 0) {
      return null;
    }

    return normalizeTeamMember(teamMembers[0]);
  } catch (error) {
    console.error(`Error fetching team member with ID ${id}:`, error);
    return null;
  }
}

// Normalize team member data for frontend consistency
function normalizeTeamMember(member: any) {
  const normalized = {
    ...member,
    // Ensure we have consistent field structures
    imageUrl: member.image_url || member.imageUrl || '/team/placeholder.jpg',
    image_url: member.image_url || member.imageUrl || '/team/placeholder.jpg',
    linkedinUrl: member.linkedin_url || member.linkedinUrl || null,
    linkedin_url: member.linkedin_url || member.linkedinUrl || null,
    githubUrl: member.github_url || member.githubUrl || null,
    github_url: member.github_url || member.githubUrl || null,
    twitterUrl: member.twitter_url || member.twitterUrl || null,
    twitter_url: member.twitter_url || member.twitterUrl || null,
    dribbbleUrl: member.dribbble_url || member.dribbbleUrl || null,
    dribbble_url: member.dribbble_url || member.dribbbleUrl || null,
    websiteUrl: member.website_url || member.websiteUrl || null,
    website_url: member.website_url || member.websiteUrl || null,
    orderPriority: member.order_priority || member.orderPriority || 0,
    order_priority: member.order_priority || member.orderPriority || 0,
    isLeader: Boolean(member.is_leader || member.isLeader),
    is_leader: Boolean(member.is_leader || member.isLeader),
    skills: member.skills || [],
    // Parse social links for compatibility
    socialLinks: {
      github: member.github_url || member.githubUrl || null,
      linkedin: member.linkedin_url || member.linkedinUrl || null,
      twitter: member.twitter_url || member.twitterUrl || null,
      dribbble: member.dribbble_url || member.dribbbleUrl || null,
      website: member.website_url || member.websiteUrl || null
    }
  };

  return normalized;
}

// Create a new team member
export async function createTeamMember(member: any) {
  try {
    // Process the team member data for insertion
    const processedMember = processTeamMemberData(member);

    console.log('Creating new team member:', {
      name: processedMember.name,
      title: processedMember.title,
      isLeader: processedMember.is_leader
    });

    // Use the tagged template literal approach which is safer
    const fields = Object.keys(processedMember);
    const values = Object.values(processedMember);

    // Build the fields part of the query
    const fieldsClause = fields.join(', ');

    // Create a dynamic SQL query with placeholders
    const sqlQuery = `
      INSERT INTO team_members (${fieldsClause})
      VALUES (${fields.map((_, i) => `$${i + 1}`).join(', ')})
      RETURNING id
    `;

    // Execute the query using the neon query method
    const result = await sql.query(sqlQuery, values);

    // Check if the insertion was successful
    if (!result || result.length === 0) {
      throw new Error('No rows inserted');
    }

    // Extract the ID from the first result
    const newId = result[0]?.id;

    // Log the successful operation
    logOperation('create team member', 'success', {
      id: newId,
      name: processedMember.name
    });

    return {
      success: true,
      id: newId,
      message: `Team member "${member.name}" created successfully with ID ${newId}`
    };
  } catch (error: any) {
    console.error('Error creating team member:', error);

    // Log the failed operation
    logOperation('create team member', 'failed', {
      error: error.message,
      name: member?.name || 'unknown',
      stack: error.stack
    });

    return {
      success: false,
      message: `Failed to create team member: ${error.message}`
    };
  }
}

// Update an existing team member
export async function updateTeamMember(id: number, member: any) {
  try {
    console.log(`Starting update for team member ID ${id}`);

    // Validate that we have a valid ID
    if (!id || isNaN(id)) {
      throw new Error(`Invalid team member ID: ${id}`);
    }

    // First, check if the team member exists
    const existingMember = await getTeamMemberById(id);
    if (!existingMember) {
      console.error(`Team member with ID ${id} not found`);
      return {
        success: false,
        message: `Team member with ID ${id} not found`
      };
    }

    // Process the team member data for update
    const processedMember = processTeamMemberData(member);
    console.log(`Processed team member data for update:`, {
      id,
      name: processedMember.name,
      title: processedMember.title,
      isLeader: processedMember.is_leader
    });

    // Build the SET clause and values array for the SQL query
    const fields = Object.keys(processedMember);
    const values = Object.values(processedMember);

    // Create SET clause with placeholders
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');

    // Add the ID as the last parameter
    values.push(id);

    // Build and execute the SQL query
    const sqlQuery = `
      UPDATE team_members
      SET ${setClause}, last_updated = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING id, name
    `;

    // Execute the query
    const result = await sql.query(sqlQuery, values);

    // Check if any rows were affected
    if (!result || result.length === 0) {
      console.error(`No rows updated for team member ID ${id}`);
      return {
        success: false,
        message: `Failed to update team member: No rows affected`
      };
    }

    // Log the successful operation
    logOperation('update team member', 'success', {
      id,
      name: processedMember.name,
      rowsAffected: result.length
    });

    return {
      success: true,
      message: `Team member "${processedMember.name}" updated successfully`,
      id: result[0]?.id
    };
  } catch (error: any) {
    console.error(`Error updating team member ID ${id}:`, error);

    // Log the failed operation
    logOperation('update team member', 'failed', {
      id,
      error: error.message,
      stack: error.stack
    });

    return {
      success: false,
      message: `Failed to update team member: ${error.message}`
    };
  }
}

// Delete an existing team member
export async function deleteTeamMember(id: number) {
  try {
    if (!id || isNaN(id)) {
      throw new Error(`Invalid team member ID: ${id}`);
    }

    console.log(`Attempting to delete team member with ID ${id}`);

    // First check if the team member exists
    const member = await getTeamMemberById(id);
    if (!member) {
      return {
        success: false,
        message: `Team member with ID ${id} not found`
      };
    }

    // Execute the delete query
    const result = await sql`
      DELETE FROM team_members
      WHERE id = ${id}
      RETURNING id, name
    `;

    if (!result || result.length === 0) {
      console.error(`No rows deleted for team member ID ${id}`);
      return {
        success: false,
        message: `Failed to delete team member: No rows affected`
      };
    }

    // Log the successful operation
    logOperation('delete team member', 'success', {
      id,
      name: member.name
    });

    return {
      success: true,
      message: `Team member "${member.name}" with ID ${id} deleted successfully`
    };
  } catch (error: any) {
    console.error(`Error deleting team member with ID ${id}:`, error);

    // Log the failed operation
    logOperation('delete team member', 'failed', {
      id,
      error: error.message,
      stack: error.stack
    });

    return {
      success: false,
      message: `Failed to delete team member: ${error.message}`
    };
  }
}

// Create a new project
export async function createProject(project: any) {
  try {
    // Process the project data for insertion
    const processedProject = processProjectData(project);
    
    console.log('Creating new project:', {
      title: processedProject.title,
      category: processedProject.category,
      technologies: Array.isArray(processedProject.technologies) ? 
        `Array with ${processedProject.technologies.length} items` : 
        typeof processedProject.technologies
    });
    
    // Use the tagged template literal approach which is safer
    const fields = Object.keys(processedProject);
    const values = Object.values(processedProject);
    
    // Build the fields part of the query
    const fieldsClause = fields.join(', ');
    
    // Create a dynamic SQL query with placeholders
    const sqlQuery = `
      INSERT INTO projects (${fieldsClause})
      VALUES (${fields.map((_, i) => `$${i + 1}`).join(', ')})
      RETURNING id
    `;
    
    // Execute the query using the neon query method
    const result = await sql.query(sqlQuery, values);
    
    // Check if the insertion was successful
    if (!result || result.length === 0) {
      throw new Error('No rows inserted');
    }
    
    // Extract the ID from the first result
    const newId = result[0]?.id;
    
    // Log the successful operation
    logOperation('create project', 'success', { 
      id: newId,
      title: processedProject.title
    });
    
    return { 
      success: true, 
      id: newId,
      message: `Project "${project.title}" created successfully with ID ${newId}`
    };
  } catch (error: any) {
    console.error('Error creating project:', error);
    
    // Log the failed operation
    logOperation('create project', 'failed', { 
      error: error.message,
      title: project?.title || 'unknown',
      stack: error.stack
    });
    
    return { 
      success: false, 
      message: `Failed to create project: ${error.message}`
    };
  }
}

// Update an existing project
export async function updateProject(id: number, project: any) {
  try {
    console.log(`Starting update for project ID ${id}`);
    
    // Validate that we have a valid ID
    if (!id || isNaN(id)) {
      throw new Error(`Invalid project ID: ${id}`);
    }
    
    // First, check if the project exists
    const existingProject = await getProjectById(id);
    if (!existingProject) {
      console.error(`Project with ID ${id} not found`);
      return { 
        success: false, 
        message: `Project with ID ${id} not found` 
      };
    }
    
    // Process the project data for update
    const processedProject = processProjectData(project);
    console.log(`Processed project data for update:`, {
      id,
      title: processedProject.title,
      category: processedProject.category,
      hasImage: Boolean(processedProject.image_url),
      technologies: Array.isArray(processedProject.technologies) ? 
        `Array with ${processedProject.technologies.length} items` : 
        typeof processedProject.technologies
    });
    
    // Build the SET clause and values array for the SQL query
    const fields = Object.keys(processedProject);
    const values = Object.values(processedProject);
    
    // Create SET clause with placeholders
    const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
    
    // Add the ID as the last parameter
    values.push(id);
    
    // Build and execute the SQL query
    const sqlQuery = `
      UPDATE projects
      SET ${setClause}, last_updated = CURRENT_TIMESTAMP
      WHERE id = $${values.length}
      RETURNING id, title
    `;

    // Execute the query
    const result = await sql.query(sqlQuery, values);
    
    // Check if any rows were affected
    if (!result || result.length === 0) {
      console.error(`No rows updated for project ID ${id}`);
      return { 
        success: false, 
        message: `Failed to update project: No rows affected` 
      };
    }
    
    // Log the successful operation
    logOperation('update project', 'success', { 
      id, 
      title: processedProject.title,
      rowsAffected: result.length
    });
    
    return { 
      success: true, 
      message: `Project "${processedProject.title}" updated successfully`,
      id: result[0]?.id
    };
  } catch (error: any) {
    console.error(`Error updating project ID ${id}:`, error);
    
    // Log the failed operation
    logOperation('update project', 'failed', { 
      id, 
      error: error.message,
      stack: error.stack
    });
    
    return { 
      success: false, 
      message: `Failed to update project: ${error.message}`
    };
  }
}

// Delete an existing project
export async function deleteProject(id: number) {
  try {
    if (!id || isNaN(id)) {
      throw new Error(`Invalid project ID: ${id}`);
    }

    console.log(`Attempting to delete project with ID ${id}`);
    
    // First check if the project exists
    const project = await getProjectById(id);
    if (!project) {
      return { 
        success: false, 
        message: `Project with ID ${id} not found` 
      };
    }

    // Execute the delete query
    const result = await sql`
      DELETE FROM projects
      WHERE id = ${id}
      RETURNING id, title
    `;
    
    if (!result || result.length === 0) {
      console.error(`No rows deleted for project ID ${id}`);
      return { 
        success: false, 
        message: `Failed to delete project: No rows affected` 
      };
    }
    
    // Log the successful operation
    logOperation('delete project', 'success', { 
      id, 
      title: project.title
    });
    
    return { 
      success: true, 
      message: `Project "${project.title}" with ID ${id} deleted successfully`
    };
  } catch (error: any) {
    console.error(`Error deleting project with ID ${id}:`, error);
    
    // Log the failed operation
    logOperation('delete project', 'failed', { 
      id, 
      error: error.message,
      stack: error.stack
    });
    
    return { 
      success: false, 
      message: `Failed to delete project: ${error.message}`
    };
  }
}

// Helper function to process team member data for database operations
function processTeamMemberData(member: any) {
  console.log('Processing team member data:', {
    name: member.name,
    title: member.title,
    hasImageUrl: Boolean(member.image_url || member.imageUrl),
    isLeader: Boolean(member.isLeader || member.is_leader)
  });

  const processedMember: any = {
    ...member,
    // Ensure PostgreSQL compatibility with JSONB fields
    skills: Array.isArray(member.skills) ? JSON.stringify(member.skills) : (
      typeof member.skills === 'string' ? member.skills : '[]'
    )
  };

  // Handle image URL field
  processedMember.image_url = member.image_url || member.imageUrl || '/team/placeholder.jpg';

  // Remove the 'imageUrl' field as it doesn't exist in the database schema
  if ('imageUrl' in processedMember) {
    delete processedMember.imageUrl;
  }

  // Handle social media URLs
  processedMember.linkedin_url = member.linkedin_url || member.linkedinUrl || null;
  processedMember.github_url = member.github_url || member.githubUrl || null;
  processedMember.twitter_url = member.twitter_url || member.twitterUrl || null;
  processedMember.dribbble_url = member.dribbble_url || member.dribbbleUrl || null;
  processedMember.website_url = member.website_url || member.websiteUrl || null;

  // Remove camelCase versions
  if ('linkedinUrl' in processedMember) delete processedMember.linkedinUrl;
  if ('githubUrl' in processedMember) delete processedMember.githubUrl;
  if ('twitterUrl' in processedMember) delete processedMember.twitterUrl;
  if ('dribbbleUrl' in processedMember) delete processedMember.dribbbleUrl;
  if ('websiteUrl' in processedMember) delete processedMember.websiteUrl;

  // Handle boolean conversions
  processedMember.active = Boolean(member.active !== false); // Default to true
  processedMember.is_leader = Boolean(member.is_leader || member.isLeader);

  // Remove camelCase version
  if ('isLeader' in processedMember) {
    delete processedMember.isLeader;
  }

  // Handle order priority
  processedMember.order_priority = typeof member.order_priority === 'number' ?
    member.order_priority : (typeof member.orderPriority === 'number' ? member.orderPriority : 0);

  // Remove camelCase version
  if ('orderPriority' in processedMember) {
    delete processedMember.orderPriority;
  }

  // Handle socialLinks object if provided
  if (member.socialLinks && typeof member.socialLinks === 'object') {
    if (member.socialLinks.github && !processedMember.github_url) {
      processedMember.github_url = member.socialLinks.github;
    }
    if (member.socialLinks.linkedin && !processedMember.linkedin_url) {
      processedMember.linkedin_url = member.socialLinks.linkedin;
    }
    if (member.socialLinks.twitter && !processedMember.twitter_url) {
      processedMember.twitter_url = member.socialLinks.twitter;
    }
    if (member.socialLinks.dribbble && !processedMember.dribbble_url) {
      processedMember.dribbble_url = member.socialLinks.dribbble;
    }
    if (member.socialLinks.website && !processedMember.website_url) {
      processedMember.website_url = member.socialLinks.website;
    }
    // Remove the socialLinks object as it doesn't exist in database schema
    delete processedMember.socialLinks;
  }

  console.log('Processed team member data:', {
    name: processedMember.name,
    title: processedMember.title,
    image_url: processedMember.image_url,
    is_leader: processedMember.is_leader,
    order_priority: processedMember.order_priority
  });

  return processedMember;
}

// Helper function to process project data for database operations
function processProjectData(project: any) {
  // Log the incoming project data for debugging
  console.log('Processing project data:', {
    id: project.id,
    title: project.title,
    hasImage: Boolean(project.image),
    hasImageUrl: Boolean(project.image_url),
    imageValue: project.image || project.image_url || null,
    hasSecondImage: Boolean(project.secondImage),
    hasSecondImageDb: Boolean(project.second_image),
    secondImageValue: project.secondImage || project.second_image || null,
  });
  
  const processedProject: any = {
    ...project,
    // Ensure PostgreSQL compatibility with JSONB fields
    technologies: Array.isArray(project.technologies) ? JSON.stringify(project.technologies) : (
      typeof project.technologies === 'string' ? project.technologies : '[]'
    ),
    features: Array.isArray(project.features) ? JSON.stringify(project.features) : (
      typeof project.features === 'string' ? project.features : null
    ),
    exclusive_features: Array.isArray(project.exclusiveFeatures) ? JSON.stringify(project.exclusiveFeatures) : (
      Array.isArray(project.exclusive_features) ? JSON.stringify(project.exclusive_features) : (
        typeof project.exclusive_features === 'string' ? project.exclusive_features : null
      )
    ),
    tech_details: project.techDetails || project.tech_details ? 
      JSON.stringify(project.techDetails || project.tech_details) : null,
    visual_effects: project.visualEffects || project.visual_effects ?
      JSON.stringify(project.visualEffects || project.visual_effects) : null,
  };
  
  // Handle image URL field - ensure we have both fields for compatibility
  // The database column is image_url, but the frontend might use image
  processedProject.image_url = project.image_url || project.image || '/projects/placeholder.jpg';
  
  // Handle second image field - ensure we use the correct column name
  processedProject.second_image = project.second_image || project.secondImage || null;
  
  // Remove the 'image' field as it doesn't exist in the database schema
  if ('image' in processedProject) {
    delete processedProject.image;
  }
  
  // Remove the 'secondImage' field as it doesn't exist in the database schema
  if ('secondImage' in processedProject) {
    delete processedProject.secondImage;
  }
  
  // Handle link field
  processedProject.project_link = project.project_link || project.link || project.projectLink || '#';

  // Remove the 'link' field as it doesn't exist in the database schema
  if ('link' in processedProject) {
    delete processedProject.link;
  }

  // Remove the 'projectLink' field as it doesn't exist in the database schema
  if ('projectLink' in processedProject) {
    delete processedProject.projectLink;
  }

  // Handle boolean conversions
  processedProject.featured = Boolean(project.featured);
  
  // Explicitly handle showBothImagesInPriority field to ensure it's saved as show_both_images_in_priority
  processedProject.show_both_images_in_priority = Boolean(project.showBothImagesInPriority || project.show_both_images_in_priority);
  
  // Remove camelCase version if it exists
  if ('showBothImagesInPriority' in processedProject) {
    delete processedProject.showBothImagesInPriority;
  }
  
  // Handle other boolean fields
  processedProject.is_code_screenshot = Boolean(project.isCodeScreenshot || project.is_code_screenshot);
  if ('isCodeScreenshot' in processedProject) {
    delete processedProject.isCodeScreenshot;
  }
  
  processedProject.use_direct_code_input = Boolean(project.useDirectCodeInput || project.use_direct_code_input);
  if ('useDirectCodeInput' in processedProject) {
    delete processedProject.useDirectCodeInput;
  }
  
  // Handle other camelCase to snake_case conversions
  if ('imagePriority' in processedProject) {
    processedProject.image_priority = processedProject.imagePriority;
    delete processedProject.imagePriority;
  }
  
  if ('updatedDays' in processedProject) {
    processedProject.updated_days = processedProject.updatedDays;
    delete processedProject.updatedDays;
  }
  
  if ('developmentProgress' in processedProject) {
    processedProject.development_progress = processedProject.developmentProgress;
    delete processedProject.developmentProgress;
  }
  
  if ('estimatedCompletion' in processedProject) {
    processedProject.estimated_completion = processedProject.estimatedCompletion;
    delete processedProject.estimatedCompletion;
  }
  
  if ('codeLanguage' in processedProject) {
    processedProject.code_language = processedProject.codeLanguage;
    delete processedProject.codeLanguage;
  }
  
  if ('codeTitle' in processedProject) {
    processedProject.code_title = processedProject.codeTitle;
    delete processedProject.codeTitle;
  }
  
  if ('codeContent' in processedProject) {
    processedProject.code_content = processedProject.codeContent;
    delete processedProject.codeContent;
  }
  
  if ('visualEffects' in processedProject) {
    // Make sure we don't overwrite the already processed visual_effects
    if (!processedProject.visual_effects) {
      processedProject.visual_effects = processedProject.visualEffects;
    }
    delete processedProject.visualEffects;
  }
  
  if ('exclusiveFeatures' in processedProject) {
    // Make sure we don't overwrite the already processed exclusive_features
    if (!processedProject.exclusive_features) {
      processedProject.exclusive_features = processedProject.exclusiveFeatures;
    }
    delete processedProject.exclusiveFeatures;
  }
  
  if ('techDetails' in processedProject) {
    // Make sure we don't overwrite the already processed tech_details
    if (!processedProject.tech_details) {
      processedProject.tech_details = processedProject.techDetails;
    }
    delete processedProject.techDetails;
  }

  // Handle lastUpdated field conversion
  if ('lastUpdated' in processedProject) {
    // Remove the camelCase version as it doesn't exist in the database schema
    delete processedProject.lastUpdated;
  }

  // Handle GitHub-related fields
  if ('githubLink' in processedProject) {
    processedProject.github_link = processedProject.githubLink || null;
    delete processedProject.githubLink;
  }

  if ('githubClientLink' in processedProject) {
    processedProject.github_client_link = processedProject.githubClientLink || null;
    delete processedProject.githubClientLink;
  }

  if ('githubServerLink' in processedProject) {
    processedProject.github_server_link = processedProject.githubServerLink || null;
    delete processedProject.githubServerLink;
  }

  // Handle imageUrl field conversion
  if ('imageUrl' in processedProject) {
    // Convert to snake_case and remove camelCase version
    if (!processedProject.image_url) {
      processedProject.image_url = processedProject.imageUrl;
    }
    delete processedProject.imageUrl;
  }

  // Handle projectLink field conversion
  if ('projectLink' in processedProject) {
    // Convert to snake_case and remove camelCase version
    if (!processedProject.project_link) {
      processedProject.project_link = processedProject.projectLink;
    }
    delete processedProject.projectLink;
  }
  
  // Log the processed project data
  console.log('Processed project data ready for database:', {
    id: processedProject.id,
    title: processedProject.title,
    image_url: processedProject.image_url,
    second_image: processedProject.second_image,
    show_both_images_in_priority: processedProject.show_both_images_in_priority,
    hasShowBothImagesInPriority: 'showBothImagesInPriority' in processedProject,
    featuresType: typeof processedProject.features,
    technologiesType: typeof processedProject.technologies,
    visualEffectsType: typeof processedProject.visual_effects
  });

  return processedProject;
}

// Get newly added projects
export async function getNewlyAddedProjects() {
  try {
    const projects = await sql`
      SELECT * FROM projects
      WHERE title LIKE 'NEWLY ADDED:%' 
      OR status IN ('In Development', 'Beta Testing', 'Recently Launched')
      ORDER BY featured DESC, image_priority ASC, id DESC
    `;
    
    return projects.map(normalizeProject);
  } catch (error) {
    console.error('Error fetching newly added projects:', error);
    return [];
  }
}

// Get featured projects
export async function getFeaturedProjects() {
  try {
    const projects = await sql`
      SELECT * FROM projects
      WHERE featured = true
      ORDER BY image_priority ASC, id DESC
    `;
    
    return projects.map(normalizeProject);
  } catch (error) {
    console.error('Error fetching featured projects:', error);
    return [];
  }
}

// Get projects by category
export async function getProjectsByCategory(category: string) {
  try {
    const projects = await sql`
      SELECT * FROM projects
      WHERE category = ${category}
      ORDER BY featured DESC, image_priority ASC, id DESC
    `;
    
    return projects.map(normalizeProject);
  } catch (error) {
    console.error(`Error fetching projects in category '${category}':`, error);
    return [];
  }
}

// Get projects by showcase location
export async function getProjectsByShowcaseLocation(showcaseLocation: string) {
  try {
    console.log(`Fetching projects with showcase_location = ${showcaseLocation}`);
    const projects = await sql`
      SELECT * FROM projects 
      WHERE showcase_location = ${showcaseLocation}
      ORDER BY featured DESC, image_priority ASC, id DESC
    `;
    
    console.log(`Found ${projects.length} projects with showcase_location = ${showcaseLocation}`);
    return projects.map(normalizeProject);
  } catch (error) {
    console.error(`Error fetching projects by showcase location ${showcaseLocation}:`, error);
    return [];
  }
}

// Get unique categories from all projects
export async function getUniqueCategories() {
  try {
    const categories = await sql`
      SELECT DISTINCT category FROM projects
      ORDER BY category
    `;
    
    // Return array of category names with 'All' at the beginning
    return ['All', ...categories.map(row => row.category)];
  } catch (error) {
    console.error('Error fetching unique categories:', error);
    return ['All'];
  }
}

// Get comprehensive database debug status with performance metrics
export async function getDebugStatus() {
  const startTime = Date.now();

  try {
    const projects = await getProjects();
    const featuredProjects = await getFeaturedProjects();
    const newlyAddedProjects = await getNewlyAddedProjects();

    // Get database schema information
    const schemaInfo = await sql`
      SELECT
        schemaname,
        tablename,
        tableowner,
        hasindexes,
        hasrules,
        hastriggers
      FROM pg_tables
      WHERE schemaname = 'public'
      ORDER BY tablename;
    `;

    // Get database size information
    const dbSizeInfo = await sql`
      SELECT
        pg_size_pretty(pg_database_size(current_database())) as database_size,
        current_database() as database_name;
    `;

    // Get active connections
    const connectionInfo = await sql`
      SELECT
        count(*) as active_connections,
        max(backend_start) as oldest_connection
      FROM pg_stat_activity
      WHERE state = 'active';
    `;

    const responseTime = Date.now() - startTime;
    trackQueryPerformance('debug status', startTime, true);

    return {
      environment: process.env.NODE_ENV || 'unknown',
      serverTime: new Date().toISOString(),
      responseTime,
      database: {
        type: 'PostgreSQL (Neon)',
        connectivity: dbDebugStatus.lastError ? 'disconnected' : 'connected',
        lastConnection: dbDebugStatus.lastConnectTime,
        connectionAttempts: dbDebugStatus.connectionAttempts,
        successfulConnections: dbDebugStatus.successfulConnections,
        failedConnections: dbDebugStatus.failedConnections,
        lastError: dbDebugStatus.lastError,
        projects: {
          total: projects.length,
          featured: featuredProjects.length,
          newlyAdded: newlyAddedProjects.length
        },
        operationLog: dbDebugStatus.operationLog.slice(0, 5),
        queryMetrics: dbDebugStatus.queryMetrics,
        performance: {
          ...dbDebugStatus.performance,
          fastestQuery: dbDebugStatus.performance.fastestQuery === Infinity ? 0 : dbDebugStatus.performance.fastestQuery
        },
        connectionPool: dbDebugStatus.connectionPool,
        schema: schemaInfo,
        size: dbSizeInfo[0] || { database_size: 'Unknown', database_name: 'Unknown' },
        activeConnections: connectionInfo[0] || { active_connections: 0, oldest_connection: null }
      }
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    trackQueryPerformance('debug status', startTime, false, error);

    console.error('Error getting debug status:', error);
    return {
      environment: process.env.NODE_ENV || 'unknown',
      serverTime: new Date().toISOString(),
      responseTime,
      database: {
        type: 'PostgreSQL (Neon)',
        connectivity: 'error',
        lastError: error instanceof Error ? error.message : String(error),
        queryMetrics: dbDebugStatus.queryMetrics,
        performance: dbDebugStatus.performance
      }
    };
  }
}

export default {
  sql,
  testConnection,
  initDatabase,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getNewlyAddedProjects,
  getFeaturedProjects,
  getProjectsByCategory,
  getProjectsByShowcaseLocation,
  getUniqueCategories,
  getDebugStatus
};