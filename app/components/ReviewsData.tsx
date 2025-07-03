import { PlanReview } from './ReviewsDrawer';

// Top carousel testimonials with mix of Pakistani and foreign customers
export const carouselReviews = [
  {
    author: "Sameen Ahmed",
    role: "Marketing Director",
    company: "TechVision Solutions",
    text: "NEX-WEBS consistently exceeds our expectations. Their WordPress development service has transformed our online presence, resulting in a 45% increase in user engagement.",
    rating: 5,
    highlightedPhrase: "exceeds our expectations",
    isVerified: true,
    projectType: "WordPress Professional",
    successMetrics: [
      { label: "User Engagement", value: "+45%" },
      { label: "Page Load Speed", value: "-60%" }
    ]
  },
  {
    author: "Michael Johnson",
    role: "E-commerce Manager",
    company: "Global Retail Solutions",
    text: "The SEO implementation and content strategy by NEX-WEBS has boosted our organic traffic by 45% within just three months. Their attention to detail and data-driven approach sets them apart.",
    rating: 5,
    highlightedPhrase: "boosted our organic traffic by 45%",
    isVerified: true,
    projectType: "SEO/Content Writing",
    successMetrics: [
      { label: "Organic Traffic", value: "+45%" },
      { label: "Conversion Rate", value: "+28%" }
    ]
  },
  {
    author: "Fatima Khan",
    role: "CTO",
    company: "InnovateHub",
    text: "NEX-WEBS delivered a robust, scalable full-stack solution that perfectly aligned with our business needs. Their technical expertise and project management were exceptional.",
    rating: 5,
    highlightedPhrase: "robust, scalable",
    isVerified: true,
    projectType: "Full-Stack Professional",
    successMetrics: [
      { label: "System Performance", value: "+75%" },
      { label: "User Satisfaction", value: "92%" }
    ]
  },
  {
    author: "David Thompson",
    role: "Business Owner",
    company: "Thompson Consulting",
    text: "Our WordPress site has received exceptional reviews since NEX-WEBS redesigned it. The modern UI and improved functionality have significantly enhanced our professional image.",
    rating: 5,
    highlightedPhrase: "exceptional reviews",
    isVerified: true,
    projectType: "WordPress Enterprise",
    successMetrics: [
      { label: "Client Retention", value: "+40%" },
      { label: "Mobile Traffic", value: "+65%" }
    ]
  },
  {
    author: "Zain Malik",
    role: "Operations Director",
    company: "Digital Solutions Co.",
    text: "NEX-WEBS has transformed our business processes with their custom AI solution. The automation and efficiency gains have been remarkable, saving us countless hours.",
    rating: 5,
    highlightedPhrase: "transformed our business processes",
    isVerified: true,
    projectType: "AI Agents/WebApps",
    successMetrics: [
      { label: "Process Efficiency", value: "+80%" },
      { label: "Cost Reduction", value: "-35%" }
    ]
  },
  {
    author: "Sarah Wilson",
    role: "Digital Marketing Lead",
    company: "Growth Dynamics",
    text: "The UI/UX design work by NEX-WEBS increased our conversion rate by 35%. Their understanding of user behavior and modern design principles is impressive.",
    rating: 5,
    highlightedPhrase: "increased our conversion rate by 35%",
    isVerified: true,
    projectType: "UI/UX Design",
    successMetrics: [
      { label: "Conversion Rate", value: "+35%" },
      { label: "User Engagement", value: "+50%" }
    ]
  }
];

// Detailed plan-specific reviews for the drawer and plan cards
export const planReviews: PlanReview[] = [
  // Add new reviews at the start of the array
  {
    id: "wp-latest-001",
    planTitle: "WordPress Professional",
    author: "Zara Ahmed",
    role: "Digital Marketing Manager",
    company: "TechVision Solutions",
    country: "Pakistan",
    rating: 5,
    text: "The WordPress Professional package exceeded all expectations. The advanced SEO implementation and E-E-A-T optimization have significantly improved our search rankings. Our site's performance is outstanding!",
    date: new Date().toISOString().split('T')[0],
    projectType: "Corporate Website",
    successMetrics: [
      { label: "Search Rankings", value: "+65%" },
      { label: "Site Speed", value: "98/100" }
    ],
    isVerified: true
  },
  // WordPress Basic Reviews
  {
    id: "wb-001",
    planTitle: "WordPress Basic",
    author: "Ali Hassan",
    role: "Owner",
    company: "Hassan Digital Marketing",
    country: "Pakistan",
    rating: 5,
    text: "The WordPress Basic package was perfect for my small business website. The team delivered a clean, responsive site that looks professional and loads quickly. The SEO basics have already helped our Google rankings!",
    date: "2023-09-15",
    projectType: "Company Website",
    successMetrics: [
      { label: "Organic Traffic", value: "+23%" },
      { label: "Page Speed", value: "92/100" }
    ],
    isVerified: true
  },
  {
    id: "wb-002",
    planTitle: "WordPress Basic",
    author: "Mariam Siddiqui",
    role: "Content Creator",
    country: "Pakistan",
    rating: 5,
    text: "Exceptional service for my personal blog. The site is beautifully designed and easy to navigate. The team was responsive and implemented all my requests perfectly. Highly recommend!",
    date: "2023-10-28",
    projectType: "Personal Blog",
    successMetrics: [
      { label: "Reader Retention", value: "+40%" }
    ],
    isVerified: true
  },
  {
    id: "wb-003",
    planTitle: "WordPress Basic",
    author: "John Smith",
    role: "Photographer",
    country: "United Kingdom",
    rating: 5,
    text: "The perfect solution for my photography portfolio. Clean design, fast loading, and excellent mobile optimization. The SEO implementation has helped clients find me much more easily.",
    date: "2023-08-05",
    projectType: "Portfolio Website",
    successMetrics: [
      { label: "Inquiries", value: "+15/month" }
    ],
    isVerified: true,
    isInternational: true
  },
  {
    id: "wb-004",
    planTitle: "WordPress Basic",
    author: "Asad Mahmood",
    role: "Restaurant Owner",
    company: "Spice Garden",
    country: "Pakistan",
    rating: 5,
    text: "Incredible value for money! Our restaurant website looks premium and professional. The mobile responsiveness is perfect, and customers love how easy it is to browse our menu. Orders have increased significantly!",
    date: "2023-12-10",
    projectType: "Restaurant Website",
    successMetrics: [
      { label: "Online Orders", value: "+45%" },
      { label: "Customer Engagement", value: "+38%" }
    ],
    isVerified: true
  },

  // WordPress Professional Reviews
  {
    id: "wp-001",
    planTitle: "WordPress Professional",
    author: "Shehzad Khan",
    role: "CEO",
    company: "Lahore Tech Solutions",
    country: "Pakistan",
    rating: 5,
    text: "The WordPress Professional package delivered exceptional value. The comprehensive SEO work and advanced E-E-A-T implementation have significantly improved our visibility in search results. Our site is now much faster and more secure.",
    date: "2023-11-02",
    projectType: "Corporate Website",
    successMetrics: [
      { label: "Search Visibility", value: "+68%" },
      { label: "Lead Generation", value: "+42%" }
    ],
    isVerified: true
  },
  {
    id: "wp-002",
    planTitle: "WordPress Professional",
    author: "Emma Peterson",
    role: "Content Manager",
    company: "Digital Trends Magazine",
    country: "Canada",
    rating: 5,
    text: "Our online magazine needed a serious upgrade, and the WordPress Professional package was perfect. The advanced SEO and author expertise setup have made a huge difference in our search rankings. The site is now 3x faster too!",
    date: "2023-09-18",
    projectType: "Online Magazine",
    successMetrics: [
      { label: "Page Views", value: "+124%" },
      { label: "Bounce Rate", value: "-38%" }
    ],
    isVerified: true,
    isInternational: true
  },
  {
    id: "wp-003",
    planTitle: "WordPress Professional",
    author: "Tariq Jameel",
    role: "Marketing Director",
    company: "Islamabad Real Estate",
    country: "Pakistan",
    rating: 5,
    text: "The WordPress Professional package transformed our real estate business online. The property listing functionality is smooth, and the SEO implementation has put us ahead of competitors. Leads have doubled in just two months!",
    date: "2023-11-25",
    projectType: "Real Estate Website",
    successMetrics: [
      { label: "Property Inquiries", value: "+105%" },
      { label: "Time on Site", value: "+3.5 minutes" }
    ],
    isVerified: true
  },

  // WordPress Enterprise Reviews
  {
    id: "we-001",
    planTitle: "WordPress Enterprise",
    author: "Ayesha Imran",
    role: "Digital Director",
    company: "Pakistan News Network",
    country: "Pakistan",
    rating: 5,
    text: "The WordPress Enterprise solution transformed our news portal completely. The site handles our high traffic volumes with ease, and the comprehensive E-E-A-T mastery has significantly improved our search rankings and credibility. Worth every rupee!",
    date: "2023-10-10",
    projectType: "News Portal",
    successMetrics: [
      { label: "Traffic Capacity", value: "+200%" },
      { label: "SERP Position", value: "Top 3" },
      { label: "Page Load", value: "1.8s" }
    ],
    isVerified: true
  },
  {
    id: "we-002",
    planTitle: "WordPress Enterprise",
    author: "Robert Zhang",
    role: "CTO",
    company: "Global Retail Solutions",
    country: "Singapore",
    rating: 5,
    text: "As a multi-location business, we needed a robust WordPress solution that could handle our complex requirements. The Enterprise package delivered beyond expectations with excellent multi-language support and enterprise-grade security features.",
    date: "2023-07-22",
    projectType: "Multi-location Business",
    successMetrics: [
      { label: "Global Traffic", value: "+87%" },
      { label: "Conversion Rate", value: "+15.3%" }
    ],
    isVerified: true,
    isInternational: true
  },
  {
    id: "we-003",
    planTitle: "WordPress Enterprise",
    author: "Sophia Chen",
    role: "E-commerce Director",
    company: "Fashion Forward",
    country: "Malaysia",
    rating: 5,
    text: "Our enterprise e-commerce site has never performed better. The integration with our inventory system is seamless, and the multi-currency support has helped us expand to new markets. Site speed is phenomenal even with thousands of products.",
    date: "2023-12-05",
    projectType: "E-commerce Enterprise",
    successMetrics: [
      { label: "International Sales", value: "+78%" },
      { label: "Cart Abandonment", value: "-25%" }
    ],
    isVerified: true,
    isInternational: true
  },

  // Full-Stack Basic Reviews
  {
    id: "fsb-001",
    planTitle: "Full-Stack Basic",
    author: "Usman Ali",
    role: "Founder",
    company: "TechStartup Lahore",
    country: "Pakistan",
    rating: 5,
    text: "The Full-Stack Basic package was perfect for our MVP. The React frontend and Node.js backend integration is smooth and performant. User authentication works flawlessly, and the API endpoints are well-documented.",
    date: "2023-08-14",
    projectType: "Web Application",
    successMetrics: [
      { label: "User Adoption", value: "2,500+" },
      { label: "API Response", value: "~150ms" }
    ],
    isVerified: true
  },
  {
    id: "fsb-002",
    planTitle: "Full-Stack Basic",
    author: "Carlos Rodriguez",
    role: "Project Manager",
    company: "DataVisual Inc",
    country: "Mexico",
    rating: 5,
    text: "Outstanding quality of work delivered. The modern stack with Next.js and MongoDB works perfectly for our data visualization tool. The team was responsive and professional throughout the entire development process.",
    date: "2023-09-25",
    projectType: "Data Tool",
    successMetrics: [
      { label: "Data Processing", value: "3x faster" },
      { label: "User Satisfaction", value: "98%" }
    ],
    isVerified: true,
    isInternational: true
  },
  {
    id: "fsb-003",
    planTitle: "Full-Stack Basic",
    author: "Amina Farooq",
    role: "Startup Founder",
    company: "HealthTech Pakistan",
    country: "Pakistan",
    rating: 5,
    text: "The Full-Stack Basic package provided everything we needed to launch our health monitoring platform. The team understood our requirements perfectly and delivered a clean, efficient solution that our users love.",
    date: "2024-01-15",
    projectType: "Health Platform",
    successMetrics: [
      { label: "User Signups", value: "3,200+ in first month" },
      { label: "App Performance", value: "99.9% uptime" }
    ],
    isVerified: true
  },

  // Full-Stack Professional Reviews
  {
    id: "fsp-001",
    planTitle: "Full-Stack Professional",
    author: "Kamran Akmal",
    role: "Product Owner",
    company: "FinTech Solutions Pakistan",
    country: "Pakistan",
    rating: 5,
    text: "The TypeScript integration and NestJS backend have made our application robust and type-safe. The comprehensive API suite handles all our complex financial operations flawlessly. PostgreSQL with Prisma is a game-changer for our data needs.",
    date: "2023-10-05",
    projectType: "Financial Platform",
    successMetrics: [
      { label: "Transaction Volume", value: "10K+/day" },
      { label: "System Uptime", value: "99.98%" }
    ],
    isVerified: true
  },
  {
    id: "fsp-002",
    planTitle: "Full-Stack Professional",
    author: "Jennifer Wong",
    role: "CTO",
    company: "EduTech International",
    country: "Hong Kong",
    rating: 5,
    text: "The Full-Stack Professional package exceeded our expectations for our educational platform. The advanced state management and comprehensive API suite handle our complex user interactions perfectly. The CI/CD setup has streamlined our deployment process.",
    date: "2024-01-10",
    projectType: "Education Platform",
    successMetrics: [
      { label: "Concurrent Users", value: "5,000+" },
      { label: "Development Cycle", value: "40% faster" }
    ],
    isVerified: true,
    isInternational: true
  },

  // Full-Stack Enterprise Reviews
  {
    id: "fse-001",
    planTitle: "Full-Stack Enterprise",
    author: "Zubair Ahmed",
    role: "Director of Technology",
    company: "National Commerce Portal",
    country: "Pakistan",
    rating: 5,
    text: "The microservices architecture implemented for our national commerce platform is exemplary. The system handles millions of daily transactions with ease. Load balancing and auto-scaling work flawlessly during traffic spikes.",
    date: "2023-06-18",
    projectType: "Enterprise Platform",
    successMetrics: [
      { label: "Peak Capacity", value: "50k req/min" },
      { label: "Reliability", value: "99.99%" }
    ],
    isVerified: true
  },
  {
    id: "fse-002",
    planTitle: "Full-Stack Enterprise",
    author: "Richard Miller",
    role: "Enterprise Architect",
    company: "Global Banking Solutions",
    country: "United States",
    rating: 5,
    text: "The enterprise-grade solution developed for our banking platform has set new standards in our organization. The microservices architecture, comprehensive monitoring, and disaster recovery implementation are world-class. Security features exceed industry standards.",
    date: "2024-02-05",
    projectType: "Banking Platform",
    successMetrics: [
      { label: "Security Compliance", value: "100%" },
      { label: "System Resilience", value: "Zero downtime" }
    ],
    isVerified: true,
    isInternational: true
  },

  // AI Agents/WebApps Reviews
  {
    id: "ai-001",
    planTitle: "AI Agents/WebApps",
    author: "Farah Javed",
    role: "Innovation Lead",
    company: "Smart Solutions Pakistan",
    country: "Pakistan",
    rating: 5,
    text: "The AI integration has transformed our customer support system. The custom solution handles 80% of queries automatically with impressive accuracy. The real-time processing and analytics dashboard provide valuable insights for our business.",
    date: "2023-11-12",
    projectType: "AI Customer Support",
    successMetrics: [
      { label: "Query Resolution", value: "80% automated" },
      { label: "Cost Savings", value: "62%" }
    ],
    isVerified: true
  },
  {
    id: "ai-002",
    planTitle: "AI Agents/WebApps",
    author: "Thomas Weber",
    role: "Head of Innovation",
    company: "European Analytics",
    country: "Germany",
    rating: 5,
    text: "The AI-powered data analysis tool developed for our market research has revolutionized how we process information. The machine learning pipeline consistently delivers accurate predictions, and the custom algorithms have given us a competitive edge.",
    date: "2024-01-20",
    projectType: "AI Analytics Platform",
    successMetrics: [
      { label: "Prediction Accuracy", value: "94.7%" },
      { label: "Analysis Speed", value: "8x faster" }
    ],
    isVerified: true,
    isInternational: true
  },

  // SEO/Content Writing Reviews
  {
    id: "seo-001",
    planTitle: "SEO/Content Writing",
    author: "Nadia Hussain",
    role: "Marketing Manager",
    company: "Pakistan Health Products",
    country: "Pakistan",
    rating: 5,
    text: "The SEO/Content Writing service has dramatically improved our online presence. The E-E-A-T content strategy and semantic keyword research have helped us establish topical authority in our niche. Our organic traffic has more than doubled!",
    date: "2023-09-30",
    projectType: "Content Marketing",
    successMetrics: [
      { label: "Organic Traffic", value: "+127%" },
      { label: "Keyword Rankings", value: "Top 10 for 35+ terms" }
    ],
    isVerified: true
  },
  {
    id: "seo-002",
    planTitle: "SEO/Content Writing",
    author: "Lisa Johnson",
    role: "Digital Marketing Director",
    company: "Health & Wellness Co",
    country: "Australia",
    rating: 5,
    text: "The SEO/Content strategy implemented for our wellness blog has been transformative. The content quality and E-E-A-T optimization have established us as authorities in our field. We've seen dramatic improvements in rankings for competitive keywords.",
    date: "2024-02-15",
    projectType: "Blog Optimization",
    successMetrics: [
      { label: "Featured Snippets", value: "15 new positions" },
      { label: "Organic Conversions", value: "+83%" }
    ],
    isVerified: true,
    isInternational: true
  },

  // UI/UX Design Reviews
  {
    id: "ui-001",
    planTitle: "UI/UX Design",
    author: "Imran Hashmi",
    role: "Product Manager",
    company: "PakApp Developers",
    country: "Pakistan",
    rating: 5,
    text: "The UI/UX design service exceeded our expectations. The user research was thorough, and the resulting design system is comprehensive and consistent. The interactive prototypes helped us validate the user experience before development.",
    date: "2023-08-08",
    projectType: "Mobile App Design",
    successMetrics: [
      { label: "User Testing", value: "95% task success" },
      { label: "Design System", value: "200+ components" }
    ],
    isVerified: true
  },
  {
    id: "ui-002",
    planTitle: "UI/UX Design",
    author: "Olivia Chen",
    role: "UX Director",
    company: "Digital Experience Lab",
    country: "Singapore",
    rating: 5,
    text: "The design work for our SaaS platform was exceptional. The team delivered a beautiful, intuitive interface that perfectly balances aesthetics and functionality. The accessibility considerations and attention to detail in the design system are impressive.",
    date: "2024-01-08",
    projectType: "SaaS Platform Design",
    successMetrics: [
      { label: "User Onboarding", value: "30% faster" },
      { label: "Design Consistency", value: "100% compliance" }
    ],
    isVerified: true,
    isInternational: true
  },

  // Mobile App Development Reviews
  {
    id: "mob-001",
    planTitle: "Mobile App Development",
    author: "Saad Khan",
    role: "CEO",
    company: "DeliverIt Pakistan",
    country: "Pakistan",
    rating: 5,
    text: "The mobile app developed for our delivery service is exceptional. The cross-platform solution works flawlessly on both iOS and Android. The offline functionality and real-time updates are perfect for our delivery personnel in areas with spotty coverage.",
    date: "2023-07-15",
    projectType: "Delivery App",
    successMetrics: [
      { label: "App Store Rating", value: "4.8/5" },
      { label: "Delivery Efficiency", value: "+23%" }
    ],
    isVerified: true
  },
  {
    id: "mob-002",
    planTitle: "Mobile App Development",
    author: "Maria Garcia",
    role: "Product Owner",
    company: "Fitness Connect",
    country: "Spain",
    rating: 5,
    text: "Our fitness tracking app has received outstanding feedback from users. The integration with wearable devices is seamless, and the UI is beautiful and intuitive. Push notifications and social features work perfectly, driving high user engagement.",
    date: "2024-02-10",
    projectType: "Fitness App",
    successMetrics: [
      { label: "User Retention", value: "78% after 3 months" },
      { label: "Daily Active Users", value: "15,000+" }
    ],
    isVerified: true,
    isInternational: true
  },
];

// Satisfaction statistics
export const satisfactionStats = [
  {
    label: '5-star',
    percentage: 98,
    count: 124
  },
  {
    label: '4-star',
    percentage: 78,
    count: 34
  },
  {
    label: '3-star',
    percentage: 21,
    count: 5
  },
  {
    label: '2-star',
    percentage: 2,
    count: 1
  },
  {
    label: '1-star',
    percentage: 0,
    count: 0
  }
]; 