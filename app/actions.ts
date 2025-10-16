"use server";
import { neon } from '@neondatabase/serverless';
import neonDb from '@/backend/lib/neon';

// Get all projects from Neon database
export async function getProjects() {
    try {
        const projects = await neonDb.getProjects();
        return { 
            success: true, 
            data: projects, 
            timestamp: new Date().toISOString() 
        };
    } catch (error: any) {
        console.error('Error fetching projects from Neon:', error);
        return { 
            success: false, 
            error: error.message, 
            timestamp: new Date().toISOString() 
        };
    }
}

// Get a specific project by ID
export async function getProjectById(id: number) {
    try {
        const project = await neonDb.getProjectById(id);
        if (!project) {
            return { 
                success: false, 
                error: 'Project not found', 
                timestamp: new Date().toISOString() 
            };
        }
        
        return { 
            success: true, 
            data: project, 
            timestamp: new Date().toISOString() 
        };
    } catch (error: any) {
        console.error(`Error fetching project ${id} from Neon:`, error);
        return { 
            success: false, 
            error: error.message, 
            timestamp: new Date().toISOString() 
        };
    }
}

// Get featured projects
export async function getFeaturedProjects() {
    try {
        const projects = await neonDb.getFeaturedProjects();
        return { 
            success: true, 
            data: projects, 
            timestamp: new Date().toISOString() 
        };
    } catch (error: any) {
        console.error('Error fetching featured projects from Neon:', error);
        return { 
            success: false, 
            error: error.message, 
            timestamp: new Date().toISOString() 
        };
    }
}

// Get newly added projects
export async function getNewlyAddedProjects() {
    try {
        const projects = await neonDb.getNewlyAddedProjects();
        return { 
            success: true, 
            data: projects, 
            timestamp: new Date().toISOString() 
        };
    } catch (error: any) {
        console.error('Error fetching newly added projects from Neon:', error);
        return { 
            success: false, 
            error: error.message, 
            timestamp: new Date().toISOString() 
        };
    }
}

// Get projects by category
export async function getProjectsByCategory(category: string) {
    try {
        const projects = await neonDb.getProjectsByCategory(category);
        return { 
            success: true, 
            data: projects, 
            timestamp: new Date().toISOString() 
        };
    } catch (error: any) {
        console.error(`Error fetching projects for category ${category} from Neon:`, error);
        return { 
            success: false, 
            error: error.message, 
            timestamp: new Date().toISOString() 
        };
    }
}

// Get all unique categories
export async function getCategories() {
    try {
        const categories = await neonDb.getUniqueCategories();
        return { 
            success: true, 
            data: categories, 
            timestamp: new Date().toISOString() 
        };
    } catch (error: any) {
        console.error('Error fetching categories from Neon:', error);
        return { 
            success: false, 
            error: error.message, 
            timestamp: new Date().toISOString() 
        };
    }
}

// Get database connection status
export async function getDatabaseStatus() {
    try {
        const status = await neonDb.getDebugStatus();
        return { 
            success: true, 
            data: status, 
            timestamp: new Date().toISOString() 
        };
    } catch (error: any) {
        console.error('Error fetching database status from Neon:', error);
        return { 
            success: false, 
            error: error.message, 
            timestamp: new Date().toISOString() 
        };
    }
}

// Direct SQL query - for admin use only
export async function executeQuery(query: string, password: string) {
    // Validate admin password
    if (password !== 'nex-devs.org889123') {
        return {
            success: false,
            error: 'Unauthorized',
            timestamp: new Date().toISOString()
        };
    }
    
    // Don't allow certain dangerous queries
    const lowercaseQuery = query.toLowerCase();
    if (
        lowercaseQuery.includes('drop table') || 
        lowercaseQuery.includes('drop database') ||
        lowercaseQuery.includes('truncate table')
    ) {
        return {
            success: false,
            error: 'This query type is not allowed for safety reasons',
            timestamp: new Date().toISOString()
        };
    }
    
    try {
        const sql = neon(process.env.DATABASE_URL);
        const result = await sql.raw(query);
        
        return {
            success: true,
            data: result,
            timestamp: new Date().toISOString()
        };
    } catch (error: any) {
        console.error('Error executing custom query on Neon:', error);
        return {
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
    }
} 
