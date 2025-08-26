'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ITEMS, Item } from '../../../data/items'

const INITIAL_BUDGET = 1000000000000 // $1 trillion

interface Purchase {
  [itemId: string]: number
}

function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString()}`
}

function BudgetFlash({ flash }: { flash: 'increase' | 'decrease' | null }) {
  if (!flash) return null
  
  return (
    <div 
      className={`absolute inset-0 rounded-lg pointer-events-none ${
        flash === 'increase' ? 'bg-green-500/20' : 'bg-red-500/20'
      } animate-ping`}
    />
  )
}

export default function SpendTrillionPage() {
  const [budget, setBudget] = useState(INITIAL_BUDGET)
  const [purchases, setPurchases] = useState<Purchase>({})
  const [budgetFlash, setBudgetFlash] = useState<'increase' | 'decrease' | null>(null)

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('spend-trillion-lite')
    if (savedData) {
      try {
        const { budget: savedBudget, purchases: savedPurchases } = JSON.parse(savedData)
        setBudget(savedBudget)
        setPurchases(savedPurchases)
      } catch (e) {
        console.error('Failed to parse saved data:', e)
      }
    }
  }, [])

  // Save to localStorage whenever budget or purchases change
  useEffect(() => {
    localStorage.setItem('spend-trillion-lite', JSON.stringify({ budget, purchases }))
  }, [budget, purchases])

  const handlePurchase = (item: Item) => {
    if (budget >= item.price) {
      setBudget(prev => prev - item.price)
      setPurchases(prev => ({
        ...prev,
        [item.id]: (prev[item.id] || 0) + 1
      }))
      setBudgetFlash('decrease')
      setTimeout(() => setBudgetFlash(null), 300)
    }
  }

  const handleSell = (item: Item) => {
    const currentQuantity = purchases[item.id] || 0
    if (currentQuantity > 0) {
      setBudget(prev => prev + item.price)
      setPurchases(prev => ({
        ...prev,
        [item.id]: Math.max(0, currentQuantity - 1)
      }))
      setBudgetFlash('increase')
      setTimeout(() => setBudgetFlash(null), 300)
    }
  }

  const handleReset = () => {
    setBudget(INITIAL_BUDGET)
    setPurchases({})
    localStorage.removeItem('spend-trillion-lite')
  }

  const totalPurchased = Object.values(purchases).reduce((sum, qty) => sum + qty, 0)
  const isCompleted = budget <= 0

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
          <h1 className="text-xl font-semibold">Spend a Trillion Lite</h1>
          <div></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-6">
        {/* Budget Display */}
        <div className="text-center mb-8 relative">
          <BudgetFlash flash={budgetFlash} />
          <div className="relative z-10">
            <h2 className="text-lg text-gray-400 mb-2">Remaining Budget</h2>
            <div className={`font-mono text-3xl font-bold transition-colors ${
              budget <= 0 ? 'text-red-400' : 'text-green-400'
            }`}>
              {formatCurrency(budget)}
            </div>
          </div>
        </div>

        {/* Success Banner */}
        {isCompleted && (
          <div className="mb-8 p-6 bg-green-900/30 border border-green-700 rounded-lg text-center">
            <h3 className="text-2xl font-bold text-green-400 mb-4">🎉 You spent a trillion!</h3>
            <p className="text-green-200 mb-4">Congratulations! You've successfully spent your entire budget.</p>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors"
            >
              Start Over
            </button>
          </div>
        )}

        {/* Reset Button */}
        {!isCompleted && totalPurchased > 0 && (
          <div className="mb-6 text-center">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-neutral-800 hover:bg-neutral-700 text-gray-300 rounded transition-colors"
            >
              Reset
            </button>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-4">
          {ITEMS.map((item) => {
            const quantity = purchases[item.id] || 0
            const canPurchase = budget >= item.price
            const canSell = quantity > 0

            return (
              <div 
                key={item.id}
                className="rounded-lg border border-neutral-800 p-4 flex justify-between items-center hover:border-neutral-700 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <p className="text-sm text-gray-400">{formatCurrency(item.price)}</p>
                </div>

                <div className="flex items-center gap-4">
                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSell(item)}
                      disabled={!canSell}
                      className="px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label={`Sell ${item.name}`}
                    >
                      −
                    </button>
                    
                    <span className="w-12 text-center font-mono text-sm">
                      {quantity}
                    </span>
                    
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canPurchase}
                      className="px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      aria-label={`Buy ${item.name}`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Cart Summary */}
        {totalPurchased > 0 && (
          <div className="mt-8 p-4 bg-neutral-900/50 border border-neutral-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Purchase Summary</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {ITEMS.filter(item => purchases[item.id] > 0).map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-300">
                    {item.name} × {purchases[item.id]}
                  </span>
                  <span className="text-green-400 font-mono">
                    {formatCurrency(item.price * purchases[item.id])}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-700 mt-4 pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Spent:</span>
                <span className="text-green-400 font-mono">
                  {formatCurrency(INITIAL_BUDGET - budget)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <p className="text-xs text-gray-500">
            Try to spend your entire trillion dollar budget. Can you do it?
          </p>
        </footer>
      </main>

      {/* CSS for animations */}
      <style jsx>{`
        .animate-ping {
          animation: ping 0.3s cubic-bezier(0, 0, 0.2, 1);
        }
        
        @keyframes ping {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          75%, 100% {
            transform: scale(1.05);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
