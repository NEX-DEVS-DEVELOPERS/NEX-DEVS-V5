import { MetadataRoute } from 'next'
import { siteConfig } from './lib/seo'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/work`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  // Dynamic blog posts (in a real app, you'd fetch these from your database/API)
  const blogPosts = [
    {
      url: `${baseUrl}/blog/building-modern-web-applications-nextjs-13`,
      lastModified: new Date('2024-03-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/mastering-typescript-best-practices`,
      lastModified: new Date('2024-03-10'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/future-web-development-ai-integration`,
      lastModified: new Date('2024-03-05'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/creating-animations-framer-motion`,
      lastModified: new Date('2024-03-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/optimizing-react-applications`,
      lastModified: new Date('2024-02-25'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/building-accessible-web-applications`,
      lastModified: new Date('2024-02-20'),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
  ]

  // Dynamic project pages (in a real app, you'd fetch these from your database/API)
  const projectPages = [
    {
      url: `${baseUrl}/projects/ai-chatbot-integration`,
      lastModified: new Date('2024-03-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects/e-commerce-platform`,
      lastModified: new Date('2024-02-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects/workflow-automation`,
      lastModified: new Date('2024-02-01'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/projects/3d-web-experience`,
      lastModified: new Date('2024-01-15'),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
  ]

  return [...staticPages, ...blogPosts, ...projectPages]
}
