'use client';  // Add this at the top since we're using framer-motion

import Link from 'next/link';
import { motion } from 'framer-motion';

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  details: string[];
}

export default function BlogCard({ title, excerpt, slug, category, date, readTime, details }: BlogCardProps) {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 neon-border-cyan-base transition-all group">
      <div className="flex flex-col h-full">
        <div className="mb-4">
          <span className="text-purple-400 text-sm">{category}</span>
          <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
            <span>{date}</span>
            <span>•</span>
            <span>{readTime} min read</span>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 mb-4 flex-grow">{excerpt}</p>
        
        <a 
          href={`/blog/${slug}`} 
          className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors group"
        >
          Read More 
          <svg 
            className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5l7 7-7 7"
            />
          </svg>
        </a>
      </div>
    </div>
  );
} 
