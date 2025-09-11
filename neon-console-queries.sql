-- SQL Queries to Run in Neon Console
-- Copy and paste these queries into the Neon Console SQL Editor to view your data

-- 1. View all projects with basic info
SELECT 
    id,
    title,
    category,
    featured,
    status,
    progress,
    completion_date,
    client_name
FROM projects 
ORDER BY featured DESC, id ASC;

-- 2. View all team members
SELECT 
    id,
    name,
    title,
    is_leader,
    order_priority,
    active
FROM team_members 
ORDER BY is_leader DESC, order_priority ASC;

-- 3. Count total records
SELECT 
    (SELECT COUNT(*) FROM projects) as total_projects,
    (SELECT COUNT(*) FROM projects WHERE featured = true) as featured_projects,
    (SELECT COUNT(*) FROM projects WHERE status IS NOT NULL) as projects_in_development,
    (SELECT COUNT(*) FROM team_members WHERE active = true) as active_team_members;

-- 4. View project technologies (JSONB data)
SELECT 
    id,
    title,
    technologies,
    tech_details
FROM projects 
WHERE technologies IS NOT NULL
ORDER BY id;

-- 5. View newly added projects
SELECT 
    id,
    title,
    status,
    progress,
    updated_days,
    exclusive_features
FROM projects 
WHERE title LIKE 'NEWLY ADDED:%'
ORDER BY id;

-- 6. View completed projects
SELECT 
    id,
    title,
    completion_date,
    client_name,
    duration,
    project_link
FROM projects 
WHERE completion_date IS NOT NULL
ORDER BY completion_date DESC;

-- 7. View team skills (JSONB data)
SELECT 
    id,
    name,
    title,
    skills,
    linkedin_url,
    github_url
FROM team_members 
ORDER BY order_priority;

-- 8. Database schema information
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('projects', 'team_members')
ORDER BY table_name, ordinal_position;

-- 9. Check table sizes
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE schemaname = 'public' 
    AND tablename IN ('projects', 'team_members');

-- 10. Full project details (use this to see all data)
SELECT * FROM projects ORDER BY id LIMIT 5;

-- 11. Full team member details
SELECT * FROM team_members ORDER BY order_priority LIMIT 5;