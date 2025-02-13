'use client';

import { motion } from 'framer-motion';

interface TestimonialProps {
  content: string;
  author: string;
  role: string;
}

export default function BlogTestimonial({ content, author, role }: TestimonialProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-zinc-900/50 p-6 rounded-xl border border-purple-500/20"
    >
      <p className="text-gray-300 italic mb-4">"{content}"</p>
      <div className="flex items-center gap-2">
        <div>
          <p className="font-semibold text-white">{author}</p>
          <p className="text-sm text-purple-400">{role}</p>
        </div>
      </div>
    </motion.div>
  );
} 