// Data insertion script for New Neon Database
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

console.log('📋 Starting data insertion...');

async function insertData() {
  try {
    // Insert NEX-WEBS Tools project
    await sql`
      INSERT INTO projects (
        title, description, detailed_description, image_url, category, 
        technologies, tech_details, project_link, featured, completion_date, 
        client_name, duration, image_priority, exclusive_features, visual_effects
      ) VALUES (
        'NEX-WEBS Tools',
        'A comprehensive suite of web tools including XML Sitemap Generator, Image Compressor, and SEO tools.(just need an API key for some tools to work)',
        'NEX-WEBS Tools is a powerful collection of utilities designed to help developers and businesses optimize their web presence. The suite includes tools for SEO analysis, performance optimization, and content management.',
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
        '{"morphTransition": false, "rippleEffect": false, "animation": "none", "shadows": "soft"}'
      )
    `;

    // Insert more key projects
    await sql`
      INSERT INTO projects (
        title, description, image_url, category, technologies, project_link, featured, image_priority
      ) VALUES (
        'NEXTJS-WEBSITE',
        'A creative portfolio website with interactive elements and smooth animations.',
        '/projects/8836a47d-e499-472e-bce5-e5c9361b6a7c.png',
        'Web Development',
        '["React", "Framer Motion", "Tailwind CSS", "TypeScript"]',
        'https://nex-webs-project2.netlify.app/',
        true,
        1
      ),
      (
        'CPU & GPU Bottleneck Calculator(AI-Agent)',
        'AI-powered tool for hardware performance analysis.',
        '/projects/1a58fe2c-191f-4164-8527-728b4f518c5f.png',
        'UI/UX Design',
        '["Figma", "Blender", "After Effects"]',
        'https://project-4-updated.vercel.app/',
        true,
        1
      )
    `;

    // Insert newly added projects
    await sql`
      INSERT INTO projects (
        title, description, image_url, category, technologies, project_link, 
        featured, status, updated_days, progress, exclusive_features, image_priority
      ) VALUES (
        'NEWLY ADDED: YT-VEDIO-ANALYZER',
        'Advanced YouTube video analysis tool powered by AI.',
        '/projects/0c3e9b24-ffb3-4f2f-8afe-00ccdbbd05a9.png',
        'Web Development',
        '["AI MODEL FOR RESEARCH"]',
        'https://nex-webs-project-6.netlify.app/',
        true,
        'In Development',
        1,
        48,
        '["PREMIUM CONTENT", "Behind-the-scenes development insights"]',
        1
      ),
      (
        'NEWLY ADDED: PET-GPT (By NEX-DEVS)',
        'AI-powered chatbot specializing in pet-related queries.',
        '/projects/1aef2df5-ec63-42c1-9c05-f37a1a4d152e.png',
        'Web Development with AI Integration',
        '["WEB SEARCH"]',
        'https://3d-portfolio-showcase.vercel.app',
        true,
        'Recently Launched',
        1,
        75,
        '["Early access to premium content", "Experimental features"]',
        1
      )
    `;

    // Insert team leader
    await sql`
      INSERT INTO team_members (
        name, title, bio, image_url, linkedin_url, github_url, 
        twitter_url, dribbble_url, skills, order_priority, is_leader, active
      ) VALUES (
        'Ali Hasnaat',
        'Founder & Lead Developer',
        'Full-stack developer with expertise in AI integration and modern web technologies. Founded NEX-DEVS in 2018 and has led 950+ successful projects.',
        '/team/ali.jpg',
        'https://linkedin.com/in/alihasnaat',
        'https://github.com/NEX-DEVS-DEVELOPERS',
        'https://twitter.com/alihasnaat',
        'https://dribbble.com/alihasnaat',
        '["Full Stack Development", "AI Integration", "System Architecture", "Team Leadership"]',
        1,
        true,
        true
      )
    `;

    // Insert key team members
    await sql`
      INSERT INTO team_members (
        name, title, bio, image_url, linkedin_url, github_url, skills, order_priority, is_leader, active
      ) VALUES 
      (
        'Mudassir Ahmad',
        'AI Workflows for Business Specialist',
        'Senior frontend developer specializing in React/Next.js ecosystems and AI workflow automation.',
        '/team/mdassir.jpg',
        'https://linkedin.com/in/mdassirahmad',
        'https://github.com/mdassirahmad',
        '["React Development", "Next.js Applications", "AI Workflow Automation"]',
        2,
        false,
        true
      ),
      (
        'Faizan Khan',
        'UI/UX Designer',
        'Creative UI/UX designer with expertise in Figma, user research, and motion design.',
        '/team/faizan.jpg',
        'https://linkedin.com/in/faizankhan',
        null,
        '["UI/UX Design", "Figma Mastery", "User Research", "Motion Design"]',
        3,
        false,
        true
      ),
      (
        'Eman Ali',
        'Backend Developer',
        'Experienced backend developer with expertise in Node.js, Python, and DevOps practices.',
        '/team/eman.jpg',
        'https://linkedin.com/in/emanali',
        'https://github.com/emanali',
        '["Backend Development", "Node.js", "Python", "DevOps"]',
        4,
        false,
        true
      )
    `;

    // Verify data
    const projectCount = await sql`SELECT COUNT(*) as count FROM projects`;
    const teamCount = await sql`SELECT COUNT(*) as count FROM team_members`;
    
    console.log(`✅ Migration completed successfully!`);
    console.log(`📊 Projects inserted: ${projectCount[0].count}`);
    console.log(`👥 Team members inserted: ${teamCount[0].count}`);
    
  } catch (error) {
    console.error('❌ Data insertion failed:', error);
    process.exit(1);
  }
}

insertData();