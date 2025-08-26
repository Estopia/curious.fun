import React, { ReactNode } from 'react'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'curious.fun',
  description: 'A collection of small interactive experiences',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
        {/* Header */}
        <header className="px-4 py-6">
          <div className="max-w-5xl mx-auto flex justify-between items-center">
            <Link 
              href="/" 
              className="text-xl font-semibold hover:text-gray-300 transition-colors"
            >
              curious.fun
            </Link>
            <Link 
              href="/about" 
              className="text-sm hover:text-gray-300 transition-colors"
            >
              about
            </Link>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4">
          {children}
        </main>

        {/* Footer */}
        <footer className="px-4 py-6 mt-16">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm text-gray-500 text-center">
              © {new Date().getFullYear()} curious.fun – made for fun
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
