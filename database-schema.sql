-- Neon PostgreSQL Database Schema for Portfolio Website
-- This file contains the complete database schema for recreating the database structure

-- =====================================================
-- PROJECTS TABLE
-- =====================================================

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
  project_link TEXT,  -- Note: This field allows NULL values (for projects in development)
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

-- Migration to allow NULL values for project_link (for projects in development)
ALTER TABLE projects ALTER COLUMN project_link DROP NOT NULL;

-- =====================================================
-- TEAM MEMBERS TABLE
-- =====================================================

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

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Projects table indexes
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_priority ON projects(image_priority);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);

-- Team members table indexes
CREATE INDEX IF NOT EXISTS idx_team_members_active ON team_members(active);
CREATE INDEX IF NOT EXISTS idx_team_members_leader ON team_members(is_leader);
CREATE INDEX IF NOT EXISTS idx_team_members_priority ON team_members(order_priority);

-- =====================================================
-- SAMPLE DATA INSERTION (OPTIONAL)
-- =====================================================

-- =====================================================
-- ACTUAL PROJECT DATA FROM WEBSITE
-- =====================================================

-- Insert actual projects from the website database
INSERT INTO projects (
  title, description, detailed_description, image_url, category, 
  technologies, tech_details, project_link, featured, completion_date, 
  client_name, duration, image_priority, exclusive_features, visual_effects
) VALUES 
-- Project 1: NEX-WEBS Tools
(
  'NEX-WEBS Tools',
  'A comprehensive suite of web tools including XML Sitemap Generator, Image Compressor, and SEO tools.(just need an API key for some tools to work)',
  'NEX-WEBS Tools is a powerful collection of utilities designed to help developers and businesses optimize their web presence. The suite includes tools for SEO analysis, performance optimization, and content management. With features like XML sitemap generation, image compression, and metadata analysis, users can significantly improve their website''s performance and visibility.',
  '/projects/9289c8e1-3f27-48e0-afaf-1ad087bce119.png',
  'Web Development',
  '["Next.js", "Tailwind CSS", "TypeScript"]',
  '{"frontend": "Next.js with TypeScript for type safety", "styling": "Tailwind CSS for responsive design", "performance": "Optimized with code splitting and lazy loading"}',
  'https://1-project-nex-webs.netlify.app/',
  true,
  '2023-10-15',
  'Internal Project',
  '8 weeks',
  1,
  '[]',
  '{"morphTransition": false, "rippleEffect": false, "floatingElements": false, "shimmering": false, "animation": "none", "shadows": "soft", "border": "solid", "glassmorphism": false, "particles": false, "animationTiming": "normal", "animationIntensity": "normal"}'
),

-- Project 2: NEXTJS-WEBSITE
(
  'NEXTJS-WEBSITE',
  'A creative portfolio website with interactive elements and smooth animations, showcasing various projects and skills.',
  'This portfolio website demonstrates advanced Next.js capabilities with a focus on user experience and modern design principles. The site features custom animations, interactive components, and optimized performance metrics. The responsive design ensures a consistent experience across all devices.',
  '/projects/8836a47d-e499-472e-bce5-e5c9361b6a7c.png',
  'Web Development',
  '["React", "Framer Motion", "Tailwind CSS", "TypeScript"]',
  '{"frontend": "React with TypeScript for scalable components", "animations": "Framer Motion for smooth transitions and effects", "styling": "Tailwind CSS for utility-first styling"}',
  'https://nex-webs-project2.netlify.app/',
  true,
  '2023-12-05',
  'Self-branded',
  '6 weeks',
  1,
  '[]',
  '{"morphTransition": false, "rippleEffect": false, "floatingElements": false, "shimmering": false, "animation": "bounce", "shadows": "neon", "border": "animated", "glassmorphism": true, "particles": true, "animationTiming": "normal", "animationIntensity": "normal"}'
),

-- Project 3: CPU & GPU Bottleneck Calculator
(
  'CPU & GPU Bottleneck Calculator(AI-Agent)',
  'A modern and intuitive NFT marketplace design with dark theme and glass-morphism effects.',
  'The CPU & GPU Bottleneck Calculator is an advanced tool that helps users identify performance bottlenecks in their computer systems. Using AI-driven analysis, it compares CPU and GPU specifications, evaluates their compatibility, and provides detailed recommendations for optimizing performance. The tool includes visual representations of bottlenecks and personalized upgrade suggestions.',
  '/projects/1a58fe2c-191f-4164-8527-728b4f518c5f.png',
  'UI/UX Design',
  '["Figma", "Blender", "After Effects"]',
  '{"design": "Figma for UI/UX with custom component library", "3D": "Blender for hardware visualization models", "animation": "After Effects for performance demonstration animations", "data": "Extensive hardware database with performance metrics"}',
  'https://project-4-updated.vercel.app/',
  true,
  '2023-11-30',
  'Hardware Benchmark Platform',
  '12 weeks',
  1,
  '[]',
  '{}'
),

-- Project 4: Gratuity Calculator 2025
(
  'WEB-APP-(Gratuity Calculator 2025)',
  'This tool simplifies the complex process of gratuity calculation, ensuring you have a clear understanding of your entitlements.',
  'The Gratuity Calculator 2025 is a comprehensive tool that factors in the latest regulations and policies to provide accurate gratuity estimations. It includes features for different employment scenarios, various country regulations, and detailed breakdowns of calculations. The tool also provides downloadable reports and historical calculation tracking.',
  '/projects/1bba4cac-58bb-4fa0-9cf1-c7062bb94629.png',
  'Web Development',
  '["React", "TensorFlow.js", "Node.js"]',
  '{"frontend": "React with responsive forms and visualization", "backend": "Node.js for calculation logic and data processing", "ai": "TensorFlow.js for predictive analysis of financial trends"}',
  'https://nex-webs-project-9.netlify.app/',
  true,
  '2024-01-10',
  'Financial Services Company',
  '10 weeks',
  1,
  '[]',
  '{}'
),

-- Project 5: Invisible Character Generator
(
  'Invisible Character Generator(Web-App)',
  'This tool is designed to help you generate and copy invisible characters easily.',
  'The Invisible Character Generator is a specialized utility for digital content creators and developers. It generates various types of invisible Unicode characters that can be used for spacing, formatting, and special effects in digital content. The tool includes a preview feature to test the characters in different contexts and a quick-copy functionality for easy integration.',
  '/projects/4f615362-0f11-4cc2-baa3-b708c837be03.png',
  'Web Development',
  '["Vue.js", "Firebase", "TailwindCSS", "Python"]',
  '{"frontend": "Vue.js for reactive interface and state management", "backend": "Python scripts for character generation algorithms", "database": "Firebase for user preferences and history", "styling": "TailwindCSS for clean, utility-first design"}',
  'https://nex-webs-project-4.netlify.app/',
  false,
  '2023-07-15',
  'Open Source Initiative',
  '5 weeks',
  1,
  '[]',
  '{}'
),

-- Project 6: Morse Code Translator
(
  'Morse Code Translator(Web-App)',
  'Express yourself with unique Morse Code products—perfect for personalized gifts, home decor, and more. Speak in dots and dashes today!',
  'The Morse Code Translator is an interactive web application that converts text to Morse code and vice versa. It includes audio playback of the Morse code, visual representations, and customizable speed settings. The application also includes a learning mode for users unfamiliar with Morse code.',
  '/projects/806ed4b7-10b2-49bb-b8b3-c13a3ec6d597.png',
  'UI/UX Design',
  '["Figma", "Adobe XD", "Prototyping"]',
  '{"design": "Figma and Adobe XD for high-fidelity mockups", "prototyping": "Interactive prototypes with animation", "research": "User testing and feedback implementation"}',
  'https://nex-webs-project-6.netlify.app/',
  false,
  '2023-08-20',
  'Educational Project',
  '4 weeks',
  1,
  '[]',
  '{}'
);

-- =====================================================
-- NEWLY ADDED PROJECTS (In Development)
-- =====================================================

-- Insert newly added projects with development status
INSERT INTO projects (
  title, description, detailed_description, image_url, second_image,
  show_both_images_in_priority, category, technologies, project_link, 
  featured, status, updated_days, progress, development_progress, 
  estimated_completion, features, exclusive_features, image_priority, visual_effects
) VALUES 
-- YT-VIDEO-ANALYZER
(
  'NEWLY ADDED: YT-VEDIO-ANALYZER',
  'ANALYZER',
  'Advanced YouTube video analysis tool powered by AI for comprehensive content insights and optimization recommendations.',
  '/projects/0c3e9b24-ffb3-4f2f-8afe-00ccdbbd05a9.png',
  NULL,
  false,
  'Web Development',
  '["AI MODEL FOR RESEARCH"]',
  'https://nex-webs-project-6.netlify.app/',
  true,
  'In Development',
  1,
  48,
  0,
  '',
  '[]',
  '["PREMIUM CONTENT", "Behind-the-scenes development insights"]',
  1,
  '{"morphTransition": true, "rippleEffect": true, "floatingElements": false, "shimmering": false, "animation": "elastic", "shadows": "neon", "border": "double", "glassmorphism": false, "particles": true, "animationTiming": "very-slow", "animationIntensity": "subtle"}'
),

-- PROJECT ARA
(
  'NEWLY ADDED: PROJECT ARA BY (NEX-DEVS)',
  'YOULL BE AMAZED..!!',
  'Revolutionary project powered by advanced AI technology, featuring cutting-edge capabilities and innovative solutions.',
  '/projects/c0e3e4a3-58ba-4e27-a61e-7dad197af43d.png',
  NULL,
  false,
  'Web Development',
  '["GOOGLE DEEP THINK"]',
  'https://3d-portfolio-showcase.vercel.app',
  true,
  'In Development',
  1,
  59,
  0,
  '',
  '[]',
  '["Experimental features not available in public release", "Limited edition design elements", "Special promotions for early adopters"]',
  1,
  '{"glow": false, "animation": "float", "showBadge": true, "spotlight": true, "shadows": "soft", "border": "dashed"}'
),

-- PET-GPT
(
  'NEWLY ADDED: PET-GPT (By NEX-DEVS)',
  'a vercitile PET query related chat bot',
  'Advanced AI-powered chatbot specializing in pet-related queries, providing comprehensive care advice and information.',
  '/projects/1aef2df5-ec63-42c1-9c05-f37a1a4d152e.png',
  '/projects/2859ce8c-65c3-4780-894a-7434a0cf7a78.png',
  true,
  'Web Development with AI Integration',
  '["WEB SEARCH"]',
  'https://3d-portfolio-showcase.vercel.app',
  true,
  'Recently Launched',
  1,
  75,
  NULL,
  NULL,
  '["DEEP SEARCH"]',
  '["Early access to premium content", "Experimental features not available in public release", "Limited edition design elements"]',
  1,
  '{"morphTransition": true, "rippleEffect": false, "floatingElements": true, "shimmering": false, "animation": "pop", "shadows": "3d", "border": "animated", "glassmorphism": true, "particles": true, "animationTiming": "very-slow", "animationIntensity": "strong"}'
),

-- 3D Portfolio Website
(
  'NEWLY ADDED: 3D Portfolio Website',
  'A 3D website showcasing immersive experiences with interactive elements and stunning animations.',
  'This cutting-edge 3D portfolio website pushes the boundaries of web technology to create an immersive digital experience. It features interactive 3D models that respond to user input, custom shader effects that create unique visual atmospheres, and a seamless navigation system that guides visitors through different project environments.',
  '/projects/3d-portfolio.jpg',
  NULL,
  false,
  'UI/UX Design',
  '["Three.js", "React Three Fiber", "GSAP", "WebGL"]',
  'https://3d-portfolio-showcase.vercel.app',
  true,
  'In Development',
  2,
  99,
  NULL,
  'Expected June 2024',
  '["Interactive 3D models and animations", "Custom shader effects", "Responsive 3D environments"]',
  '[]',
  1,
  '{}'
),

-- Fullstack Dashboard
(
  'NEWLY ADDED: Fullstack Dashboard',
  'A complete dashboard solution with authentication, analytics, and real-time data visualization.',
  'The Fullstack Dashboard is a comprehensive solution for business intelligence and data management. It provides a secure authentication system with role-based access control, real-time analytics that process and visualize data streams, and customizable reporting tools.',
  '/projects/dashboard.jpg',
  NULL,
  false,
  'Web Development',
  '["Next.js 14", "Tailwind CSS", "Prisma", "MongoDB"]',
  'https://fullstack-dashboard.vercel.app',
  true,
  'Beta Testing',
  5,
  50,
  NULL,
  'Expected July 2024',
  '["OAuth 2.0 Authentication", "Real-time Analytics", "Data Visualization"]',
  '[]',
  1,
  '{}'
);

-- =====================================================
-- ACTUAL TEAM MEMBER DATA FROM WEBSITE
-- =====================================================

-- Insert team leader
INSERT INTO team_members (
  name, title, bio, image_url, email, linkedin_url, github_url, 
  twitter_url, dribbble_url, website_url, skills, order_priority, 
  active, is_leader, created_at, last_updated
) VALUES (
  'Ali Hasnaat',
  'Founder & Lead Developer',
  'Full-stack developer with expertise in AI integration and modern web technologies. Passionate about creating exceptional digital experiences and innovative solutions. Founded NEX-DEVS in 2018 and has led the development of 950+ successful projects.',
  '/team/ali.jpg',
  NULL,
  'https://linkedin.com/in/alihasnaat',
  'https://github.com/NEX-DEVS-DEVELOPERS',
  'https://twitter.com/alihasnaat',
  'https://dribbble.com/alihasnaat',
  NULL,
  '["Full Stack Development", "AI Integration", "System Architecture", "Cloud Infrastructure", "Team Leadership", "Project Management", "Client Relations", "Technical Strategy"]',
  1,
  true,
  true,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- Insert team members
INSERT INTO team_members (
  name, title, bio, image_url, linkedin_url, github_url, 
  skills, order_priority, active, is_leader, created_at, last_updated
) VALUES 
(
  'Mudassir Ahmad',
  'AI Workflows for Business Specialist',
  'Senior frontend developer specializing in React/Next.js ecosystems and AI workflow automation for business processes.',
  '/team/mdassir.jpg',
  'https://linkedin.com/in/mdassirahmad',
  'https://github.com/mdassirahmad',
  '["React Development", "Next.js Applications", "UI/UX Implementation", "AI Workflow Automation", "Business Process Optimization"]',
  2,
  true,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'Faizan Khan',
  'UI/UX Designer',
  'Creative UI/UX designer with expertise in Figma, user research, and motion design. Specializes in creating intuitive, visually appealing interfaces.',
  '/team/faizan.jpg',
  'https://linkedin.com/in/faizankhan',
  NULL,
  '["UI/UX Design", "Figma Mastery", "User Research", "Motion Design", "Prototyping", "Design Systems"]',
  3,
  true,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'Eman Ali',
  'Backend Developer',
  'Experienced backend developer with expertise in Node.js, Python, and DevOps practices. Specializes in building scalable server-side applications.',
  '/team/eman.jpg',
  'https://linkedin.com/in/emanali',
  'https://github.com/emanali',
  '["Backend Development", "Node.js", "Python", "DevOps", "Database Design", "API Development"]',
  4,
  true,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'Anns Bashir',
  'AI Agent Developer',
  'Specialized AI agent developer with expertise in N8N, Make.com, and workflow automation platforms. Creates intelligent automation solutions.',
  '/team/anns.jpg',
  'https://linkedin.com/in/annsbashir',
  'https://github.com/annsbashir',
  '["AI Agent Development", "N8N Workflows", "Make.com Automation", "Process Automation", "Integration Development"]',
  5,
  true,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'Hassam Baloch',
  'AI Agent Developer',
  'Specialized AI Agent Developer with comprehensive expertise in N8N, Make.com, and advanced workflow automation platforms.',
  '/team/hassam.jpg',
  'https://linkedin.com/in/hassambaloch',
  'https://github.com/hassambaloch',
  '["AI Agent Development", "N8N Advanced Workflows", "Make.com Expert Integration", "Business Process Automation", "Intelligent Workflow Design"]',
  6,
  true,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
),
(
  'Usman Aftab',
  'AI Database & DevOps Specialist',
  'Expert in AI database technologies, vector databases, and DevOps practices. Specializes in building intelligent data systems and managing scalable cloud infrastructure.',
  '/team/usman.jpg',
  'https://linkedin.com/in/usmanaftab',
  'https://github.com/usmanaftab',
  '["Vector Databases", "AI Database Design", "DevOps Engineering", "Cloud Infrastructure", "Database Optimization", "Machine Learning Ops"]',
  7,
  true,
  false,
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- =====================================================
-- NOTES AND IMPORTANT INFORMATION
-- =====================================================

/*
KEY FIELD EXPLANATIONS:

PROJECTS TABLE:
- id: Auto-incrementing primary key
- technologies: JSONB array of technology names (e.g., ["React", "Next.js", "TypeScript"])
- tech_details: JSONB object with detailed tech stack info
- features: JSONB array of main features
- exclusive_features: JSONB array of premium/exclusive features  
- visual_effects: JSONB array of UI effects and animations
- image_priority: Lower numbers = higher priority in display order
- is_code_screenshot: Boolean indicating if main image is a code screenshot
- project_link: Can be NULL for projects still in development
- github_link: Main GitHub repository link
- github_client_link: Frontend/client repository link
- github_server_link: Backend/server repository link

TEAM MEMBERS TABLE:
- skills: JSONB array of skills (e.g., ["React", "Node.js", "Python"])
- order_priority: Lower numbers = higher priority in team display
- is_leader: Boolean flag for team leadership roles
- active: Boolean flag to show/hide team members

QUERY EXAMPLES:

-- Get all featured projects ordered by priority
SELECT * FROM projects 
WHERE featured = true 
ORDER BY image_priority ASC, id DESC;

-- Get projects by category
SELECT * FROM projects 
WHERE category = 'Web Development' 
ORDER BY featured DESC, image_priority ASC;

-- Get active team members ordered by hierarchy
SELECT * FROM team_members 
WHERE active = true 
ORDER BY is_leader DESC, order_priority ASC;

-- Search projects by technology
SELECT * FROM projects 
WHERE technologies::text ILIKE '%React%' 
ORDER BY featured DESC;

-- Get projects with GitHub links
SELECT id, title, github_link, github_client_link, github_server_link 
FROM projects 
WHERE github_link IS NOT NULL OR github_client_link IS NOT NULL;
*/