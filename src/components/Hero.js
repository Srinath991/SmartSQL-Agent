'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function Hero() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()

  const handleTryItOut = (e) => {
    e.preventDefault()
    e.stopPropagation()

    console.log('Try it out button clicked!')
    console.log('Current user:', user)
    console.log('Is authenticated:', isAuthenticated)

    if (isAuthenticated) {
      // User is authenticated, go directly to chat
      console.log('User is authenticated, navigating to chat')
      router.push('/chat')
    } else {
      // User is not authenticated, go to auth page
      console.log('User not authenticated, navigating to auth page')
      router.push('/auth')
    }
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center px-4 relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }} />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto text-center">
            {/* Logo/Icon */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl mb-4 shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
            SmartSQL Agent
            </h1>

            {/* Tagline */}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 font-light">
              Ask questions, get SQL answers instantly.
            </p>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Natural Language Queries</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Instant Results</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>AI for SQL Queries</span>
              </div>
            </div>

            {/* CTA Section */}
            <button
              type="button"
              disabled={loading}
              onClick={handleTryItOut}
              className="group bg-blue-600 hover:bg-blue-700 text-white px-12 py-4 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl font-medium text-xl mx-auto"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Try it out</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </main>
      </div>
    </div>
  )
}
