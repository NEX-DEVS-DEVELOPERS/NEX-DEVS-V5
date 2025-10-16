'use client';

import React from 'react';
import { 
  audiowide, 
  vt323, 
  fontStyles, 
  vt323DefaultSize, 
  getVT323Style, 
  getAudiowideStyle 
} from '@/frontend/utils/fonts';

/**
 * FontExample component
 * 
 * This component demonstrates how to use the fonts.ts utility with all the predefined styles.
 * You can import and use this in any page to see how the fonts look.
 */
const FontExample = () => {
  return (
    <div className="p-8 bg-zinc-900 text-white max-w-4xl mx-auto rounded-lg">
      <h1 className="text-3xl font-bold mb-6">Font Usage Examples</h1>
      
      {/* Basic font usage */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Basic Font Usage</h2>
        
        <div className="grid gap-4">
          <div>
            <h3 className="text-lg mb-2">Audiowide Font</h3>
            <p className={audiowide.className}>
              This text uses the Audiowide font directly imported.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2">VT323 Font</h3>
            <p className={vt323.className} style={vt323DefaultSize}>
              This text uses the VT323 font directly imported with default size.
            </p>
          </div>
        </div>
      </section>
      
      {/* Predefined heading styles */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Heading Styles</h2>
        
        <div className="grid gap-4">
          <h1 className={fontStyles.headings.h1}>H1 Heading</h1>
          <h2 className={fontStyles.headings.h2}>H2 Heading</h2>
          <h3 className={fontStyles.headings.h3}>H3 Heading</h3>
          <h4 className={fontStyles.headings.h4}>H4 Heading</h4>
          <h2 className={fontStyles.headings.sectionTitle}>Section Title</h2>
          <h3 className={fontStyles.headings.cardTitle}>Card Title</h3>
          <h2 className={fontStyles.headings.gradientTitle}>Gradient Title</h2>
        </div>
      </section>
      
      {/* Predefined text styles */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Text Styles</h2>
        
        <div className="grid gap-4">
          <p className={fontStyles.text.body}>Body text using VT323 font.</p>
          <p className={fontStyles.text.description}>Description text with gray color.</p>
          <p className={fontStyles.text.highlight}>Highlighted text with purple color.</p>
          <p className={fontStyles.text.small}>Small text using VT323 font.</p>
          <label className={fontStyles.text.label}>Form label text</label>
        </div>
      </section>
      
      {/* Component styles */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Component Styles</h2>
        
        <div className="grid gap-8">
          {/* Card example */}
          <div className="bg-zinc-800 p-4 rounded-lg">
            <h3 className={fontStyles.components.card.title}>Card Title</h3>
            <p className={fontStyles.components.card.description}>
              This is a description for a card component using the predefined styles.
            </p>
          </div>
          
          {/* Hero section example */}
          <div className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 p-6 rounded-lg">
            <h2 className={fontStyles.components.hero.title}>Hero Title</h2>
            <p className={fontStyles.components.hero.subtitle}>
              This is a subtitle for a hero section using the predefined styles.
            </p>
          </div>
          
          {/* Section example */}
          <div className="text-center">
            <h2 className={fontStyles.components.section.title}>Section Title</h2>
            <p className={fontStyles.components.section.description}>
              This is a description for a section using the predefined styles.
            </p>
          </div>
          
          {/* Button examples */}
          <div className="flex gap-4">
            <button className={`${fontStyles.components.button.primary} bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg`}>
              Primary Button
            </button>
            <button className={`${fontStyles.components.button.secondary} bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg`}>
              Secondary Button
            </button>
          </div>
        </div>
      </section>
      
      {/* Helper functions */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Helper Functions</h2>
        
        <div className="grid gap-4">
          <div>
            <h3 className="text-lg mb-2">getVT323Style</h3>
            <p {...getVT323Style('text-blue-300')}>
              This text uses the getVT323Style helper with additional blue color class.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg mb-2">getAudiowideStyle</h3>
            <p {...getAudiowideStyle('text-2xl text-green-300')}>
              This text uses the getAudiowideStyle helper with additional classes.
            </p>
          </div>
        </div>
      </section>
      
      {/* Usage in layout.tsx */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Usage in layout.tsx</h2>
        <pre className="bg-zinc-800 p-4 rounded-lg overflow-auto text-sm">
          {`
// In your layout.tsx file:
import { fontVariables } from '@/frontend/utils/fonts';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        {children}
      </body>
    </html>
  );
}
          `}
        </pre>
      </section>
    </div>
  );
};

export default FontExample; 