import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BlogPostParams {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: BlogPostParams): Promise<Metadata> {
  // In a real application, fetch the blog post data based on the slug
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: 'Blog Post Title',
    datePublished: '2024-03-15T00:00:00.000Z',
    author: {
      '@type': 'Person',
      name: 'Your Name',
    },
  };

  return {
    title: `Blog Post Title | Your Name`,
    description: 'Blog post description',
    openGraph: {
      title: 'Blog Post Title',
      description: 'Blog post description',
      type: 'article',
      publishedTime: '2024-03-15T00:00:00.000Z',
    },
    // Add JSON-LD Schema for blog post
    other: {
      'script:ld+json': JSON.stringify(jsonLd),
    },
  };
}

export default function BlogPost({ params }: BlogPostParams) {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Enhanced purple glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />
      
      <article className="relative px-4 sm:px-6 py-12 sm:py-24 mx-auto max-w-4xl">
        {/* Back button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-6 sm:mb-8 text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Header Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-purple-500/20 mb-8 sm:mb-12">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-purple-400 mb-4">
            <span className="bg-purple-500/10 px-2 sm:px-3 py-1 rounded-full">Next.js</span>
            <span className="hidden sm:inline">•</span>
            <span>March 15, 2024</span>
            <span className="hidden sm:inline">•</span>
            <span>8 min read</span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6">
            Building Modern Web Applications with Next.js 13
          </h1>
          <p className="text-gray-400 text-sm sm:text-base lg:text-lg">
            Learn how to leverage the power of Next.js 13 to create fast, SEO-friendly web applications with the latest features.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-4 sm:p-6 rounded-xl border border-purple-500/20 mb-8 sm:mb-12">
          <h2 className="text-lg sm:text-xl font-semibold text-white mb-4">Table of Contents</h2>
          <ul className="space-y-2 text-sm">
            {[
              'Introduction to Next.js 13',
              'Setting Up Your Development Environment',
              'Understanding the App Router',
              'Server and Client Components',
              'Data Fetching Strategies',
              'Optimizing Performance',
              'Deployment and Best Practices'
            ].map((item, index) => (
              <li key={index}>
                <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-purple-400 hover:text-purple-300 transition-colors">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="prose prose-invert prose-purple max-w-none space-y-8 sm:space-y-12 text-sm sm:text-base">
          {/* Content sections */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-purple-500/20">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">
              Introduction to Next.js 13
            </h2>
            <p className="text-gray-300 text-sm sm:text-base mb-4">
              TypeScript has evolved into an essential tool for modern web development, offering powerful type safety and developer experience features.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-black/30 p-4 sm:p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-base sm:text-lg font-semibold text-purple-400 mb-3">Key Features</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• App Router for enhanced routing</li>
                  <li>• React Server Components</li>
                  <li>• Streaming and Suspense</li>
                </ul>
              </div>
              <div className="bg-black/30 p-4 sm:p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-base sm:text-lg font-semibold text-purple-400 mb-3">Benefits</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li>• Improved performance</li>
                  <li>• Better SEO capabilities</li>
                  <li>• Enhanced developer experience</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Introduction Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="introduction-to-typescript" className="text-2xl font-bold text-white mb-4">
              Introduction to Advanced TypeScript
            </h2>
            <p className="text-gray-300 mb-6">
              TypeScript has evolved into an essential tool for modern web development, offering powerful type safety and developer experience features. This guide dives deep into advanced TypeScript concepts and patterns that can elevate your development workflow.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Advanced Type Features</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Conditional Types & Mapped Types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Template Literal Types</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Utility Types Deep Dive</span>
                  </li>
                </ul>
              </div>
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Type System Benefits</h3>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Enhanced Code Reliability</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Better Refactoring Support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-400 mt-1">•</span>
                    <span>Improved IDE Integration</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Type System Features Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="advanced-type-system" className="text-2xl font-bold text-white mb-4">
              Advanced Type System Features
            </h2>
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-lg font-semibold text-purple-400 mb-3">Generics Mastery</h3>
                <div className="bg-black/50 p-4 rounded-lg mb-4">
                  <pre className="text-purple-300">
                    <code>{`type Container<T> = {
  value: T;
  map<U>(fn: (value: T) => U): Container<U>;
}`}</code>
                  </pre>
                </div>
                <p className="text-gray-300">
                  Understanding advanced generic patterns for creating flexible, reusable type definitions.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Conditional Types</h3>
                  <div className="bg-black/50 p-4 rounded-lg mb-4">
                    <pre className="text-purple-300">
                      <code>{`type NonNullable<T> = T extends null | undefined ? never : T;`}</code>
                    </pre>
                  </div>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Mapped Types</h3>
                  <div className="bg-black/50 p-4 rounded-lg mb-4">
                    <pre className="text-purple-300">
                      <code>{`type Readonly<T> = {
  [P in keyof T]: T[P];
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Design Patterns Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="typescript-design-patterns" className="text-2xl font-bold text-white mb-4">
              TypeScript Design Patterns
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Factory Pattern</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Type-safe factory functions</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Abstract factories</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Builder Pattern</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Fluent interfaces</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Method chaining</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Observer Pattern</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Event handling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>State management</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Testing Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="testing-strategies" className="text-2xl font-bold text-white mb-4">
              Testing TypeScript Applications
            </h2>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Unit Testing</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Jest with TypeScript</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Type testing utilities</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-lg font-semibold text-purple-400 mb-3">Integration Testing</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Testing with types</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-400 mt-1">•</span>
                      <span>Mocking strategies</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Author Bio */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-6 sm:p-8 rounded-xl border border-purple-500/20 mt-8 sm:mt-12">
          <h3 className="text-lg sm:text-xl font-bold text-white mb-4">About the Author</h3>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-gray-300 text-sm sm:text-base mb-4">
                Written by a senior developer with expertise in Next.js and React development. Passionate about sharing knowledge and helping others build better web applications.
              </p>
              <div className="flex items-center gap-4 text-sm">
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  Twitter
                </Link>
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  GitHub
                </Link>
                <Link href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                  LinkedIn
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
} 