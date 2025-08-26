'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

const WEEKS_PER_YEAR = 52
const MAX_YEARS = 90
const TOTAL_WEEKS = MAX_YEARS * WEEKS_PER_YEAR

function WeekGrid({ weeksLived }: { weeksLived: number }) {
  // Create path strings for filled and empty weeks for better performance
  let filledPath = ''
  let emptyPath = ''
  
  for (let year = 0; year < MAX_YEARS; year++) {
    for (let week = 0; week < WEEKS_PER_YEAR; week++) {
      const weekIndex = year * WEEKS_PER_YEAR + week
      const x = week * 12 + 1
      const y = year * 12 + 1
      const pathData = `M${x + 2},${y} L${x + 8},${y} Q${x + 10},${y} ${x + 10},${y + 2} L${x + 10},${y + 8} Q${x + 10},${y + 10} ${x + 8},${y + 10} L${x + 2},${y + 10} Q${x},${y + 10} ${x},${y + 8} L${x},${y + 2} Q${x},${y} ${x + 2},${y} Z `
      
      if (weekIndex < weeksLived) {
        filledPath += pathData
      } else {
        emptyPath += pathData
      }
    }
  }

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <svg
        viewBox="0 0 624 1080"
        className="w-full h-auto border border-neutral-800 rounded-lg bg-neutral-900/50"
        aria-label="Life grid showing weeks lived and remaining"
      >
        {emptyPath && <path d={emptyPath} fill="#262626" />}
        {filledPath && <path d={filledPath} fill="#d4d4d8" />}
      </svg>
    </div>
  )
}

function calculateWeeksFromBirth(birthDate: string): number {
  if (!birthDate) return 0
  
  const birth = new Date(birthDate)
  const today = new Date()
  
  if (birth > today) return 0
  
  const diffTime = today.getTime() - birth.getTime()
  const diffWeeks = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 7))
  
  return Math.min(diffWeeks, TOTAL_WEEKS)
}

function formatNumber(num: number): string {
  return num.toLocaleString()
}

export default function LifeInWeeksPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [age, setAge] = useState(25)
  const [inputMode, setInputMode] = useState<'age' | 'dob'>('age')
  const [birthDate, setBirthDate] = useState('')
  
  const weeksLived = inputMode === 'age' 
    ? Math.min(age * WEEKS_PER_YEAR, TOTAL_WEEKS)
    : calculateWeeksFromBirth(birthDate)

  // Initialize age from URL params
  useEffect(() => {
    const ageParam = searchParams.get('age')
    if (ageParam) {
      const parsedAge = parseInt(ageParam, 10)
      if (!isNaN(parsedAge) && parsedAge >= 0 && parsedAge <= MAX_YEARS) {
        setAge(parsedAge)
      }
    }
  }, [searchParams])

  // Update URL when age changes
  useEffect(() => {
    if (inputMode === 'age') {
      const url = new URL(window.location.href)
      url.searchParams.set('age', age.toString())
      router.replace(url.pathname + url.search, { scroll: false })
    }
  }, [age, inputMode, router])

  const handleAgeChange = (newAge: number) => {
    const clampedAge = Math.max(0, Math.min(MAX_YEARS, newAge))
    setAge(clampedAge)
  }

  const handleBirthDateChange = (date: string) => {
    setBirthDate(date)
    if (date) {
      const weeks = calculateWeeksFromBirth(date)
      const calculatedAge = Math.floor(weeks / WEEKS_PER_YEAR)
      setAge(calculatedAge)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      {/* Header */}
      <header className="px-4 py-6 border-b border-neutral-800">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← curious.fun
          </Link>
          <h1 className="text-xl font-semibold">Life in Weeks</h1>
          <div></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-6">
        {/* Controls */}
        <div className="mb-8 space-y-6">
          {/* Mode Toggle */}
          <div className="flex gap-4">
            <button
              onClick={() => setInputMode('age')}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                inputMode === 'age' 
                  ? 'bg-white text-black' 
                  : 'bg-neutral-800 text-gray-400 hover:text-white'
              }`}
            >
              Age in Years
            </button>
            <button
              onClick={() => setInputMode('dob')}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                inputMode === 'dob' 
                  ? 'bg-white text-black' 
                  : 'bg-neutral-800 text-gray-400 hover:text-white'
              }`}
            >
              Date of Birth
            </button>
          </div>

          {inputMode === 'age' ? (
            /* Age Controls */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="age-slider" className="block text-sm text-gray-400 mb-2">
                  Age (years)
                </label>
                <input
                  id="age-slider"
                  type="range"
                  min="0"
                  max={MAX_YEARS}
                  value={age}
                  onChange={(e) => handleAgeChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer slider"
                  aria-label="Age in years"
                />
              </div>
              <div>
                <label htmlFor="age-input" className="block text-sm text-gray-400 mb-2">
                  Exact Age
                </label>
                <input
                  id="age-input"
                  type="number"
                  min="0"
                  max={MAX_YEARS}
                  value={age}
                  onChange={(e) => handleAgeChange(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white focus:border-neutral-500 focus:outline-none"
                  aria-label="Age in years input"
                />
              </div>
            </div>
          ) : (
            /* Date of Birth Control */
            <div>
              <label htmlFor="dob-input" className="block text-sm text-gray-400 mb-2">
                Date of Birth
              </label>
              <input
                id="dob-input"
                type="date"
                value={birthDate}
                onChange={(e) => handleBirthDateChange(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full md:w-auto px-3 py-2 bg-neutral-800 border border-neutral-700 rounded text-white focus:border-neutral-500 focus:outline-none"
                aria-label="Date of birth"
              />
            </div>
          )}

          {/* Summary */}
          <div className="p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <p className="text-center text-gray-300">
              <span className="font-semibold text-white">{formatNumber(weeksLived)}</span> of{' '}
              <span className="font-semibold text-white">{formatNumber(TOTAL_WEEKS)}</span> weeks passed
            </p>
          </div>
        </div>

        {/* Week Grid */}
        <WeekGrid weeksLived={weeksLived} />
        
        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Each square represents one week. This visualization assumes a 90-year lifespan.
          </p>
        </footer>
      </main>
    </div>
  )
}
