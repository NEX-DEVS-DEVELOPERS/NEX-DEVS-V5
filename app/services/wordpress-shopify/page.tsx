'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    name: "Saira faisal",
    role: "E-commerce Manager",
    company: "Fashion Boutique",
    content: "The WordPress solution provided transformed our online presence. Sales increased by 150% within the first quarter!",
    initials: "SF"
  },
  {
    name: "Muhammad Ali",
    role: "Store Owner",
    company: "Tech Gadgets",
    content: "Their Shopify expertise helped us scale from local to international. The custom features they added were game-changing.",
    initials: "MA"
  }
]

const services = [
  {
    title: "Custom WordPress Development",
    description: "Tailored WordPress solutions with custom themes, plugins, and functionalities",
    features: [
      "Custom Theme Development",
      "Plugin Development",
      "WooCommerce Integration",
      "Performance Optimization",
      "Security Implementation"
    ],
    icon: "🎨"
  },
  {
    title: "Shopify Solutions",
    description: "End-to-end Shopify store setup and customization",
    features: [
      "Store Setup & Configuration",
      "Theme Customization",
      "App Integration",
      "Payment Gateway Setup",
      "Inventory Management"
    ],
    icon: "🛍️"
  },
  {
    title: "E-commerce Strategy",
    description: "Comprehensive e-commerce strategy and optimization",
    features: [
      "Market Analysis",
      "Conversion Optimization",
      "SEO Implementation",
      "Analytics Setup",
      "Marketing Integration"
    ],
    icon: "📈"
  }
]

const processSteps = [
  {
    title: "Discovery",
    description: "Understanding your business needs and goals",
    details: "We begin with a thorough analysis of your requirements, target audience, and business objectives.",
    icon: "🎯"
  },
  {
    title: "Planning",
    description: "Creating a detailed project roadmap",
    details: "Developing a comprehensive plan including features, timeline, and milestones.",
    icon: "📋"
  },
  {
    title: "Development",
    description: "Building your custom solution",
    details: "Implementing your solution with regular updates and feedback sessions.",
    icon: "💻"
  },
  {
    title: "Launch",
    description: "Deploying and optimizing",
    details: "Careful testing, deployment, and post-launch support to ensure success.",
    icon: "🚀"
  }
]

const themes = [
  {
    name: "AVADA",
    price: 70,
    features: ["Multi-purpose Theme", "Advanced Page Builder", "Performance Optimized", "500+ Pre-built Websites"],
    rating: 4.9
  },
  {
    name: "FOXIZ",
    price: 65,
    features: ["Magazine/Blog Theme", "Dark Mode Support", "AMP Ready", "Advanced Review System"],
    rating: 4.8
  },
  {
    name: "PIXWELL",
    price: 60,
    features: ["Modern Magazine Theme", "Optimized for AdSense", "Newsletter Integration", "Speed Optimized"],
    rating: 4.7
  },
  {
    name: "GENERATE-PRESS",
    price: 60,
    features: ["Lightweight Theme", "Extreme Customization", "WooCommerce Ready", "Schema Markup"],
    rating: 4.8
  },
  {
    name: "KAIDENCE",
    price: 55,
    features: ["Performance First", "Header Builder", "Custom Fonts", "WooCommerce Integration"],
    rating: 4.7
  },
  {
    name: "PHLOX",
    price: 40,
    features: ["Portfolio Focus", "Elementor Compatible", "One-Click Demo Import", "RTL Support"],
    rating: 4.6
  },
  {
    name: "NEWSPAPER-12",
    price: 60,
    features: ["News/Magazine Focus", "Advanced Category System", "Social Integration", "Video Playlists"],
    rating: 4.8
  }
]

const shopifyThemes = [
  {
    name: "Dawn",
    price: 0,
    features: ["Official Shopify Theme", "Lightning Fast", "Built-in SEO", "Mobile-First Design"],
    rating: 4.9
  },
  {
    name: "Prestige",
    price: 350,
    features: ["Luxury Design", "Advanced Product Filtering", "Instagram Integration", "Custom Mega Menu"],
    rating: 4.8
  },
  {
    name: "Warehouse",
    price: 280,
    features: ["Large Inventory Support", "Advanced Search", "Multi-Currency", "Quick Order Form"],
    rating: 4.7
  },
  {
    name: "Impulse",
    price: 320,
    features: ["Story-Focused Design", "Product Videos", "Lookbook Feature", "Advanced Product Zoom"],
    rating: 4.8
  },
  {
    name: "Flex",
    price: 450,
    features: ["100+ Customization Options", "Page Builder", "Multiple Headers", "Advanced Typography"],
    rating: 4.9
  },
  {
    name: "Editions",
    price: 280,
    features: ["Editorial Layout", "Product Stories", "Custom Promotion Tiles", "Dynamic Checkout"],
    rating: 4.7
  }
]

const plugins = [
  {
    name: "WP-ROCKET",
    price: 170,
    description: "Premium caching plugin for ultimate WordPress performance optimization",
    features: ["Page Caching", "Browser Caching", "GZIP Compression", "CDN Integration"]
  },
  {
    name: "RANK MATH PRO",
    description: "Advanced SEO plugin with AI-powered suggestions and schema markup",
    features: ["AI Content Analysis", "Advanced Schema", "Keyword Tracking", "SEO Analytics"]
  },
  {
    name: "ELEMENTOR PRO",
    description: "Professional website builder with advanced design capabilities",
    features: ["Visual Page Builder", "Theme Builder", "Pop-up Builder", "WooCommerce Builder"]
  },
  {
    name: "API KEY FOR FAST INDEXING",
    description: "Instant search engine indexing solution for better visibility",
    features: ["Instant Indexing", "Search Console Integration", "IndexNow API", "Analytics"]
  },
  {
    name: "SMUSH PRO WITH CDN",
    description: "Image optimization and CDN solution for faster loading",
    features: ["Image Compression", "Global CDN", "Lazy Loading", "WebP Conversion"]
  },
  {
    name: "FORMS PRO",
    description: "Advanced form builder with automation and integration capabilities",
    features: ["Drag & Drop Builder", "Payment Integration", "Email Marketing", "Custom Validation"]
  }
]

export default function WordPressShopifyPage() {
  return (
    <main className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-[128px] animate-pulse" />
          <div className="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[128px] animate-pulse delay-500" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-4 sm:space-y-8"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
              Professional WordPress & Shopify
              <div className="mt-2 sm:mt-4 md:mt-6 inline-block">
                <span className="block border border-white rounded-xl px-4 sm:px-6 py-2 sm:py-3 bg-white text-black text-xl sm:text-2xl md:text-3xl font-bold backdrop-blur-sm">
                  Development & Optimization
                </span>
              </div>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Elevate your online presence with our expert WordPress and Shopify solutions. 
              From custom development to performance optimization, we deliver results that drive growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="group relative p-4 sm:p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg
                         hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent 
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl" />
                
                <div className="relative z-10">
                  <span className="text-3xl sm:text-4xl mb-3 sm:mb-4 block">{service.icon}</span>
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-2 sm:mb-3">{service.title}</h3>
                  <p className="text-sm sm:text-base text-gray-400 mb-3 sm:mb-4">{service.description}</p>
                  
                  <ul className="space-y-2">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300 text-sm sm:text-base">
                        <span className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium WordPress Themes Section */}
      <section className="py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-16"
          >
            Premium WordPress Themes
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {themes.map((theme, index) => (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-4 sm:p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg
                         hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{theme.name}</h3>
                    <span className="text-purple-400 font-bold text-sm sm:text-base">${theme.price}</span>
                  </div>
                  <div className="space-y-2">
                    {theme.features.map((feature, i) => (
                      <p key={i} className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                        <span className="text-purple-400">✓</span>
                        {feature}
                      </p>
                    ))}
                  </div>
                  <div className="mt-3 sm:mt-4 flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-300 text-sm sm:text-base">{theme.rating}/5.0</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Shopify Themes Section */}
      <section className="py-12 sm:py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-16"
          >
            Premium Shopify Themes
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {shopifyThemes.map((theme, index) => (
              <motion.div
                key={theme.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-4 sm:p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg
                         hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h3 className="text-lg sm:text-xl font-semibold text-white">{theme.name}</h3>
                    <span className="text-purple-400 font-bold text-sm sm:text-base">
                      {theme.price === 0 ? 'Free' : `$${theme.price}`}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {theme.features.map((feature, i) => (
                      <p key={i} className="text-gray-300 flex items-center gap-2 text-sm sm:text-base">
                        <span className="text-purple-400">✓</span>
                        {feature}
                      </p>
                    ))}
                  </div>
                  <div className="mt-3 sm:mt-4 flex items-center gap-2">
                    <span className="text-yellow-400">★</span>
                    <span className="text-gray-300 text-sm sm:text-base">{theme.rating}/5.0</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Plugins Section */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white text-center mb-16"
          >
            Essential Premium Plugins
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plugins.map((plugin, index) => (
              <motion.div
                key={plugin.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-lg
                         hover:border-purple-500/50 transition-all duration-300"
              >
                <div className="relative z-10">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold text-white">{plugin.name}</h3>
                    {plugin.price && <span className="text-purple-400 font-bold">${plugin.price}</span>}
                  </div>
                  <p className="text-gray-300 mb-4">{plugin.description}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {plugin.features.map((feature, i) => (
                      <p key={i} className="text-gray-400 flex items-center gap-2">
                        <span className="text-purple-400">⚡</span>
                        {feature}
                      </p>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white text-center mb-16"
          >
            Our Development Process
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 
                              rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300">
                  <span className="text-3xl mb-4 block">{step.icon}</span>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm mb-3">{step.description}</p>
                  <p className="text-gray-500 text-sm">{step.details}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white text-center mb-16"
          >
            Client Testimonials
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 
                              rounded-xl blur-xl group-hover:opacity-75 transition-opacity duration-500" />
                <div className="relative p-8 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm
                              hover:border-purple-500/50 transition-all duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-xl font-semibold text-white">
                      {testimonial.initials}
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{testimonial.name}</h4>
                      <p className="text-gray-400">{testimonial.role}</p>
                      <p className="text-purple-400 text-sm">{testimonial.company}</p>
                    </div>
                  </div>
                  <p className="text-gray-300 italic">{testimonial.content}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
} 
