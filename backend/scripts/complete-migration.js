// Complete the migration by adding remaining projects and team members
require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

async function completeMigration() {
  try {
    console.log('🚀 Completing database migration with remaining data...');

    // Add remaining completed projects
    await sql`
      INSERT INTO projects (
        title, description, detailed_description, image_url, category, 
        technologies, tech_details, project_link, featured, completion_date, 
        client_name, duration, image_priority
      ) VALUES 
      (
        'WEB-APP-(Gratuity Calculator 2025)',
        'This tool simplifies the complex process of gratuity calculation, ensuring you have a clear understanding of your entitlements.',
        'The Gratuity Calculator 2025 is a comprehensive tool that factors in the latest regulations and policies to provide accurate gratuity estimations. It includes features for different employment scenarios, various country regulations, and detailed breakdowns of calculations.',
        '/projects/1bba4cac-58bb-4fa0-9cf1-c7062bb94629.png',
        'Web Development',
        '["React", "TensorFlow.js", "Node.js"]',
        '{"frontend": "React with responsive forms and visualization", "backend": "Node.js for calculation logic", "ai": "TensorFlow.js for predictive analysis"}',
        'https://nex-webs-project-9.netlify.app/',
        true,
        '2024-01-10',
        'Financial Services Company',
        '10 weeks',
        1
      ),
      (
        'Invisible Character Generator(Web-App)',
        'This tool is designed to help you generate and copy invisible characters easily.',
        'The Invisible Character Generator is a specialized utility for digital content creators and developers. It generates various types of invisible Unicode characters that can be used for spacing, formatting, and special effects in digital content.',
        '/projects/4f615362-0f11-4cc2-baa3-b708c837be03.png',
        'Web Development',
        '["Vue.js", "Firebase", "TailwindCSS", "Python"]',
        '{"frontend": "Vue.js for reactive interface", "backend": "Python scripts for character generation", "database": "Firebase for user preferences"}',
        'https://nex-webs-project-4.netlify.app/',
        false,
        '2023-07-15',
        'Open Source Initiative',
        '5 weeks',
        1
      ),
      (
        'Morse Code Translator(Web-App)',
        'Express yourself with unique Morse Code products—perfect for personalized gifts, home decor, and more. Speak in dots and dashes today!',
        'The Morse Code Translator is an interactive web application that converts text to Morse code and vice versa. It includes audio playback of the Morse code, visual representations, and customizable speed settings.',
        '/projects/806ed4b7-10b2-49bb-b8b3-c13a3ec6d597.png',
        'UI/UX Design',
        '["Figma", "Adobe XD", "Prototyping"]',
        '{"design": "Figma and Adobe XD for high-fidelity mockups", "prototyping": "Interactive prototypes with animation"}',
        'https://nex-webs-project-6.netlify.app/',
        false,
        '2023-08-20',
        'Educational Project',
        '4 weeks',
        1
      )
    `;

    // Add remaining newly added projects
    await sql`
      INSERT INTO projects (
        title, description, detailed_description, image_url, category, 
        technologies, tech_details, project_link, featured, status, 
        updated_days, progress, features, image_priority
      ) VALUES 
      (
        'NEWLY ADDED: PROJECT ARA BY (NEX-DEVS)',
        'YOULL BE AMAZED..!!',
        'Revolutionary project powered by advanced AI technology, featuring cutting-edge capabilities and innovative solutions.',
        '/projects/c0e3e4a3-58ba-4e27-a61e-7dad197af43d.png',
        'Web Development',
        '["GOOGLE DEEP THINK"]',
        null,
        'https://3d-portfolio-showcase.vercel.app',
        true,
        'In Development',
        1,
        59,
        '[]',
        1
      ),
      (
        'NEWLY ADDED: 3D Portfolio Website',
        'A 3D website showcasing immersive experiences with interactive elements and stunning animations.',
        'This cutting-edge 3D portfolio website pushes the boundaries of web technology to create an immersive digital experience. It features interactive 3D models that respond to user input and custom shader effects.',
        '/projects/3d-portfolio.jpg',
        'UI/UX Design',
        '["Three.js", "React Three Fiber", "GSAP", "WebGL"]',
        '{"3D": "Three.js with custom WebGL shaders", "framework": "React Three Fiber", "animation": "GSAP for timeline-based animations"}',
        'https://3d-portfolio-showcase.vercel.app',
        true,
        'In Development',
        2,
        99,
        '["Interactive 3D models", "Custom shader effects", "Responsive 3D environments"]',
        1
      ),
      (
        'NEWLY ADDED: Fullstack Dashboard',
        'A complete dashboard solution with authentication, analytics, and real-time data visualization.',
        'The Fullstack Dashboard is a comprehensive solution for business intelligence and data management. It provides secure authentication, real-time analytics, and customizable reporting tools.',
        '/projects/dashboard.jpg',
        'Web Development',
        '["Next.js 14", "Tailwind CSS", "Prisma", "MongoDB"]',
        '{"frontend": "Next.js 14 with App Router", "database": "MongoDB with Prisma ORM", "styling": "Tailwind CSS with custom design system"}',
        'https://fullstack-dashboard.vercel.app',
        true,
        'Beta Testing',
        5,
        50,
        '["OAuth 2.0 Authentication", "Real-time Analytics", "Data Visualization"]',
        1
      )
    `;

    // Add remaining team members
    await sql`
      INSERT INTO team_members (
        name, title, bio, image_url, linkedin_url, github_url, 
        skills, order_priority, is_leader, active
      ) VALUES 
      (
        'Anns Bashir',
        'AI Agent Developer',
        'Specialized AI agent developer with expertise in N8N, Make.com, and workflow automation platforms. Creates intelligent automation solutions.',
        '/team/anns.jpg',
        'https://linkedin.com/in/annsbashir',
        'https://github.com/annsbashir',
        '["AI Agent Development", "N8N Workflows", "Make.com Automation", "Process Automation"]',
        5,
        false,
        true
      ),
      (
        'Hassam Baloch',
        'AI Agent Developer',
        'Specialized AI Agent Developer with comprehensive expertise in N8N, Make.com, and advanced workflow automation platforms.',
        '/team/hassam.jpg',
        'https://linkedin.com/in/hassambaloch',
        'https://github.com/hassambaloch',
        '["AI Agent Development", "N8N Advanced Workflows", "Make.com Expert Integration", "Business Process Automation"]',
        6,
        false,
        true
      ),
      (
        'Usman Aftab',
        'AI Database & DevOps Specialist',
        'Expert in AI database technologies, vector databases, and DevOps practices. Specializes in building intelligent data systems and managing scalable cloud infrastructure.',
        '/team/usman.jpg',
        'https://linkedin.com/in/usmanaftab',
        'https://github.com/usmanaftab',
        '["Vector Databases", "AI Database Design", "DevOps Engineering", "Cloud Infrastructure", "Database Optimization"]',
        7,
        false,
        true
      )
    `;

    // Final verification
    const totalProjects = await sql`SELECT COUNT(*) as count FROM projects`;
    const totalTeam = await sql`SELECT COUNT(*) as count FROM team_members`;
    const featuredProjects = await sql`SELECT COUNT(*) as count FROM projects WHERE featured = true`;

    console.log('\n✅ Migration completed successfully!');
    console.log(`📊 Total projects: ${totalProjects[0].count}`);
    console.log(`⭐ Featured projects: ${featuredProjects[0].count}`);
    console.log(`👥 Total team members: ${totalTeam[0].count}`);
    console.log('\n🎉 Your new Neon database is fully set up and ready!');

  } catch (error) {
    console.error('❌ Error completing migration:', error);
  }
}

completeMigration();