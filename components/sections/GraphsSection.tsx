'use client'

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Doughnut, Radar, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, ArcElement, RadialLinearScale, Filler, ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  Title, Tooltip, Legend, ArcElement, RadialLinearScale, Filler
);

// --- UPDATED DATA DEFINITIONS ---

const aiUsageData = {
  labels: ['Code Generation', 'Data Analysis', 'Testing', 'Documentation', 'Optimization'],
  datasets: [{
    data: [99, 98, 97, 99, 98],
    backgroundColor: ['rgba(192, 132, 252, 0.5)', 'rgba(129, 140, 248, 0.5)', 'rgba(250, 204, 21, 0.5)', 'rgba(74, 222, 128, 0.5)', 'rgba(244, 114, 182, 0.5)'],
    borderColor: ['#C084FC', '#818CF8', '#FACC15', '#4ADE80', '#F472B6'],
    borderWidth: 2, hoverOffset: 12, hoverBorderColor: '#fff',
  }]
};

const nexDevsSkillsData = {
    labels: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'Go', 'PostgreSQL', 'MongoDB', 'Docker', 'Kubernetes', 'AWS', 'GCP', 'LangChain', 'PyTorch'],
    datasets: [{
      label: 'Proficiency',
      data: [99, 99, 98, 98, 97, 95, 98, 96, 97, 96, 98, 97, 98, 96],
      backgroundColor: 'rgba(167, 139, 250, 0.6)',
      borderColor: 'rgba(167, 139, 250, 1)',
      borderWidth: 1, borderRadius: 4,
    }]
};

const aiTaskAutomationData = {
  labels: ['Content Creation', 'Data Entry', 'Customer Support', 'Reporting', 'Code Refactoring'],
  datasets: [{
    data: [35, 25, 20, 15, 5],
    backgroundColor: ['rgba(192, 132, 252, 0.5)', 'rgba(129, 140, 248, 0.5)', 'rgba(74, 222, 128, 0.5)', 'rgba(250, 204, 21, 0.5)', 'rgba(244, 114, 182, 0.5)'],
    borderColor: ['#C084FC', '#818CF8', '#4ADE80', '#FACC15', '#F472B6'],
    borderWidth: 2, hoverOffset: 12, hoverBorderColor: '#fff',
  }]
};

const aiPerformanceBoostData = {
  labels: ['Lead Conversion', 'User Engagement', 'Operational Cost Reduction'],
  datasets: [{
    label: 'Improvement',
    data: [45, 60, 50],
    backgroundColor: ['rgba(167, 139, 250, 0.6)', 'rgba(74, 222, 128, 0.6)', 'rgba(250, 204, 21, 0.6)'],
    borderColor: ['rgba(167, 139, 250, 1)', 'rgba(74, 222, 128, 1)', 'rgba(250, 204, 21, 1)'],
    borderWidth: 1, borderRadius: 4,
  }]
};

const modelFineTuningData = {
  labels: ['Data Prep', 'Model Selection', 'Training', 'Evaluation', 'Deployment'],
  datasets: [{
    label: 'Expertise',
    data: [98, 98, 98, 98, 98], // Updated to 98%
    backgroundColor: 'rgba(74, 222, 128, 0.2)',
    borderColor: 'rgba(74, 222, 128, 1)',
    pointBackgroundColor: 'rgba(74, 222, 128, 1)',
    pointBorderColor: '#fff',
  }]
};

const mobileDevData = {
    labels: ['iOS (Swift)', 'Android (Kotlin)', 'React Native', 'Flutter', 'Performance', 'UI/UX'],
    datasets: [{
      label: 'Proficiency',
      data: [98, 97, 99, 96, 98, 99],
      backgroundColor: 'rgba(56, 189, 248, 0.6)',
      borderColor: 'rgba(56, 189, 248, 1)',
      borderWidth: 1,
      borderRadius: 4,
    }]
};

// --- CHART OPTIONS ---

const getCommonOptions = (isMobile: boolean): ChartOptions => ({
    responsive: true, maintainAspectRatio: false, animation: { duration: 1000, easing: 'easeOutCubic' },
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true, backgroundColor: 'rgba(10, 10, 20, 0.85)', titleColor: '#E5E7EB',
        bodyColor: '#D1D5DB', borderColor: 'rgba(167, 139, 250, 0.5)', borderWidth: 1,
        padding: 12, cornerRadius: 8, usePointStyle: true, boxPadding: 4,
        callbacks: { label: (context: any) => `${context.label}: ${context.raw}${context.dataset.label === 'Improvement' || context.dataset.label === 'Proficiency' ? '%' : ''}` },
      },
    },
});

const getDoughnutOptions = (isMobile: boolean): ChartOptions<'doughnut'> => ({
    ...(getCommonOptions(isMobile) as ChartOptions<'doughnut'>),
    cutout: '70%',
});

const getRadarOptions = (isMobile: boolean, color: string): ChartOptions<'radar'> => ({
    ...(getCommonOptions(isMobile) as ChartOptions<'radar'>),
    scales: {
      r: {
        angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
        grid: { color: 'rgba(255, 255, 255, 0.1)' },
        pointLabels: { font: { size: isMobile ? 9 : 12 }, color: '#D1D5DB' },
        ticks: { display: false, stepSize: 20 },
      },
    },
    elements: { line: { borderColor: color, backgroundColor: `${color}33` }, point: { backgroundColor: color, borderColor: color } }
});
    
const getBarOptions = (isMobile: boolean, horizontal: boolean = false): ChartOptions<'bar'> => ({
    ...(getCommonOptions(isMobile) as ChartOptions<'bar'>),
    indexAxis: horizontal ? 'y' : 'x',
    scales: {
      x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#D1D5DB', font: { size: 10 } } },
      y: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#D1D5DB', font: { size: 10 } } }
    }
});

// --- ICONS ---
const PauseIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75zM17.25 5.25a.75.75 0 01.75.75v12a.75.75 0 01-1.5 0V6a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

const PlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.722-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
    </svg>
);

const ChevronLeftIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
    </svg>
);

const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
);

const icons: { [key: string]: JSX.Element } = {
    'AI Integration': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>,
    'NEX-DEVS Skills': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M12 6a2 2 0 100-4 2 2 0 000 4zm0 14a2 2 0 100-4 2 2 0 000 4zm6-8a2 2 0 100-4 2 2 0 000 4zm-12 0a2 2 0 100-4 2 2 0 000 4z" /></svg>,
    'AI Task Automation': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 6V4m0 16v-2m8-8h2M4 12H2m15.364 6.364l1.414 1.414M4.222 4.222l1.414 1.414m14.142 0l-1.414 1.414M5.636 18.364l-1.414 1.414M12 16a4 4 0 110-8 4 4 0 010 8z" /></svg>,
    'AI Performance Boost': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>,
    'Model Fine-Tuning': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.096 2.572-1.065z" /><path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    'Mobile Development': <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
};

// --- SUB-COMPONENTS ---

const TabButton = ({ id, title, icon, activeTab, setActiveTab }: { id: string, title: string, icon: JSX.Element, activeTab: string, setActiveTab: (id: string) => void }) => (
    <button onClick={() => setActiveTab(id)} className={`relative flex items-center shrink-0 gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${activeTab === id ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
        {icon}
        <span className="truncate">{title}</span>
        {activeTab === id && <motion.div className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500" layoutId="underline" />}
    </button>
);


const StatCard = ({ label, value, unit }: { label: string, value: any, unit?: string }) => (
    <div className="relative group bg-white/5 p-4 rounded-lg text-center backdrop-blur-sm transition-all duration-300 hover:bg-white/10">
      <div className="absolute -inset-px bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg blur opacity-0 group-hover:opacity-60 transition duration-300"></div>
      <div className="relative">
          <div className="text-3xl font-bold text-purple-300 group-hover:text-white transition-colors duration-300">
            {value}{unit}
          </div>
          <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">{label}</div>
      </div>
    </div>
  );

const ChartWrapper = ({ children, heightClass = "h-[300px] md:h-[350px]" }: { children: React.ReactNode, heightClass?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.4, ease: 'easeInOut' }} className={`${heightClass} relative`}>
    {children}
  </motion.div>
);

// --- MAIN COMPONENT ---

export default function GraphsSection() {
  const [activeTab, setActiveTab] = useState('AI Integration');
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile(); window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const tabContent = [
    {
      id: 'AI Integration', title: 'AI Integration', icon: icons['AI Integration'],
      chart: <Doughnut data={aiUsageData} options={getDoughnutOptions(isMobile)} />,
      description: 'Advanced metrics showing our AI implementation effectiveness across key development areas, demonstrating industry-leading performance.',
      stats: [
        { label: 'Avg. Efficiency', value: 98.2, unit: '%' }, { label: 'Last Updated', value: 'March 2025' },
        { label: 'Confidence', value: 99.5, unit: '%' }, { label: 'Source', value: 'Internal Data' },
      ],
    },
    {
      id: 'NEX-DEVS Skills', title: 'NEX-DEVS Skills', icon: icons['NEX-DEVS Skills'],
      chart: <Bar data={nexDevsSkillsData} options={getBarOptions(isMobile, true)} />,
      description: 'A comprehensive overview of our team\'s expertise across the modern technology stack, ensuring high-quality and robust solutions.',
      stats: [
        { label: 'Avg. Proficiency', value: 97.3, unit: '%' }, { label: 'Skills Tracked', value: 14 },
        { label: 'Top Skill', value: 'Next.js' }, { label: 'Expertise Level', value: 'Senior' }
      ],
      chartHeight: 'h-[400px] md:h-[450px]'
    },
    {
      id: 'AI Task Automation', title: 'AI Task Automation', icon: icons['AI Task Automation'],
      chart: <Doughnut data={aiTaskAutomationData} options={getDoughnutOptions(isMobile)} />,
      description: 'Breakdown of tasks automated by our AI systems, showcasing broad application and efficiency gains in daily operations.',
      stats: [
        { label: 'Automated Tasks', value: 5 }, { label: 'Avg. Time Saved', value: 60, unit: '%' },
        { label: 'Accuracy', value: 99.8, unit: '%' }, { label: 'Scalability', value: 'High' }
      ]
    },
    {
      id: 'AI Performance Boost', title: 'AI Performance Boost', icon: icons['AI Performance Boost'],
      chart: <Bar data={aiPerformanceBoostData} options={getBarOptions(isMobile)} />,
      description: 'Quantifiable improvements in key business metrics driven by our AI solutions, leading to tangible business growth.',
      stats: [
        { label: 'Avg. Uplift', value: 51.7, unit: '%' }, { label: 'ROI Period', value: '<6 mos' },
        { label: 'Client Satisfaction', value: 98, unit: '%' }, { label: 'Data-driven', value: '100%' }
      ]
    },
    {
      id: 'Model Fine-Tuning', title: 'Model Fine-Tuning', icon: icons['Model Fine-Tuning'],
      chart: <Radar data={modelFineTuningData} options={getRadarOptions(isMobile, '#4ADE80')} />,
      description: 'Our expertise in fine-tuning models for specific client needs, ensuring optimal performance and relevance.',
      stats: [
        { label: 'Custom Models', value: '20+' }, { label: 'Performance Gain', value: 40, unit: '%' },
        { label: 'Specialization', value: 'High' }, { label: 'Cost-Effective', value: 'Yes' }
      ]
    },
    {
        id: 'Mobile Development', title: 'Mobile Development', icon: icons['Mobile Development'],
        chart: <Bar data={mobileDevData} options={getBarOptions(isMobile, true)} />,
        description: 'Expertise in building high-performance, cross-platform, and native mobile applications with exceptional user experiences.',
        stats: [
            { label: 'Avg. Proficiency', value: 97.8, unit: '%' }, { label: 'Platforms', value: 'iOS & Android' },
            { label: 'Top Framework', value: 'React Native' }, { label: 'User Satisfaction', value: 99, unit: '%' }
        ],
        chartHeight: 'h-[400px] md:h-[450px]'
    }
  ];

  const handlePrevious = () => {
    setIsAutoScrolling(false);
    setActiveTab(prev => {
      const currentIndex = tabContent.findIndex(t => t.id === prev);
      const newIndex = (currentIndex - 1 + tabContent.length) % tabContent.length;
      return tabContent[newIndex].id;
    });
  };

  const handleNext = () => {
    setIsAutoScrolling(false);
    setActiveTab(prev => {
      const currentIndex = tabContent.findIndex(t => t.id === prev);
      const newIndex = (currentIndex + 1) % tabContent.length;
      return tabContent[newIndex].id;
    });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isAutoScrolling) {
      interval = setInterval(() => {
        setActiveTab(prev => {
          const currentIndex = tabContent.findIndex(t => t.id === prev);
          return tabContent[(currentIndex + 1) % tabContent.length].id;
        });
      }, 5000);
    }
    return () => clearInterval(interval);
  }, [isAutoScrolling, tabContent.length]);

  const activeContent = tabContent.find(t => t.id === activeTab);

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setIsAutoScrolling(false);
  }
    
    return (
    <section className="py-16 sm:py-24 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3">Performance Metrics</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">Explore our metrics showcasing our expertise, workflow efficiency, and project priorities.</p>
            </div>
        <div className="bg-black/50 border border-white/10 rounded-xl backdrop-blur-lg">
          <div className="p-4 sm:p-6 border-b border-white/10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                    <h3 className="text-xl font-bold text-white">Performance Categories</h3>
                    <p className="text-sm text-gray-400 mt-1">Select a category or use the controls to navigate.</p>
                        </div>
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button onClick={handlePrevious} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200" aria-label="Previous Chart">
                        <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                    <button onClick={handleNext} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200" aria-label="Next Chart">
                        <ChevronRightIcon className="h-5 w-5" />
                    </button>
                    <button onClick={() => setIsAutoScrolling(!isAutoScrolling)} className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-all duration-200" aria-label={isAutoScrolling ? 'Pause auto-scrolling' : 'Play auto-scrolling'}>
                        {isAutoScrolling ? <PauseIcon className="h-5 w-5" /> : <PlayIcon className="h-5 w-5" />}
                    </button>
                </div>
            </div>
          </div>
          
          <div className="p-2 sm:p-6">
            <div className="w-full overflow-x-auto mb-6">
                <div className="flex flex-nowrap items-center gap-1 sm:gap-2 pb-2">
                    {tabContent.map(tab => <TabButton key={tab.id} {...tab} activeTab={activeTab} setActiveTab={handleTabClick} />)}
            </div>
          </div>
          
            <AnimatePresence mode="wait">
              {activeContent && (
                <motion.div key={activeContent.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                    <div className="lg:col-span-1">
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-3">{activeContent.icon}{activeContent.title}</h3>
                      <p className="text-sm text-gray-400 mb-6">{activeContent.description}</p>
                    </div>
                    <div className="lg:col-span-2">
                      <ChartWrapper heightClass={activeContent.chartHeight}>
                        {activeContent.chart}
                      </ChartWrapper>
                    </div>
                  </div>
                  <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {activeContent.stats.map(stat => <StatCard key={stat.label} {...stat} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}