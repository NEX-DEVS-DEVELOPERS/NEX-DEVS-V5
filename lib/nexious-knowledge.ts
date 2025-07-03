/**
 * Knowledge base for the Nexious AI chatbot
 * This file contains information about the website, services, pricing, etc.
 * that can be used to enhance the AI's responses
 */

// Define type interfaces for better type checking
export interface Service {
  name: string;
  description: string;
  technologies: string[];
  timeline: string;
  priceRange: string;
  features: string[];
  exactPrice?: number;
  popular?: boolean;
  isNew?: boolean;
}

export interface ServiceCategory {
  name: string;
  services: Service[];
}

export const websiteInformation = {
  name: "NEX-DEVS",
  tagline: "Professional Web Development Solutions",
  description: "NEX-DEVS provides professional web development services including custom websites, applications, and digital solutions for businesses of all sizes. We specialize in modern web technologies, e-commerce solutions, and custom applications using our proprietary NEX-SHFT methodology for superior results.",
  contact: {
    email: "contact@nex-devs.com",
    phone: "+1 (555) 123-4567",
    location: "Remote team, serving globally"
  },
  owner: {
    name: "Ali Hasnaat",
    title: "Fullstack Developer & Founder",
    experience: "5+ years",
    projectsCompleted: "50+",
    keySkills: ["Discovery & Planning", "Design & Architecture", "Frontend Development", "Backend Development"],
    specializations: ["React/Next.js", "Node.js", "PostgreSQL", "E-commerce", "API Development", "UI/UX Design"]
  },
  uniqueValuePropositions: [
    "Proprietary NEX-SHFT development methodology for faster, more reliable results",
    "Personalized service with direct access to the founder on every project",
    "Transparent pricing with no hidden fees or surprise costs",
    "Quality-first approach with comprehensive testing and optimization",
    "Modern technology stack ensuring scalable, future-proof solutions",
    "Competitive pricing without compromising on quality or service"
  ]
};

// New detailed information about Ali Hasnaat (owner)
export const ownerPersonalInformation = {
  fullName: "Ali Hasnaat",
  nickname: "Ali",
  personalEmail: "nexwebs.org@gmail.com",
  phone: "0329-2425950",
  location: "Pakistan",
  background: "Self-taught developer who has been coding since 2018",
  profession: "Fullstack Web Developer specialized in React/Next.js ecosystem",
  education: "Self-educated through online courses, bootcamps, and continuous learning",
  careerJourney: "Started as a graphic designer, transitioned to web development in 2018, and quickly mastered frontend and backend technologies to become a fullstack developer",
  passion: "Creating innovative web solutions that help businesses grow online and solving complex technical challenges",
  philosophy: "Building relationships through trust, quality work, and clear communication. Believes in delivering more value than clients pay for.",
  workStyle: "Hands-on developer who personally oversees every project from start to finish, often working late into the night when inspired",
  communication: "Direct, friendly, and responsive - typically replies within hours, even during off-hours for urgent client needs",
  expertise: ["React/Next.js", "TypeScript", "Node.js", "UI/UX Design", "WordPress", "Full-Stack Development", "E-commerce Solutions", "API Development"],
  languages: ["JavaScript/TypeScript", "Python", "PHP", "HTML/CSS", "SQL", "GraphQL"],
  frameworks: ["React", "Next.js", "Vue.js", "Express", "NestJS", "Tailwind CSS", "Bootstrap", "Material UI"],
  tools: ["Git", "Docker", "AWS", "Vercel", "Netlify", "Figma", "Adobe XD", "VSCode", "MongoDB", "PostgreSQL"],
  personalGoals: "Expand NEX-DEVS to become a recognized brand in web development services globally and build innovative SaaS products",
  values: ["Honesty", "Quality", "Creativity", "Client Satisfaction", "Continuous Learning", "Work-Life Balance", "Technical Excellence"],
  clientApproach: "Always listens carefully to clients' needs, asks detailed questions to understand business objectives, and provides personalized solutions that exceed expectations",
  workProcess: {
    discoveryPhase: "In-depth consultation to understand business needs, target audience, and project scope",
    planningPhase: "Creating detailed technical specifications, wireframes, and project timelines",
    designPhase: "Developing modern, user-friendly interfaces with focus on user experience",
    developmentPhase: "Writing clean, efficient code with regular client updates and feedback sessions",
    testingPhase: "Rigorous testing across devices and browsers to ensure flawless performance",
    launchPhase: "Smooth deployment with performance optimization and analytics setup",
    supportPhase: "Ongoing maintenance, updates, and technical support for continued success"
  },
  funFacts: [
    "Transitioned from graphic design to web development in 2018",
    "Has completed over 50 projects for clients around the world",
    "Often works late into the night when inspired by new ideas",
    "Can code for 8+ hours straight when in the flow state",
    "Believes in delivering more value than what clients pay for",
    "Started learning to code through YouTube tutorials and free online resources",
    "Built his first commercial website within 3 months of learning web development",
    "Passionate about mentoring new developers and sharing knowledge"
  ],
  testimonialQuotes: [
    "Ali transformed our outdated website into a modern, user-friendly platform that doubled our online leads.",
    "Working with Ali was a pleasure - he understood our vision perfectly and delivered beyond our expectations.",
    "The most responsive developer I've ever worked with. Ali was always available to answer questions and make adjustments.",
    "Ali's technical skills are impressive, but what really sets him apart is his commitment to understanding our business goals.",
    "We've worked with several developers before, but no one has delivered results like Ali. Our e-commerce sales increased by 70% after his redesign."
  ],
  personalTone: "Friendly but professional, enthusiastic about technology, patient with client questions, technically precise but able to explain complex concepts in simple terms",
  favoriteProjects: "E-commerce platforms, interactive web applications with advanced functionality, real-time dashboards, and custom CMS solutions",
  personalPhilosophy: "Technology should solve real problems and make people's lives easier. Good code is not just functional, but maintainable, scalable, and elegant.",
  websiteRole: "Founder, Lead Developer, and Design Director of NEX-DEVS (ALI-HASNAAT), responsible for client consultations, technical architecture, project management, and quality assurance"
};

// NEX-SHFT Methodology - Our Proprietary Development Process
export const nexShftMethodology = {
  name: "NEX-SHFT",
  fullName: "Next-Generation Scalable High-Fidelity Technology",
  description: "Our proprietary development methodology that combines agile principles with modern technology practices to deliver superior web solutions faster and more reliably than traditional approaches.",

  corePhases: [
    {
      phase: "N - Navigate & Discover",
      description: "Comprehensive project discovery and requirement analysis",
      duration: "1-2 weeks",
      activities: [
        "In-depth client consultation and needs assessment",
        "Market research and competitive analysis",
        "Technical feasibility study and architecture planning",
        "User persona development and journey mapping",
        "Project scope definition and timeline creation"
      ],
      deliverables: [
        "Detailed project requirements document",
        "Technical architecture blueprint",
        "User experience wireframes",
        "Project timeline and milestone plan"
      ]
    },
    {
      phase: "E - Engineer & Design",
      description: "System architecture design and user interface creation",
      duration: "2-3 weeks",
      activities: [
        "Database schema design and optimization",
        "API architecture and endpoint planning",
        "UI/UX design with modern design principles",
        "Component library and design system creation",
        "Performance optimization planning"
      ],
      deliverables: [
        "Complete system architecture documentation",
        "High-fidelity UI/UX designs",
        "Interactive prototypes",
        "Technical specifications document"
      ]
    },
    {
      phase: "X - eXecute & Develop",
      description: "Full-stack development with continuous integration",
      duration: "4-8 weeks",
      activities: [
        "Frontend development with React/Next.js",
        "Backend API development with Node.js",
        "Database implementation and optimization",
        "Third-party integrations and API connections",
        "Continuous testing and quality assurance"
      ],
      deliverables: [
        "Fully functional web application",
        "Comprehensive test suite",
        "API documentation",
        "Development environment setup"
      ]
    },
    {
      phase: "S - Secure & Test",
      description: "Security implementation and comprehensive testing",
      duration: "1-2 weeks",
      activities: [
        "Security audit and vulnerability assessment",
        "Performance testing and optimization",
        "Cross-browser and device compatibility testing",
        "User acceptance testing",
        "Load testing and scalability verification"
      ],
      deliverables: [
        "Security audit report",
        "Performance optimization report",
        "Testing documentation",
        "Quality assurance certification"
      ]
    },
    {
      phase: "H - Host & Deploy",
      description: "Production deployment and launch preparation",
      duration: "3-5 days",
      activities: [
        "Production environment setup",
        "Domain configuration and SSL implementation",
        "Database migration and optimization",
        "CDN setup and performance optimization",
        "Monitoring and analytics implementation"
      ],
      deliverables: [
        "Live production website",
        "Deployment documentation",
        "Monitoring dashboard setup",
        "Performance metrics baseline"
      ]
    },
    {
      phase: "F - Follow-up & Support",
      description: "Post-launch support and continuous improvement",
      duration: "Ongoing",
      activities: [
        "Performance monitoring and optimization",
        "Regular security updates and patches",
        "Feature enhancements and improvements",
        "Technical support and maintenance",
        "Analytics review and optimization recommendations"
      ],
      deliverables: [
        "Monthly performance reports",
        "Security update notifications",
        "Feature enhancement proposals",
        "Ongoing technical support"
      ]
    },
    {
      phase: "T - Transform & Scale",
      description: "Growth optimization and scaling preparation",
      duration: "As needed",
      activities: [
        "Scalability assessment and planning",
        "Performance optimization for growth",
        "New feature development",
        "Integration with additional business systems",
        "Technology stack upgrades and modernization"
      ],
      deliverables: [
        "Scalability roadmap",
        "Performance optimization plan",
        "Technology upgrade recommendations",
        "Growth-ready infrastructure"
      ]
    }
  ],

  benefits: [
    "50% faster development time compared to traditional methods",
    "99.9% uptime reliability through comprehensive testing",
    "Enhanced security through built-in security auditing",
    "Superior performance through optimization at every phase",
    "Scalable architecture that grows with your business",
    "Transparent process with clear deliverables at each phase",
    "Reduced post-launch issues through thorough testing",
    "Future-proof technology choices and implementation"
  ],

  technicalAdvantages: [
    "Modern React/Next.js frontend for optimal performance",
    "Scalable Node.js backend architecture",
    "PostgreSQL database optimization for reliability",
    "API-first design for easy integrations",
    "Mobile-responsive design as standard",
    "SEO optimization built into every project",
    "Security-first development approach",
    "Performance monitoring and optimization"
  ],

  differentiators: [
    "Only development company using the NEX-SHFT methodology",
    "Proprietary testing and quality assurance processes",
    "Direct founder involvement in every project",
    "Transparent pricing with no hidden costs",
    "Faster delivery without compromising quality",
    "Comprehensive post-launch support included",
    "Technology choices based on long-term sustainability",
    "Proven track record with 50+ successful projects"
  ]
};

// Technical Capabilities and Expertise
export const technicalCapabilities = {
  frontendTechnologies: {
    primary: ["React", "Next.js", "TypeScript", "JavaScript"],
    styling: ["Tailwind CSS", "CSS3", "SCSS", "Styled Components", "Material UI", "Bootstrap"],
    stateManagement: ["Redux", "Zustand", "Context API", "React Query"],
    testing: ["Jest", "React Testing Library", "Cypress", "Playwright"],
    buildTools: ["Webpack", "Vite", "Turbo", "ESBuild"]
  },

  backendTechnologies: {
    primary: ["Node.js", "Express.js", "NestJS", "Python", "PHP"],
    databases: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQLite"],
    apis: ["REST APIs", "GraphQL", "WebSocket", "Server-Sent Events"],
    authentication: ["JWT", "OAuth", "Auth0", "Firebase Auth", "NextAuth"],
    cloudServices: ["AWS", "Vercel", "Netlify", "DigitalOcean", "Heroku"]
  },

  specializedServices: {
    ecommerce: ["Shopify", "WooCommerce", "Custom E-commerce Solutions", "Payment Gateway Integration"],
    cms: ["WordPress", "Strapi", "Sanity", "Contentful", "Custom CMS"],
    mobile: ["React Native", "Progressive Web Apps", "Mobile-First Design"],
    devops: ["Docker", "CI/CD", "GitHub Actions", "Automated Deployment", "Performance Monitoring"]
  },

  industryExperience: [
    "E-commerce and Online Retail",
    "Healthcare and Medical Services",
    "Education and E-learning",
    "Real Estate and Property Management",
    "Financial Services and Fintech",
    "Restaurant and Food Services",
    "Professional Services and Consulting",
    "Non-profit and Community Organizations",
    "Technology and SaaS Companies",
    "Creative and Design Agencies"
  ]
};

// Project Examples and Case Studies
export const projectExamples = {
  ecommerceProjects: [
    {
      name: "Multi-vendor Marketplace",
      description: "Custom e-commerce platform supporting multiple vendors with advanced inventory management",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe"],
      features: ["Vendor dashboard", "Real-time inventory", "Multi-payment gateways", "Advanced analytics"],
      results: "70% increase in sales, 50% reduction in cart abandonment"
    },
    {
      name: "Fashion Retail Website",
      description: "Modern e-commerce site with AR try-on features and personalized recommendations",
      technologies: ["React", "Express", "MongoDB", "AI/ML APIs"],
      features: ["AR integration", "Personalization engine", "Social commerce", "Mobile app"],
      results: "300% increase in mobile conversions, 45% higher average order value"
    }
  ],

  businessApplications: [
    {
      name: "Healthcare Management System",
      description: "Comprehensive patient management system with telemedicine capabilities",
      technologies: ["Next.js", "NestJS", "PostgreSQL", "WebRTC"],
      features: ["Patient portal", "Video consultations", "Electronic health records", "Appointment scheduling"],
      results: "60% reduction in administrative overhead, 90% patient satisfaction"
    },
    {
      name: "Real Estate CRM Platform",
      description: "Custom CRM for real estate agencies with property management and client tracking",
      technologies: ["React", "Node.js", "PostgreSQL", "Google Maps API"],
      features: ["Property listings", "Client management", "Document storage", "Analytics dashboard"],
      results: "40% increase in lead conversion, 50% time savings in property management"
    }
  ],

  portfolioWebsites: [
    {
      name: "Creative Agency Portfolio",
      description: "Award-winning portfolio website with interactive animations and case studies",
      technologies: ["Next.js", "Framer Motion", "Sanity CMS", "Vercel"],
      features: ["Interactive animations", "Case study presentations", "Client testimonials", "Contact forms"],
      results: "200% increase in client inquiries, featured in design showcases"
    },
    {
      name: "Professional Services Website",
      description: "Corporate website with service booking and client portal integration",
      technologies: ["React", "Express", "MongoDB", "Stripe"],
      features: ["Service booking", "Client portal", "Payment processing", "Resource library"],
      results: "150% increase in online bookings, 35% reduction in support tickets"
    }
  ]
};

export const serviceCategories: ServiceCategory[] = [
  {
    name: "Design",
    services: [
      {
        name: "UI/UX Design",
        description: "Professional UI/UX design services with modern interfaces and seamless user experiences",
        technologies: ["Figma", "Framer", "Adobe XD", "User Flow Diagrams", "Interactive Prototypes", "Design Systems"],
        timeline: "2-3 weeks",
        priceRange: "$500",
        exactPrice: 500,
        features: [
          "Custom UI Design in Figma",
          "Interactive Prototypes",
          "Responsive Design System",
          "User Flow Diagrams",
          "Design Components Library",
          "Animation with Framer",
          "Design Handoff",
          "Design Documentation",
          "Collaboration Sessions",
          "3 Revision Rounds"
        ],
        isNew: true
      }
    ]
  },
  {
    name: "WordPress",
    services: [
      {
        name: "WordPress Basic",
        description: "Streamlined WordPress solution perfect for small businesses beginning their online journey",
        technologies: ["WordPress", "PHP", "MySQL", "JavaScript", "Responsive Design"],
        timeline: "2-3 weeks",
        priceRange: "$350",
        exactPrice: 350,
        features: [
          "Custom WordPress Theme",
          "Mobile Responsive Design",
          "5 Pages",
          "Basic SEO Setup",
          "Contact Form",
          "2 Revisions"
        ]
      },
      {
        name: "WordPress Professional",
        description: "Enhanced WordPress solution with advanced features for growing businesses seeking expansion",
        technologies: ["WordPress", "WooCommerce", "PHP", "MySQL", "JavaScript", "Advanced SEO"],
        timeline: "3-4 weeks",
        priceRange: "$450",
        exactPrice: 450,
        features: [
          "Everything in Basic",
          "E-commerce Integration",
          "10 Pages",
          "Advanced SEO",
          "Social Media Integration",
          "Premium Plugins",
          "4 Revisions"
        ],
        popular: true
      }
    ]
  },
  {
    name: "Development",
    services: [
      {
        name: "Full-Stack Basic",
        description: "Complete custom web application with modern frontend and robust backend architecture",
        technologies: ["React", "Next.js", "Node.js", "Express", "MongoDB", "PostgreSQL", "RESTful APIs"],
        timeline: "4-8 weeks",
        priceRange: "$550",
        exactPrice: 550,
        features: [
          "Custom Frontend & Backend",
          "User Authentication",
          "Database Integration",
          "API Development",
          "Basic Admin Panel",
          "3 Revisions"
        ]
      }
    ]
  },
  {
    name: "E-Commerce",
    services: [
      {
        name: "E-commerce Solutions",
        description: "Feature-rich online stores with payment processing, inventory management, and user-friendly interfaces.",
        technologies: ["Shopify", "WooCommerce", "Custom Solutions", "Payment Gateways"],
        timeline: "6-12 weeks",
        priceRange: "$3,000 - $15,000",
        features: [
          "Product Catalog",
          "Shopping Cart",
          "Secure Checkout",
          "Payment Gateway Integration",
          "Inventory Management",
          "Order Tracking",
          "Customer Accounts",
          "Mobile Responsive Design"
        ]
      }
    ]
  },
  {
    name: "Mobile",
    services: [
      {
        name: "Mobile App Development",
        description: "Native and cross-platform mobile applications for iOS and Android devices.",
        technologies: ["React Native", "Flutter", "Swift", "Kotlin"],
        timeline: "8-16 weeks",
        priceRange: "$5,000 - $25,000",
        features: [
          "Native Performance",
          "Cross-Platform Compatibility",
          "User Authentication",
          "API Integration",
          "Push Notifications",
          "Offline Functionality",
          "App Store Submission",
          "Regular Updates"
        ]
      }
    ]
  }
];

export const workingProcess = [
  {
    stage: "Discovery",
    description: "We start with a thorough consultation to understand your business, goals, target audience, and specific requirements.",
    timeline: "1-2 weeks",
    deliverables: ["Project brief", "Initial requirements document", "Preliminary timeline"],
    details: "Deep dive into requirements, tech stack selection, and project roadmap creation"
  },
  {
    stage: "Planning & Design",
    description: "We create wireframes, mockups, and design concepts for your approval before development begins.",
    timeline: "2-3 weeks",
    deliverables: ["Wireframes", "Design mockups", "Technical specifications", "Project roadmap"],
    details: "Creating scalable solutions with modern architecture patterns"
  },
  {
    stage: "Development",
    description: "Our team develops your solution with regular updates and opportunities for feedback.",
    timeline: "Varies by project type",
    deliverables: ["Development milestones", "Regular progress updates", "Code documentation"]
  },
  {
    stage: "Testing & Quality Assurance",
    description: "Comprehensive testing to ensure your solution works flawlessly across all intended devices and browsers.",
    timeline: "1-2 weeks",
    deliverables: ["Bug reports", "Performance metrics", "Compatibility testing results"]
  },
  {
    stage: "Deployment & Launch",
    description: "We handle the deployment process and ensure a smooth launch of your website or application.",
    timeline: "1 week",
    deliverables: ["Deployed website/application", "Launch checklist", "Deployment documentation"]
  },
  {
    stage: "Support & Maintenance",
    description: "Ongoing support and maintenance options to keep your website or application running smoothly.",
    timeline: "Ongoing",
    deliverables: ["Regular updates", "Performance monitoring", "Technical support"]
  }
];

export const frequentlyAskedQuestions = [
  {
    question: "How much does a website cost?",
    answer: "Our pricing depends on your specific needs. UI/UX Design starts at $500, WordPress Basic at $350, WordPress Professional at $450, and Full-Stack Development at $550. For more complex solutions like e-commerce or mobile apps, prices range from $3,000-$25,000. We provide detailed quotes after discussing your requirements during a discovery call."
  },
  {
    question: "How long does it take to build a website?",
    answer: "Development timelines vary based on project complexity. UI/UX Design takes 2-3 weeks, WordPress sites 2-4 weeks, and custom web applications 4-8 weeks. E-commerce solutions typically require 6-12 weeks. We provide a detailed timeline during the planning phase after fully understanding your requirements."
  },
  {
    question: "Do you offer website maintenance services?",
    answer: "Yes, we offer ongoing maintenance and support packages to keep your website secure, updated, and optimized. Our maintenance plans include regular updates, backups, security monitoring, and technical support."
  },
  {
    question: "Can you redesign my existing website?",
    answer: "Absolutely! We specialize in website redesigns to improve performance, user experience, and visual appeal. Our process involves analyzing your current site, identifying improvement areas, and implementing modern design and development practices."
  },
  {
    question: "Do you provide hosting services?",
    answer: "While we don't provide hosting directly, we can recommend reliable hosting providers suitable for your needs and handle all aspects of setup and deployment. We ensure your website is properly configured for optimal performance and security."
  },
  {
    question: "What technologies do you use for development?",
    answer: "We use modern technologies based on project requirements. Our tech stack includes React, Next.js, Angular, Vue.js for frontend; Node.js, Python, PHP for backend; and various database solutions like MySQL, PostgreSQL, and MongoDB. For e-commerce, we work with Shopify, WooCommerce, and custom solutions."
  },
  {
    question: "How do we get started working together?",
    answer: "The process begins with a discovery call where we discuss your requirements and goals. After this, we provide a proposal with timeline and pricing. Once approved, we begin with the planning phase, followed by design, development, testing, and launch."
  },
  {
    question: "What is your most popular service?",
    answer: "Our WordPress Professional package at $450 is our most popular offering. It includes e-commerce integration, 10 pages, advanced SEO, social media integration, premium plugins, and 4 revision rounds. It's perfect for growing businesses that need a professional online presence with advanced features."
  }
];

export const companyValues = [
  {
    value: "Quality",
    description: "We are committed to delivering high-quality, well-crafted digital solutions that exceed expectations."
  },
  {
    value: "Transparency",
    description: "We maintain clear communication and provide regular updates throughout the development process."
  },
  {
    value: "Innovation",
    description: "We stay at the forefront of technology to provide cutting-edge solutions to our clients."
  },
  {
    value: "Reliability",
    description: "We deliver on our promises, meeting deadlines and specifications with consistent quality."
  },
  {
    value: "Client Focus",
    description: "We prioritize understanding and meeting our clients' unique needs and business objectives."
  }
];

export const developerSkills = [
  {
    id: "01",
    title: "Discovery & Planning",
    description: "Deep dive into requirements, tech stack selection, and project roadmap creation"
  },
  {
    id: "02", 
    title: "Design & Architecture",
    description: "Creating scalable solutions with modern architecture patterns"
  },
  {
    id: "03",
    title: "Frontend Development",
    description: "Building responsive, accessible, and performant user interfaces"
  },
  {
    id: "04",
    title: "Backend Development",
    description: "Developing robust server-side applications and APIs"
  }
];

// Step-by-step procedures for the AI to provide detailed guidance
export const stepByStepProcedures = {
  startingAProject: {
    title: "Starting a Web Development Project with NEX-DEVS",
    description: "A comprehensive guide to begin your web development journey with us",
    steps: [
      {
        stepNumber: 1,
        title: "Initial Consultation",
        description: "Schedule a free discovery call with Ali Hasnaat to discuss your project needs and goals",
        details: "During this call, we'll explore your business requirements, target audience, competitive landscape, and project timeline. Come prepared with any existing materials, inspirational websites, and specific goals you want to achieve.",
        timeframe: "30-60 minutes",
        deliverables: "Project brief outline"
      },
      {
        stepNumber: 2,
        title: "Requirement Analysis",
        description: "We'll analyze your needs and create a detailed project requirements document",
        details: "Our team will research your industry, analyze competitors, and create a comprehensive document outlining functional requirements, technical specifications, and project scope. This document will serve as the foundation for your project.",
        timeframe: "3-5 business days",
        deliverables: "Detailed requirements document, preliminary sitemap"
      },
      {
        stepNumber: 3,
        title: "Proposal and Quote",
        description: "Receive a tailored proposal with timeline and pricing options",
        details: "Based on the requirements analysis, we'll provide you with a detailed proposal including project scope, timeline, milestones, deliverables, and pricing. We offer flexible payment options and will explain everything clearly.",
        timeframe: "2-3 business days",
        deliverables: "Project proposal, cost estimate, contract"
      },
      {
        stepNumber: 4,
        title: "Design Phase",
        description: "Our design team creates the visual identity and user experience for your project",
        details: "We'll develop wireframes, mockups, and interactive prototypes for your approval. This includes color schemes, typography, layout designs, and user flow diagrams tailored to your brand and target audience.",
        timeframe: "2-4 weeks",
        deliverables: "Wireframes, design mockups, interactive prototypes"
      },
      {
        stepNumber: 5,
        title: "Development Phase",
        description: "Our development team brings the designs to life with clean, efficient code",
        details: "We follow industry best practices to develop your website or application, with regular updates and opportunities for feedback. This phase includes frontend development, backend systems, database setup, and integration of all required functionality.",
        timeframe: "4-12 weeks (depending on project complexity)",
        deliverables: "Development milestone updates, staging environment access"
      },
      {
        stepNumber: 6,
        title: "Testing and Quality Assurance",
        description: "Rigorous testing across devices and browsers to ensure flawless performance",
        details: "We perform comprehensive testing including functional testing, cross-browser compatibility, responsive design verification, performance optimization, security testing, and user acceptance testing.",
        timeframe: "1-2 weeks",
        deliverables: "QA report, performance metrics, bug fixes"
      },
      {
        stepNumber: 7,
        title: "Launch and Deployment",
        description: "Smooth deployment of your website or application to production servers",
        details: "We handle all aspects of launching your project including domain configuration, SSL setup, server deployment, and final checks. We also provide training for your team on managing content and using any custom features.",
        timeframe: "1-3 days",
        deliverables: "Live website/application, training session, launch checklist"
      },
      {
        stepNumber: 8,
        title: "Post-Launch Support",
        description: "Ongoing maintenance, updates, and technical support",
        details: "We provide 30 days of free support after launch for bug fixes. Beyond that, we offer various maintenance packages to keep your website secure, updated, and optimized for performance.",
        timeframe: "Ongoing",
        deliverables: "Support documentation, maintenance options"
      }
    ]
  },
  
  choosingRightService: {
    title: "Choosing the Right Web Development Service",
    description: "A guide to help you select the perfect service for your specific needs",
    steps: [
      {
        stepNumber: 1,
        title: "Assess Your Business Needs",
        description: "Determine what you need your website or application to accomplish",
        details: "Consider your business goals, target audience, required functionality, content needs, and growth projections. Are you selling products, generating leads, providing information, or offering a service? Your answers will help determine the right solution.",
        questions: [
          "What is the primary purpose of your website?",
          "Who is your target audience?",
          "What actions do you want visitors to take?",
          "How much content will you need to manage?",
          "Do you need e-commerce capabilities?"
        ]
      },
      {
        stepNumber: 2,
        title: "Understand Available Options",
        description: "Review our service categories to understand what each offers",
        details: "We provide several service tiers including WordPress solutions, custom web applications, e-commerce platforms, and UI/UX design. Each has different capabilities, maintenance requirements, and price points.",
        serviceComparison: {
          wordpressBasic: "Perfect for small businesses needing a professional online presence with up to 5 pages",
          wordpressProfessional: "Ideal for growing businesses needing more features, e-commerce integration, and up to 10 pages",
          fullStackBasic: "Great for businesses needing custom functionality beyond what WordPress offers",
          ecommerceOptions: "Specialized solutions for online stores with inventory management and payment processing"
        }
      },
      {
        stepNumber: 3,
        title: "Consider Budget and Timeline",
        description: "Evaluate your budget constraints and project timeline",
        details: "Different services have different cost implications and development timeframes. We offer solutions starting from $137.45 for WordPress Basic to custom solutions that may cost several thousand dollars.",
        budgetGuidelines: {
          small: "$137.45 - $255.26 for standard WordPress solutions",
          medium: "$294.53 - $373.07 for professional custom websites",
          large: "$800+ for e-commerce and complex web applications"
        },
        timelineExpectations: {
          wordpress: "2-4 weeks",
          custom: "4-8 weeks",
          ecommerce: "6-12 weeks"
        }
      },
      {
        stepNumber: 4,
        title: "Evaluate Long-term Needs",
        description: "Consider future growth and scalability requirements",
        details: "Your business will evolve, and your website should be able to grow with you. Consider future functionality, content expansion, user growth, and integration needs.",
        scalabilityFactors: [
          "Anticipated traffic growth",
          "Content expansion plans",
          "Future feature additions",
          "Integration with other business systems",
          "Maintenance preferences and technical capabilities"
        ]
      },
      {
        stepNumber: 5,
        title: "Book a Consultation",
        description: "Schedule a free consultation to discuss your specific situation",
        details: "Our team will help you evaluate the best option for your specific needs, budget, and timeline. We'll provide expert recommendations based on your business goals and technical requirements.",
        consultationProcess: "30-minute video call with Ali Hasnaat to discuss your project needs and receive personalized recommendations",
        scheduling: "Available on our website contact form or by emailing directly at nexwebs.org@gmail.com"
      }
    ]
  },
  
  paymentProcess: {
    title: "Complete Payment Process Guide",
    description: "Step-by-step instructions for making payments for our services",
    steps: [
      {
        stepNumber: 1,
        title: "Review and Accept Proposal",
        description: "Carefully review the project proposal and statement of work",
        details: "After our consultation, you'll receive a detailed proposal outlining project scope, deliverables, timeline, and cost. Review this carefully, ask any questions, and formally accept the proposal to proceed."
      },
      {
        stepNumber: 2,
        title: "Choose Payment Method",
        description: "Select your preferred payment method from our available options",
        details: "We accept multiple payment methods including credit/debit cards, PayPal, bank transfers, and cryptocurrency. For clients in Pakistan, we also accept JazzCash, EasyPaisa, SadaPay, and NayaPay.",
        paymentOptions: {
          international: ["Credit/Debit Cards", "PayPal", "Bank Transfer", "Cryptocurrency (Bitcoin, Ethereum, USDT)"],
          pakistan: ["JazzCash", "EasyPaisa", "SadaPay", "NayaPay", "Bank Transfer"]
        }
      },
      {
        stepNumber: 3,
        title: "Initial Deposit Payment",
        description: "Pay the initial 50% deposit to begin work",
        details: "Our standard payment schedule requires a 50% deposit to begin work on your project. You'll receive detailed payment instructions based on your chosen payment method. Work begins after this payment is confirmed."
      },
      {
        stepNumber: 4,
        title: "Milestone Payments (if applicable)",
        description: "For larger projects, make payments at predefined project milestones",
        details: "Projects over $1000 may have milestone-based payment schedules. Each milestone payment is linked to specific deliverables and project phases. You'll receive notifications when milestones are reached."
      },
      {
        stepNumber: 5,
        title: "Final Payment",
        description: "Complete the final payment before project launch",
        details: "The remaining balance (typically 50% of the project total) is due upon project completion and before the final launch. We'll provide a final invoice with payment instructions."
      },
      {
        stepNumber: 6,
        title: "Receive Payment Confirmation",
        description: "Get official receipt and payment confirmation",
        details: "After each payment, you'll receive a detailed receipt and payment confirmation via email. This serves as your proof of payment and outlines what has been paid for."
      },
      {
        stepNumber: 7,
        title: "Project Handover",
        description: "Receive complete project files and access credentials",
        details: "After the final payment is confirmed, you'll receive full access to all project files, source code, design assets, and necessary credentials. We'll also provide documentation and training if needed."
      }
    ]
  },
  
  websiteMaintenance: {
    title: "Website Maintenance Best Practices",
    description: "How to keep your website secure, updated, and performing at its best",
    steps: [
      {
        stepNumber: 1,
        title: "Regular Content Updates",
        description: "Keep your website content fresh and relevant",
        details: "Regularly update your website with new content, blog posts, product information, and company news. Fresh content improves SEO, keeps visitors engaged, and demonstrates that your business is active.",
        frequency: "Weekly or monthly, depending on your business type"
      },
      {
        stepNumber: 2,
        title: "Software Updates",
        description: "Keep all software components up to date",
        details: "Regularly update your content management system, plugins, themes, and other software components. Updates often include security patches, bug fixes, and new features.",
        frequency: "Monthly, or immediately for critical security updates",
        services: "Our maintenance packages include monitored updates to prevent compatibility issues"
      },
      {
        stepNumber: 3,
        title: "Security Monitoring",
        description: "Protect your website from threats and vulnerabilities",
        details: "Implement security best practices including malware scanning, firewall protection, secure user authentication, and regular security audits. Monitor for suspicious activity and unauthorized access attempts.",
        services: "Our security packages include real-time monitoring, firewall protection, and incident response"
      },
      {
        stepNumber: 4,
        title: "Performance Optimization",
        description: "Ensure your website loads quickly and performs well",
        details: "Regularly optimize images, minify code, leverage browser caching, and monitor server response times. Fast-loading websites improve user experience, conversion rates, and search engine rankings.",
        frequency: "Quarterly performance audits",
        services: "Our performance optimization service includes comprehensive speed improvements"
      },
      {
        stepNumber: 5,
        title: "Regular Backups",
        description: "Protect your data with automated backups",
        details: "Implement automated daily or weekly backups of your website files and database. Store backups in secure, off-site locations to ensure data can be restored in case of emergencies.",
        frequency: "Daily or weekly, depending on how frequently your content changes",
        services: "All our maintenance plans include automated backup systems"
      },
      {
        stepNumber: 6,
        title: "Analytics Monitoring",
        description: "Track website performance and user behavior",
        details: "Monitor analytics to understand user behavior, traffic sources, popular content, and conversion rates. Use this data to make informed decisions about website improvements.",
        tools: "Google Analytics, Google Search Console, heatmapping tools",
        services: "We provide monthly analytics reports and recommendations as part of our premium maintenance packages"
      },
      {
        stepNumber: 7,
        title: "Technical SEO Maintenance",
        description: "Ensure your website remains optimized for search engines",
        details: "Regularly check for broken links, crawl errors, sitemap issues, and other technical SEO factors. Fix issues promptly to maintain search engine rankings.",
        frequency: "Monthly technical SEO audits",
        services: "Our SEO maintenance service includes comprehensive technical optimization"
      }
    ]
  }
};

// =============================================================================
// ADMIN KNOWLEDGE BASE MANAGEMENT FUNCTIONS
// =============================================================================

// Interface for new knowledge entries
export interface KnowledgeEntry {
  id: string;
  category: string;
  title: string;
  content: string;
  tags: string[];
  dateAdded: Date;
  lastModified: Date;
  isActive: boolean;
}

// Dynamic knowledge base for admin-added entries
let dynamicKnowledgeBase: KnowledgeEntry[] = [
  {
    id: 'kb_1750066321538_uyxiharmb',
    category: 'Pricing',
    title: 'Development Package Pricing',
    content: `WordPress Basic: $350, WordPress Professional: $450, Full-Stack Development: $550. E-commerce solutions: $3,000-$15,000. Mobile apps: $5,000-$25,000. Custom pricing available for enterprise solutions and complex requirements.`,
    tags: ['pricing', 'wordpress', 'fullstack', 'ecommerce', 'mobile', 'enterprise'],
    dateAdded: new Date('2025-06-16T09:32:01.538Z'),
    lastModified: new Date('2025-06-16T09:32:01.538Z'),
    isActive: true
  },
  {
    id: 'kb_1751047840242_370rqs33n',
    category: 'Services',
    title: 'Full-Stack Web Development Services',
    content: `NEX-DEVS offers comprehensive full-stack web development services including React, Next.js, Node.js, Express, PostgreSQL, MongoDB, and modern deployment solutions. We specialize in creating scalable, performant web applications with modern UI/UX design, responsive layouts, and SEO optimization.`,
    tags: ['web development', 'full-stack', 'react', 'nextjs', 'nodejs', 'postgresql', 'mongodb'],
    dateAdded: new Date('2025-06-27T18:10:40.243Z'),
    lastModified: new Date('2025-06-27T18:10:40.243Z'),
    isActive: true
  }
];

// Add new knowledge entry (for admin use)
export const addKnowledgeEntry = (entry: Omit<KnowledgeEntry, 'id' | 'dateAdded' | 'lastModified'>): string => {
  const id = `kb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newEntry: KnowledgeEntry = {
    ...entry,
    id,
    dateAdded: new Date(),
    lastModified: new Date(),
  };

  dynamicKnowledgeBase.push(newEntry);
  return id;
};

// Update existing knowledge entry (for admin use)
export const updateKnowledgeEntry = (id: string, updates: Partial<Omit<KnowledgeEntry, 'id' | 'dateAdded'>>): boolean => {
  const index = dynamicKnowledgeBase.findIndex(entry => entry.id === id);
  if (index !== -1) {
    dynamicKnowledgeBase[index] = {
      ...dynamicKnowledgeBase[index],
      ...updates,
      lastModified: new Date()
    };
    return true;
  }
  return false;
};

// Delete knowledge entry (for admin use)
export const deleteKnowledgeEntry = (id: string): boolean => {
  const index = dynamicKnowledgeBase.findIndex(entry => entry.id === id);
  if (index !== -1) {
    dynamicKnowledgeBase.splice(index, 1);
    return true;
  }
  return false;
};

// Get all knowledge entries (for admin interface)
export const getAllKnowledgeEntries = (): KnowledgeEntry[] => {
  return [...dynamicKnowledgeBase];
};

// Get knowledge entries by category
export const getKnowledgeByCategory = (category: string): KnowledgeEntry[] => {
  return dynamicKnowledgeBase.filter(entry => entry.category === category && entry.isActive);
};

// Search knowledge entries
export const searchKnowledgeEntries = (query: string): KnowledgeEntry[] => {
  const lowercaseQuery = query.toLowerCase();
  return dynamicKnowledgeBase.filter(entry =>
    entry.isActive && (
      entry.title.toLowerCase().includes(lowercaseQuery) ||
      entry.content.toLowerCase().includes(lowercaseQuery) ||
      entry.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    )
  );
};

// Get knowledge base statistics (for admin dashboard)
export const getKnowledgeBaseStats = () => {
  const total = dynamicKnowledgeBase.length;
  const active = dynamicKnowledgeBase.filter(entry => entry.isActive).length;
  const categories = [...new Set(dynamicKnowledgeBase.map(entry => entry.category))];
  const recentEntries = dynamicKnowledgeBase
    .filter(entry => entry.dateAdded > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000))
    .length;

  return {
    total,
    active,
    inactive: total - active,
    categories: categories.length,
    recentEntries,
    categoryBreakdown: categories.map(category => ({
      name: category,
      count: dynamicKnowledgeBase.filter(entry => entry.category === category).length
    }))
  };
};

// Validate knowledge entry
export const validateKnowledgeEntry = (entry: Partial<KnowledgeEntry>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!entry.title || entry.title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }

  if (!entry.content || entry.content.trim().length < 10) {
    errors.push('Content must be at least 10 characters long');
  }

  if (!entry.category || entry.category.trim().length < 2) {
    errors.push('Category must be at least 2 characters long');
  }

  if (!entry.tags || !Array.isArray(entry.tags) || entry.tags.length === 0) {
    errors.push('At least one tag is required');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

// Additional exports for compatibility
export const commonQuestions = frequentlyAskedQuestions;
export const pricingInformation = {
  services: serviceCategories,
  workingProcess: workingProcess
};
export const contactInformation = {
  email: "nexwebs.org@gmail.com",
  phone: "0329-2425950",
  website: "https://nex-devs.com"
};
export const businessInformation = {
  name: "NEX-DEVS",
  owner: "Ali Hasnaat",
  established: "2020",
  location: "Pakistan",
  services: "Web Development, UI/UX Design, E-commerce Solutions"
};

// All exports are already declared above with 'export const'
// No need for additional export statement