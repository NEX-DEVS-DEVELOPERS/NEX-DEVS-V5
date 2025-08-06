import { Metadata } from 'next';
import BlogCard from '../components/BlogCard';
import BlogTestimonial from '../components/BlogTestimonial';
import { audiowide, vt323 } from '@/app/utils/fonts';
import { pageMetadata, generatePersonSchema, generateWebSiteSchema, generateBlogPostSchema, injectStructuredData } from '@/app/lib/seo';
import BlogPageClient from './BlogPageClient';

// Generate metadata for SEO
export const metadata: Metadata = pageMetadata.blog();

// Server-side data fetching function
async function getBlogPosts() {
  try {
    // In a real app, this would be a database call or API request
    // For now, we'll return static data that would normally come from your API
    const blogPosts = [
      {
        id: 1,
        title: 'Building Modern Web Applications with Next.js 13',
        excerpt: 'Learn how to leverage the power of Next.js 13 to create fast, SEO-friendly web applications with the latest features.',
        slug: 'building-modern-web-applications-nextjs-13',
        category: 'Next.js',
        date: 'March 15, 2024',
        datePublished: '2024-03-15T10:00:00Z',
        readTime: '8',
        image: '/blog/nextjs-13-guide.jpg',
        author: 'Ali Hasnaat',
        details: [
          'Deep dive into Next.js 13 App Router and Server Components',
          'Implementing dynamic routing and data fetching strategies',
          'Optimizing performance with built-in Image and Font optimization',
          'Setting up API routes and handling server-side operations',
          'Implementing authentication and authorization'
        ]
      },
      {
        id: 2,
        title: 'Mastering TypeScript: Best Practices and Tips',
        excerpt: 'Discover advanced TypeScript techniques and best practices to write more maintainable and scalable code.',
        slug: 'mastering-typescript-best-practices',
        category: 'TypeScript',
        date: 'March 10, 2024',
        datePublished: '2024-03-10T14:30:00Z',
        readTime: '6',
        image: '/blog/typescript-best-practices.jpg',
        author: 'Ali Hasnaat',
        details: [
          'Understanding advanced type system features and generics',
          'Implementing design patterns in TypeScript',
          'Type-safe API integration techniques',
          'Performance optimization and code organization',
          'Testing strategies for TypeScript applications'
        ]
      },
      {
        id: 3,
        title: 'The Future of Web Development: AI Integration',
        excerpt: 'Explore how artificial intelligence is reshaping the landscape of web development and what it means for developers.',
        slug: 'future-web-development-ai-integration',
        category: 'AI & Web Dev',
        date: 'March 5, 2024',
        datePublished: '2024-03-05T09:15:00Z',
        readTime: '12',
        image: '/blog/ai-web-development.jpg',
        author: 'Ali Hasnaat',
        details: [
          'Implementing AI-powered features in web applications',
          'Using machine learning models with TensorFlow.js',
          'Natural Language Processing in modern web apps',
          'AI-driven user experience optimization',
          'Ethics and best practices in AI integration'
        ]
      },
      {
        id: 4,
        title: 'Creating Stunning Animations with Framer Motion',
        excerpt: 'Learn how to implement beautiful and performant animations in your React applications using Framer Motion.',
        slug: 'creating-animations-framer-motion',
        category: 'Animation',
        date: 'March 1, 2024',
        datePublished: '2024-03-01T16:45:00Z',
        readTime: '7',
        image: '/blog/framer-motion-animations.jpg',
        author: 'Ali Hasnaat',
        details: [
          'Building complex animation sequences',
          'Implementing gesture-based interactions',
          'Creating responsive and accessible animations',
          'Performance optimization techniques',
          'Advanced animation patterns and examples'
        ]
      },
      {
        id: 5,
        title: 'Optimizing React Applications for Performance',
        excerpt: 'Discover practical techniques to improve the performance of your React applications and deliver better user experiences.',
        slug: 'optimizing-react-applications',
        category: 'Performance',
        date: 'February 25, 2024',
        datePublished: '2024-02-25T11:20:00Z',
        readTime: '9',
        image: '/blog/react-performance.jpg',
        author: 'Ali Hasnaat',
        details: [
          'Implementing code splitting and lazy loading',
          'Memory leak prevention and optimization',
          'State management optimization techniques',
          'React rendering optimization strategies',
          'Performance monitoring and analysis tools'
        ]
      },
      {
        id: 6,
        title: 'Building Accessible Web Applications',
        excerpt: 'Learn the importance of web accessibility and how to implement it effectively in your projects.',
        slug: 'building-accessible-web-applications',
        category: 'Accessibility',
        date: 'February 20, 2024',
        datePublished: '2024-02-20T13:30:00Z',
        readTime: '11',
        image: '/blog/web-accessibility.jpg',
        author: 'Ali Hasnaat',
        details: [
          'Understanding WCAG guidelines and compliance',
          'Implementing keyboard navigation and focus management',
          'Creating accessible forms and interactive elements',
          'Testing tools and methodologies for accessibility',
          'Screen reader optimization techniques'
        ]
      }
    ]

    return { data: blogPosts, success: true }
  } catch (error) {
    console.error('Error fetching blog posts:', error)
    return { data: [], success: false }
  }
}

// Static testimonials data
const staticTestimonials = [
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

// Server component - this runs on the server
export default async function BlogPage() {
  // Fetch blog posts server-side
  const blogData = await getBlogPosts()

  // Generate structured data for SEO
  const personSchema = generatePersonSchema()
  const websiteSchema = generateWebSiteSchema()

  // Generate blog post schemas for each post
  const blogPostSchemas = blogData.data.map(post =>
    generateBlogPostSchema({
      headline: post.title,
      description: post.excerpt,
      image: post.image,
      datePublished: post.datePublished,
      author: post.author,
      url: `/blog/${post.slug}`
    })
  )

  return (
    <>
      {/* Inject structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: injectStructuredData(personSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: injectStructuredData(websiteSchema)
        }}
      />
      {blogPostSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: injectStructuredData(schema)
          }}
        />
      ))}

      {/* Static content for SEO crawlers */}
      <main className="min-h-screen bg-black relative">
        {/* Enhanced purple glow effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />

        {/* Hero section with improved mobile visibility */}
        <div className="relative px-4 sm:px-6 pt-24 sm:pt-24 pb-12 sm:pb-24 mx-auto max-w-7xl">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mb-6">
              <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white ${audiowide.className}`}>
                Digital
              </h1>
              <span className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-black bg-white px-4 py-2 rounded-lg shadow-lg ${audiowide.className}`}>
                Excellence
              </span>
            </div>
            <div className="max-w-2xl mx-auto px-4">
              <p className={`text-gray-300 text-sm sm:text-base lg:text-lg mb-4 ${vt323.className}`}>
                Discover in-depth articles, practical tutorials, and expert insights about web development,
                design patterns, and emerging technologies. Join thousands of developers leveling up their skills.
              </p>
              <p className={`text-purple-400 text-xs sm:text-sm mb-2 ${vt323.className}`}>
                New articles every week. Stay curious, keep coding.
              </p>
            </div>
          </div>

          {/* Blog grid with improved responsiveness - SEO optimized */}
          <section className="mb-12 sm:mb-24">
            <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 text-center ${audiowide.className}`}>
              Latest Articles
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {blogData.data.map((post) => (
                <article key={post.slug} className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6 hover:border-purple-500/40 transition-colors">
                  <div className="mb-4">
                    <span className="text-xs text-purple-400 font-medium">{post.category}</span>
                    <span className="text-xs text-gray-500 ml-2">{post.readTime} min read</span>
                  </div>
                  <h3 className={`text-lg font-semibold text-white mb-3 ${audiowide.className}`}>
                    {post.title}
                  </h3>
                  <p className={`text-gray-300 text-sm mb-4 ${vt323.className}`}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{post.date}</span>
                    <span className="text-xs text-purple-400">Read More →</span>
                  </div>
                </article>
              ))}
            </div>
          </section>

          {/* Testimonials section - SEO optimized */}
          <section>
            <h2 className={`text-2xl sm:text-3xl font-bold text-white mb-6 sm:mb-8 px-4 ${audiowide.className}`}>
              What Readers Say
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
              {staticTestimonials.map((testimonial, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm border border-purple-500/20 rounded-xl p-6">
                  <p className={`text-gray-300 text-sm mb-4 italic ${vt323.className}`}>
                    "{testimonial.content}"
                  </p>
                  <div>
                    <div className={`text-white font-semibold ${audiowide.className}`}>
                      {testimonial.author}
                    </div>
                    <div className="text-purple-400 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Pass data to client component for interactive features */}
          <BlogPageClient
            blogPosts={blogData.data}
            testimonials={staticTestimonials}
            loading={!blogData.success}
          />
        </div>
      </main>
    </>
  )
}