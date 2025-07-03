'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { PhoneIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

export default function PhoneIconButton() {
  return (
    <Link href="/contact">
      <motion.button 
        className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full shadow-md transition"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <PhoneIcon className="h-5 w-5" />
      </motion.button>
    </Link>
  )
} 