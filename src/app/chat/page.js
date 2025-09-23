'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import { supabase } from '@/lib/supabase'
import Header from '@/components/Header'

export default function ChatPage() {
  const [query, setQuery] = useState('')
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastHiding, setToastHiding] = useState(false)
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const bottomRef = useRef(null)
  const examples = [
    "Top 10 customers by total order value",
    "Monthly revenue for the past 12 months",
    "Best selling products this quarter",
    "Users who didn't place an order in the last 30 days",
  ]

  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) router.push('/')
  }, [loading, isAuthenticated, router])

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-hide toast (show for 5 seconds)
  useEffect(() => {
    if (!toastMessage) return
    setToastHiding(false)
    const hideTimer = setTimeout(() => {
      setToastHiding(true)
      const clearTimer = setTimeout(() => {
        setToastMessage('')
        setToastHiding(false)
      }, 300)
      return () => clearTimeout(clearTimer)
    }, 5000)
    return () => clearTimeout(hideTimer)
  }, [toastMessage])

  const executeQuery = async (e) => {
    e.preventDefault()
    if (!query.trim() || !user || isLoading) return

    const session = await supabase.auth.getSession()
    const token = session?.data?.session?.access_token
    if (!token) {
      setToastMessage("⚠️ No access token found. Please log in again.")
      return
    }

    setIsLoading(true)
    setIsStreaming(true)
    const userQuery = query.trim()
    setQuery('')
    setMessages((prev) => [
      ...prev,
      { role: 'user', type: 'message', content: userQuery },
    ])

    try {
      const url = new URL(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ask/stream`)
      url.searchParams.set('query', userQuery)

      const response = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (!response.ok) throw new Error("Unauthorized or network error")

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let firstTokenReceived = false
      let buffer = ''

      while (!done) {
        const { value, done: readerDone } = await reader.read()
        done = readerDone
        if (value) {
          buffer += decoder.decode(value, { stream: true })
      
          // Split by newlines
          const lines = buffer.split("\n")
          buffer = lines.pop() // keep incomplete chunk

        for (const line of lines) {
            const clean = line.trim()
            if (!clean || !clean.startsWith("data:")) continue  // ✅ ignore empty & invalid lines
      
            try {
              const parsed = JSON.parse(clean.replace(/^data:\s*/, ""))
      
              // ---- Token (AI message) ----
              if (parsed.type === "token" && parsed.content) {
                if (!firstTokenReceived) {
                  firstTokenReceived = true
                  // Stop showing the blue loading state as soon as streaming starts
                  setIsLoading(false)
                }
                setMessages((prev) => {
                  const next = [...prev]
                  const lastIdx = next.length - 1
      
                  if (!(next[lastIdx]?.role === "assistant" && next[lastIdx].type === "message")) {
                    next.push({ role: "assistant", type: "message", content: "" })
                  }
      
                  const idx = next.length - 1
                  next[idx] = {
                    ...next[idx],
                    content: (next[idx].content || "") + String(parsed.content),
                  }
                  return next
                })
              }
      
              // ---- Tool start ----
              else if (parsed.type === "tool_start") {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: "system",
                    type: "tool",
                    tool: parsed.tool,
                    input: parsed.input,
                    status: "running",
                    run_id: parsed.run_id,
                  },
                ])
              }
      
              // ---- Tool end ----
              else if (parsed.type === "tool_end") {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.type === "tool" && m.run_id === parsed.run_id
                      ? { ...m, output: parsed.output, status: "done" }
                      : m
                  )
                )
              }
            } catch (err) {
              console.warn("⚠️ Stream parse error:", err, line)
            }
          }
        }
      }
      
    } catch (err) {
      console.error(err)
      setToastMessage("⚠️ Could not connect to backend. Please try again.")
    } finally {
      setIsStreaming(false)
      setIsLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
     <Header />

      {/* Chat */}
      <main className="flex-1 overflow-y-auto pt-8 pb-32 px-4 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-center max-w-lg mx-auto">
              <div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Ready to query your data</h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                Ask questions in natural language and get instant SQL results.
              </p>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setQuery(ex)}
                    className="w-full text-left px-4 py-3 rounded-lg bg-white/70 dark:bg-gray-800/70 border border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 transition"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-200">{ex}</span>
                  </button>
                ))}
              </div>
            </div>
            </div>
          ) : (
          <div className="max-w-4xl mx-auto flex flex-col space-y-6">
            {messages.map((m, idx) => {
              if (m.type === 'tool') {
                return (
                  <div key={idx} className="flex justify-start">
                    <details
                      className={`mt-2 border border-gray-300 dark:border-gray-600 rounded-lg p-3 w-fit max-w-[90%] ${
                        m.status === 'running' ? 'animate-pulse' : ''
                      }`}
                      open={false}
                    >
                      <summary className="cursor-pointer font-semibold text-gray-800 dark:text-gray-200">
                        🛠️ Tool: {m.tool}
                      </summary>
                      <div className="mt-2 space-y-3 text-sm text-gray-700 dark:text-gray-300">
                        <div>
                          <span className="font-medium">Input:</span>
                          <pre className="p-2 rounded mt-1 bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap">
                            {JSON.stringify(m.input, null, 2)}
                          </pre>
                </div>
                        {m.output && (
                          <div>
                            <span className="font-medium">Output:</span>
                            <pre className="p-2 rounded mt-1 bg-gray-50 dark:bg-gray-800 whitespace-pre-wrap">
                              {String(m.output)}
                            </pre>
            </div>
          )}
        </div>
                    </details>
                  </div>
                )
              }

              return (
                <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`${
                      m.role === 'user'
                        ? 'bg-white/80 dark:bg-gray-800/80 rounded-2xl rounded-br-sm border border-gray-200 dark:border-gray-600 shadow-sm'
                        : 'bg-transparent rounded-2xl rounded-bl-sm prose prose-blue dark:prose-invert max-w-none'
                    } inline-block w-fit px-6 py-4 max-w-[95%] sm:max-w-[80%] text-base sm:text-lg whitespace-pre-wrap break-words overflow-x-auto`}
                  >
                    {m.role === 'assistant' ? (
                      <>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                          {String(m.content)}
                        </ReactMarkdown>
                        {isStreaming && idx === messages.length - 1 && (
                          <span className="ml-1 align-middle text-gray-500 dark:text-gray-400 animate-pulse">▍</span>
                        )}
                      </>
                    ) : (
                      m.content
                    )}
        </div>
      </div>
              )
            })}
          </div>
        )}
        <div ref={bottomRef} />
      </main>

      {/* Toast */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 transition-all duration-300 transform ${
            toastHiding ? 'translate-x-6 opacity-0' : 'translate-x-0 opacity-100'
          }`}
        >
          <div className="bg-gray-900 text-white px-4 py-3 rounded-lg shadow-lg">{toastMessage}</div>
        </div>
      )}

      {/* Input */}
      <form
        onSubmit={executeQuery}
        className="fixed bottom-0 left-0 right-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 p-6"
      >
        <div className="max-w-4xl mx-auto flex gap-4">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your data..."
            className="flex-1 px-6 py-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white/50 dark:bg-gray-700/50 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 text-lg"
                  disabled={isLoading}
                />
              <button
                type="submit"
                disabled={!query.trim() || isLoading}
            className="p-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:bg-gray-300 flex items-center justify-center shadow-lg"
              >
                {isLoading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 dark:border-blue-400 border-t-transparent"></div>
                ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                )}
              </button>
            </div>
          </form>
    </div>
  )
}
