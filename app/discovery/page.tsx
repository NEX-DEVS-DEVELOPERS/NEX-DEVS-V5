'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { FaArrowLeft, FaCalendarAlt, FaVideo } from 'react-icons/fa'

// Timeline step component
const TimelineStep = ({ number, title, description, active }: { 
  number: number; 
  title: string; 
  description: string;
  active: boolean;
}) => {
  return (
    <div className={`flex items-start mb-8 ${active ? 'opacity-100' : 'opacity-60'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center mr-4 ${
        active ? 'bg-purple-600 text-white' : 'bg-gray-300 text-gray-700'
      }`}>
        {number}
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-1">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  )
}

export default function DiscoveryCallPage() {
  const [activeStep, setActiveStep] = useState(1);
  
  const timelineSteps = [
    {
      number: 1,
      title: "Discovery Call",
      description: "A 30-minute call to understand your project requirements and goals."
    },
    {
      number: 2,
      title: "Proposal & Quote",
      description: "We'll provide a detailed proposal outlining scope, timeline, and pricing."
    },
    {
      number: 3,
      title: "Project Kickoff",
      description: "Once approved, we'll start with a kickoff meeting to set expectations."
    },
    {
      number: 4,
      title: "Design & Development",
      description: "Our team works on your project with regular updates and feedback sessions."
    },
    {
      number: 5,
      title: "Launch & Support",
      description: "Deployment of your project with post-launch support and maintenance."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center text-gray-700 hover:text-purple-600 transition-colors">
            <FaArrowLeft className="mr-2" />
            <span>Back to Home</span>
          </Link>
          <div className="flex items-center">
            <Image
              src="/images/logo.png"
              alt="Agency Logo"
              width={40}
              height={40}
              className="mr-3"
            />
            <span className="font-semibold text-lg">DigitalCraft Studio</span>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Book a Discovery Call</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Let's discuss your project and see how we can help bring your vision to life. 
              Our discovery call helps us understand your needs and determine the best approach.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Project Timeline */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Project Journey</h2>
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                
                {/* Timeline steps */}
                <div className="relative z-10">
                  {timelineSteps.map((step, index) => (
                    <TimelineStep 
                      key={step.number}
                      number={step.number}
                      title={step.title}
                      description={step.description}
                      active={step.number === activeStep}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mt-6">
                <button 
                  onClick={() => setActiveStep(prev => Math.min(prev + 1, timelineSteps.length))}
                  className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors mr-2"
                  disabled={activeStep === timelineSteps.length}
                >
                  Next Step
                </button>
                <button 
                  onClick={() => setActiveStep(prev => Math.max(prev - 1, 1))}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                  disabled={activeStep === 1}
                >
                  Previous Step
                </button>
              </div>
            </div>
            
            {/* Scheduling Section */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6">Schedule Your Call</h2>
              
              <div className="space-y-6">
                <div className="flex items-center p-4 border border-gray-200 rounded-md hover:border-purple-300 transition-colors cursor-pointer">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <FaCalendarAlt className="text-blue-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Calendar Booking</h3>
                    <p className="text-gray-600">Choose a convenient time slot from our calendar</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 border border-gray-200 rounded-md hover:border-purple-300 transition-colors cursor-pointer">
                  <div className="bg-green-100 p-3 rounded-full mr-4">
                    <FaVideo className="text-green-600 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Google Meet</h3>
                    <p className="text-gray-600">Secure video conferencing for our discovery call</p>
                  </div>
                </div>
                
                <div className="mt-8">
                  <Link 
                    href="https://calendly.com/your-agency" 
                    target="_blank"
                    className="block w-full py-3 bg-purple-600 text-white text-center rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Book Your Discovery Call
                  </Link>
                </div>
                
                <div className="mt-4 text-center text-gray-600 text-sm">
                  <p>Calls typically last 30 minutes and are conducted via Google Meet</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Agency Information */}
          <div className="mt-16 bg-purple-50 p-8 rounded-lg">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="mb-6 md:mb-0 md:mr-8">
                <h2 className="text-2xl font-bold mb-3">Why Work With Us?</h2>
                <p className="text-gray-700 mb-4">
                  At DigitalCraft Studio, we specialize in creating custom digital experiences 
                  that help businesses grow. Our team of experts will guide you through every 
                  step of the process to ensure your project's success.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-purple-600 rounded-full mr-2"></span>
                    <span>Tailored solutions for your specific needs</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-purple-600 rounded-full mr-2"></span>
                    <span>Transparent communication throughout the project</span>
                  </li>
                  <li className="flex items-center">
                    <span className="h-2 w-2 bg-purple-600 rounded-full mr-2"></span>
                    <span>Collaborative approach focusing on results</span>
                  </li>
                </ul>
              </div>
              <div className="w-full md:w-auto">
                <Image
                  src="/images/agency-team.jpg"
                  alt="Our Agency Team"
                  width={400}
                  height={300}
                  className="rounded-lg shadow-md"
                />
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  )
}
