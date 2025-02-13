'use client';

import Link from 'next/link';
import { useState } from 'react';

// Code block component with copy functionality
function CodeBlock({ code, language }: { code: string, language: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <button
        onClick={copyToClipboard}
        className="absolute right-4 top-4 p-2 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 transition-colors"
        aria-label={copied ? "Copied to clipboard" : "Copy to clipboard"}
      >
        <span className={`text-sm ${copied ? 'text-green-400' : 'text-purple-400'}`}>
          {copied ? '✓' : '📋'}
        </span>
      </button>
      <pre className="text-purple-300 overflow-x-auto p-6 rounded-lg bg-black/30 border border-purple-500/10">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function AccessibilityBlogPost() {
  return (
    <main className="min-h-screen bg-black relative">
      {/* Enhanced purple glow effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-black to-black pointer-events-none" />
      
      <article className="relative px-6 py-24 mx-auto max-w-4xl">
        {/* Back button */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors mb-8 group"
        >
          <span className="text-lg">←</span>
          Back to Blog
        </Link>

        {/* Header Section with enhanced styling */}
        <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 mb-12 transform hover:scale-[1.01] transition-transform shadow-lg shadow-purple-500/10">
          <div className="flex flex-wrap items-center gap-4 text-sm text-purple-400 mb-4">
            <span className="bg-purple-500/10 px-3 py-1 rounded-full">Advanced Accessibility</span>
            <span className="hidden md:inline">•</span>
            <span>February 20, 2024</span>
            <span className="hidden md:inline">•</span>
            <span>25 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6 tracking-tight">
            Building Accessible Web Applications
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            A comprehensive guide to creating truly inclusive web experiences through advanced accessibility implementation. 
            Learn how to build applications that work for everyone, regardless of their abilities or assistive technologies.
          </p>
        </div>

        {/* Enhanced Table of Contents */}
        <nav className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 mb-12 shadow-lg shadow-purple-500/10">
          <h2 className="text-2xl font-semibold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">Table of Contents</h2>
          <ul className="space-y-4 text-purple-400 grid md:grid-cols-2 gap-4">
            <li>
              <a href="#introduction" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                <span className="text-sm">01</span>
                <span>Introduction to Web Accessibility</span>
              </a>
            </li>
            <li>
              <a href="#wcag-guidelines" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                <span className="text-sm">02</span>
                <span>WCAG Guidelines and Compliance</span>
              </a>
            </li>
            <li>
              <a href="#keyboard-navigation" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                <span className="text-sm">03</span>
                <span>Advanced Keyboard Navigation</span>
              </a>
            </li>
            <li>
              <a href="#screen-reader" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                <span className="text-sm">04</span>
                <span>Screen Reader Optimization</span>
              </a>
            </li>
            <li>
              <a href="#semantic-html" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                <span className="text-sm">05</span>
                <span>Semantic HTML Patterns</span>
              </a>
            </li>
            <li>
              <a href="#color-contrast" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                <span className="text-sm">06</span>
                <span>Color and Contrast</span>
              </a>
            </li>
            <li>
              <a href="#testing" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                <span className="text-sm">07</span>
                <span>Testing and Validation</span>
              </a>
            </li>
            <li>
              <a href="#best-practices" className="hover:text-purple-300 transition-colors flex items-center gap-2">
                <span className="text-sm">08</span>
                <span>Advanced Best Practices</span>
              </a>
            </li>
          </ul>
        </nav>

        {/* Main Content with Enhanced Sections */}
        <div className="prose prose-invert prose-purple max-w-none space-y-12">
          {/* Introduction Section */}
          <section className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
            <h2 id="introduction" className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">
              Introduction to Web Accessibility
            </h2>
            <p className="text-gray-300 leading-relaxed mb-6">
              Web accessibility is a crucial aspect of modern web development that ensures digital content is accessible to everyone, 
              regardless of their abilities or disabilities. This comprehensive guide will take you through advanced techniques and 
              best practices for creating truly inclusive web experiences.
            </p>
            <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
              <h3 className="text-xl font-semibold text-purple-400 mb-4">Key Benefits of Accessible Web Design</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-white mb-2">Business Impact</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Expanded market reach (1+ billion people with disabilities globally)</li>
                    <li>• Improved brand reputation and social responsibility</li>
                    <li>• Reduced legal risks and compliance costs</li>
                    <li>• Higher conversion rates and user engagement</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-white mb-2">Technical Benefits</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Enhanced SEO performance</li>
                    <li>• Better code maintainability</li>
                    <li>• Improved mobile responsiveness</li>
                    <li>• Future-proof development practices</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* WCAG Guidelines Section with More Details */}
          <section className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
            <h2 id="wcag-guidelines" className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">
              Advanced WCAG Guidelines and Compliance
            </h2>
            <div className="space-y-8">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">WCAG 2.1 Success Criteria</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white mb-2">Level A (Essential)</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Non-text content alternatives</li>
                      <li>• Keyboard accessibility</li>
                      <li>• No keyboard traps</li>
                      <li>• Timing adjustable</li>
                      <li>• Seizure prevention</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white mb-2">Level AA (Enhanced)</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Color contrast (4.5:1 minimum)</li>
                      <li>• Text resizing without loss</li>
                      <li>• Multiple ways to find content</li>
                      <li>• Focus visible indicators</li>
                      <li>• Language of parts</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Implementation Examples</h3>
                <CodeBlock 
                  language="html"
                  code={`<!-- Example of accessible form implementation -->
<form role="form" aria-labelledby="form-title">
  <h2 id="form-title" class="text-xl font-bold">Contact Form</h2>
  
  <div class="form-group">
    <label for="name" class="block">
      Name
      <span class="text-red-500" aria-hidden="true">*</span>
      <span class="sr-only">required</span>
    </label>
    <input
      type="text"
      id="name"
      name="name"
      required
      aria-required="true"
      aria-describedby="name-help"
    />
    <p id="name-help" class="text-sm">
      Please enter your full name
    </p>
  </div>

  <div class="form-group">
    <label for="email">Email Address</label>
    <input
      type="email"
      id="email"
      name="email"
      aria-describedby="email-error"
      pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
    />
    <p id="email-error" class="error" role="alert" aria-live="polite"></p>
  </div>
</form>`}
                />
              </div>
            </div>
          </section>

          {/* New Section: Semantic HTML Patterns */}
          <section id="semantic-html" className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">
              Semantic HTML Patterns
            </h2>
            <div className="space-y-6">
              <p className="text-gray-300">
                Semantic HTML is the foundation of accessible web development. Using the right HTML elements for their intended purpose
                provides built-in accessibility features and improves SEO.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">Document Structure</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Use <code>&lt;header&gt;</code> for introductory content</li>
                    <li>• Implement <code>&lt;nav&gt;</code> for navigation</li>
                    <li>• Utilize <code>&lt;main&gt;</code> for primary content</li>
                    <li>• Apply <code>&lt;article&gt;</code> for self-contained content</li>
                    <li>• Include <code>&lt;aside&gt;</code> for complementary content</li>
                  </ul>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">Interactive Elements</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Use <code>&lt;button&gt;</code> for clickable actions</li>
                    <li>• Implement <code>&lt;select&gt;</code> for dropdown menus</li>
                    <li>• Apply <code>&lt;input&gt;</code> with proper types</li>
                    <li>• Include <code>&lt;label&gt;</code> for form controls</li>
                    <li>• Utilize <code>&lt;dialog&gt;</code> for modal windows</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* New Section: Color and Contrast */}
          <section id="color-contrast" className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">
              Color and Contrast Guidelines
            </h2>
            <div className="space-y-6">
              <p className="text-gray-300">
                Proper color contrast is essential for users with visual impairments. WCAG 2.1 provides specific guidelines
                for ensuring adequate contrast between text and background colors.
              </p>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">Contrast Requirements</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Normal text: 4.5:1 minimum ratio</li>
                    <li>• Large text: 3:1 minimum ratio</li>
                    <li>• UI components: 3:1 minimum ratio</li>
                    <li>• Logos: No minimum requirement</li>
                  </ul>
                </div>
                <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                  <h3 className="text-xl font-semibold text-purple-400 mb-4">Color Best Practices</h3>
                  <ul className="space-y-2 text-gray-300">
                    <li>• Don't rely on color alone</li>
                    <li>• Use patterns or icons with colors</li>
                    <li>• Provide high contrast modes</li>
                    <li>• Test with color blindness simulators</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Testing Section */}
          <section id="testing" className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">
              Comprehensive Testing Approach
            </h2>
            <div className="space-y-6">
              <div className="bg-black/30 p-6 rounded-lg border border-purple-500/10">
                <h3 className="text-xl font-semibold text-purple-400 mb-4">Testing Methods</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-white mb-2">Automated Testing</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• WAVE Evaluation Tool</li>
                      <li>• aXe DevTools</li>
                      <li>• Lighthouse Accessibility</li>
                      <li>• NVDA Screen Reader</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white mb-2">Manual Testing</h4>
                    <ul className="space-y-2 text-gray-300">
                      <li>• Keyboard navigation testing</li>
                      <li>• Screen reader testing</li>
                      <li>• Color contrast verification</li>
                      <li>• User testing with disabled individuals</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Author Bio with Enhanced Styling */}
          <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 shadow-lg shadow-purple-500/10">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent mb-6">About the Author</h3>
            <div className="flex items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-purple-700 flex items-center justify-center">
                <span className="text-2xl text-white font-bold">YN</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-300 mb-6 leading-relaxed">
                  Written by an accessibility advocate and senior developer with over 8 years of experience in implementing 
                  WCAG guidelines and creating inclusive web experiences. Passionate about making the web accessible to everyone 
                  through education and practical implementation. Regular speaker at accessibility conferences and contributor to 
                  open-source accessibility projects.
                </p>
                <div className="flex items-center gap-6">
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
        </div>
      </article>
    </main>
  );
} 