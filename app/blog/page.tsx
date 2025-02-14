import { Metadata } from 'next';
import BlogCard from '../components/BlogCard';
import BlogTestimonial from '../components/BlogTestimonial';

export const metadata: Metadata = {
  title: 'Blog | Your Name',
  description: 'Explore our latest articles about web development, design, and technology',
  openGraph: {
    title: 'Blog | Your Name',
    description: 'Explore our latest articles about web development, design, and technology',
    type: 'website',
  },
  // Add JSON-LD Schema
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Blog',
      name: 'Your Name Blog',
      description: 'Explore our latest articles about web development, design, and technology',
      url: 'https://yourwebsite.com/blog',
      author: {
        '@type': 'Person',
        name: 'Your Name',
      },
    }),
  },
};

const blogPosts = [
  {
    title: 'Building Modern Web Applications with Next.js 13',
    excerpt: 'Learn how to leverage the power of Next.js 13 to create fast, SEO-friendly web applications with the latest features.',
    slug: 'building-modern-web-applications-nextjs-13',
    category: 'Next.js',
    date: 'March 15, 2024',
    readTime: '8',
    details: [
      'Deep dive into Next.js 13 App Router and Server Components',
      'Implementing dynamic routing and data fetching strategies',
      'Optimizing performance with built-in Image and Font optimization',
      'Setting up API routes and handling server-side operations',
      'Implementing authentication and authorization'
    ]
  },
  {
    title: 'Mastering TypeScript: Best Practices and Tips',
    excerpt: 'Discover advanced TypeScript techniques and best practices to write more maintainable and scalable code.',
    slug: 'mastering-typescript-best-practices',
    category: 'TypeScript',
    date: 'March 10, 2024',
    readTime: '10',
    details: [
      'Understanding advanced type system features and generics',
      'Implementing design patterns in TypeScript',
      'Type-safe API integration techniques',
      'Performance optimization and code organization',
      'Testing strategies for TypeScript applications'
    ]
  },
  {
    title: 'The Future of Web Development: AI Integration',
    excerpt: 'Explore how artificial intelligence is reshaping the landscape of web development and what it means for developers.',
    slug: 'future-web-development-ai-integration',
    category: 'AI & Web Dev',
    date: 'March 5, 2024',
    readTime: '12',
    details: [
      'Implementing AI-powered features in web applications',
      'Using machine learning models with TensorFlow.js',
      'Natural Language Processing in modern web apps',
      'AI-driven user experience optimization',
      'Ethics and best practices in AI integration'
    ]
  },
  {
    title: 'Creating Stunning Animations with Framer Motion',
    excerpt: 'Learn how to implement beautiful and performant animations in your React applications using Framer Motion.',
    slug: 'creating-animations-framer-motion',
    category: 'Animation',
    date: 'March 1, 2024',
    readTime: '7',
    details: [
      'Building complex animation sequences',
      'Implementing gesture-based interactions',
      'Creating responsive and accessible animations',
      'Performance optimization techniques',
      'Advanced animation patterns and examples'
    ]
  },
  {
    title: 'Optimizing React Applications for Performance',
    excerpt: 'Discover practical techniques to improve the performance of your React applications and deliver better user experiences.',
    slug: 'optimizing-react-applications',
    category: 'Performance',
    date: 'February 25, 2024',
    readTime: '9',
    details: [
      'Implementing code splitting and lazy loading',
      'Memory leak prevention and optimization',
      'State management optimization techniques',
      'React rendering optimization strategies',
      'Performance monitoring and analysis tools'
    ]
  },
  {
    title: 'Building Accessible Web Applications',
    excerpt: 'Learn the importance of web accessibility and how to implement it effectively in your projects.',
    slug: 'building-accessible-web-applications',
    category: 'Accessibility',
    date: 'February 20, 2024',
    readTime: '11',
    details: [
      'Understanding WCAG guidelines and compliance',
      'Implementing keyboard navigation and focus management',
      'Creating accessible forms and interactive elements',
      'Testing tools and methodologies for accessibility',
      'Screen reader optimization techniques'
    ]
  }
];

const testimonials = [
  {
    content: "The insights shared in these blog posts have significantly improved my development workflow.",
    author: "SAEED KHAN",
    role: "Senior Developer"
  },
  {
    content: "Clear, concise, and incredibly practical. These articles are a must-read for any developer.",
    author: "MINAHIL JUTT",
    role: "Tech Lead"
  },
  {
    content: "The technical depth combined with easy-to-follow explanations makes this blog outstanding.",
    author: "RIDA FATIMA",
    role: "Frontend Engineer"
  },
  {
    content: "These articles helped me transition from junior to senior developer. Invaluable resource!",
    author: "DAWOOD AHMAD",
    role: "Full Stack Developer"
  },
  {
    content: "The performance optimization tips literally helped us cut our loading times in half.",
    author: "ANAS AHMAD",
    role: "Performance Engineer"
  },
  {
    content: "A goldmine of practical knowledge. Every article feels like a masterclass.",
    author: "HARIS JUTT",
    role: "Software Architect"
  }
];

// Hey curious developer! Try running this in your console:
// btoa('unlock-the-matrix') 
// Use the result as a CSS class on any element...

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Enhanced purple glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />
      
      {/* Hero section */}
      <div className="relative px-6 py-24 mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 inline-flex flex-wrap justify-center gap-4">
            <span className="text-white">Digital</span>
            <span className="text-black bg-white px-4 py-1 rounded-lg">Excellence</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Discover in-depth articles, practical tutorials, and expert insights about web development, 
            design patterns, and emerging technologies. Join thousands of developers leveling up their skills.
          </p>
          <p className="text-purple-400 mt-4 text-sm">
            New articles every week. Stay curious, keep coding.
          </p>
          <p className="text-yellow-400 mt-4 text-sm">
            🔍 Hint: Try typing "unlock-the-matrix" in your console for a surprise!
          </p>
        </div>

        {/* Blog grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {Array.isArray(blogPosts) && blogPosts.map((post) => (
            <BlogCard key={post.slug} {...post} />
          ))}
        </div>

        {/* Testimonials */}
        <h2 className="text-3xl font-bold text-white mb-8">What Readers Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Array.isArray(testimonials) && testimonials.map((testimonial, index) => (
            <BlogTestimonial key={index} {...testimonial} />
          ))}
        </div>
      </div>
    </main>
  );
} 