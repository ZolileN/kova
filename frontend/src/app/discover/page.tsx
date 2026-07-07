"use client"

import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { Search, MapPin, Sparkles } from "lucide-react"

export default function Discover() {
  const destinations = [
    {
      title: "Kyoto, Japan",
      category: "Culture",
      description: "Ancient temples, bamboo forests and autumn colours.",
      image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Santorini, Greece",
      category: "Islands",
      description: "Whitewashed cliffs above the Aegean Sea.",
      image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Marrakech, Morocco",
      category: "Adventure",
      description: "Vibrant souks, riads and desert dunes.",
      image: "https://images.unsplash.com/photo-1597212618440-806262de4f6b?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Banff, Canada",
      category: "Nature",
      description: "Turquoise lakes and Rocky Mountain peaks.",
      image: "https://images.unsplash.com/photo-1513524673859-e93540fc405c?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Lisbon, Portugal",
      category: "City",
      description: "Pastel hills, trams and Atlantic light.",
      image: "https://images.unsplash.com/photo-1558564016-56be44425cc0?q=80&w=2070&auto=format&fit=crop"
    },
    {
      title: "Cape Town, South Africa",
      category: "Coastal",
      description: "Table Mountain, beaches and wineries.",
      image: "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?q=80&w=2070&auto=format&fit=crop"
    }
  ]

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

        <div className="p-8 max-w-7xl w-full mx-auto space-y-10">
          
          {/* Header Section */}
          <div className="space-y-3">
            <div className="inline-flex items-center text-orange-500 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3.5 h-3.5 mr-2" />
              Destination Discovery
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white font-display">
              Where to next?
            </h1>
            <p className="text-zinc-400 text-lg max-w-2xl">
              Explore curated destinations or ask the AI for personalised ideas.
            </p>
          </div>

          {/* Search Bar & Ask AI */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search a place, vibe, or activity..." 
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-orange-500 text-zinc-100"
              />
            </div>
            <button className="h-12 px-6 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl flex items-center shadow-lg shadow-orange-500/20 transition-all">
              <Sparkles className="w-4 h-4 mr-2" />
              Ask AI
            </button>
          </div>

          {/* Destination Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <div key={i} className="group rounded-2xl border border-zinc-900 bg-zinc-900/40 overflow-hidden hover:border-zinc-700 transition-all cursor-pointer flex flex-col h-[320px]">
                <div className="h-[200px] w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-zinc-950 to-transparent z-10" />
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style={{ backgroundImage: `url("${dest.image}")` }} />
                  
                  <div className="absolute top-4 left-4 z-20">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-zinc-900/80 backdrop-blur-md text-zinc-200 border border-zinc-700">
                      {dest.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-5 flex-1 bg-zinc-950 flex flex-col justify-end">
                  <h3 className="text-lg font-bold text-white flex items-center mb-2">
                    <MapPin className="w-4 h-4 mr-1.5 text-orange-500" />
                    {dest.title}
                  </h3>
                  <p className="text-sm text-zinc-400">
                    {dest.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </main>
      <CommandPalette />
    </div>
  )
}
