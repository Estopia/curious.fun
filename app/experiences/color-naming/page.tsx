'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { hslToHex, stepToHsl } from '../../../lib/color'

const TOTAL_STEPS = 101

type GameMode = 'auto' | 'manual'
type Choice = 'green' | 'blue'

interface StepData {
  green: number
  blue: number
  userChoice?: Choice
}

function generateFakeDistribution(step: number): { green: number; blue: number } {
  // Bias toward green for early steps, blue for later steps
  const greenBias = Math.max(0, (50 - step) / 50)
  const baseProbability = 0.3 + greenBias * 0.4
  
  const green = Math.floor(baseProbability * 100 + Math.random() * 20)
  const blue = 100 - green
  
  return { green, blue }
}

function ProgressRing({ step, total }: { step: number; total: number }) {
  const progress = (step / (total - 1)) * 100
  const circumference = 2 * Math.PI * 16 // radius = 16
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-400">{step + 1} of {total}</span>
      <svg className="w-8 h-8 transform -rotate-90" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-neutral-800"
          strokeWidth="2"
        />
        <circle
          cx="18"
          cy="18"
          r="16"
          fill="none"
          className="stroke-blue-500"
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

function ColorNamingGame() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [step, setStep] = useState(0)
  const [mode, setMode] = useState<GameMode>('auto')
  const [sessionData, setSessionData] = useState<{ [key: number]: StepData }>({})
  const [showRecap, setShowRecap] = useState(false)
  const [showDebug, setShowDebug] = useState(false)

  // Load data from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('color-naming-session')
    if (saved) {
      try {
        setSessionData(JSON.parse(saved))
      } catch (e) {
        console.error('Failed to parse session data:', e)
      }
    }
    
    // Initialize URL params
    const stepParam = searchParams.get('step')
    const modeParam = searchParams.get('mode')
    
    if (stepParam) {
      const parsedStep = parseInt(stepParam, 10)
      if (!isNaN(parsedStep) && parsedStep >= 0 && parsedStep < TOTAL_STEPS) {
        setStep(parsedStep)
      }
    }
    
    if (modeParam === 'auto' || modeParam === 'manual') {
      setMode(modeParam)
    }
  }, [searchParams])

  // Update URL when state changes
  useEffect(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('step', step.toString())
    url.searchParams.set('mode', mode)
    router.replace(url.pathname + url.search, { scroll: false })
  }, [step, mode, router])

  // Save to localStorage when session data changes
  useEffect(() => {
    localStorage.setItem('color-naming-session', JSON.stringify(sessionData))
  }, [sessionData])

  const currentHsl = stepToHsl(step, TOTAL_STEPS)
  const currentHex = hslToHex(currentHsl.h, currentHsl.s, currentHsl.l)
  const currentStepData = sessionData[step] || generateFakeDistribution(step)

  const handleChoice = (choice: Choice) => {
    const newData = { ...sessionData }
    
    if (!newData[step]) {
      newData[step] = generateFakeDistribution(step)
    }
    
    // Record user choice
    newData[step].userChoice = choice
    
    // Update fake statistics (simulate other users)
    if (choice === 'green') {
      newData[step].green += 1
    } else {
      newData[step].blue += 1
    }
    
    setSessionData(newData)
    
    // Auto advance in auto mode
    if (mode === 'auto' && step < TOTAL_STEPS - 1) {
      setStep(step + 1)
    }
  }

  const findSwitchPoint = (): number | null => {
    for (let i = 1; i < TOTAL_STEPS; i++) {
      const prevChoice = sessionData[i - 1]?.userChoice
      const currChoice = sessionData[i]?.userChoice
      
      if (prevChoice === 'green' && currChoice === 'blue') {
        return i
      }
    }
    return null
  }

  const findSessionAverageSwitch = (): number | null => {
    // Simplified: find where session data shows blue > green for first time
    for (let i = 0; i < TOTAL_STEPS; i++) {
      const data = sessionData[i]
      if (data && data.blue > data.green) {
        return i
      }
    }
    return null
  }

  const exportChoices = () => {
    const choices: { [key: number]: Choice } = {}
    Object.entries(sessionData).forEach(([stepStr, data]) => {
      if (data.userChoice) {
        choices[parseInt(stepStr)] = data.userChoice
      }
    })
    
    const blob = new Blob([JSON.stringify(choices, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'color-naming-choices.json'
    a.click()
    URL.revokeObjectURL(url)
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
          <h1 className="text-xl font-semibold">Color Naming Game</h1>
          <div></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-6">
        {/* Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setMode('auto')}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                mode === 'auto' 
                  ? 'bg-white text-black' 
                  : 'bg-neutral-800 text-gray-400 hover:text-white'
              }`}
            >
              Auto Advance
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`px-3 py-2 rounded text-sm transition-colors ${
                mode === 'manual' 
                  ? 'bg-white text-black' 
                  : 'bg-neutral-800 text-gray-400 hover:text-white'
              }`}
            >
              Manual Slider
            </button>
          </div>
          
          <ProgressRing step={step} total={TOTAL_STEPS} />
        </div>

        {/* Manual Slider */}
        {mode === 'manual' && (
          <div className="mb-6">
            <input
              type="range"
              min="0"
              max={TOTAL_STEPS - 1}
              value={step}
              onChange={(e) => setStep(parseInt(e.target.value))}
              className="w-full h-2 bg-neutral-800 rounded-lg appearance-none cursor-pointer"
              aria-label="Color step slider"
            />
          </div>
        )}

        {/* Color Swatch */}
        <div className="flex flex-col items-center space-y-6">
          <div 
            className="w-48 h-48 md:w-64 md:h-64 aspect-square rounded-xl border border-neutral-800 transition-colors duration-300"
            style={{ backgroundColor: currentHex }}
            aria-label={`Current color: ${currentHex}, HSL(${Math.round(currentHsl.h)}, ${Math.round(currentHsl.s * 100)}%, ${Math.round(currentHsl.l * 100)}%)`}
          />

          {/* Debug Info */}
          {showDebug && (
            <div className="text-xs text-gray-500 text-center">
              <p>Hex: {currentHex}</p>
              <p>HSL: ({Math.round(currentHsl.h)}, {Math.round(currentHsl.s * 100)}%, {Math.round(currentHsl.l * 100)}%)</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 w-full max-w-md">
            <button
              onClick={() => handleChoice('green')}
              className="flex-1 py-4 px-6 bg-transparent border border-neutral-800 rounded-lg hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Choose Green"
            >
              <span className="text-lg font-semibold">Green</span>
            </button>
            <button
              onClick={() => handleChoice('blue')}
              className="flex-1 py-4 px-6 bg-transparent border border-neutral-800 rounded-lg hover:bg-neutral-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Choose Blue"
            >
              <span className="text-lg font-semibold">Blue</span>
            </button>
          </div>

          {/* Feedback */}
          <div className="text-center text-sm text-gray-400">
            {sessionData[step] && (
              <p>
                {Math.round((currentStepData.green / (currentStepData.green + currentStepData.blue)) * 100)}% chose green, {' '}
                {Math.round((currentStepData.blue / (currentStepData.green + currentStepData.blue)) * 100)}% chose blue
              </p>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="mt-8 flex justify-center gap-4 text-xs">
          <button
            onClick={() => setShowRecap(!showRecap)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showRecap ? 'Hide' : 'Show'} Recap
          </button>
          <button
            onClick={() => setShowDebug(!showDebug)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {showDebug ? 'Hide' : 'Show'} Debug
          </button>
          <button
            onClick={exportChoices}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Export Choices
          </button>
        </div>

        {/* Recap Panel */}
        {showRecap && (
          <div className="mt-6 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Switch Point Analysis</h3>
            <div className="space-y-2 text-sm text-gray-300">
              <p>
                <span className="text-gray-400">Your switch point:</span>{' '}
                {findSwitchPoint() !== null ? `Step ${findSwitchPoint()}` : 'N/A'}
              </p>
              <p>
                <span className="text-gray-400">Session average:</span>{' '}
                {findSessionAverageSwitch() !== null ? `Step ${findSessionAverageSwitch()}` : 'N/A'}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Explore the boundary where green becomes blue. Each step changes the hue slightly.
          </p>
        </footer>
      </main>
    </div>
  )
}

export default function ColorNamingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0f0f0f] text-white flex items-center justify-center">Loading...</div>}>
      <ColorNamingGame />
    </Suspense>
  )
}
