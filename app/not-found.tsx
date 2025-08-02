'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-screen bg-[var(--color-neutral)]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Accent Shape */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[600px] h-[600px] bg-[var(--color-primary)] rounded-full blur-3xl opacity-20 top-[-200px] left-[-200px]" />
        <div className="absolute w-[500px] h-[500px] bg-[var(--color-accent)] rounded-full blur-3xl opacity-20 bottom-[-150px] right-[-150px]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center">
        <h1 className="text-7xl font-bold text-[var(--color-primary)] mb-4">404</h1>
        <p className="text-lg text-gray-700 mb-6">
          Oops! The page you are looking for doesn’t exist.
        </p>
        <Link
          href="/"
          className="flex items-center justify-center gap-2 px-5 py-3 rounded-lg 
                     bg-[var(--color-primary)] text-white hover:bg-[var(--color-accent)]
                     transition-all duration-300 hover:gap-3"
        >
          <ArrowLeft className="w-5 h-5" />
          Go back home
        </Link>
      </div>
    </motion.div>
  )
}