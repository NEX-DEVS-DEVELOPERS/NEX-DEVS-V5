'use client'

import { useEffect, useState } from 'react'
import DebugPanel from './DebugPanel'

type Project = {
  id: number;
  title: string;
  featured?: boolean;
  status?: string;
  [key: string]: any;
}

export default function DebugPanelWrapper({ projects }: { projects: Project[] }) {
  const [showDebug, setShowDebug] = useState(false)

  useEffect(() => {
    // Only show debug panel in development or for admin users
    const isAdmin = localStorage.getItem('isAdmin') === 'true'
    const isDev = process.env.NODE_ENV === 'development'
    setShowDebug(isAdmin || isDev)
  }, [])

  if (!showDebug) return null

  return <DebugPanel projects={projects} />
} 