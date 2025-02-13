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
  details?: string[];
}

export default function BlogCard({ title, excerpt, slug, category, date, readTime, details = [] }: BlogCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="bg-zinc-900/50 rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 backdrop-blur-sm"
    >
      <Link href={`/blog/${slug}`} className="block p-6">
        <div className="flex items-center gap-4 text-sm text-purple-400 mb-3">
          <span className="bg-purple-500/10 px-3 py-1 rounded-full">{category}</span>
          <span>•</span>
          <span>{date}</span>
          <span>•</span>
          <span>{readTime} min read</span>
        </div>
        <h2 className="text-xl font-bold mb-3 text-white group-hover:text-purple-400 transition-colors">
          {title}
        </h2>
        <p className="text-gray-400 mb-4">{excerpt}</p>
        {details.length > 0 && (
          <div className="space-y-2">
            {details.map((detail, index) => (
              <div key={index} className="flex items-start gap-2 text-sm text-gray-300">
                <span className="text-purple-400">•</span>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  );
} 