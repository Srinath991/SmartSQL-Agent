// components/Header.js
'use client'
import Link from 'next/link'
import AccountMenu from './AccountMenu'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { isAuthenticated } = useAuth()

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0-2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
              </svg>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">SmartSQL</span>
          </Link>

          <div className="flex items-center relative">
            {isAuthenticated ? <AccountMenu /> : (
              <Link href="/auth" className="px-3 py-2 rounded-lg text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition">
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
