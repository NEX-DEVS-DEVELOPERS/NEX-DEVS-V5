import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Mastering TypeScript: Best Practices and Tips | Your Name',
  description: 'Discover advanced TypeScript techniques and best practices to write more maintainable and scalable code.',
  openGraph: {
    title: 'Mastering TypeScript: Best Practices and Tips',
    description: 'Discover advanced TypeScript techniques and best practices to write more maintainable and scalable code.',
    type: 'article',
    publishedTime: '2024-03-10T00:00:00.000Z',
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Mastering TypeScript: Best Practices and Tips',
      datePublished: '2024-03-10T00:00:00.000Z',
      author: {
        '@type': 'Person',
        name: 'Your Name',
      },
    }),
  },
};

export default function TypeScriptBlogPost() {
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
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Blog
        </Link>

        {/* Header Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 mb-12">
          <div className="flex items-center gap-4 text-sm text-purple-400 mb-4">
            <span className="bg-purple-500/10 px-3 py-1 rounded-full">TypeScript</span>
            <span>•</span>
            <span>March 10, 2024</span>
            <span>•</span>
            <span>10 min read</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Mastering TypeScript: Best Practices and Tips
          </h1>
          <p className="text-gray-400 text-lg">
            Discover advanced TypeScript techniques and best practices to write more maintainable and scalable code.
          </p>
        </div>

        {/* Table of Contents */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-6 rounded-xl border border-purple-500/20 mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Table of Contents</h2>
          <ul className="space-y-2">
            {[
              'Advanced Type System Features',
              'Generics and Type Inference',
              'Design Patterns in TypeScript',
              'Performance Optimization',
              'Testing Strategies',
              'Real-world Examples'
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
        <div className="prose prose-invert prose-purple max-w-none space-y-12">
          {/* Advanced Type System Features Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="advanced-type-system-features" className="text-2xl font-bold text-white mb-4">
              Advanced Type System Features
            </h2>
            <p className="text-gray-300 mb-6">
              TypeScript's type system offers powerful features that go beyond basic type annotations. Understanding these advanced concepts is crucial for writing type-safe and maintainable code.
            </p>
            <div className="bg-black/50 p-6 rounded-lg mb-6">
              <h3 className="text-xl text-white mb-4">Mapped Types</h3>
              <pre className="overflow-x-auto p-4 bg-black rounded-lg">
                <code className="text-sm text-purple-300">
                  {`type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Example usage
interface User {
  name: string;
  age: number;
}

const user: Readonly<User> = {
  name: "John",
  age: 30
};`}
                </code>
              </pre>
            </div>
            <div className="bg-black/50 p-6 rounded-lg">
              <h3 className="text-xl text-white mb-4">Conditional Types</h3>
              <pre className="overflow-x-auto p-4 bg-black rounded-lg">
                <code className="text-sm text-purple-300">
                  {`type NonNullable<T> = T extends null | undefined ? never : T;

type ExtractType<T, U> = T extends U ? T : never;

// Example usage
type StringOrNumber = string | number | boolean;
type StringOnly = ExtractType<StringOrNumber, string>; // type StringOnly = string`}
                </code>
              </pre>
            </div>
          </section>

          {/* Generics and Type Inference Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="generics-and-type-inference" className="text-2xl font-bold text-white mb-4">
              Generics and Type Inference
            </h2>
            <p className="text-gray-300 mb-6">
              Generics are one of TypeScript's most powerful features, enabling you to write flexible, reusable code while maintaining type safety.
            </p>
            <div className="bg-black/50 p-6 rounded-lg mb-6">
              <h3 className="text-xl text-white mb-4">Generic Functions</h3>
              <pre className="overflow-x-auto p-4 bg-black rounded-lg">
                <code className="text-sm text-purple-300">
                  {`function identity<T>(arg: T): T {
  return arg;
}

// Generic Constraints
interface Lengthwise {
  length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}`}
                </code>
              </pre>
            </div>
          </section>

          {/* Design Patterns Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="design-patterns-in-typescript" className="text-2xl font-bold text-white mb-4">
              Design Patterns in TypeScript
            </h2>
            <p className="text-gray-300 mb-6">
              Implementing common design patterns in TypeScript can help create more maintainable and scalable applications.
            </p>
            <div className="bg-black/50 p-6 rounded-lg mb-6">
              <h3 className="text-xl text-white mb-4">Factory Pattern</h3>
              <pre className="overflow-x-auto p-4 bg-black rounded-lg">
                <code className="text-sm text-purple-300">
                  {`interface Product {
  name: string;
  price: number;
}

class ProductFactory {
  static createProduct(type: 'basic' | 'premium'): Product {
    switch (type) {
      case 'basic':
        return { name: 'Basic Product', price: 99 };
      case 'premium':
        return { name: 'Premium Product', price: 199 };
    }
  }
}`}
                </code>
              </pre>
            </div>
          </section>

          {/* Performance Optimization Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="performance-optimization" className="text-2xl font-bold text-white mb-4">
              Performance Optimization
            </h2>
            <p className="text-gray-300 mb-6">
              Learn how to optimize TypeScript code for better performance while maintaining type safety.
            </p>
            <div className="space-y-4">
              <h3 className="text-xl text-white">Key Optimization Techniques:</h3>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Use const assertions for better type inference</li>
                <li>Leverage strict mode for enhanced type checking</li>
                <li>Implement proper typing for async operations</li>
                <li>Optimize bundle size with proper import/export strategies</li>
              </ul>
            </div>
          </section>

          {/* Testing Strategies Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="testing-strategies" className="text-2xl font-bold text-white mb-4">
              Testing Strategies
            </h2>
            <p className="text-gray-300 mb-6">
              Effective testing strategies for TypeScript applications using modern testing frameworks.
            </p>
            <div className="bg-black/50 p-6 rounded-lg">
              <h3 className="text-xl text-white mb-4">Unit Testing Example</h3>
              <pre className="overflow-x-auto p-4 bg-black rounded-lg">
                <code className="text-sm text-purple-300">
                  {`import { describe, it, expect } from 'vitest';

interface User {
  name: string;
  email: string;
}

class UserService {
  validateUser(user: User): boolean {
    return user.email.includes('@') && user.name.length > 0;
  }
}

describe('UserService', () => {
  it('should validate user correctly', () => {
    const service = new UserService();
    const user: User = {
      name: 'John',
      email: 'john@example.com'
    };
    expect(service.validateUser(user)).toBe(true);
  });
});`}
                </code>
              </pre>
            </div>
          </section>

          {/* Real-world Examples Section */}
          <section className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20">
            <h2 id="real-world-examples" className="text-2xl font-bold text-white mb-4">
              Real-world Examples
            </h2>
            <p className="text-gray-300 mb-6">
              Practical examples of TypeScript in production environments and common use cases.
            </p>
            <div className="bg-black/50 p-6 rounded-lg">
              <h3 className="text-xl text-white mb-4">API Integration Example</h3>
              <pre className="overflow-x-auto p-4 bg-black rounded-lg">
                <code className="text-sm text-purple-300">
                  {`interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
}

async function fetchUser(id: number): Promise<ApiResponse<UserData>> {
  try {
    const response = await fetch(\`/api/users/\${id}\`);
    const data = await response.json();
    return {
      data,
      status: response.status,
      message: 'Success'
    };
  } catch (error) {
    throw new Error('Failed to fetch user');
  }
}`}
                </code>
              </pre>
            </div>
          </section>
        </div>

        {/* Author Bio */}
        <div className="bg-zinc-900/50 backdrop-blur-sm p-8 rounded-xl border border-purple-500/20 mt-12">
          <h3 className="text-xl font-bold text-white mb-4">About the Author</h3>
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <p className="text-gray-300 mb-2">
                Written by a TypeScript expert with extensive experience in building large-scale applications. Passionate about type safety and code quality.
              </p>
              <div className="flex items-center gap-4">
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
