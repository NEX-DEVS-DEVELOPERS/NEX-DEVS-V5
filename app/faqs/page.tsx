'use client';

import { useState, FormEvent, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronDown } from 'lucide-react';
import { audiowide, vt323 } from '@/app/utils/fonts';

// Interface for user-submitted questions
interface UserQuestion {
  id: string;
  question: string;
  answer: string;
  name: string;
  createdAt: string;
}

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>('general');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [question, setQuestion] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [userQuestions, setUserQuestions] = useState<UserQuestion[]>([]);

  // Fetch user-submitted questions
  useEffect(() => {
    const fetchUserQuestions = async () => {
      try {
        const response = await fetch('/api/get-user-questions');
        if (response.ok) {
          const questions = await response.json();
          setUserQuestions(questions);
        }
      } catch (error) {
        console.error('Error fetching user questions:', error);
      }
    };

    fetchUserQuestions();
  }, []);

  // Update categories to include user-submitted questions
  const categories = [
    ...(userQuestions.length > 0 ? [{ id: 'community', name: 'Community Q&A' }] : []),
    { id: 'general', name: 'General' },
    { id: 'services', name: 'Services' },
    { id: 'pricing', name: 'Pricing' },
    { id: 'payment', name: 'Payment' },
    { id: 'process', name: 'Process' },
  ];

  // Set default active category to community if available
  useEffect(() => {
    if (userQuestions.length > 0 && activeCategory === 'general') {
      setActiveCategory('community');
    }
  }, [userQuestions, activeCategory]);

  const faqs = {
    general: [
      {
        question: "What services do you offer?",
        answer: "I specialize in a wide range of web development services including custom website development, e-commerce solutions (Shopify, WooCommerce), WordPress sites, web applications, mobile-responsive designs, and performance optimization. My expertise extends to frontend development with modern frameworks like React, Next.js, and backend solutions tailored to your specific needs."
      },
      {
        question: "How long does it take to complete a project?",
        answer: "Project timelines vary based on complexity, scope, and specific requirements. A simple website might take 2-3 weeks, while complex web applications can take 2-3 months or more. During our initial consultation, I'll provide a detailed timeline estimate based on your project's specific needs. I pride myself on delivering projects on schedule without compromising quality."
      },
      {
        question: "Do you work with clients internationally?",
        answer: "Yes! I work with clients worldwide and have successfully completed projects for businesses across North America, Europe, Asia, and Australia. I'm comfortable with remote collaboration and can adapt to different time zones for meetings and communication."
      },
      {
        question: "What makes your services different from other developers?",
        answer: "What sets me apart is my commitment to delivering high-quality, custom solutions that precisely meet your business needs. I focus on creating websites that not only look stunning but also drive results. My approach includes thorough research, performance optimization, SEO best practices, and a strong emphasis on user experience. Additionally, I provide exceptional post-launch support to ensure your continued success."
      }
    ],
    services: [
      {
        question: "Can you redesign my existing website?",
        answer: "Absolutely! Website redesigns are a significant part of my services. I'll analyze your current site, identify areas for improvement, and create a modern, effective design that enhances user experience while preserving your brand identity. The redesign process includes updating the visual design, improving site architecture, enhancing performance, and ensuring mobile responsiveness."
      },
      {
        question: "Do you offer e-commerce development?",
        answer: "Yes, I specialize in e-commerce development using platforms like Shopify, WooCommerce, and custom solutions. I can build a complete online store with secure payment processing, inventory management, shipping integration, and customer account features. My e-commerce solutions are designed to maximize conversions and provide seamless shopping experiences."
      },
      {
        question: "Can you help with SEO and making my site rank better?",
        answer: "While I'm not primarily an SEO specialist, I build all websites with SEO best practices in mind. This includes clean code structure, proper heading hierarchy, optimized image assets, mobile responsiveness, and fast loading times—all factors that improve search engine rankings. For comprehensive SEO campaigns, I can recommend trusted partners who specialize in this area."
      },
      {
        question: "Do you provide website maintenance services?",
        answer: "Yes, I offer website maintenance packages to keep your site secure, updated, and performing optimally. These services include regular software updates, security monitoring, performance optimization, content updates, and technical support. Maintenance packages can be tailored to your specific needs and schedule."
      }
    ],
    pricing: [
      {
        question: "Why do your services cost what they do?",
        answer: "My pricing reflects the value, expertise, and quality of work delivered. Each project is an investment in professional design, development, and strategy that drives business results. The rates account for my specialized technical skills, years of experience, premium-quality code, thorough testing, and ongoing support. Unlike template solutions or low-cost alternatives, I create custom, high-performance websites that are built to last and deliver ROI."
      },
      {
        question: "Do you offer fixed-price quotes or hourly rates?",
        answer: "I offer both fixed-price quotes for well-defined projects and hourly rates for ongoing work or projects with evolving requirements. For most client projects, I prefer fixed-price agreements as they provide budget certainty and allow me to focus on quality rather than watching the clock. My pricing structure is transparent, with no hidden fees or surprises."
      },
      {
        question: "What factors affect the cost of my website?",
        answer: "Several factors influence project costs: complexity (number of pages, features, and functionality), design requirements (custom designs vs. modifications), technical requirements (integrations, e-commerce capability, custom functionality), content needs (copywriting, photography), timeline (rush projects may incur additional costs), and ongoing support requirements. During our consultation, I'll breakdown these factors as they relate to your specific project."
      },
      {
        question: "Do you offer discounts for non-profits or startups?",
        answer: "I occasionally offer special packages for non-profits and early-stage startups that align with my values. While I can't discount my standard rates significantly (as it would compromise the quality and attention each project receives), I can work with you to phase development to fit budgetary constraints or simplify certain aspects while maintaining core functionality and quality."
      }
    ],
    payment: [
      {
        question: "What payment methods do you accept?",
        answer: "I accept various payment methods including credit/debit cards, PayPal, bank transfers, and cryptocurrency payments. For international clients, I can work with you to find the most convenient and cost-effective payment method. All payment details will be clearly outlined in our agreement."
      },
      {
        question: "What is your payment schedule?",
        answer: "For most projects, I require a 50% deposit before work begins, with the remaining 50% due upon project completion but before the final launch. For larger projects, I offer milestone-based payment schedules, typically divided into 3-4 payments linked to specific deliverables. This approach helps distribute costs throughout the project timeline while ensuring steady progress."
      },
      {
        question: "Do you offer payment plans?",
        answer: "Yes, for larger projects I offer flexible payment plans to help manage cash flow. These are typically structured around project milestones and deliverables. We can discuss payment plan options during our consultation to find an arrangement that works for your budget while ensuring project momentum."
      },
      {
        question: "What happens if I'm not satisfied with the work?",
        answer: "Your satisfaction is my priority. All projects include revision rounds as specified in our agreement. If aspects of the delivered work don't meet the agreed-upon requirements, I'll make the necessary revisions at no additional cost. I maintain clear communication throughout the project to ensure expectations are aligned, preventing major discrepancies in the final deliverable."
      }
    ],
    process: [
      {
        question: "What is your development process like?",
        answer: "My development process follows a proven methodology: 1) Discovery and planning (understanding your goals, audience, and requirements), 2) Design (creating wireframes and visual mockups), 3) Development (building the actual website or application), 4) Testing (ensuring everything works properly across devices and browsers), 5) Launch (deploying the site to your server), and 6) Support (providing training and ongoing maintenance). Throughout this process, I emphasize communication and collaboration."
      },
      {
        question: "What information do you need from me to start?",
        answer: "To begin effectively, I'll need: your business information, project goals and objectives, target audience details, brand guidelines (logos, colors, fonts), content (text, images, videos), technical requirements or preferences, examples of websites you like, and any existing website analytics if applicable. The more information provided, the more tailored the solution will be to your specific needs."
      },
      {
        question: "How involved will I need to be during the project?",
        answer: "Your involvement is crucial at key stages: the initial briefing, feedback on designs and prototypes, content provision, and final review before launch. While I handle all technical aspects, your input ensures the end product aligns with your vision. I structure the process to respect your time while ensuring you have visibility and input at critical decision points."
      },
      {
        question: "What happens after my website launches?",
        answer: "After launch, I provide a handover that includes site training, documentation, and technical support to address any immediate issues. I offer various post-launch support options, from maintenance packages to development retainers, ensuring your site continues to perform optimally. I recommend regular maintenance and updates to keep your site secure, functioning well, and aligned with evolving web standards."
      }
    ],
    // Add user-submitted questions to the FAQ data
    community: userQuestions.map(q => ({
      question: q.question,
      answer: q.answer,
      askedBy: q.name,
      isUserSubmitted: true,
      date: q.createdAt
    }))
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');
    
    try {
      const response = await fetch('/api/submit-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          question,
          recipient: 'nexwebs.org@gmail.com',
          subject: 'New Question from NEXDEVS FAQ Page'
        }),
      });
      
      if (response.ok) {
        setSubmitStatus('success');
        setName('');
        setEmail('');
        setQuestion('');
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
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

  return (
    <div className="min-h-screen pt-20 sm:pt-32 pb-16 sm:pb-20 bg-black">
      {/* Header section */}
      <div className="w-full py-10 sm:py-16 mb-8 sm:mb-12 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 flex flex-wrap justify-center items-center gap-2 sm:gap-3 ${audiowide.className}`}>
              <span className="bg-white text-black px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg shadow-purple-500/20 transform -rotate-1">FREQUENTLY</span>
              <span className="text-white">ASKED QUESTIONS</span>
            </h1>
            <p className={`text-base sm:text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mt-4 sm:mt-6 px-2 ${vt323.className}`}>
              Find answers to common questions about my services, process, and payment methods.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Feature newly approved community questions if any */}
      {userQuestions.length > 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 mb-10 sm:mb-16"
        >
          <div className="rounded-xl bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-1">
            <div className="bg-black rounded-lg p-4 sm:p-6">
              <div className="mb-5 sm:mb-6 text-center">
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold text-white inline-flex items-center ${audiowide.className}`}>
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">Recently Answered Questions</span>
                </h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                {userQuestions.slice(0, 2).map((q, index) => (
                  <motion.div
                    key={q.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2 + 0.5 }}
                    className="bg-black/70 border border-white/10 rounded-xl p-4 sm:p-6 hover:border-purple-500/30 transition-all duration-300"
                  >
                    <h3 className={`text-base sm:text-lg font-medium text-white mb-2 sm:mb-3 ${audiowide.className}`}>{q.question}</h3>
                    <p className={`text-gray-300 mb-3 sm:mb-4 text-sm line-clamp-3 sm:line-clamp-4 ${vt323.className}`}>{q.answer}</p>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span className="truncate mr-2">Asked by {q.name}</span>
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                        <span>Recently Answered</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* FAQ Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-10">
          {/* Category Pills for Mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:hidden overflow-x-auto pb-4 flex flex-nowrap gap-2 max-w-full"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-full transition-all duration-300 flex-shrink-0 text-sm ${
                  activeCategory === category.id
                    ? category.id === 'community' 
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium'
                      : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                    : category.id === 'community'
                      ? 'bg-white/5 border border-purple-500/30 text-purple-300 hover:text-white font-medium'
                      : 'bg-white/5 border border-white/10 text-gray-300 hover:text-white'
                }`}
              >
                {category.id === 'community' && (
                  <span className="inline-flex items-center">
                    {category.name}
                    {userQuestions.length > 0 && (
                      <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">
                        {userQuestions.length}
                      </span>
                    )}
                  </span>
                )}
                {category.id !== 'community' && category.name}
              </button>
            ))}
          </motion.div>

          {/* Category Sidebar for Desktop */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:block lg:col-span-1"
          >
            <div className="sticky top-24 bg-black rounded-2xl p-6 border border-white/10">
              <h3 className={`text-xl font-semibold mb-4 text-white ${audiowide.className}`}>Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-all duration-300 ${
                      activeCategory === category.id
                        ? category.id === 'community' 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium'
                          : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                        : category.id === 'community'
                          ? 'hover:bg-white/10 text-purple-300 hover:text-white font-medium'
                          : 'hover:bg-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    {category.id === 'community' && (
                      <span className="inline-flex items-center">
                        {category.name}
                        {userQuestions.length > 0 && (
                          <span className="ml-2 bg-purple-500 text-white text-xs rounded-full px-2 py-0.5">
                            {userQuestions.length}
                          </span>
                        )}
                      </span>
                    )}
                    {category.id !== 'community' && category.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* FAQ Content */}
          <motion.div 
            className="lg:col-span-4 bg-black rounded-2xl p-4 sm:p-6 md:p-8 border border-white/10"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {activeCategory === 'community' && (
              <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-purple-900/20 border border-purple-500/30 rounded-lg">
                <p className={`text-purple-300 text-xs sm:text-sm ${vt323.className}`}>
                  These questions were submitted by our community and personally answered by the NEXDEVS team.
                </p>
              </div>
            )}
            
            <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
              {faqs[activeCategory as keyof typeof faqs].map((faq, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="overflow-hidden"
                >
                  <AccordionItem 
                    value={`item-${index}`} 
                    className={`border overflow-hidden rounded-xl ${
                      'isUserSubmitted' in faq
                        ? 'border-purple-500/30 bg-gradient-to-b from-black to-purple-950/20'
                        : 'border-white/10 bg-black'
                    }`}
                  >
                    <AccordionTrigger className="text-left px-4 sm:px-6 py-3 sm:py-4 hover:no-underline group">
                      <div className="flex items-start justify-between w-full pr-6">
                        <div>
                          <h3 className={`text-base sm:text-lg font-medium group-hover:text-purple-400 transition-colors duration-300 text-white ${audiowide.className}`}>
                            {faq.question}
                          </h3>
                          {'askedBy' in faq && (
                            <div className="flex flex-wrap items-center mt-1">
                              <span className="text-xs text-purple-300 block">Asked by {faq.askedBy}</span>
                              {'date' in faq && (
                                <span className="text-xs text-gray-500 ml-2 block">
                                  • {new Date(faq.date).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <ChevronDown className="h-5 w-5 shrink-0 text-purple-400 transition-transform duration-300 mt-1" />
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 sm:px-6 pb-4 pt-0 text-gray-300">
                      <p className={`leading-relaxed text-sm sm:text-base ${vt323.className}`}>{faq.answer}</p>
                      {'isUserSubmitted' in faq && (
                        <div className="mt-4 pt-3 border-t border-white/10">
                          <span className="text-xs text-purple-300 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Answered by NEXDEVS Team
                          </span>
                        </div>
                      )}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.div>
        </div>
      </div>

      {/* Ask a Question Section */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 mt-16 sm:mt-24"
      >
        <div className="relative rounded-2xl p-5 sm:p-8 border border-white/10 bg-black overflow-hidden">
          {/* Purple gradient background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/10 to-pink-900/10 opacity-30"></div>
          
          <div className="relative z-10">
            <div className="text-center mb-6 sm:mb-10">
              <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 flex items-center justify-center flex-wrap gap-2 ${audiowide.className}`}>
                <span className="text-white">ASK</span>
                <span className="bg-white text-black px-3 sm:px-4 py-1 sm:py-2 rounded-lg transform -rotate-1">YOUR QUESTION</span>
              </h2>
              <p className={`text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-2 ${vt323.className}`}>
                Can't find what you're looking for? Submit your question and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                <div>
                  <label htmlFor="name" className={`block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base ${audiowide.className}`}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base ${vt323.className}`}
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email" className={`block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base ${audiowide.className}`}>
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-sm sm:text-base ${vt323.className}`}
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>
              <div className="mb-5 sm:mb-6">
                <label htmlFor="question" className={`block text-white mb-1 sm:mb-2 font-medium text-sm sm:text-base ${audiowide.className}`}>
                  Your Question
                </label>
                <textarea
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 rounded-lg bg-black border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all min-h-[100px] sm:min-h-[120px] text-sm sm:text-base ${vt323.className}`}
                  placeholder="What would you like to know?"
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg transform transition-all hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-70 text-sm sm:text-base ${audiowide.className}`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Question'}
                </button>
              </div>

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 bg-green-500/20 border border-green-500/30 text-green-400 text-center rounded-lg text-sm ${vt323.className}`}
                >
                  Your question has been submitted successfully! We'll get back to you soon.
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-4 p-3 bg-red-500/20 border border-red-500/30 text-red-400 text-center rounded-lg text-sm ${vt323.className}`}
                >
                  Something went wrong. Please try again or contact us directly.
                </motion.div>
              )}
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 