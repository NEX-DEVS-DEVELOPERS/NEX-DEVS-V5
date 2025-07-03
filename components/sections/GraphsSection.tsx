'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Line, Bar, Doughnut, Radar, PolarArea } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

// Define chart data
const workflowData = {
  labels: ['Research', 'Planning', 'Design', 'Development', 'Testing', 'Deployment'],
  datasets: [
    {
      label: 'Ideal Workflow',
      data: [90, 85, 90, 95, 85, 90],
      borderColor: 'rgba(138, 43, 226, 1)',
      backgroundColor: 'rgba(138, 43, 226, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(138, 43, 226, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(138, 43, 226, 1)',
      pointRadius: 4,
      pointHoverRadius: 5,
      tension: 0.4,
      fill: true
    },
    {
      label: 'NEX-DEVS Workflow',
      data: [95, 92, 96, 98, 94, 97],
      borderColor: 'rgba(75, 192, 192, 1)',
      backgroundColor: 'rgba(75, 192, 192, 0.1)',
      borderWidth: 2,
      pointBackgroundColor: 'rgba(75, 192, 192, 1)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(75, 192, 192, 1)',
      pointRadius: 4,
      pointHoverRadius: 5,
      tension: 0.4,
      fill: true
    }
  ]
};

// Simplified AI Integration data
const aiUsageData = {
  labels: ['Code Generation', 'Data Analysis', 'Testing', 'Documentation', 'Optimization'],
  datasets: [
    {
      data: [96, 94, 90, 98, 95],
      backgroundColor: [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)'
      ],
      borderColor: [
        'rgba(255, 255, 255, 0.9)',
        'rgba(255, 255, 255, 0.9)',
        'rgba(255, 255, 255, 0.9)',
        'rgba(255, 255, 255, 0.9)',
        'rgba(255, 255, 255, 0.9)'
      ],
      borderWidth: 2,
      hoverOffset: 10,
      hoverBorderWidth: 3
    }
  ]
};

const skillComparisonData = {
  labels: ['Frontend', 'Backend', 'DevOps', 'Design', 'Mobile'],
  datasets: [
    {
      label: 'NEX-DEVS',
      data: [98, 97, 96, 95, 93],
      backgroundColor: 'rgba(138, 43, 226, 0.7)',
      borderColor: 'rgba(138, 43, 226, 0.9)',
      borderWidth: 1,
      borderRadius: 4,
      barThickness: 12,
    },
    {
      label: 'Industry Average',
      data: [65, 70, 60, 55, 50],
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 0.8)',
      borderWidth: 1,
      borderRadius: 4,
      barThickness: 12,
    }
  ]
};

// Simplified NEX-DEVS Skills data
const nexDevsSkillsData = {
  labels: ['React', 'Node.js', 'TypeScript', 'Next.js', 'UI/UX', 'Testing'],
  datasets: [
    {
      label: 'Skill Level',
      data: [89, 92, 95, 99, 96, 99],
      backgroundColor: 'rgba(138, 43, 226, 0.3)',
      borderColor: 'rgba(138, 43, 226, 0.8)',
      pointBackgroundColor: 'rgba(138, 43, 226, 0.8)',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: 'rgba(138, 43, 226, 1)',
      pointRadius: 3,
      pointHoverRadius: 5,
      fill: true
    }
  ]
};

// Simplified Our Priorities data
const prioritiesData = {
  labels: ['Quality', 'Performance', 'User Experience', 'Accessibility', 'Security'],
  datasets: [
    {
      label: 'Priority Level',
      data: [97, 95, 98, 90, 96],
      backgroundColor: [
        'rgba(255, 99, 132, 0.7)',
        'rgba(54, 162, 235, 0.7)',
        'rgba(255, 206, 86, 0.7)',
        'rgba(75, 192, 192, 0.7)',
        'rgba(153, 102, 255, 0.7)'
      ],
      borderWidth: 0
    }
  ]
};

// Mobile-optimized options for charts
const commonOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 800,
    easing: 'easeOutQuart' as const
  },
  plugins: {
    legend: {
      labels: {
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          family: "'Inter', sans-serif",
          size: 10,
          weight: "normal" as "normal"
        },
        boxWidth: 10,
        padding: 8,
        usePointStyle: true
      },
      position: 'top' as const,
      // Better mobile display
      display: typeof window !== 'undefined' && window.innerWidth > 640 ? true : false,
      align: 'center' as const,
    },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.85)',
      titleColor: 'rgba(255, 255, 255, 1)',
      bodyColor: 'rgba(255, 255, 255, 0.9)',
      borderColor: 'rgba(138, 43, 226, 0.5)',
      borderWidth: 1,
      padding: 8,
      boxPadding: 4,
      titleFont: {
        family: "'Inter', sans-serif",
        size: 13,
        weight: "bold" as "bold"
      },
      bodyFont: {
        family: "'Inter', sans-serif",
        size: 12
      },
      cornerRadius: 4,
      displayColors: true,
      boxWidth: 8,
      boxHeight: 8,
      usePointStyle: true,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || '';
          if (label) {
            label += ': ';
          }
          if (context.parsed !== undefined) {
            if (context.parsed.y !== undefined) {
              label += context.parsed.y;
            } else if (context.parsed !== undefined) {
              label += context.parsed;
            }
          }
          return label + '%';
        }
      }
    }
  },
  scales: {
    x: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.8)',
        font: {
          family: "'Inter', sans-serif",
          size: 10,
          weight: "normal" as "normal"
        },
        maxRotation: 45,
        minRotation: 45
      }
    },
    y: {
      grid: {
        color: 'rgba(255, 255, 255, 0.05)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.8)',
        font: {
          family: "'Inter', sans-serif",
          size: 10
        },
        callback: function(value: any) {
          return value + '%';
        },
        beginAtZero: true,
        suggestedMax: 100
      }
    },
    r: {
      grid: {
        color: 'rgba(255, 255, 255, 0.1)'
      },
      ticks: {
        color: 'rgba(255, 255, 255, 0.8)',
        backdropColor: 'transparent',
        font: {
          family: "'Inter', sans-serif",
          size: 9
        },
        callback: function(value: any) {
          return value + '%';
        },
        backdropPadding: 2,
        showLabelBackdrop: false,
        stepSize: 20
      },
      suggestedMin: 0,
      suggestedMax: 100,
      angleLines: {
        color: 'rgba(255, 255, 255, 0.15)'
      },
      pointLabels: {
        color: 'rgba(255, 255, 255, 0.9)',
        font: {
          family: "'Inter', sans-serif",
          size: 10,
          weight: "normal" as "normal"
        }
      }
    }
  }
};

// Tab content type
type TabContentType = {
  id: string;
  title: string;
  icon: JSX.Element;
  chart: JSX.Element;
  description: string;
}

const GraphsSection: React.FC = () => {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const autoScrollTimerRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Define tab contents
  const tabContents: TabContentType[] = [
    {
      id: 'workflow',
      title: 'Workflow Process',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      chart: <Line data={workflowData} options={commonOptions} height={250} />,
      description: 'Our development workflow consistently outperforms industry standards across all phases, with particular excellence in the development and deployment stages.'
    },
    {
      id: 'ai-usage',
      title: 'AI Integration',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      chart: <Doughnut data={aiUsageData} options={{
        ...commonOptions,
        cutout: typeof window !== 'undefined' && window.innerWidth < 640 ? '50%' : '60%',
        plugins: {
          ...commonOptions.plugins,
          legend: {
            ...commonOptions.plugins.legend,
            position: 'bottom' as const,
            display: false // Hide default legend for custom mobile legend
          },
          tooltip: {
            ...commonOptions.plugins.tooltip,
            enabled: true,
            titleFont: {
              family: "'Inter', sans-serif",
              size: 14,
              weight: "bold" as "bold"
            },
            bodyFont: {
              family: "'Inter', sans-serif",
              size: 13
            },
            padding: 10,
            callbacks: {
              title: function(tooltipItems: any) {
                return tooltipItems[0].label;
              },
              label: function(context: any) {
                return `Efficiency: ${context.parsed}%`;
              },
              afterLabel: function(context: any) {
                const labels = [
                  'Reduces manual coding by 96%',
                  'Improves data processing speed by 94%',
                  'Reduces testing time by 90%',
                  'Accelerates documentation by 98%',
                  'Enhances optimization workflows by 95%'
                ];
                return labels[context.dataIndex];
              }
            }
          }
        }
      }} height={240} />,
      description: 'Advanced metrics showing our AI implementation effectiveness across key development areas, demonstrating industry-leading performance.'
    },
    {
      id: 'skill-comparison',
      title: 'Team Skills',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      chart: <Bar data={skillComparisonData} options={commonOptions} height={250} />,
      description: 'Comparing NEX-DEVS technical expertise with industry standards across key development areas. Our team consistently exceeds market averages.'
    },
    {
      id: 'nexdevs-skills',
      title: 'NEX-DEVS Skills',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      chart: <Radar data={nexDevsSkillsData} options={commonOptions} height={250} />,
      description: 'Comprehensive skill profile of our lead development team at NEX-DEVS, highlighting expertise across cutting-edge technologies.'
    },
    {
      id: 'priorities',
      title: 'Our Priorities',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      chart: <PolarArea data={prioritiesData} options={commonOptions} height={250} />,
      description: 'Visualization of our core priorities, showcasing our commitment to delivering high-quality solutions that prioritize user experience and security.'
    }
  ];

  // Auto-scroll functionality
  useEffect(() => {
    if (isHovering) {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
        autoScrollTimerRef.current = null;
      }
      return;
    }

    autoScrollTimerRef.current = setInterval(() => {
      setActiveTabIndex((prev) => (prev + 1) % tabContents.length);
    }, 5000);

    return () => {
      if (autoScrollTimerRef.current) {
        clearInterval(autoScrollTimerRef.current);
      }
    };
  }, [isHovering, tabContents.length]);

  // Optimized chart container for better mobile display
  const renderTabContent = (tab: TabContentType, index: number) => {
    const isActive = activeTabIndex === index;
    
    return (
      <div 
        key={tab.id}
        className={`absolute inset-0 p-4 sm:p-6 ${isActive ? 'block' : 'hidden'}`}
      >
        <div className="flex flex-col h-full space-y-3 sm:space-y-4">
          {/* Chart Header - Simplified for mobile */}
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="text-lg sm:text-xl font-semibold text-white flex items-center gap-2">
              <span className="text-purple-400">{tab.icon}</span>
              {tab.title}
              {tab.id === 'ai-usage' && (
                <span className="ml-2 text-xs bg-blue-500/50 px-2 py-0.5 rounded-full text-white">
                  Efficiency Metrics
                </span>
              )}
            </h4>
            
            <div className="text-xs text-gray-400 bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm border border-gray-800">
              <span className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Updated monthly
              </span>
            </div>
          </div>
          
          {/* Chart Description - Mobile optimized */}
          <p className="text-xs sm:text-sm text-gray-400">
            {tab.description}
            {/* Simple explanation for AI usage chart */}
            {tab.id === 'ai-usage' && (
              <span className="block mt-1 text-blue-300 text-xs">
                * Percentages show efficiency improvement vs. traditional methods. Tap/hover over segments for details.
              </span>
            )}
          </p>
          
          {/* Chart Container - Simplified for mobile */}
          <div className="flex-1 relative overflow-hidden rounded-xl p-1 bg-gradient-to-tr from-purple-900/20 to-black/30 backdrop-blur-sm border border-purple-500/10">
            {/* Chart - Height optimized based on device */}
            <div className="relative h-full min-h-[260px] sm:min-h-[250px] bg-black/20 rounded-lg p-2 sm:p-4 backdrop-blur-sm">
              {tab.chart}
              
              {/* Simplified legends for better mobile experience */}
              {tab.id === 'ai-usage' && (
                <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm p-2 rounded-lg border border-blue-500/20 text-xs text-center text-white">
                  <div className="grid grid-cols-3 gap-x-1 gap-y-1.5">
                    {aiUsageData.labels.map((label, i) => (
                      <div key={label} className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full mb-0.5" style={{
                          backgroundColor: aiUsageData.datasets[0].backgroundColor[i],
                          border: '2px solid rgba(255, 255, 255, 0.9)',
                          boxShadow: '0 0 4px rgba(255, 255, 255, 0.3)'
                        }}></div>
                        <div>
                          <div className="font-semibold">{aiUsageData.datasets[0].data[i]}%</div>
                          <div className="text-gray-300 text-[9px] leading-tight">{label}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-1.5 text-[8px] text-blue-200">Tap chart segments for detailed metrics</div>
                </div>
              )}
            </div>
          </div>
          
          {/* Stats Footer - Only visible on desktop */}
          <div className="hidden sm:grid grid-cols-4 gap-4">
            {[
              { label: 'Data Points', value: index === 0 ? '12' : index === 1 ? '5' : index === 2 ? '10' : index === 3 ? '6' : '5' },
              { label: 'Last Updated', value: 'March 2025' },
              { label: 'Confidence', value: '99%' },
              { label: 'Source', value: 'Internal Data' }
            ].map((stat) => (
              <div 
                key={stat.label}
                className="bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-2 flex flex-col justify-center"
              >
                <span className="text-xs text-gray-500">{stat.label}</span>
                <span className="text-sm font-medium text-gray-300">{stat.value}</span>
              </div>
            ))}
          </div>

          {/* Mobile Stats Footer - Only shows Data Points and Last Updated */}
          <div className="grid sm:hidden grid-cols-2 gap-3">
            {[
              { label: 'Data Points', value: index === 0 ? '12' : index === 1 ? '5' : index === 2 ? '10' : index === 3 ? '6' : '5' },
              { label: 'Last Updated', value: 'March 2025' }
            ].map((stat) => (
              <div 
                key={stat.label}
                className="bg-black/20 backdrop-blur-sm border border-gray-800 rounded-lg p-2 flex flex-col justify-center"
              >
                <span className="text-xs text-gray-500">{stat.label}</span>
                <span className="text-sm font-medium text-gray-300">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section ref={sectionRef} className="py-8 sm:py-16 relative">
      {/* Background effects - simplified */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] -z-10 opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -z-10 opacity-30"></div>
      
      {/* Section Header - Mobile optimized */}
      <div className="container mx-auto px-3 sm:px-4">
        <div className="text-center mb-6 sm:mb-12">
          <div className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 bg-purple-900/30 text-purple-400 rounded-full text-xs sm:text-sm font-medium mb-2 sm:mb-3 backdrop-blur-sm border border-purple-500/20">
            Data Visualization
          </div>
          <h2 className="text-xl sm:text-4xl font-bold text-white mb-2 sm:mb-3">Performance Metrics</h2>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
            Explore our metrics showcasing our expertise, workflow efficiency, and project priorities.
          </p>
        </div>
        
        {/* Enhanced Tab Navigation - Mobile optimized */}
        <div 
          className="relative rounded-lg sm:rounded-xl overflow-hidden backdrop-blur-sm bg-black/20 border border-purple-500/20 mb-6 sm:mb-12 mx-auto max-w-5xl"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {/* Auto-scroll indicator - Simplified */}
          <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10 flex items-center gap-1 text-[10px] sm:text-xs text-gray-400 bg-black/30 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full backdrop-blur-sm border border-gray-800">
            <div className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${!isHovering ? 'bg-green-500 animate-pulse' : 'bg-gray-600'}`}></div>
            <span className="hidden sm:inline">{!isHovering ? 'Auto-scrolling' : 'Paused'}</span>
          </div>
          
          {/* Tab Navigation - Mobile optimized */}
          <div className="relative z-10 border-b border-purple-500/10">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabContents.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabIndex(index)}
                  className={`relative flex items-center gap-1 px-2.5 sm:px-5 py-2 sm:py-3 min-w-[80px] sm:min-w-[100px] text-[11px] sm:text-sm font-medium transition-all duration-300 ${
                    activeTabIndex === index 
                      ? 'text-white' 
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  aria-label={`View ${tab.title} chart`}
                >
                  <span className="relative z-10 flex items-center gap-1 sm:gap-2">
                    {tab.icon}
                    <span>{tab.title}</span>
                  </span>
                  
                  {/* Active indicator */}
                  {activeTabIndex === index && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" />
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Tab Content - Mobile optimized height */}
          <div className="relative min-h-[380px] sm:min-h-[450px]">
            <AnimatePresence mode="wait">
              {tabContents.map((tab, index) => renderTabContent(tab, index))}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Bottom CTA - Mobile optimized */}
        <div className="text-center">
          <p className="text-xs sm:text-sm text-gray-400 mb-3 sm:mb-4">
            Want to learn more about our approach and methodologies?
          </p>
          <a 
            href="#contact" 
            className="inline-flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-3 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 text-white text-xs sm:text-sm font-medium hover:from-purple-700 hover:to-purple-900 transition-colors duration-300 shadow-lg shadow-purple-900/30"
          >
            <span>Schedule a consultation</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default GraphsSection; 