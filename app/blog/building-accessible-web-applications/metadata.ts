import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Building Accessible Web Applications | Your Name',
  description: 'A comprehensive guide to building accessible web applications, covering WCAG guidelines, keyboard navigation, ARIA, semantic HTML, color contrast, and advanced accessibility patterns.',
  openGraph: {
    title: 'Building Accessible Web Applications',
    description: 'A comprehensive guide to building accessible web applications, covering WCAG guidelines, keyboard navigation, ARIA, semantic HTML, color contrast, and advanced accessibility patterns.',
    type: 'article',
    publishedTime: '2024-02-20T00:00:00.000Z',
  },
  other: {
    'script:ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: 'Building Accessible Web Applications',
      datePublished: '2024-02-20T00:00:00.000Z',
      author: {
        '@type': 'Person',
        name: 'Your Name',
      },
    }),
  },
}; 
