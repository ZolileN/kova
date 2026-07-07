"use client"

import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { Calendar, Plane, Clock, CheckSquare, Wallet, Users, Bot, ArrowLeft, Search } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { fetchAPI } from "@/lib/api"

export default function JourneyLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const pathname = usePathname()
  const journeyId = params.id
  const basePath = `/journeys/${journeyId}`

  const tabs = [
    { name: "Timeline", href: basePath, icon: Clock },
    { name: "Tasks", href: `${basePath}/tasks`, icon: CheckSquare },
    { name: "Budget", href: `${basePath}/budget`, icon: Wallet },
    { name: "Members", href: `${basePath}/members`, icon: Users },
    { name: "AI Concierge", href: `${basePath}/ai`, icon: Bot },
  ]

  interface JourneyData {
    id: string;
    title: string;
    journey_type_code: string;
    start_date: string;
    end_date: string;
    status: string;
  }

  const [journey, setJourney] = useState<JourneyData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadJourney() {
      try {
        const data = await fetchAPI(`/journeys/${journeyId}`)
        setJourney(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadJourney()
  }, [journeyId])

  return (
    <div className="flex w-full min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Navigation Bar */}
        <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search journeys, tasks, expenses..."
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg h-9 pl-9 pr-12 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-400 font-mono">⌘K</kbd>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-orange-500/20 cursor-pointer">
              ZN
            </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full space-y-8 mt-2">
          
          <Link href="/" className="inline-flex items-center text-sm text-zinc-400 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>

          {/* Hero Header */}
          <div className="relative w-full h-[280px] rounded-2xl overflow-hidden border border-zinc-800 shadow-xl">
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop")' }} />
            <div className="absolute inset-0 bg-linear-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
            
            <div className="relative z-10 p-8 h-full flex flex-col justify-center max-w-2xl">
              {loading ? (
                <div className="text-zinc-500">Loading journey...</div>
              ) : journey ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="inline-flex items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
                      <Plane className="w-3.5 h-3.5 mr-1.5" />
                      {journey.journey_type_code}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                      <Clock className="w-3 h-3 mr-1" />
                      {journey.status}
                    </span>
                  </div>
                  
                  <h1 className="text-4xl font-bold text-white mb-4">{journey.title}</h1>
                  
                  <div className="flex items-center gap-6 text-sm text-zinc-300 mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-zinc-500" />
                      {new Date(journey.start_date).toLocaleDateString()} – {new Date(journey.end_date).toLocaleDateString()}
                    </div>
                  </div>

                  <p className="text-zinc-400 text-sm">
                    Your perfectly orchestrated {journey.journey_type_code} journey awaits.
                  </p>
                </>
              ) : (
                <div className="text-red-500">Journey not found.</div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center border-b border-zinc-800">
            {tabs.map((tab) => {
              const isActive = pathname === tab.href
              const Icon = tab.icon
              return (
                <Link
                  key={tab.name}
                  href={tab.href}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-orange-500 text-orange-500"
                      : "border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {tab.name}
                </Link>
              )
            })}
          </div>

          {/* Content Area */}
          <div className="pt-2">
            {children}
          </div>

        </div>
      </main>
      <CommandPalette />
    </div>
  )
}
