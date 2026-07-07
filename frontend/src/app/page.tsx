"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { usePathname } from "next/navigation"
import { Search, MapPin, Plane, Building2, Train, Car, Plus, Sparkles, Send, Bot } from "lucide-react"
import { fetchAPI } from "@/lib/api"
import Link from "next/link"

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  
  interface JourneyData {
    id: string;
    title: string;
    journey_type_code: string;
    start_date: string;
    end_date: string;
    status: string;
  }
  
  const [journeys, setJourneys] = useState<JourneyData[]>([])
  const [loading, setLoading] = useState(true)

  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Ciao! I am your Kova Concierge. I can help refine your timeline, check flight options, or file expenses. What are we planning today?" }
  ])

  useEffect(() => {
    const loadJourneys = async () => {
      try {
        const data = await fetchAPI("/journeys")
        setJourneys(data)
      } catch (error) {
        console.error("Failed to fetch journeys:", error)
      } finally {
        setLoading(false)
      }
    }
    loadJourneys()
  }, [])

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    setChatHistory([...chatHistory, { role: "user", content: chatMessage }])
    setChatMessage("")

    setTimeout(() => {
      setChatHistory(prev => [...prev, { role: "assistant", content: "I've noted that! I can automatically add that to your timeline if you'd like." }])
    }, 1000)
  }

  return (
    <div className="flex w-full min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden font-sans">
      <Sidebar />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="flex items-center justify-between px-8 py-4 border-b border-zinc-900 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search journeys, tasks, expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-lg h-9 pl-9 pr-12 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500 transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-zinc-800 border border-zinc-700 rounded text-[10px] text-zinc-400 font-mono">⌘K</kbd>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-sm font-bold text-white shadow-md shadow-orange-500/20 cursor-pointer hover:bg-orange-600 transition-colors">
              ZN
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 p-8 max-w-[1600px] mx-auto w-full">
          
          <div className="xl:col-span-2 space-y-12">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-500 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                The AI Journey Operating System
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
                Every journey, perfectly orchestrated.
              </h1>
              <p className="text-zinc-400 text-lg max-w-2xl leading-relaxed">
                Plan, coordinate and execute travel for individuals, groups and businesses — all in one elegant workspace.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="bg-zinc-900/40 border border-zinc-800 rounded-2xl p-8 shadow-xl max-w-4xl mx-auto backdrop-blur-sm mt-8">
                <h2 className="text-2xl font-bold text-white mb-6">Where to?</h2>
                
                <div className="flex items-center gap-3 mb-6">
                  <button className="px-5 py-2 rounded-full text-sm font-medium bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors border border-zinc-700">Business travel</button>
                  <button className="px-5 py-2 rounded-full text-sm font-medium bg-zinc-100 text-zinc-900 shadow-md">Personal travel</button>
                  <button className="px-5 py-2 rounded-full text-sm font-medium bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 transition-colors border border-zinc-700">Group travel</button>
                </div>

                <div className="relative mb-6">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <input 
                    type="text" 
                    defaultValue="London" 
                    className="w-full h-14 pl-12 pr-14 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-orange-500 text-zinc-100 text-lg transition-colors"
                  />
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-orange-500 hover:bg-orange-600 rounded-lg flex items-center justify-center text-white transition-colors shadow-md shadow-orange-500/20">
                    <Search className="w-5 h-5" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center px-4 py-2 rounded-full text-sm font-medium border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <Plane className="w-4 h-4 mr-2 text-zinc-400" /> Flights
                  </button>
                  <button className="flex items-center px-4 py-2 rounded-full text-sm font-medium border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <Building2 className="w-4 h-4 mr-2 text-zinc-400" /> Hotels
                  </button>
                  <button className="flex items-center px-4 py-2 rounded-full text-sm font-medium border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <Train className="w-4 h-4 mr-2 text-zinc-400" /> Trains
                  </button>
                  <button className="flex items-center px-4 py-2 rounded-full text-sm font-medium border border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:bg-zinc-800 transition-colors">
                    <Car className="w-4 h-4 mr-2 text-zinc-400" /> Rental cars
                  </button>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-12 max-w-4xl mx-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Your Journeys</h3>
                <button className="flex items-center px-3 py-1.5 text-xs font-semibold text-orange-500 bg-orange-500/10 hover:bg-orange-500/20 rounded-lg transition-colors border border-orange-500/20">
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  New
                </button>
              </div>

              {loading ? (
                <div className="text-zinc-500 text-sm">Loading journeys...</div>
              ) : journeys.length === 0 ? (
                <div className="text-zinc-500 text-sm">No journeys found. Create one to get started!</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {journeys.map((journey) => (
                    <Link key={journey.id} href={`/journeys/${journey.id}`}>
                      <div className="group relative rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900/50 hover:border-zinc-700 transition-all cursor-pointer">
                        <div className="h-40 w-full relative overflow-hidden">
                          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop")' }} />
                          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent z-10" />
                          <div className="absolute top-4 right-4 z-20">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">
                              {journey.status}
                            </span>
                          </div>
                        </div>
                        <div className="p-5 relative z-10">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-1">{journey.journey_type_code}</p>
                          <h4 className="text-lg font-bold text-white mb-3 group-hover:text-orange-500 transition-colors">{journey.title}</h4>
                          <div className="flex items-center justify-between text-xs text-zinc-400">
                            <div className="flex items-center gap-3">
                              <div className="flex -space-x-2">
                                <div className="w-6 h-6 rounded-full border-2 border-zinc-900 bg-orange-500 flex items-center justify-center text-[8px] font-bold text-white">ZN</div>
                              </div>
                            </div>
                            <span className="font-mono bg-zinc-900 px-2 py-1 rounded border border-zinc-800 text-zinc-500">{new Date(journey.start_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 flex flex-col h-[600px] overflow-hidden sticky top-24">
              <div className="px-5 py-4 border-b border-zinc-900 bg-zinc-900/50 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center mr-3">
                    <Bot className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-100">Kova Concierge</h3>
                    <p className="text-[10px] text-zinc-500">Always active</p>
                  </div>
                </div>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
              </div>

              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-orange-500 text-white font-medium"
                          : "bg-zinc-900 text-zinc-300 border border-zinc-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendChat} className="p-4 border-t border-zinc-900 bg-zinc-900/30 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask Kova..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-zinc-950 border border-zinc-800 rounded-full h-10 px-4 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-orange-500"
                />
                <button
                  type="submit"
                  className="w-10 h-10 flex items-center justify-center rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/10 active:scale-95 transition-all shrink-0"
                >
                  <Send className="w-4 h-4 ml-1" />
                </button>
              </form>
            </div>
          </div>

        </div>
      </main>
      <CommandPalette />
    </div>
  )
}
