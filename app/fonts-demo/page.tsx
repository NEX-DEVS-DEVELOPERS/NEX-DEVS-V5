'use client';

import React from 'react';
import Link from 'next/link';
import { fontStyles, getVT323Style, getAudiowideStyle } from '@/app/utils/fonts';
import FontExample from '@/app/components/FontExample';

export default function FontsDemoPage() {
  return (
    <div className="min-h-screen bg-black text-white py-24">
      <div className="container mx-auto px-4">
        <header className="mb-12 text-center">
          <h1 className={fontStyles.headings.h1}>
            NEX-DEVS Font System
          </h1>
          <p {...getVT323Style('text-xl max-w-2xl mx-auto mt-4')}>
            This page demonstrates how to use the fonts.ts utility to apply consistent typography across your site.
          </p>
          <div className="mt-6">
            <Link 
              href="/"
              className={`${fontStyles.components.button.primary} bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg inline-block`}
            >
              Back to Home
            </Link>
          </div>
        </header>

        <div className="grid gap-12">
          {/* Simple usage example */}
          <section className="bg-zinc-900/50 rounded-xl p-8 backdrop-blur-sm border border-zinc-800">
            <h2 className={fontStyles.headings.h2}>Simple Usage</h2>
            <p {...getVT323Style('mt-4')}>
              Here's how to use the font styles in your components:
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div className="bg-zinc-800 p-6 rounded-lg">
                <h3 className={fontStyles.headings.h3}>For Headings</h3>
                <pre className="mt-4 bg-black/50 p-4 rounded-lg overflow-auto text-sm">
                  {`import { fontStyles } from '@/app/utils/fonts';

// In your component:
<h1 className={fontStyles.headings.h1}>
  Main Heading
</h1>

<h2 className={fontStyles.headings.h2}>
  Section Heading
</h2>`}
                </pre>
              </div>

              <div className="bg-zinc-800 p-6 rounded-lg">
                <h3 className={fontStyles.headings.h3}>For Text</h3>
                <pre className="mt-4 bg-black/50 p-4 rounded-lg overflow-auto text-sm">
                  {`import { getVT323Style } from '@/app/utils/fonts';

// In your component:
<p {...getVT323Style('text-gray-300')}>
  This is paragraph text with VT323 font
  and additional classes.
</p>

// Or use predefined styles:
<p className={fontStyles.text.description}>
  Description text
</p>`}
                </pre>
              </div>
            </div>
          </section>

          {/* Real-world example */}
          <section className="bg-zinc-900/50 rounded-xl p-8 backdrop-blur-sm border border-zinc-800">
            <h2 className={fontStyles.headings.h2}>Real-world Example</h2>
            <p {...getVT323Style('mt-4')}>
              Here's a sample card component using our font system:
            </p>

            <div className="mt-8 grid gap-8 md:grid-cols-3">
              {[
                {
                  title: "Web Development",
                  description: "Custom websites built with modern frameworks and best practices",
                  icon: "💻"
                },
                {
                  title: "AI Integration",
                  description: "Enhance your applications with powerful AI capabilities",
                  icon: "🤖"
                },
                {
                  title: "E-commerce",
                  description: "Online stores with seamless payment processing and inventory management",
                  icon: "🛒"
                }
              ].map((service, index) => (
                <div key={index} className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 rounded-lg border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300">
                  <div className="text-3xl mb-4">{service.icon}</div>
                  <h3 className={fontStyles.components.card.title}>{service.title}</h3>
                  <p {...getVT323Style('text-gray-400')}>
                    {service.description}
                  </p>
                  <button className={`${fontStyles.components.button.secondary} mt-4 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 rounded-lg transition-colors w-full`}>
                    Learn More
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Complete reference */}
          <section className="bg-zinc-900/50 rounded-xl p-8 backdrop-blur-sm border border-zinc-800">
            <h2 className={fontStyles.headings.h2}>Complete Reference</h2>
            <p {...getVT323Style('mt-4')}>
              Below is a complete reference of all available font styles and helpers:
            </p>

            <FontExample />
          </section>
        </div>
      </div>
    </div>
  );
} 