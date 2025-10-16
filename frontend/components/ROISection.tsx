'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Audiowide } from 'next/font/google';

const audiowide = Audiowide({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

interface ROIMetric {
  id: number;
  metric_name: string;
  metric_value: number;
  metric_unit: string;
  baseline_value?: number;
  target_value?: number;
  achievement_rate?: number;
  confidence_score?: number;
  ai_insight?: string;
  predicted_trend?: string;
  data_source?: string;
}

interface ROICard {
  id: number;
  title: string;
  value: string;
  description: string;
  icon_url?: string;
  metric_type?: string;
  trend?: string;
  trend_percentage?: number;
  time_period?: string;
  category?: string;
  metrics?: ROIMetric[];
}

interface ROICaseStudy {
  id: number;
  client_name: string;
  client_industry: string;
  roi_percentage: number;
  total_return: number;
  key_improvements: any[];
  client_testimonial?: string;
  duration_months?: number;
}

interface ROISection {
  id: number;
  main_heading: string;
  sub_heading?: string;
  video_url?: string;
  image_one?: string;
  image_two?: string;
  image_three?: string;
  theme_color?: string;
  cards: ROICard[];
  caseStudies?: ROICaseStudy[];
}

export default function ROISection() {
  const [roiData, setRoiData] = useState<ROISection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchROIData = async () => {
      try {
        const response = await fetch('/api/roi-section', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch ROI data');
        }
        
        const data = await response.json();
        
        if (data && data.id) {
          // Filter out cards that don't have required data
          const validCards = data.cards?.filter((card: ROICard) => 
            card.title && card.value && card.description
          ) || [];
          
          if (validCards.length > 0) {
            setRoiData({
              ...data,
              cards: validCards
            });
          } else {
            setError('No valid ROI data available');
          }
        } else {
          setError('No ROI data available');
        }
      } catch (err) {
        console.error('Error fetching ROI data:', err);
        setError('Failed to load ROI data');
      } finally {
        setLoading(false);
      }
    };

    fetchROIData();
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const containerWidth = container.offsetWidth;
      const targetScroll = containerWidth * index;
      
      // Use requestAnimationFrame for smooth 60fps scrolling
      requestAnimationFrame(() => {
        container.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      });
      setCurrentIndex(index);
    }
  }, []);

  // Optimized scroll handler with requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current || !roiData) return;
    
    requestAnimationFrame(() => {
      if (!scrollContainerRef.current) return;
      
      const container = scrollContainerRef.current;
      const scrollLeft = container.scrollLeft;
      const containerWidth = container.offsetWidth;
      const index = Math.round(scrollLeft / containerWidth);
      
      if (index !== currentIndex && index >= 0 && index < roiData.cards.length) {
        setCurrentIndex(index);
      }
    });
  }, [currentIndex, roiData]);

  if (loading) {
    return (
      <section className="w-full py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="flex flex-col items-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-t-2 border-purple-500"></div>
              <p className="text-gray-400 text-sm">Loading ROI insights...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !roiData || !roiData.cards || roiData.cards.length === 0) {
    return (
      <section className="w-full py-24 bg-black">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="text-red-400 mb-4 text-4xl">⚠️</div>
              <p className="text-gray-400 text-lg mb-2">{error || 'ROI data not available'}</p>
              <p className="text-gray-500 text-sm">Please contact the administrator to publish ROI section.</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const getTrendIcon = (trend?: string) => {
    if (trend === 'up') {
      return (
        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      );
    } else if (trend === 'down') {
      return (
        <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
      </svg>
    );
  };

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'conversion': return 'from-purple-500 to-pink-500';
      case 'revenue': return 'from-green-500 to-emerald-500';
      case 'efficiency': return 'from-blue-500 to-cyan-500';
      case 'engagement': return 'from-orange-500 to-yellow-500';
      default: return 'from-purple-500 to-blue-500';
    }
  };

  return (
    <section className="w-full py-24 bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[128px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-16 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-block px-6 py-2 bg-purple-500/10 border border-purple-500/30 rounded-full mb-6">
            <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">Measurable Results</span>
          </div>
          
          <h1 className={`text-3xl md:text-5xl lg:text-6xl font-black mb-6 ${audiowide.className} text-white tracking-wide`}>
            {roiData.main_heading}
          </h1>
          
          {roiData.sub_heading && (
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              {roiData.sub_heading}
            </p>
          )}
        </motion.div>

        {/* Horizontal Scrolling Container */}
        <div className="relative">

          {/* Scroll Container */}
          <div
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            style={{ 
              scrollbarWidth: 'none', 
              msOverflowStyle: 'none',
              WebkitOverflowScrolling: 'touch',
              scrollBehavior: 'smooth',
              willChange: 'scroll-position',
            }}
          >
            {roiData.cards.map((card, cardIndex) => (
              <div
                key={card.id}
                className="min-w-full snap-start snap-always"
                style={{ 
                  transform: 'translateZ(0)',
                  backfaceVisibility: 'hidden',
                  perspective: 1000,
                }}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.5,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start px-4"
                  style={{
                    transform: 'translateZ(0)',
                    willChange: 'opacity',
                  }}
                >
                  {/* Left Side: Media */}
                  <div className="space-y-6">
                    {/* Video at top */}
                    {roiData.video_url && (
                      <div className="relative aspect-video overflow-hidden rounded-2xl border border-purple-500/30 bg-black">
                        <video 
                          src={roiData.video_url} 
                          controls 
                          playsInline 
                          className="w-full h-full object-cover"
                          poster={roiData.image_one || undefined}
                        />
                      </div>
                    )}

                    {/* Two images at bottom side by side */}
                    {(roiData.image_one || roiData.image_two) && (
                      <div className="grid grid-cols-2 gap-4">
                        {roiData.image_one && (
                          <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-black/50">
                            <img 
                              src={roiData.image_one} 
                              alt="ROI Metric Visual 1" 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        {roiData.image_two && (
                          <div className="relative overflow-hidden rounded-xl border border-gray-800 bg-black/50">
                            <img 
                              src={roiData.image_two} 
                              alt="ROI Metric Visual 2" 
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Right Side: ROI Details - Only show if card has data */}
                  <div className="space-y-6">
                    {/* Only render if card has title, value, and description */}
                    {card.title && card.value && card.description ? (
                      <>
                        {/* Card Header */}
                        <div>
                          <div className="flex items-center gap-3 mb-4">
                            {card.category && (
                              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide text-white bg-gradient-to-r ${getCategoryColor(card.category)}`}>
                                {card.category}
                              </span>
                            )}
                            {card.time_period && (
                              <span className="text-xs text-gray-500 uppercase tracking-wide">
                                {card.time_period}
                              </span>
                            )}
                          </div>

                          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {card.title}
                          </h2>

                          <div className="flex items-center gap-4 mb-6">
                            <div 
                              className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400"
                              style={{
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                              }}
                            >
                              {card.value}
                            </div>
                            {card.trend && (
                              <div className="flex flex-col items-start">
                                <div className="flex items-center gap-1">
                                  {getTrendIcon(card.trend)}
                                  {card.trend_percentage !== null && card.trend_percentage !== undefined && (
                                    <span className={`text-sm font-bold ${
                                      card.trend === 'up' ? 'text-green-400' : 
                                      card.trend === 'down' ? 'text-red-400' : 'text-blue-400'
                                    }`}>
                                      {typeof card.trend_percentage === 'number' 
                                        ? card.trend_percentage.toFixed(2) 
                                        : card.trend_percentage}%
                                    </span>
                                  )}
                                </div>
                                <span className="text-xs text-gray-500">trend</span>
                              </div>
                            )}
                          </div>

                          <p className="text-lg text-gray-300 leading-relaxed">
                            {card.description}
                          </p>
                        </div>

                        {/* Detailed Metrics - Only show if metrics exist */}
                        {card.metrics && card.metrics.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                              <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                              </svg>
                              Detailed Metrics
                            </h3>
                        
                        <div className="grid gap-4">
                          {card.metrics.map((metric) => (
                            <div
                              key={metric.id}
                              className="bg-black/60 border border-gray-800 rounded-xl p-5 hover:border-purple-500/40 transition-all"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0 pr-4">
                                  <h4 className="text-base font-semibold text-white mb-1 truncate">
                                    {metric.metric_name}
                                  </h4>
                                  {metric.data_source && (
                                    <span className="text-xs text-gray-500 block truncate">
                                      Source: {metric.data_source}
                                    </span>
                                  )}
                                </div>
                                <div className="text-right flex-shrink-0">
                                  <div className="text-2xl font-bold text-purple-400 whitespace-nowrap">
                                    {typeof metric.metric_value === 'number' 
                                      ? metric.metric_value.toLocaleString('en-US', {
                                          minimumFractionDigits: 0,
                                          maximumFractionDigits: 2,
                                        })
                                      : metric.metric_value}
                                    {metric.metric_unit || ''}
                                  </div>
                                  {metric.confidence_score !== null && metric.confidence_score !== undefined && (
                                    <div className="text-xs text-gray-500 mt-1">
                                      {typeof metric.confidence_score === 'number' 
                                        ? metric.confidence_score.toFixed(1)
                                        : metric.confidence_score}% confidence
                                    </div>
                                  )}
                                </div>
                              </div>

                              {/* Progress Bar for Achievement Rate */}
                              {metric.baseline_value !== null && metric.baseline_value !== undefined && 
                               metric.target_value !== null && metric.target_value !== undefined && (
                                <div className="space-y-2">
                                  <div className="flex justify-between text-xs text-gray-500">
                                    <span className="truncate">
                                      Baseline: {typeof metric.baseline_value === 'number' 
                                        ? metric.baseline_value.toLocaleString('en-US', { maximumFractionDigits: 2 })
                                        : metric.baseline_value}{metric.metric_unit || ''}
                                    </span>
                                    <span className="truncate ml-2">
                                      Target: {typeof metric.target_value === 'number'
                                        ? metric.target_value.toLocaleString('en-US', { maximumFractionDigits: 2 })
                                        : metric.target_value}{metric.metric_unit || ''}
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                                    <div
                                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500 ease-out"
                                      style={{ 
                                        width: `${Math.min(Math.max(metric.achievement_rate || 0, 0), 100)}%`,
                                        transform: 'translateZ(0)',
                                      }}
                                    />
                                  </div>
                                  {metric.achievement_rate !== null && metric.achievement_rate !== undefined && (
                                    <div className="text-xs text-gray-400">
                                      {typeof metric.achievement_rate === 'number'
                                        ? metric.achievement_rate.toFixed(1)
                                        : metric.achievement_rate}% of target achieved
                                    </div>
                                  )}
                                </div>
                              )}

                              {/* AI Insight */}
                              {metric.ai_insight && (
                                <div className="mt-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                                  <div className="flex items-start gap-2">
                                    <svg className="w-4 h-4 text-purple-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                                    </svg>
                                    <p className="text-xs text-purple-200">{metric.ai_insight}</p>
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-center">No data available for this ROI section</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {roiData.cards.length > 1 && (
            <>
              <button
                onClick={() => scrollToIndex(Math.max(0, currentIndex - 1))}
                disabled={currentIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/80 border border-purple-500/30 text-white p-3 rounded-full hover:bg-purple-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
                aria-label="Previous ROI"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={() => scrollToIndex(Math.min(roiData.cards.length - 1, currentIndex + 1))}
                disabled={currentIndex === roiData.cards.length - 1}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 border border-purple-500/30 text-white p-3 rounded-full hover:bg-purple-500/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed z-10"
                aria-label="Next ROI"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Pagination Buttons with Numbers */}
        {roiData.cards.length > 1 && (
          <div className="flex justify-center gap-3 mt-12">
            {roiData.cards.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollToIndex(index)}
                className={`w-10 h-10 rounded-full font-semibold transition-all duration-300 ${
                  currentIndex === index 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50 scale-110' 
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                }`}
                aria-label={`Go to ROI ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 justify-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Link 
            href="/contact"
            className={`inline-flex items-center justify-center px-8 py-4 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 transition-all duration-300 shadow-lg ${audiowide.className}`}
          >
            Get Your AI ROI Plan
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </Link>
          
          <Link 
            href="/discovery-call"
            className={`inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-lg shadow-purple-500/50 ${audiowide.className}`}
          >
            Book AI Discovery Call
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>
        </motion.div>
      </div>

      {/* Custom scrollbar hiding and performance optimizations */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
          -webkit-overflow-scrolling: touch;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        
        /* Hardware acceleration for smooth 60fps scrolling */
        @media (prefers-reduced-motion: no-preference) {
          .scrollbar-hide {
            scroll-snap-type: x mandatory;
            scroll-behavior: smooth;
          }
        }
        
        /* Optimize rendering performance */
        .scrollbar-hide > * {
          will-change: transform;
          transform: translateZ(0);
          backface-visibility: hidden;
          -webkit-font-smoothing: antialiased;
        }
      `}</style>
    </section>
  );
}
