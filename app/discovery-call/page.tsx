'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Head from 'next/head'
import { useInView } from "react-intersection-observer";

// Declare the Calendly type for TypeScript
declare global {
  interface Window {
    Calendly?: {
      initBadgeWidget: (options: {
        url: string;
        text: string;
        color: string;
        textColor: string;
        branding: boolean;
      }) => void;
    };
  }
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

export default function DiscoveryCallPage() {
  const router = useRouter()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')
  const [projectType, setProjectType] = useState('')
  const [projectDetails, setProjectDetails] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [calendar, setCalendar] = useState<Date[][]>([])
  const [showCalendly, setShowCalendly] = useState(false)
  const [activeTree, setActiveTree] = useState<string | null>(null)
  const calendlyRef = useRef<HTMLDivElement>(null)
  const [isCalendlyLoaded, setIsCalendlyLoaded] = useState(false)
  const mainCalendlyRef = useRef<HTMLDivElement>(null)
  const [calendarLoaded, setCalendarLoaded] = useState(false);
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });
  
  const availableTimeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', 
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'
  ]

  // Close Calendly popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendlyRef.current && !calendlyRef.current.contains(event.target as Node)) {
        setShowCalendly(false)
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [calendlyRef])

  // Load Calendly script and badge widget
  useEffect(() => {
    // Set calendar loaded state for UI purposes immediately
    setIsCalendlyLoaded(true);
    setCalendarLoaded(true);
    
    // Preload Calendly widget when component mounts to make popup faster
    const preloadLink = document.createElement('link');
    preloadLink.rel = 'preload';
    preloadLink.as = 'script';
    preloadLink.href = 'https://assets.calendly.com/assets/external/widget.js';
    document.head.appendChild(preloadLink);
    
    return () => {
      document.head.removeChild(preloadLink);
    }
  }, [])

  // Agency's current projects tree structure
  const currentProjects = [
    {
      id: 'web',
      name: 'Web Development',
      icon: '💻',
      projects: [
        'E-commerce Platform Redesign',
        'SaaS Dashboard Development',
        'Corporate Website Overhaul'
      ]
    },
    {
      id: 'mobile',
      name: 'Mobile Applications',
      icon: '📱',
      projects: [
        'iOS Fitness Tracker',
        'Cross-platform E-learning App',
        'Food Delivery Service App'
      ]
    },
    {
      id: 'ai',
      name: 'AI Integration',
      icon: '🤖',
      projects: [
        'Customer Support Chatbots',
        'Content Recommendation Engine',
        'Predictive Analytics Dashboard'
      ]
    },
    {
      id: 'design',
      name: 'UI/UX Design',
      icon: '🎨',
      projects: [
        'Brand Identity Redesign',
        'User Experience Optimization',
        'Interactive Prototype Development'
      ]
    }
  ]

  // Generate calendar for current month
  useEffect(() => {
    const generateCalendar = () => {
      const year = currentMonth.getFullYear()
      const month = currentMonth.getMonth()
      
      // First day of the month
      const firstDay = new Date(year, month, 1)
      // Last day of the month
      const lastDay = new Date(year, month + 1, 0)
      
      // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
      const firstDayOfWeek = firstDay.getDay()
      
      const daysInMonth = lastDay.getDate()
      
      // Initialize calendar
      const calendarArray: Date[][] = []
      let week: Date[] = []
      
      // Add empty slots for days before the first day of the month
      for (let i = 0; i < firstDayOfWeek; i++) {
        const prevDate = new Date(year, month, -firstDayOfWeek + i + 1)
        week.push(prevDate)
      }
      
      // Fill in the days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day)
        
        week.push(date)
        
        // Start a new week if Sunday or if it's the last day
        if (week.length === 7 || day === daysInMonth) {
          // If the last week isn't complete, pad with next month days
          while (week.length < 7) {
            const nextDate = new Date(year, month, day + (week.length - 6))
            week.push(nextDate)
          }
          
          calendarArray.push(week)
          week = []
        }
      }
      
      setCalendar(calendarArray)
    }
    
    generateCalendar()
  }, [currentMonth])

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    setSelectedDate(null)
    setSelectedTime(null)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
  }

  const isPastDate = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    date.setHours(0, 0, 0, 0)
    return date < today
  }

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isSunday = (date: Date) => {
    return date.getDay() === 0
  }

  const isSelectable = (date: Date) => {
    return isCurrentMonth(date) && !isPastDate(date) && !isSunday(date)
  }

  const handleDateSelect = (date: Date) => {
    if (isSelectable(date)) {
      setSelectedDate(new Date(date))
      setSelectedTime(null)
    }
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const toggleCalendly = () => {
    setShowCalendly(!showCalendly)
  }

  const toggleTreeItem = (id: string) => {
    if (activeTree === id) {
      setActiveTree(null)
    } else {
      setActiveTree(id)
    }
  }

  // ESC key handler
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && showCalendly) {
        toggleCalendly();
      }
    };
    
    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [showCalendly, toggleCalendly]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedDate || !selectedTime || !userName || !userEmail || !projectType) {
      alert('Please fill in all required fields')
      return
    }
    
    setIsSubmitting(true)
    
    // Format selected date for form submission
    const formattedDate = selectedDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    try {
      // Simulate API call - replace with your actual API endpoint
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Show success message
      setIsSubmitted(true)
      
      // Reset form after successful submission
      setTimeout(() => {
        router.push('/')
      }, 3000)
    } catch (error) {
      console.error('Error scheduling call:', error)
      alert('An error occurred while scheduling your call. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>NEX-DEVS | Schedule Your Discovery Call</title>
        <meta name="description" content="Schedule a 30-minute discovery call with NEX-DEVS to discuss your project requirements and explore potential solutions." />
        <link rel="icon" href="/icons/favicon.svg" type="image/svg+xml" />
        <link rel="icon" href="/icons/favicon-192.png" type="image/png" sizes="192x192" />
        <link rel="icon" href="/icons/favicon-512.png" type="image/png" sizes="512x512" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
        
        {/* Preload Calendly resources for faster popup loading */}
        <link rel="preload" href="https://assets.calendly.com/assets/external/widget.js" as="script" />
        <link rel="preload" href="https://assets.calendly.com/assets/external/widget.css" as="style" />
        
        {/* Calendly badge widget begin */}
        <link href="https://assets.calendly.com/assets/external/widget.css" rel="stylesheet" />
        <script src="https://assets.calendly.com/assets/external/widget.js" type="text/javascript" async></script>
        
        {/* Custom CSS for Calendly integration */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Custom scrollbar for webkit browsers */
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: #1f2937;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background-color: #374151;
            border-radius: 20px;
          }
          
          /* Calendly widget styles */
          .calendly-inline-widget {
            background-color: #111827 !important;
            color: #ffffff !important;
          }
          
          /* Custom animations */
          @keyframes shimmer {
            0% { background-position: -200% center; }
            100% { background-position: 200% center; }
          }
          .animate-shimmer {
            animation: shimmer 3s ease-in-out infinite;
          }
          
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 6s linear infinite;
          }
          
          @keyframes float-smooth {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-15px); }
            100% { transform: translateY(0px); }
          }
          .animate-float-smooth {
            animation: float-smooth 6s ease-in-out infinite;
          }
          
          @keyframes glow {
            0% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
            50% { box-shadow: 0 0 20px rgba(147, 51, 234, 0.8); }
            100% { box-shadow: 0 0 5px rgba(147, 51, 234, 0.5); }
          }
          .animate-glow {
            animation: glow 3s ease-in-out infinite;
          }
        `}} />
        
        <script type="text/javascript" dangerouslySetInnerHTML={{ __html: `
          window.onload = function() { 
            Calendly.initBadgeWidget({ 
              url: 'https://calendly.com/nexdevs-org', 
              text: 'Schedule time with me', 
              color: '#0069ff', 
              textColor: '#ffffff', 
              branding: true 
            });
          }
        `}} />
        {/* Calendly badge widget end */}
      </Head>
      
      <main className="min-h-screen bg-black text-white py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto pt-16 sm:pt-20 mt-0">
          {/* Header */}
          <motion.div 
            className="text-center mb-8 sm:mb-12 px-2 pt-4"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-violet-600 mb-4 sm:mb-6">
              Schedule a Discovery Call
            </h1>
            <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto">
              Let's discuss your project and see how we can help bring your vision to life.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="flex justify-center gap-4 mb-8"
          >
            <Link 
              href="/contact"
              className="px-6 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white font-medium shadow-lg shadow-purple-600/30 hover:shadow-purple-600/50 transition-all flex items-center gap-2 group"
            >
              <svg className="h-5 w-5 group-hover:rotate-12 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Complete Project Brief
            </Link>
            <button
              onClick={toggleCalendly}
              className="px-6 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 text-white font-medium shadow-lg shadow-gray-900/40 transition-all flex items-center gap-2"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 13.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M15.6947 16.7H15.7037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 13.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M11.9955 16.7H12.0045" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 13.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8.29431 16.7H8.30329" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Full Calendar View
            </button>
          </motion.div>

          {/* Important Notice Box - More visible and concise */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 bg-gradient-to-r from-purple-900/50 to-violet-900/50 border-l-4 border-purple-500 rounded-lg p-4 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-1">
              <div className="bg-purple-600 rounded-full p-1.5 flex-shrink-0">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-white">Important Information</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed pl-9">
              This calendar is exclusively for scheduling initial discovery calls. For comprehensive project details and to secure your spot in our development pipeline, please <Link href="/contact" className="text-purple-400 hover:text-purple-300 underline underline-offset-2 font-medium">complete our detailed project brief</Link>.
            </p>
          </motion.div>

          {/* Live Calendly Widget */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-2xl shadow-black/20"
          >
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 w-8 h-8 rounded-full flex items-center justify-center">
                  <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                    <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">Schedule with NEX-DEVS</h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-green-400 flex items-center">
                  <span className="h-2 w-2 bg-green-400 rounded-full mr-1.5 animate-pulse"></span>
                  Available Now
                </span>
                <div className="flex space-x-2">
                  <Link
                    href="/contact"
                    className="bg-gray-800 py-1.5 px-3 rounded-md text-sm font-medium text-white hover:bg-gray-700 transition-all"
                  >
                    Contact
                  </Link>
                <button 
                  onClick={toggleCalendly} 
                  className="bg-gradient-to-r from-purple-600 to-violet-600 py-1.5 px-3 rounded-md text-sm font-medium text-white shadow-md shadow-purple-900/30 hover:opacity-90 transition-all"
                >
                  Full View
                </button>
              </div>
            </div>
            </div>
            <div className="grid md:grid-cols-5 gap-4 p-6">
              {/* Workflow Information */}
              <div className="md:col-span-3 space-y-6">
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="text-lg font-medium text-white mb-2">My Availability</h3>
                  <p className="text-gray-300 text-sm mb-3">I'm currently available for new projects and consultations with the following schedule:</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-900/70 rounded-md p-3 border border-gray-700/30">
                      <div className="flex items-center mb-1.5">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm font-medium text-white">Most Available</span>
                      </div>
                      <p className="text-xs text-gray-400">Monday - Wednesday</p>
                      <p className="text-xs text-gray-400">9:00 AM - 4:00 PM EST</p>
                    </div>
                    
                    <div className="bg-gray-900/70 rounded-md p-3 border border-gray-700/30">
                      <div className="flex items-center mb-1.5">
                        <div className="h-2 w-2 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm font-medium text-white">Limited Availability</span>
                      </div>
                      <p className="text-xs text-gray-400">Thursday - Friday</p>
                      <p className="text-xs text-gray-400">10:00 AM - 2:00 PM EST</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center">
                    <button 
                      onClick={toggleCalendly}
                      className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                    >
                      <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                      See My Calendar
                    </button>
                </div>
                </div>
                
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/50">
                  <h3 className="text-lg font-medium text-white mb-2">My Work Process</h3>
                  <div className="space-y-3">
                    <div className="flex">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center mr-3 text-xs font-bold">1</div>
                      <div>
                        <h4 className="text-white font-medium">Discovery Call</h4>
                        <p className="text-sm text-gray-300">We'll discuss your project needs and goals in a 30-minute meeting</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center mr-3 text-xs font-bold">2</div>
                      <div>
                        <h4 className="text-white font-medium">Proposal & Planning</h4>
                        <p className="text-sm text-gray-300">I'll prepare a detailed proposal with timeline and cost estimates</p>
                      </div>
                    </div>
                    <div className="flex">
                      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-purple-600 flex items-center justify-center mr-3 text-xs font-bold">3</div>
                      <div>
                        <h4 className="text-white font-medium">Development</h4>
                        <p className="text-sm text-gray-300">Regular updates and milestone reviews during implementation</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Animated Schedule Visualization */}
              <div className="md:col-span-2">
                <div className="h-full bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden relative">
                  {/* Calendar background pattern */}
                  <div className="absolute inset-0 opacity-10 bg-repeat" style={{ 
                    backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
                  }}></div>
                  
                  {/* Animated floating elements */}
                  <div className="absolute top-12 right-5 w-8 h-8 rounded-lg border-2 border-purple-500/20 animate-float opacity-30 z-[1]"></div>
                  <div className="absolute bottom-20 left-10 w-6 h-6 rounded-full border border-violet-500/20 animate-spin-slow opacity-20 z-[1]"></div>
                  <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-purple-600/10 rounded-sm animate-pulse-slow z-[1]"></div>
                  <div className="absolute bottom-1/3 right-1/4 w-10 h-5 border border-blue-500/20 rounded-md animate-float-smooth opacity-20 z-[1]"></div>
                  
                  {/* Paper document icon floating */}
                  <div className="absolute top-10 left-8 opacity-20 animate-float z-[1]">
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  
                  {/* Clock icon floating */}
                  <div className="absolute bottom-24 right-10 opacity-20 animate-float-smooth z-[1]" style={{ animationDelay: "1s" }}>
                    <svg className="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  
                  {/* Calendar icon floating */}
                  <div className="absolute top-1/2 right-12 opacity-20 animate-float z-[1]" style={{ animationDelay: "2s" }}>
                    <svg className="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  
                  {/* Header */}
                  <div className="relative z-10 bg-gradient-to-r from-purple-900/40 to-violet-900/40 p-3 text-center border-b border-gray-700/50">
                    <h3 className="font-medium text-white">Weekly Schedule</h3>
                  </div>
                  
                  {/* Animated schedule visualization */}
                  <div className="relative z-10 p-4">
                    <div className="mb-6 flex flex-col">
                      <div className="text-center mb-2">
                        <span className="text-sm font-semibold text-purple-300">Daily Activity Levels</span>
                      </div>
                      
                      {/* Activity bars - animated */}
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Monday</span>
                            <span>High Availability</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full animate-pulse" style={{width: '80%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Tuesday</span>
                            <span>Medium Availability</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full animate-pulse-slow" style={{width: '60%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Wednesday</span>
                            <span>High Availability</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full animate-pulse" style={{width: '70%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Thursday</span>
                            <span>Limited Availability</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full animate-pulse-slow" style={{width: '40%'}}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Friday</span>
                            <span>Limited Availability</span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full animate-pulse" style={{width: '30%'}}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Busy hours visualization - animated clock */}
                    <div className="mt-6 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-semibold text-purple-300">Peak Working Hours</span>
                        <div className="flex items-center">
                          <div className="h-2 w-2 bg-purple-500 rounded-full animate-ping mr-1"></div>
                          <span className="text-xs text-gray-400">Active Now</span>
                        </div>
                      </div>
                      
                      <div className="flex justify-center">
                        <div className="relative w-32 h-32 flex items-center justify-center">
                          {/* Clock face with precise hour markers */}
                          <div className="absolute inset-0 rounded-full border-2 border-gray-700"></div>
                          
                          {/* Hour numbers */}
                          {[...Array(12)].map((_, i) => {
                            const hour = i + 1;
                            const angle = (hour * 30 - 90) * (Math.PI / 180);
                            const radius = 48; // Slightly smaller than clock radius for better positioning
                            const x = Math.cos(angle) * radius;
                            const y = Math.sin(angle) * radius;
                            return (
                              <div
                                key={hour}
                                className="absolute text-[10px] font-medium text-gray-400"
                                style={{
                                  transform: `translate(${x}px, ${y}px)`,
                                  width: '16px',
                                  height: '16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                              >
                                {hour}
                              </div>
                            );
                          })}
                          
                          {/* Minute markers */}
                          {[...Array(60)].map((_, i) => {
                            if (i % 5 !== 0) { // Skip positions where numbers are
                              const angle = (i * 6 - 90) * (Math.PI / 180);
                              const radius = 56; // Outer radius for minute markers
                              const x = Math.cos(angle) * radius;
                              const y = Math.sin(angle) * radius;
                              return (
                                <div
                                  key={i}
                                  className="absolute w-0.5 h-0.5 bg-gray-600 rounded-full"
                                  style={{
                                    transform: `translate(${x}px, ${y}px)`
                                  }}
                                />
                              );
                            }
                            return null;
                          })}

                          {/* Spinning inner accent circle */}
                          <div className="absolute inset-2 rounded-full border border-purple-500/20 animate-spin-slow"></div>
                          
                          {/* Digital time display */}
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-mono bg-gray-800/90 text-white px-2 py-0.5 rounded-md border border-gray-700/50 w-20 text-center">
                            {new Date().getHours().toString().padStart(2, '0')}:
                            {new Date().getMinutes().toString().padStart(2, '0')}:
                            {new Date().getSeconds().toString().padStart(2, '0')}
                          </div>
                          
                          {/* Busy time indicators */}
                          <div className="absolute inset-0">
                            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                              <path 
                                d="M50,50 L50,10 A40,40 0 0,1 90,50 Z" 
                                fill="rgba(139, 92, 246, 0.2)"
                                className="animate-pulse-slow"
                              />
                            </svg>
                          </div>
                          
                          {/* Clock hands with smooth movement */}
                          <div 
                            className="absolute w-[2px] h-[40%] bg-gradient-to-b from-purple-400 to-purple-600 rounded-full origin-bottom" 
                            style={{ 
                              transform: `rotate(${(new Date().getHours() % 12) * 30 + new Date().getMinutes() * 0.5}deg)`,
                              transformOrigin: 'bottom center',
                              bottom: '50%',
                              transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
                            }}
                          />
                          <div 
                            className="absolute w-[1px] h-[45%] bg-gradient-to-b from-blue-400 to-blue-600 rounded-full origin-bottom"
                            style={{ 
                              transform: `rotate(${new Date().getMinutes() * 6 + new Date().getSeconds() * 0.1}deg)`,
                              transformOrigin: 'bottom center',
                              bottom: '50%',
                              transition: 'transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
                            }}
                          />
                          <div 
                            className="absolute w-[1px] h-[48%] bg-red-500 rounded-full origin-bottom"
                            style={{ 
                              transform: `rotate(${new Date().getSeconds() * 6}deg)`,
                              transformOrigin: 'bottom center',
                              bottom: '50%',
                              transition: 'transform 0.2s cubic-bezier(0.4, 2.08, 0.55, 0.44)'
                            }}
                          />
                          
                          {/* Center dot with layered design */}
                          <div className="absolute w-4 h-4 rounded-full bg-gray-800 border-2 border-purple-500 z-20">
                            <div className="absolute inset-0.5 rounded-full bg-purple-400 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Calendar appointments visualization */}
                    <div className="mt-6 mb-4">
                      <h4 className="text-sm font-semibold text-purple-300 mb-2">Next Appointments</h4>
                      <div className="space-y-2">
                        <div className="bg-gray-900/80 rounded-md p-2 border border-gray-700/50 flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-purple-900/50 flex items-center justify-center mr-2 flex-shrink-0">
                              <svg className="h-4 w-4 text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-white">Discovery Call</p>
                              <p className="text-[10px] text-gray-400">Project Discussion</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-white">Today</p>
                            <p className="text-[10px] text-purple-400">2:00 PM</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-900/80 rounded-md p-2 border border-gray-700/50 flex items-center justify-between opacity-60">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-md bg-blue-900/50 flex items-center justify-center mr-2 flex-shrink-0">
                              <svg className="h-4 w-4 text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-white">Project Review</p>
                              <p className="text-[10px] text-gray-400">Weekly Status Update</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-medium text-white">Tomorrow</p>
                            <p className="text-[10px] text-blue-400">10:00 AM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Next available slot */}
                    <div className="mt-4 px-3 py-2.5 bg-gray-900/70 rounded-lg border border-purple-500/20 flex items-center justify-between animate-glow">
                      <div className="flex items-center">
                        <svg className="h-4 w-4 text-green-500 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div>
                          <span className="text-xs text-gray-300">Next Available Slot</span>
                          <div className="flex items-center">
                            <span className="text-xs font-medium text-white">Today at 2:00pm</span>
                            <span className="ml-1 text-[10px] px-1.5 py-0.5 bg-green-900/30 text-green-400 rounded">
                              In {Math.floor((new Date(new Date().setHours(14, 0, 0, 0)).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h {Math.floor(((new Date(new Date().setHours(14, 0, 0, 0)).getTime() - new Date().getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Schedule button */}
                  <div className="relative z-10 p-3 border-t border-gray-700/50 bg-gradient-to-r from-gray-900/50 to-gray-800/50">
                    <button
                      onClick={toggleCalendly}
                      className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-600/20"
                    >
                      Schedule a Time
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-800">
              <div className="flex items-center gap-4">
                <div className="text-xs font-medium px-2.5 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300">
                  30 min
                </div>
                <div className="text-xs font-medium text-gray-400">
                  Next available: <span className="text-white">Today at 2:00pm</span>
                </div>
              </div>
              <Link 
                href="/contact" 
                className="text-xs font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
              >
                Need more details? <span className="underline">Complete brief</span>
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
              </Link>
            </div>
          </motion.div>
          
          {/* Google Meet Integration Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-16 bg-gradient-to-br from-gray-900 to-gray-950 border border-gray-800 rounded-xl overflow-hidden shadow-2xl shadow-black/20"
          >
            <div className="grid md:grid-cols-2 gap-0">
              <div className="p-8 flex flex-col justify-center">
                <div className="flex items-center mb-5">
                  <div className="bg-gradient-to-r from-blue-500 to-cyan-500 w-10 h-10 rounded-lg flex items-center justify-center mr-4 shadow-lg shadow-blue-600/20">
                    <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                      <rect x="3" y="6" width="12" height="12" rx="2" ry="2" />
              </svg>
          </div>
                  <h2 className="text-2xl font-bold text-white">Google Meet <span className="text-sm ml-2 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 font-medium">Integrated</span></h2>
                  </div>
                
                <h3 className="text-lg font-semibold text-white mb-3">Seamless Video Conferencing</h3>
                <p className="text-gray-300 mb-6">Every discovery call is conducted through Google Meet, providing you with a secure, reliable, and feature-rich video conferencing experience with no downloads required.</p>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center mb-2">
                      <svg className="h-4 w-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <h4 className="font-medium text-white">Instant Access</h4>
                  </div>
                    <p className="text-xs text-gray-400">Link sent immediately after booking via email</p>
                </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center mb-2">
                      <svg className="h-4 w-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14v6m-3-3h6M6 10h2a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2zm10 0h2a2 2 0 002-2V6a2 2 0 00-2-2h-2a2 2 0 00-2 2v2a2 2 0 002 2zM6 20h2a2 2 0 002-2v-2a2 2 0 00-2-2H6a2 2 0 00-2 2v2a2 2 0 002 2z" />
                </svg>
                      <h4 className="font-medium text-white">Screen Sharing</h4>
              </div>
                    <p className="text-xs text-gray-400">Share designs, mockups and project demos</p>
                        </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center mb-2">
                      <svg className="h-4 w-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                      <h4 className="font-medium text-white">Live Chat</h4>
                      </div>
                    <p className="text-xs text-gray-400">Share links and references during the call</p>
                    </div>
                    
                  <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-center mb-2">
                      <svg className="h-4 w-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.63-3.07 19.79 19.79 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                      </svg>
                      <h4 className="font-medium text-white">Secure Connection</h4>
                        </div>
                    <p className="text-xs text-gray-400">End-to-end encryption for all meetings</p>
                    </div>
                            </div>
                
                <div className="flex justify-center md:justify-start">
                            <button
                    onClick={toggleCalendly}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-blue-600/20 flex items-center gap-2"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Schedule Your Meeting
                            </button>
                        </div>
                </div>
                
              <div className="hidden md:flex items-center justify-center p-8 bg-gradient-to-br from-gray-900/80 to-gray-950">
                <div className="w-full max-w-md aspect-video bg-gradient-to-br from-blue-900/30 to-cyan-900/30 rounded-xl border border-blue-500/20 shadow-2xl shadow-blue-600/10 flex flex-col items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('https://lh3.googleusercontent.com/TyuUCQNzXvYQYUy_EbhJkwNDspspF-jRNyihzVLhfP9_yxdDP9i-8xCFe0W-rWJ9JQYH42UKdnBCIw=w1920-h1080-p')] bg-cover bg-center opacity-5"></div>
                  
                  <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mb-5 shadow-lg shadow-blue-600/30 z-10">
                    <svg className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14v-4z" />
                      <rect x="3" y="6" width="12" height="12" rx="2" ry="2" />
                    </svg>
                      </div>
                      
                  <h3 className="text-xl font-bold text-white mb-2 z-10">Google Meet Ready</h3>
                  <p className="text-sm text-gray-300 text-center max-w-xs z-10">All discovery calls are conducted via Google Meet for a seamless experience on any device</p>
                  
                  <div className="mt-6 grid grid-cols-3 gap-3 z-10">
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 7l-7 5 7 5V7z" />
                        <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                      </svg>
                      </div>
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                      <svg className="h-5 w-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                        <line x1="12" y1="19" x2="12" y2="23" />
                        <line x1="8" y1="23" x2="16" y2="23" />
                      </svg>
                      </div>
                    <div className="w-10 h-10 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                              </svg>
                    </div>
                      </div>
                      
                  <div className="absolute bottom-4 left-4 flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-1.5"></div>
                    <span className="text-xs text-green-400">Ready to connect</span>
                      </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Grid Layout - Enhanced Calendar with Contact Button - REPLACED WITH A MORE STREAMLINED VERSION */}
          {/* REMOVED DUPLICATED CALENDAR SECTION */}
          
          {/* Calendar Grid View Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-12 bg-gray-900 border border-gray-800 p-6 rounded-xl overflow-hidden shadow-lg shadow-black/20"
          >
            <h2 className="text-xl font-bold mb-6 text-white flex items-center">
              <svg className="h-5 w-5 mr-2 text-purple-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Our Weekly Availability
            </h2>
            
            <div className="p-3 bg-gray-800 rounded-lg mb-6 flex items-center">
              <svg className="h-5 w-5 text-purple-400 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-gray-300">
                Below you can see our weekly availability. Click <span onClick={toggleCalendly} className="text-purple-400 font-medium cursor-pointer hover:underline">View Full Calendar</span> to schedule your discovery call.
              </p>
            </div>
            
            <div className="aspect-video max-h-[400px] w-full bg-gray-800/50 rounded-lg mb-6 overflow-hidden shadow-lg shadow-black/30 border border-gray-700/50">
              <div className="grid grid-cols-7 h-12 border-b border-gray-700/70 text-xs font-medium text-gray-400">
                <div className="flex items-center justify-center border-r border-gray-700/70">SUN</div>
                <div className="flex items-center justify-center border-r border-gray-700/70">MON</div>
                <div className="flex items-center justify-center border-r border-gray-700/70">TUE</div>
                <div className="flex items-center justify-center border-r border-gray-700/70">WED</div>
                <div className="flex items-center justify-center border-r border-gray-700/70">THU</div>
                <div className="flex items-center justify-center border-r border-gray-700/70">FRI</div>
                <div className="flex items-center justify-center">SAT</div>
              </div>
              
              <div className="h-full grid grid-cols-7 grid-rows-4 relative">
                {/* Time indicators */}
                <div className="absolute left-0 w-full border-t border-gray-700/50" style={{ top: '25%' }}>
                  <span className="absolute -top-2.5 -left-2 text-[10px] text-gray-500 bg-gray-800/90 px-1">12 PM</span>
                </div>
                <div className="absolute left-0 w-full border-t border-gray-700/50" style={{ top: '50%' }}>
                  <span className="absolute -top-2.5 -left-2 text-[10px] text-gray-500 bg-gray-800/90 px-1">3 PM</span>
                </div>
                <div className="absolute left-0 w-full border-t border-gray-700/50" style={{ top: '75%' }}>
                  <span className="absolute -top-2.5 -left-2 text-[10px] text-gray-500 bg-gray-800/90 px-1">6 PM</span>
                </div>
                
                {/* Grid lines */}
                <div className="col-start-1 row-span-4 h-full border-r border-gray-700/30"></div>
                <div className="col-start-2 row-span-4 h-full border-r border-gray-700/30"></div>
                <div className="col-start-3 row-span-4 h-full border-r border-gray-700/30"></div>
                <div className="col-start-4 row-span-4 h-full border-r border-gray-700/30"></div>
                <div className="col-start-5 row-span-4 h-full border-r border-gray-700/30"></div>
                <div className="col-start-6 row-span-4 h-full border-r border-gray-700/30"></div>
                
                {/* Current time indicator */}
                <div className="absolute left-0 w-full border-t-2 border-purple-500/70 z-10" style={{ top: '42%' }}>
                  <div className="absolute -left-1 -top-1.5 h-3 w-3 rounded-full bg-purple-500/70"></div>
                </div>
                
                {/* Appointments */}
                <div className="absolute top-[15%] left-[14.3%] w-[14.1%] h-[10%] bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-sm cursor-pointer hover:bg-purple-500/30 transition-colors group">
                  <div className="text-[9px] text-purple-300 px-1 truncate">9:00 AM Meeting</div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/70 text-[8px] text-white font-medium">View Details</div>
                </div>
                <div className="absolute top-[38%] left-[42.9%] w-[14.1%] h-[10%] bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-sm cursor-pointer hover:bg-purple-500/30 transition-colors group">
                  <div className="text-[9px] text-purple-300 px-1 truncate">2:00 PM Call</div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/70 text-[8px] text-white font-medium">View Details</div>
                </div>
                <div className="absolute top-[60%] left-[71.5%] w-[14.1%] h-[10%] bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-sm cursor-pointer hover:bg-purple-500/30 transition-colors group">
                  <div className="text-[9px] text-purple-300 px-1 truncate">4:30 PM Client</div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/70 text-[8px] text-white font-medium">View Details</div>
                </div>
                <div className="absolute top-[80%] left-[28.6%] w-[14.1%] h-[10%] bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 rounded-sm cursor-pointer hover:bg-purple-500/30 transition-colors group">
                  <div className="text-[9px] text-purple-300 px-1 truncate">7:00 PM Meeting</div>
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900/70 text-[8px] text-white font-medium">View Details</div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center">
              <button 
                onClick={toggleCalendly}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-violet-600 text-white font-medium hover:opacity-90 transition-all shadow-lg shadow-purple-600/20 flex items-center btn-glow"
              >
                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M19.21 15.77L15.6701 19.31C15.5301 19.45 15.4 19.71 15.37 19.9L15.18 21.25C15.11 21.74 15.45 22.0801 15.94 22.0101L17.29 21.82C17.48 21.79 17.75 21.66 17.88 21.52L21.4201 17.9801C22.0301 17.3701 22.3201 16.6601 21.4201 15.7601C20.5301 14.8701 19.82 15.1601 19.21 15.77Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M18.7 16.28C19 17.36 19.84 18.2 20.92 18.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5V12" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                View Full Calendar
              </button>
            </div>
          </motion.div>
          
          {/* Current Projects Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg shadow-black/20"
          >
            <h2 className="text-xl font-bold mb-6 text-white">Current Projects We're Working On</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Web Development Projects */}
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-800 p-3 font-medium flex items-center">
                  <span className="mr-2">💻</span>
                  Web Development
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-300">E-commerce Platform Redesign</p>
                      <p className="text-xs text-gray-500">Modernizing UI/UX with improved conversion flows</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-300">SaaS Dashboard Development</p>
                      <p className="text-xs text-gray-500">Building intuitive admin interfaces with real-time data</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Mobile App Projects */}
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-800 p-3 font-medium flex items-center">
                  <span className="mr-2">📱</span>
                  Mobile Applications
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-300">Cross-platform Fitness Tracker</p>
                      <p className="text-xs text-gray-500">React Native app with health API integrations</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-300">Food Delivery Service App</p>
                      <p className="text-xs text-gray-500">Location-based services with real-time tracking</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* AI and Design Projects in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {/* AI Integration Projects */}
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-800 p-3 font-medium flex items-center">
                  <span className="mr-2">🤖</span>
                  AI Integration
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-300">Customer Support Chatbots</p>
                      <p className="text-xs text-gray-500">AI-powered assistance with natural language processing</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-300">Content Recommendation Engine</p>
                      <p className="text-xs text-gray-500">Personalized suggestions based on user behavior</p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* UI/UX Design Projects */}
              <div className="border border-gray-800 rounded-lg overflow-hidden">
                <div className="bg-gray-800 p-3 font-medium flex items-center">
                  <span className="mr-2">🎨</span>
                  UI/UX Design
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-300">Brand Identity Redesign</p>
                      <p className="text-xs text-gray-500">Comprehensive brand refresh for digital platforms</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mt-1.5 mr-2 flex-shrink-0"></span>
                    <div>
                      <p className="text-gray-300">User Experience Optimization</p>
                      <p className="text-xs text-gray-500">Improving conversions through enhanced UX flows</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              
            {/* Agency Info */}
            <div className="mt-8 p-4 bg-gray-800 rounded-lg">
              <div className="flex items-center mb-3">
                <div className="bg-gradient-to-r from-purple-600 to-violet-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                  <Image 
                    src="/icons/favicon.svg" 
                    alt="NEX-DEVS Logo"
                    width={20}
                    height={20}
                  />
                </div>
                <h3 className="text-lg font-medium">About NEX-DEVS</h3>
              </div>
              <p className="text-gray-300 text-sm">
                Our team specializes in creating custom digital experiences that transform businesses. 
                With over 5 years of industry experience, we've delivered more than 100 successful projects 
                for clients ranging from startups to established enterprises.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-gray-300">10+ Skilled Developers</span>
                </div>
                <div className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-gray-300">24/7 Support Team</span>
                </div>
                <div className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-gray-300">95% Client Satisfaction</span>
                </div>
                <div className="flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-purple-500 mr-2"></span>
                  <span className="text-gray-300">Global Client Base</span>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Easter Eggs Section */}
          <div className="fixed bottom-4 right-4">
            <div className="flex items-center bg-gray-900 py-2 px-4 rounded-full shadow-lg border border-gray-800">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-red-500 mr-2">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
              <span className="text-white font-medium">Easter Eggs: 0/6</span>
            </div>
          </div>

          {/* Calendly Popup */}
          {showCalendly && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-auto" style={{ paddingTop: "5rem" }}>
              <div 
                ref={calendlyRef}
                className="bg-gray-900 rounded-xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-hidden border border-gray-800 animate-reveal relative"
              >
                {/* Loading Progress Bar - always visible during loading */}
                {!isCalendlyLoaded && (
                  <div className="absolute top-0 left-0 w-full z-50">
                    <div className="h-1.5 bg-gray-800 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 animate-shimmer" 
                        style={{ backgroundSize: '200% 100%', width: '100%' }}></div>
                    </div>
                    <div className="absolute top-[calc(50%-60px)] left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-900/95 px-6 py-4 rounded-xl border border-gray-700 flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full border-4 border-blue-600 border-t-transparent animate-spin mb-3"></div>
                      <p className="text-white font-medium mb-1">Loading Calendar</p>
                      <p className="text-xs text-gray-400 mb-3">Please wait while we connect to Calendly</p>
                      <div className="w-48 h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full animate-shimmer" 
                          style={{ backgroundSize: '200% 100%', width: '85%' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-between items-center p-4 border-b border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                        <path d="M8 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M16 2V5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.5 9.09H20.5" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M21 8.5V17C21 20 19.5 22 16 22H8C4.5 22 3 20 3 17V8.5C3 5.5 4.5 3.5 8 3.5H16C19.5 3.5 21 5.5 21 8.5Z" stroke="currentColor" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold">Schedule with NEX-DEVS</h3>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="hidden sm:flex text-xs bg-gray-800 px-2 py-1 rounded-md text-gray-300">
                      Press <kbd className="px-1.5 py-0.5 bg-gray-700 rounded mx-1 text-xs">ESC</kbd> to close
                    </span>
                    <button 
                      onClick={toggleCalendly} 
                      className="text-gray-400 hover:text-white transition-colors rounded-full p-1.5 hover:bg-gray-800"
                      aria-label="Close calendar"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-3 h-[75vh]">
                  {/* Left sidebar - with scroll for buttons */}
                  <div className="md:flex flex-col border-r border-gray-800 relative overflow-hidden hidden">
                    <div className="h-full overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900 p-5 scroll-smooth" style={{ scrollBehavior: 'smooth' }}>
                      {/* Animated calendar background elements */}
                      <div className="absolute top-20 right-5 w-16 h-16 rounded-lg border-2 border-purple-500/30 animate-float-smooth opacity-30 pointer-events-none"></div>
                      <div className="absolute bottom-20 left-10 w-12 h-12 rounded-full border-2 border-violet-500/20 animate-spin-slow opacity-20 pointer-events-none"></div>
                      <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-purple-600/10 rounded-md animate-pulse-slow pointer-events-none"></div>
                      
                    <div className="bg-gradient-to-br from-purple-900/40 to-violet-900/40 rounded-lg p-4 mb-4 border border-gray-800">
                      <h4 className="text-lg font-bold text-white mb-2">Discovery Call</h4>
                      <div className="flex items-center mb-3">
                        <svg className="h-4 w-4 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-300">30 Minutes</span>
                      </div>
                      <div className="flex items-center mb-3">
                        <svg className="h-4 w-4 text-purple-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <span className="text-sm text-gray-300">One-on-One</span>
                      </div>
                      
                      {/* Enhanced Real-time Next Available Section */}
                      <div className="bg-gray-800/70 p-4 rounded-lg border border-gray-700/50 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10 animate-pulse-slow"></div>
                        <div className="relative z-10">
                          <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2"></div>
                              <span className="text-sm font-medium text-white">Next Available</span>
                            </div>
                            <span className="text-sm font-medium text-green-400">Today</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-2xl font-bold text-white">2:00 PM</span>
                            <span className="text-sm text-gray-400">
                              in {Math.floor((new Date(new Date().setHours(14, 0, 0, 0)).getTime() - new Date().getTime()) / (1000 * 60 * 60))}h {Math.floor(((new Date(new Date().setHours(14, 0, 0, 0)).getTime() - new Date().getTime()) % (1000 * 60 * 60)) / (1000 * 60))}m
                            </span>
                          </div>
                          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full animate-shimmer" 
                              style={{ 
                                width: `${100 - (((new Date(new Date().setHours(14, 0, 0, 0)).getTime() - new Date().getTime()) / (1000 * 60 * 60)) * 8.33)}%`,
                                backgroundSize: '200% 100%'
                              }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-6 space-y-3">
                        <Link 
                          href="/contact" 
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-purple-600/20"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                          BRIEF DESCRIPTION
                        </Link>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-semibold text-gray-400 uppercase mb-3">What to expect</h4>
                    <ul className="space-y-3 text-sm text-gray-300 mb-6">
                      <li className="flex">
                        <span className="bg-purple-500/20 text-purple-300 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">1</span>
                        <span>Initial consultation about your project requirements</span>
                      </li>
                      <li className="flex">
                        <span className="bg-purple-500/20 text-purple-300 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">2</span>
                        <span>Discussion of potential solutions and approaches</span>
                      </li>
                      <li className="flex">
                        <span className="bg-purple-500/20 text-purple-300 rounded-full h-5 w-5 flex items-center justify-center mr-2 flex-shrink-0">3</span>
                        <span>Timeline and budget expectations overview</span>
                      </li>
                    </ul>
                    
                      {/* Animated upcoming availability indicator */}
                      <div className="bg-gray-800/70 p-3 rounded-lg border border-gray-700/50 animate-pulse-slow">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-400">Next Available</span>
                          <span className="font-semibold text-white">Today at 2:00pm</span>
                        </div>
                        <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 rounded-full animate-shimmer" 
                            style={{ 
                              width: `${100 - (((new Date(new Date().setHours(14, 0, 0, 0)).getTime() - new Date().getTime()) / (1000 * 60 * 60)) * 8.33)}%`,
                              backgroundSize: '200% 100%'
                            }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Calendly Button moved here */}
                      <div className="mt-6 pt-4">
                        <button
                          className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-blue-600/20"
                          onClick={() => {
                            window.open('https://calendly.com/nexdevs-org', '_blank');
                          }}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                          Schedule Now
                        </button>
                    </div>
                  </div>
                  
                    {/* Scroll indicator */}
                    <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none"></div>
                  </div>
                  
                  {/* Right side - Calendly Widget */}
                  <div className="md:col-span-2 h-full relative">
                    {/* Mobile-only info bar */}
                    <div className="md:hidden p-3 bg-gray-800/90 border-b border-gray-700">
                      <div className="flex items-center mb-1">
                        <span className="h-2 w-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
                        <span className="text-sm font-medium text-white">30 Min Discovery Call</span>
                      </div>
                      <p className="text-xs text-gray-400">Select a date and time to schedule your call</p>
                    </div>
                    
                    {/* Main Calendly integration - this is where the Calendly widget will appear */}
                    <div 
                      className="calendly-inline-widget w-full h-full" 
                      data-url="https://calendly.com/nexdevs-org?hide_landing_page_details=1&hide_gdpr_banner=1&background_color=0d3d5b&text_color=f8f8f8&primary_color=bf6ce9"
                      style={{ minWidth: "320px", minHeight: "75vh" }}
                    ></div>
                    <script type="text/javascript" src="https://assets.calendly.com/assets/external/widget.js" async></script>
                    
                    {/* Loading overlay */}
                    {!isCalendlyLoaded && (
                      <div className="absolute inset-0 z-10 bg-[#0d3d5b] flex flex-col items-center justify-center">
                        {/* Calendly-style loading animation */}
                        <div className="relative w-24 h-24 mb-8">
                          {/* Outer rotating ring */}
                          <div className="absolute inset-0 rounded-full border-4 border-gray-700/30"></div>
                          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#bf6ce9] animate-spin"></div>
                          
                          {/* Inner pulsing circle */}
                          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-[#bf6ce9]/20 to-[#bf6ce9]/30 animate-pulse"></div>
                          
                          {/* Calendly icon */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-10 h-10 text-[#bf6ce9]" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" 
                                d="M8 2v3M16 2v3M3.5 9.09h17M21 8.5V17c0 3-1.5 5-4.5 5h-8c-3.5 0-5-2-5-5V8.5c0-3 1.5-5 5-5h8c3.5 0 5 2 5 5z"/>
                            </svg>
                          </div>
                        </div>

                        {/* Loading text with shimmer effect */}
                        <div className="text-center">
                          <h3 className="text-[#f8f8f8] text-xl font-semibold mb-2">Loading Calendar</h3>
                          <p className="text-[#f8f8f8]/70 text-sm mb-6">Please wait while we set up your scheduling experience</p>
                        </div>

                        {/* Progress bar */}
                        <div className="w-64 h-1 bg-gray-700/30 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-[#bf6ce9] to-[#bf6ce9]/70 animate-shimmer relative"
                            style={{ 
                              width: '90%',
                              backgroundSize: '200% 100%',
                            }}
                          >
                            {/* Animated highlight */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"
                              style={{ backgroundSize: '200% 100%' }}
                            ></div>
                          </div>
                        </div>

                        {/* Loading steps */}
                        <div className="mt-8 space-y-2 text-sm text-[#f8f8f8]/70">
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-[#bf6ce9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            <span>Initializing calendar</span>
                          </div>
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-[#bf6ce9] animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Loading available time slots</span>
                          </div>
                          <div className="flex items-center opacity-50">
                            <div className="w-4 h-4 mr-2 rounded-full border-2 border-[#bf6ce9]/30"></div>
                            <span>Preparing scheduling interface</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Mobile fixed button bar with scroll indicator */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-3 z-50">
                  <div className="absolute -top-6 left-0 right-0 h-6 bg-gradient-to-b from-transparent to-gray-900 pointer-events-none"></div>
                  <button
                    onClick={() => {
                      window.open('https://calendly.com/nexdevs-org', '_blank');
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Open Calendar in New Tab
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {isSubmitted && (
            <motion.div 
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in-up"
              initial="hidden"
              animate="visible"
              variants={fadeIn}
            >
              <div className="bg-gray-900 rounded-xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-800 p-8 text-center">
                <div className="rounded-full bg-green-900 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <svg className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Booking Confirmed!</h2>
                <p className="text-gray-300 mb-6">
                  Your discovery call has been scheduled. We've sent you a confirmation email with details and a Google Meet link.
                </p>
                <Link href="/" className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-md hover:opacity-90 transition-all">
                  Return to Home
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
} 