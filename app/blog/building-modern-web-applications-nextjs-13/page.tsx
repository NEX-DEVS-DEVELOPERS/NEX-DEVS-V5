import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import CodeBlock from '@/app/components/CodeBlock';

export const metadata: Metadata = {
  title: 'Building Modern Web Applications with Next.js 13 | Your Name',
  description: 'A comprehensive guide to building modern web applications using Next.js 13, covering App Router, Server Components, data fetching, and performance optimization.',
  openGraph: {
    title: 'Building Modern Web Applications with Next.js 13',
    description: 'A comprehensive guide to building modern web applications using Next.js 13, covering App Router, Server Components, data fetching, and performance optimization.',
    type: 'article',
    publishedTime: '2024-03-15T00:00:00.000Z',
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Building Modern Web Applications with Next.js 13',
      datePublished: '2024-03-15T00:00:00.000Z',
      author: {
        '@type': 'Person',
        name: 'Your Name',
      },
    }),
  },
};

export default function NextJsBlogPost() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Enhanced gradient effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />
      
      <article className="relative px-6 py-24 mx-auto max-w-4xl">
        {/* Back button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
        >
          <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
          Back to Blog
        </Link>

        {/* Header Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 mb-12 transform hover:scale-[1.01] transition-transform">
          <div className="flex flex-wrap items-center gap-4 text-sm text-purple-400 mb-4">
            <span className="bg-purple-500/10 px-3 py-1 rounded-full">Next.js</span>
            <span className="hidden md:inline">•</span>
            <span>March 15, 2024</span>
            <span className="hidden md:inline">•</span>
            <span>15 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Building Modern Web Applications with Next.js 13
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            A comprehensive guide to leveraging Next.js 13's powerful features for building fast, 
            scalable, and SEO-friendly web applications. Learn about the App Router, Server Components, 
            and advanced optimization techniques.
          </p>
        </div>

        {/* Table of Contents */}
        <nav className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-purple-400">
            <li>
              <a href="#introduction" className="hover:text-purple-300 transition-colors">Introduction to Next.js 13</a>
            </li>
            <li>
              <a href="#setup" className="hover:text-purple-300 transition-colors">Setting Up Your Development Environment</a>
            </li>
            <li>
              <a href="#app-router" className="hover:text-purple-300 transition-colors">Understanding the App Router</a>
            </li>
            <li>
              <a href="#server-components" className="hover:text-purple-300 transition-colors">Server and Client Components</a>
            </li>
            <li>
              <a href="#data-fetching" className="hover:text-purple-300 transition-colors">Data Fetching Strategies</a>
            </li>
            <li>
              <a href="#optimization" className="hover:text-purple-300 transition-colors">Performance Optimization</a>
            </li>
            <li>
              <a href="#deployment" className="hover:text-purple-300 transition-colors">Deployment and Best Practices</a>
            </li>
          </ul>
        </nav>

        {/* Main Content */}
        <div className="prose prose-invert prose-purple max-w-none space-y-12">
          {/* Introduction Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="introduction" className="text-2xl font-bold text-white mb-4">
              Introduction to Next.js 13
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Next.js 13 represents a paradigm shift in React development, introducing revolutionary features 
              that change how we build web applications. The framework brings significant improvements in 
              performance, developer experience, and deployment flexibility.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• App Router for enhanced routing</li>
                  <li>• React Server Components</li>
                  <li>• Streaming and Suspense</li>
                  <li>• Built-in SEO optimizations</li>
                  <li>• Edge and Node.js runtime</li>
                </ul>
              </div>
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Benefits</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Improved performance</li>
                  <li>• Better SEO capabilities</li>
                  <li>• Enhanced developer experience</li>
                  <li>• Reduced bundle sizes</li>
                  <li>• Flexible deployment options</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Setup Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="setup" className="text-2xl font-bold text-white mb-4">
              Setting Up Your Development Environment
            </h2>
            <p className="text-gray-300 mb-6">
              Getting started with Next.js 13 is straightforward. Here's how to set up a new project with 
              the latest features enabled:
            </p>
            <CodeBlock 
              language="bash"
              code={`# Create a new Next.js 13 project
npx create-next-app@latest my-next-app --typescript --tailwind --app

# Navigate to the project directory
cd my-next-app

# Install additional recommended dependencies
npm install @vercel/analytics sharp

# Start the development server
npm run dev`}
            />
            <div className="mt-6 bg-purple-500/10 p-4 rounded-lg">
              <p className="text-sm text-purple-300">
                <strong>Pro Tip:</strong> Use the new App Router by creating files in the app/ directory 
                instead of pages/ for better performance and newer features.
              </p>
            </div>
          </section>

          {/* App Router Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="app-router" className="text-2xl font-bold text-white mb-4">
              Understanding the App Router
            </h2>
            <p className="text-gray-300 mb-6">
              The App Router introduces a new paradigm for routing in Next.js, based on the concept of 
              server components and nested layouts:
            </p>
            <CodeBlock 
              language="typescript"
              code={`// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <nav>
          {/* Shared navigation */}
        </nav>
        {children}
      </body>
    </html>
  )
}

// app/blog/[slug]/page.tsx
export default async function BlogPost({
  params,
}: {
  params: { slug: string }
}) {
  const post = await fetchPost(params.slug)
  return (
    <article>
      <h1>{post.title}</h1>
      <div>{post.content}</div>
    </article>
  )
}`}
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">File Conventions</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• page.tsx - Route UI</li>
                  <li>• layout.tsx - Shared layouts</li>
                  <li>• loading.tsx - Loading UI</li>
                  <li>• error.tsx - Error handling</li>
                  <li>• not-found.tsx - 404 pages</li>
                </ul>
              </div>
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Key Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Nested layouts</li>
                  <li>• Route groups</li>
                  <li>• Dynamic segments</li>
                  <li>• Parallel routes</li>
                  <li>• Intercepting routes</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Server Components Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="server-components" className="text-2xl font-bold text-white mb-4">
              Server and Client Components
            </h2>
            <p className="text-gray-300 mb-6">
              Next.js 13 introduces a powerful server components architecture that can significantly improve 
              performance by reducing client-side JavaScript:
            </p>
            <CodeBlock 
              language="typescript"
              code={`// Server Component (default)
async function BlogList() {
  const posts = await fetchPosts() // Direct database queries
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>{post.title}</li>
      ))}
    </ul>
  )
}

// Client Component
'use client'

import { useState } from 'react'

export default function LikeButton() {
  const [likes, setLikes] = useState(0)
  
  return (
    <button onClick={() => setLikes(likes + 1)}>
      Likes: {likes}
    </button>
  )
}`}
            />
          </section>

          {/* Data Fetching Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="data-fetching" className="text-2xl font-bold text-white mb-4">
              Data Fetching Strategies
            </h2>
            <p className="text-gray-300 mb-6">
              Next.js 13 provides multiple ways to fetch and cache data efficiently:
            </p>
            <CodeBlock 
              language="typescript"
              code={`// Server-side data fetching
async function getData() {
  const res = await fetch('https://api.example.com/data', {
    next: {
      revalidate: 3600 // Revalidate every hour
    }
  })
  
  if (!res.ok) {
    throw new Error('Failed to fetch data')
  }
  
  return res.json()
}

// Route Segment Config
export const revalidate = 3600 // Revalidate entire page

// Dynamic Data Fetching
export const dynamic = 'force-dynamic'
export const fetchCache = 'force-no-store'`}
            />
            <div className="mt-6 bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">Caching Strategies</h3>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <div>
                    <strong className="text-white">Force Cache:</strong> Default behavior, data is cached indefinitely
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <div>
                    <strong className="text-white">Revalidate:</strong> Data is cached with periodic updates
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span>•</span>
                  <div>
                    <strong className="text-white">No Store:</strong> Data is fetched on every request
                  </div>
                </li>
              </ul>
            </div>
          </section>

          {/* Performance Optimization */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="optimization" className="text-2xl font-bold text-white mb-4">
              Performance Optimization
            </h2>
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Image Optimization</h3>
                <CodeBlock 
                  language="typescript"
                  code={`import Image from 'next/image'

export default function OptimizedImage() {
  return (
    <Image
      src="/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      priority
      className="rounded-lg"
      placeholder="blur"
      blurDataURL="data:image/jpeg;base64,..."
    />
  )
}`}
                />
              </div>
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Font Optimization</h3>
                <CodeBlock 
                  language="typescript"
                  code={`import { Inter } from 'next/font/google'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export default function Layout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  )
}`}
                />
              </div>
            </div>
          </section>

          {/* Deployment Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="deployment" className="text-2xl font-bold text-white mb-4">
              Deployment and Best Practices
            </h2>
            <p className="text-gray-300 mb-6">
              Deploy your Next.js 13 application with confidence using these best practices:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Deployment Checklist</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Environment variables configured</li>
                  <li>• Build optimization enabled</li>
                  <li>• Error monitoring setup</li>
                  <li>• Analytics integration</li>
                  <li>• Performance monitoring</li>
                </ul>
              </div>
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Platform Options</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Vercel (recommended)</li>
                  <li>• AWS Amplify</li>
                  <li>• Netlify</li>
                  <li>• Docker containers</li>
                  <li>• Self-hosted solutions</li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Author Bio */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 mt-12">
          <h3 className="text-xl font-bold text-white mb-4">About the Author</h3>
          <div className="flex items-start gap-6">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-2xl text-purple-400">YN</span>
            </div>
            <div className="flex-1">
              <p className="text-gray-300 mb-4 leading-relaxed">
                Written by a senior full-stack developer with over 7 years of experience in React and Next.js. 
                Passionate about building performant web applications and sharing knowledge with the developer 
                community. Currently working on large-scale applications using Next.js 13 and helping teams 
                adopt modern web development practices.
              </p>
              <div className="flex items-center gap-4">
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Twitter ↗
                </Link>
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  GitHub ↗
                </Link>
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  LinkedIn ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
} 