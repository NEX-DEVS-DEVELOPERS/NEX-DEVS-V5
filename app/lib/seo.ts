import { Metadata } from 'next'

// Base SEO configuration
export const siteConfig = {
  name: 'NEX-DEVS | AI-Powered Development Solutions',
  description: 'NEX-DEVS specializes in AI-powered development solutions including intelligent web applications, AI automation, chatbots, and custom AI integrations for businesses seeking cutting-edge technology.',
  url: 'https://nexdevs.com', // Updated with actual domain
  ogImage: '/logos/nex-devs-logo.png',
  creator: 'Ali Hasnaat',
  company: 'NEX-DEVS',
  email: 'contact@nexdevs.com',
  phone: '+1-555-0123', // Add your actual phone number
  address: {
    streetAddress: '123 Tech Street',
    addressLocality: 'Tech City',
    addressRegion: 'TC',
    postalCode: '12345',
    addressCountry: 'US'
  },
  social: {
    twitter: 'https://twitter.com/nexdevs',
    linkedin: 'https://linkedin.com/company/nexdevs',
    github: 'https://github.com/nexdevs',
    facebook: 'https://facebook.com/nexdevs'
  },
  keywords: [
    'AI development',
    'artificial intelligence',
    'web development',
    'chatbot integration',
    'automation',
    'Next.js',
    'React',
    'TypeScript',
    'full-stack development',
    'AI consulting',
    'machine learning',
    'business automation',
    'custom AI solutions',
    'AI-powered applications',
    'intelligent web applications',
    'AI chatbot development',
    'business process automation',
    'AI integration services',
    'custom software development',
    'AI-powered websites',
    'machine learning solutions',
    'AI automation tools',
    'intelligent business solutions',
    'AI development company',
    'artificial intelligence consulting',
    'AI software development',
    'automated workflows',
    'AI-driven applications',
    'smart automation systems',
    'AI technology solutions',
    'digital transformation',
    'AI implementation',
    'intelligent automation',
    'AI-powered business tools',
    'custom AI development',
    'AI application development',
    'AI system integration',
    'AI-enhanced websites',
    'AI development services',
    'AI solution provider'
  ]
}

// SEO metadata types
export interface SEOProps {
  title?: string
  description?: string
  keywords?: string[]
  image?: string
  url?: string
  type?: 'website' | 'article' | 'profile'
  publishedTime?: string
  modifiedTime?: string
  author?: string
  section?: string
  tags?: string[]
  noindex?: boolean
  nofollow?: boolean
}

// Generate metadata for pages
export function generateMetadata({
  title,
  description = siteConfig.description,
  keywords = siteConfig.keywords,
  image = siteConfig.ogImage,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author = siteConfig.creator,
  section,
  tags,
  noindex = false,
  nofollow = false
}: SEOProps = {}): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name
  const fullUrl = url ? `${siteConfig.url}${url}` : siteConfig.url
  const fullImage = image?.startsWith('http') ? image : `${siteConfig.url}${image}`

  const metadata: Metadata = {
    title: fullTitle,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: author }],
    creator: author,
    publisher: siteConfig.company,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: fullUrl,
      siteName: siteConfig.name,
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title || siteConfig.name,
        },
      ],
      locale: 'en_US',
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [fullImage],
      creator: `@${siteConfig.creator.replace(' ', '').toLowerCase()}`,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'your-google-verification-code', // Replace with actual verification code
      yandex: 'your-yandex-verification-code', // Replace with actual verification code
      yahoo: 'your-yahoo-verification-code', // Replace with actual verification code
    },
  }

  return metadata
}

// Structured data schemas
export interface PersonSchema {
  '@context': 'https://schema.org'
  '@type': 'Person'
  name: string
  jobTitle: string
  worksFor: {
    '@type': 'Organization'
    name: string
  }
  url: string
  sameAs: string[]
  knowsAbout: string[]
  description: string
}

export interface OrganizationSchema {
  '@context': 'https://schema.org'
  '@type': 'Organization'
  name: string
  url: string
  logo: string
  description: string
  foundingDate: string
  founder: {
    '@type': 'Person'
    name: string
  }
  contactPoint: {
    '@type': 'ContactPoint'
    telephone: string
    contactType: 'customer service'
    email: string
  }
  sameAs: string[]
  address: {
    '@type': 'PostalAddress'
    addressCountry: string
    addressRegion: string
  }
}

export interface WebSiteSchema {
  '@context': 'https://schema.org'
  '@type': 'WebSite'
  name: string
  url: string
  description: string
  publisher: {
    '@type': 'Organization'
    name: string
  }
  potentialAction: {
    '@type': 'SearchAction'
    target: {
      '@type': 'EntryPoint'
      urlTemplate: string
    }
    'query-input': string
  }
}

export interface BlogPostSchema {
  '@context': 'https://schema.org'
  '@type': 'BlogPosting'
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified: string
  author: {
    '@type': 'Person'
    name: string
  }
  publisher: {
    '@type': 'Organization'
    name: string
    logo: {
      '@type': 'ImageObject'
      url: string
    }
  }
  mainEntityOfPage: {
    '@type': 'WebPage'
    '@id': string
  }
}

// Generate structured data
export function generatePersonSchema(): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ali Hasnaat',
    jobTitle: 'AI Developer & Founder',
    worksFor: {
      '@type': 'Organization',
      name: 'NEX-DEVS'
    },
    url: siteConfig.url,
    sameAs: [
      'https://linkedin.com/in/alihasnaat', // Replace with actual profiles
      'https://github.com/alihasnaat',
      'https://twitter.com/alihasnaat'
    ],
    knowsAbout: [
      'Artificial Intelligence',
      'Web Development',
      'React',
      'Next.js',
      'TypeScript',
      'Node.js',
      'Machine Learning',
      'Automation',
      'Chatbot Development'
    ],
    description: 'AI Developer and Founder of NEX-DEVS, specializing in AI-powered web applications and intelligent automation solutions.'
  }
}

export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NEX-DEVS',
    url: siteConfig.url,
    logo: `${siteConfig.url}/logo.png`,
    description: siteConfig.description,
    foundingDate: '2018',
    founder: {
      '@type': 'Person',
      name: 'Ali Hasnaat'
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+1-XXX-XXX-XXXX', // Replace with actual phone
      contactType: 'customer service',
      email: 'contact@nexdevs.com' // Replace with actual email
    },
    sameAs: [
      'https://linkedin.com/company/nexdevs', // Replace with actual profiles
      'https://twitter.com/nexdevs',
      'https://github.com/nexdevs'
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'US', // Replace with actual country
      addressRegion: 'CA' // Replace with actual region
    }
  }
}

export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.company
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

export function generateBlogPostSchema({
  headline,
  description,
  image,
  datePublished,
  dateModified,
  author = siteConfig.creator,
  url
}: {
  headline: string
  description: string
  image: string
  datePublished: string
  dateModified?: string
  author?: string
  url: string
}): BlogPostSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline,
    description,
    image: image.startsWith('http') ? image : `${siteConfig.url}${image}`,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Person',
      name: author
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.company,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/logo.png`
      }
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${siteConfig.url}${url}`
    }
  }
}

// Utility to inject structured data
export function injectStructuredData(schema: any): string {
  return JSON.stringify(schema)
}

// Common page-specific metadata generators
export const pageMetadata = {
  home: () => generateMetadata({
    title: 'AI-Powered Development Solutions',
    description: 'Transform your business with cutting-edge AI development solutions. Specializing in intelligent web applications, automation, and custom AI integrations.',
    keywords: [...siteConfig.keywords, 'homepage', 'AI solutions', 'business transformation'],
    url: '/'
  }),

  about: () => generateMetadata({
    title: 'About Ali Hasnaat & NEX-DEVS Team',
    description: 'Meet Ali Hasnaat, AI Developer and Founder of NEX-DEVS. Learn about our team of AI specialists and our mission to democratize artificial intelligence.',
    keywords: [...siteConfig.keywords, 'about', 'team', 'Ali Hasnaat', 'founder', 'AI specialists'],
    url: '/about'
  }),

  work: () => generateMetadata({
    title: 'Portfolio & Work Experience',
    description: 'Explore our portfolio of successful AI projects and development work. See how we transform businesses through intelligent automation and modern web technologies.',
    keywords: [...siteConfig.keywords, 'portfolio', 'projects', 'work experience', 'case studies'],
    url: '/work'
  }),

  projects: () => generateMetadata({
    title: 'AI Projects & Development Portfolio',
    description: 'Browse our comprehensive portfolio of AI-powered projects, web applications, and automation solutions. See real results from our development work.',
    keywords: [...siteConfig.keywords, 'projects', 'portfolio', 'AI applications', 'development showcase'],
    url: '/projects'
  }),

  blog: () => generateMetadata({
    title: 'AI Development Blog & Insights',
    description: 'Stay updated with the latest in AI development, web technologies, and industry insights. Expert articles on artificial intelligence and modern development practices.',
    keywords: [...siteConfig.keywords, 'blog', 'articles', 'AI insights', 'development tips', 'technology trends'],
    url: '/blog'
  }),

  contact: () => generateMetadata({
    title: 'Contact NEX-DEVS for AI Development',
    description: 'Get in touch with NEX-DEVS for your AI development needs. Free consultation for AI integration, web development, and automation projects.',
    keywords: [...siteConfig.keywords, 'contact', 'consultation', 'AI development services', 'get in touch'],
    url: '/contact'
  })
}

// Generate LocalBusiness schema for better local SEO
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${siteConfig.url}/#localbusiness`,
    name: siteConfig.company,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: siteConfig.address.streetAddress,
      addressLocality: siteConfig.address.addressLocality,
      addressRegion: siteConfig.address.addressRegion,
      postalCode: siteConfig.address.postalCode,
      addressCountry: siteConfig.address.addressCountry
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '40.7128', // Update with actual coordinates
      longitude: '-74.0060'
    },
    openingHours: [
      'Mo-Fr 09:00-18:00'
    ],
    priceRange: '$$',
    serviceArea: {
      '@type': 'Country',
      name: 'United States'
    },
    areaServed: [
      {
        '@type': 'Country',
        name: 'United States'
      },
      {
        '@type': 'Country',
        name: 'Canada'
      },
      {
        '@type': 'Country',
        name: 'United Kingdom'
      }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'AI Development Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'AI Web Development',
            description: 'Custom AI-powered web applications and intelligent automation solutions'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Chatbot Development',
            description: 'AI chatbot integration and custom conversational AI solutions'
          }
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Business Automation',
            description: 'Intelligent workflow automation and process optimization'
          }
        }
      ]
    },
    sameAs: [
      siteConfig.social.twitter,
      siteConfig.social.linkedin,
      siteConfig.social.github,
      siteConfig.social.facebook
    ]
  }
}

