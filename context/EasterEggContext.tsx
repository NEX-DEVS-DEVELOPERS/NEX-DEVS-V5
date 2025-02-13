'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Define all possible easter eggs
export const EASTER_EGGS = {
  // From page.tsx
  'konami': 'Found the Konami code sequence',
  'terminal': 'Discovered the secret terminal',
  'tech-achievement': 'Clicked tech stack icons multiple times',
  'source-code': 'Found the source code easter egg',
  // From work page
  'work-achievement': 'Discovered the hidden work achievement',
  'stats-master': 'Unlocked the secret stats sequence',
  // Add other easter eggs from other pages here
} as const

type EasterEggContextType = {
  foundEasterEggs: Set<string>
  addEasterEgg: (eggName: keyof typeof EASTER_EGGS) => void
  totalEasterEggs: number
  getEasterEggDescription: (eggName: string) => string | undefined
}

const EasterEggContext = createContext<EasterEggContextType | undefined>(undefined)

export function EasterEggProvider({ children }: { children: ReactNode }) {
  const [foundEasterEggs, setFoundEasterEggs] = useState<Set<string>>(new Set())
  const totalEasterEggs = Object.keys(EASTER_EGGS).length // Automatically calculate total from defined eggs

  // Load found easter eggs from localStorage
  useEffect(() => {
    const savedEggs = localStorage.getItem('foundEasterEggs')
    if (savedEggs) {
      setFoundEasterEggs(new Set(JSON.parse(savedEggs)))
    }
  }, [])

  // Save to localStorage when eggs are found
  useEffect(() => {
    localStorage.setItem('foundEasterEggs', JSON.stringify([...foundEasterEggs]))
  }, [foundEasterEggs])

  const addEasterEgg = (eggName: keyof typeof EASTER_EGGS) => {
    if (EASTER_EGGS[eggName]) { // Only add valid easter eggs
      setFoundEasterEggs(prev => {
        const newSet = new Set(prev)
        newSet.add(eggName)
        return newSet
      })
    }
  }

  const getEasterEggDescription = (eggName: string) => {
    return EASTER_EGGS[eggName as keyof typeof EASTER_EGGS]
  }

  return (
    <EasterEggContext.Provider value={{ 
      foundEasterEggs, 
      addEasterEgg, 
      totalEasterEggs,
      getEasterEggDescription 
    }}>
      {children}
    </EasterEggContext.Provider>
  )
}

export function useEasterEggs() {
  const context = useContext(EasterEggContext)
  if (context === undefined) {
    throw new Error('useEasterEggs must be used within an EasterEggProvider')
  }
  return context
} 