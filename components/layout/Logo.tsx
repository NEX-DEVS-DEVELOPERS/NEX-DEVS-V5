import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center">
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="mr-2"
        >
          <motion.path
            d="M20 4L4 12L20 20L36 12L20 4Z"
            fill="currentColor"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          />
          <motion.path
            d="M4 20L20 28L36 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <motion.path
            d="M4 28L20 36L36 28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          />
        </svg>
        <div>
          <span className="text-2xl font-bold tracking-tight">NEX-WEBS</span>
          <span className="text-sm text-gray-500 ml-2 hidden sm:inline">MAKE IT EASY FOR YOU</span>
        </div>
      </motion.div>
    </Link>
  );
} 