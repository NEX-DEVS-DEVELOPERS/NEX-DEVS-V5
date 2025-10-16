'use client'
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProjectDetails {
  isOpen: boolean;
  id: string;
}

const FeaturedProjectsPage = () => {
  const [expandedDetails, setExpandedDetails] = useState<{ [key: string]: boolean }>({});

  const toggleDetails = (id: string) => {
    setExpandedDetails(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const projects = [
    {
      id: "wordpress",
      title: "WordPress Development",
      description: "Custom WordPress solutions for businesses of all sizes",
      details: [
        "Custom theme development",
        "Plugin customization",
        "E-commerce integration",
        "Performance optimization",
        "Security hardening"
      ],
      metrics: [
        "50+ WordPress sites delivered",
        "99.9% uptime guarantee",
        "40% faster load times"
      ],
      expandedContent: {
        overview: "Our WordPress development services focus on creating custom, high-performance websites that are easy to manage and maintain.",
        keyFeatures: [
          {
            title: "Custom Theme Development",
            description: "Built from scratch themes that perfectly match your brand identity and requirements"
          },
          {
            title: "WooCommerce Integration",
            description: "Full-featured e-commerce solutions with custom payment gateways and inventory management"
          },
          {
            title: "Security Implementation",
            description: "Enterprise-grade security measures including SSL, firewall configuration, and regular security audits"
          }
        ],
        technologies: ["PHP 8+", "MySQL", "WooCommerce", "REST API", "jQuery", "SASS"],
        processSteps: [
          "Requirements Analysis",
          "Design & Wireframing",
          "Development & Testing",
          "Security Implementation",
          "Launch & Maintenance"
        ]
      }
    },
    {
      id: "shopify",
      title: "Shopify/WooCommerce Solutions",
      description: "End-to-end e-commerce platform development",
      details: [
        "Custom theme development",
        "Payment gateway integration",
        "Inventory management systems",
        "Multi-currency support",
        "Analytics integration"
      ],
      metrics: [
        "2x conversion rate increase",
        "45% faster checkout process",
        "100K+ products managed"
      ],
      expandedContent: {
        overview: "We deliver comprehensive e-commerce solutions using Shopify and WooCommerce platforms.",
        keyFeatures: [
          {
            title: "Custom Checkout Processes",
            description: "Tailored checkout experiences that optimize conversion rates"
          },
          {
            title: "Inventory Management Systems",
            description: "Efficient systems for managing large product catalogs"
          },
          {
            title: "Multi-currency Support",
            description: "Ability to accept payments in multiple currencies"
          }
        ],
        technologies: ["Shopify", "WooCommerce", "PHP", "MySQL", "REST API"],
        processSteps: [
          "Requirements Analysis",
          "Custom Theme Development",
          "Payment Gateway Integration",
          "Inventory Management Setup",
          "Analytics Integration"
        ]
      }
    },
    {
      id: "figma",
      title: "Figma/Framer Design",
      description: "UI/UX design and prototyping services",
      details: [
        "Interactive prototypes",
        "Design systems",
        "Component libraries",
        "Animation design",
        "Responsive layouts"
      ],
      metrics: [
        "90% design approval rate",
        "30% reduced revision cycles",
        "50+ design systems created"
      ],
      expandedContent: {
        overview: "Our design process combines creativity with functionality, using Figma and Framer to create engaging user experiences.",
        keyFeatures: [
          {
            title: "Interactive Prototypes",
            description: "Quickly iterate and test design concepts"
          },
          {
            title: "Design Systems",
            description: "Consistent and scalable design patterns"
          },
          {
            title: "Component Libraries",
            description: "Reusable design elements for faster development"
          }
        ],
        technologies: ["Figma", "Framer", "Adobe XD", "Sketch", "UI/UX Design"],
        processSteps: [
          "Requirements Analysis",
          "Design & Wireframing",
          "Prototyping & Testing",
          "Design System Creation",
          "Component Library Development"
        ]
      }
    },
    {
      id: "devops",
      title: "Website DevOps",
      description: "Continuous integration and deployment solutions",
      details: [
        "Automated deployments",
        "Performance monitoring",
        "Security auditing",
        "Load balancing",
        "Backup systems"
      ],
      metrics: [
        "99.99% deployment success rate",
        "60% faster deployment cycles",
        "24/7 monitoring"
      ],
      expandedContent: {
        overview: "Our DevOps services ensure your website operates at peak performance with maximum security.",
        keyFeatures: [
          {
            title: "Automated Deployments",
            description: "Continuous and reliable deployment pipelines"
          },
          {
            title: "Performance Monitoring",
            description: "Real-time insights into website performance"
          },
          {
            title: "Security Auditing",
            description: "Regular security checks and audits"
          }
        ],
        technologies: ["Docker", "Kubernetes", "Prometheus", "ELK Stack", "Ansible"],
        processSteps: [
          "Requirements Analysis",
          "Infrastructure Setup",
          "Continuous Integration",
          "Deployment Automation",
          "Monitoring & Optimization"
        ]
      }
    },
    {
      id: "webapp",
      title: "MODERN AI BASED SAAS PRODUCT",
      description: "Enterprise-grade SaaS solutions with advanced AI integration",
      details: [
        "Enterprise AI Integration",
        "Advanced SaaS Architecture",
        "Predictive Analytics",
        "Intelligent Automation",
        "Scalable Infrastructure"
      ],
      metrics: [
        "95% accuracy in AI predictions",
        "5x faster data processing",
        "100+ AI models deployed"
      ],
      expandedContent: {
        overview: "We develop sophisticated SaaS solutions enhanced with enterprise-grade AI capabilities.",
        keyFeatures: [
          {
            title: "Enterprise AI Integration",
            description: "Advanced AI models for intelligent business automation"
          },
          {
            title: "SaaS Architecture",
            description: "Scalable multi-tenant cloud infrastructure"
          },
          {
            title: "Predictive Analytics",
            description: "Data-driven insights and forecasting"
          }
        ],
        technologies: ["Python", "TypeScript", "TensorFlow", "Kubernetes", "Cloud Infrastructure"],
        processSteps: [
          "Business Analysis",
          "AI Strategy Development",
          "SaaS Architecture Design",
          "AI Model Integration",
          "Deployment & Scaling"
        ]
      }
    },
    {
      id: "seo",
      title: "SEO/Content Writing",
      description: "Advanced SEO strategies and semantic content optimization for maximum visibility",
      details: [
        "Semantic SEO optimization",
        "Content strategy & planning",
        "Technical SEO implementation",
        "Authority link building",
        "Schema markup integration",
        "Core Web Vitals optimization",
        "Voice search optimization",
        "Local SEO enhancement"
      ],
      metrics: [
        "200% average traffic increase",
        "40% higher engagement",
        "Top 3 SERP rankings",
        "85% semantic search visibility",
        "95% mobile optimization score",
        "60% voice search presence"
      ],
      expandedContent: {
        overview: "Our comprehensive SEO and content services leverage advanced semantic optimization, technical excellence, and data-driven strategies to maximize your digital presence and drive qualified organic traffic.",
        keyFeatures: [
          {
            title: "Semantic SEO Mastery",
            description: "Advanced semantic analysis and topic clustering for comprehensive search intent coverage"
          },
          {
            title: "Technical Excellence",
            description: "Core Web Vitals optimization, structured data implementation, and advanced schema markup"
          },
          {
            title: "Content Strategy",
            description: "Data-driven content planning with semantic keyword research and topic authority building"
          },
          {
            title: "Advanced Analytics",
            description: "Comprehensive tracking with custom dashboards and AI-powered insights"
          },
          {
            title: "Voice & Mobile SEO",
            description: "Optimization for voice search queries and mobile-first indexing"
          },
          {
            title: "Local SEO Dominance",
            description: "Strategic local presence optimization with GBP management and local schema markup"
          }
        ],
        technologies: [
          "Google Search Console",
          "Google Analytics 4",
          "SEMrush",
          "Ahrefs",
          "Screaming Frog",
          "Schema Pro",
          "MarketMuse",
          "Surfer SEO",
          "Mobile-Friendly Test API",
          "PageSpeed Insights API"
        ],
        processSteps: [
          "Technical SEO Audit",
          "Semantic Keyword Research",
          "Content Gap Analysis",
          "Topic Cluster Planning",
          "On-Page Optimization",
          "Schema Implementation",
          "Content Creation & Enhancement",
          "Authority Link Building",
          "Performance Monitoring",
          "ROI Analysis & Reporting"
        ]
      }
    }
  ];

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-black pt-32 px-6 md:px-20 lg:px-40"
    >
      {/* Background Gradient Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10">
        <motion.h1 
          variants={itemVariants}
          className="text-5xl font-bold text-center mb-6 text-white tracking-tight"
        >
          Featured Projects & Services
        </motion.h1>
        
        <motion.p 
          variants={itemVariants}
          className="text-gray-400 text-center mb-6 max-w-2xl mx-auto"
        >
          Delivering exceptional digital experiences through innovative solutions and cutting-edge technology
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 text-sm border border-purple-500/20">
            6+ Years of Experience • 200+ Projects Delivered • 100% Client Satisfaction
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group relative p-8 rounded-xl border border-[#2A2A2A] bg-[#111111] hover:border-purple-500/50 transition-all duration-300"
            >
              {/* Hover Gradient Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg" />

              <div className="relative z-10">
                <div className="flex items-center gap-4 mb-4">
                  <h2 className="text-2xl font-bold text-white group-hover:text-purple-200 transition-colors">
                    {project.title}
                  </h2>
                  <div className="flex-grow h-[1px] bg-gradient-to-r from-purple-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <p className="text-gray-400 mb-6">{project.description}</p>
                
                <div className="space-y-6 mb-6">
                  <div className="flex flex-wrap gap-2">
                    {project.details.map((detail, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full bg-[#1A1A1A] text-sm text-gray-300 border border-transparent hover:border-purple-500/30 transition-colors"
                      >
                        {detail}
                      </span>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {project.metrics.map((metric, index) => (
                      <div 
                        key={index} 
                        className="flex items-center gap-2 text-gray-400 bg-[#1A1A1A] p-3 rounded-lg"
                      >
                        <span className="w-2 h-2 rounded-full bg-purple-500/50 group-hover:bg-purple-500 transition-colors" />
                        {metric}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#2A2A2A] pt-4">
                  <motion.button
                    onClick={() => toggleDetails(project.id)}
                    className="text-purple-400 hover:text-purple-300 transition-colors flex items-center gap-2 group/btn"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {expandedDetails[project.id] ? 'Show Less' : 'Read More'}
                    <span className="transition-transform duration-300 group-hover/btn:translate-x-1">
                      {expandedDetails[project.id] ? '↑' : '↓'}
                    </span>
                  </motion.button>

                  {expandedDetails[project.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 space-y-8"
                    >
                      {/* Overview Section */}
                      <div className="bg-[#1A1A1A] rounded-xl p-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Overview</h3>
                        <p className="text-gray-300 leading-relaxed">
                          {project.expandedContent.overview}
                        </p>
                      </div>

                      {/* Key Features Section */}
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {project.expandedContent.keyFeatures.map((feature, idx) => (
                          <div 
                            key={idx}
                            className="bg-[#1A1A1A] rounded-xl p-6 border border-purple-500/10 hover:border-purple-500/30 transition-colors"
                          >
                            <h4 className="text-lg font-medium text-purple-300 mb-2">
                              {feature.title}
                            </h4>
                            <p className="text-gray-400 text-sm">
                              {feature.description}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Technologies & Process Section */}
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-[#1A1A1A] rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-white mb-4">Technologies</h3>
                          <div className="flex flex-wrap gap-2">
                            {project.expandedContent.technologies.map((tech, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 bg-purple-500/10 text-purple-300 rounded-full text-sm"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="bg-[#1A1A1A] rounded-xl p-6">
                          <h3 className="text-xl font-semibold text-white mb-4">Process</h3>
                          <ol className="space-y-2">
                            {project.expandedContent.processSteps.map((step, idx) => (
                              <li 
                                key={idx}
                                className="flex items-center gap-3 text-gray-300"
                              >
                                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-500/20 text-purple-300 text-sm">
                                  {idx + 1}
                                </span>
                                {step}
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturedProjectsPage;
