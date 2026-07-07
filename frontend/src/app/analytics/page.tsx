"use client"

import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { Search, Plane, Wallet, TrendingUp, Receipt } from "lucide-react"

export default function Analytics() {
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

        <div className="p-8 max-w-5xl mx-auto w-full space-y-8 mt-4">
          
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Analytics
            </h1>
            <p className="text-zinc-400 text-sm">
              A snapshot of travel activity across your workspace.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Metric 1 */}
            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-900/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Journeys</span>
                <Plane className="w-4 h-4 text-orange-500" />
              </div>
              <p className="text-2xl font-bold text-white">1</p>
            </div>

            {/* Metric 2 */}
            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-900/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Budget</span>
                <Wallet className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-white">4,800</p>
            </div>

            {/* Metric 3 */}
            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-900/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Spent</span>
                <TrendingUp className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold text-white">4,440</p>
            </div>

            {/* Metric 4 */}
            <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-900/40">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Expenses</span>
                <Receipt className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold text-white">4</p>
            </div>
          </div>

          {/* Journeys by Type */}
          <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-900/40 space-y-6">
            <h3 className="text-sm font-bold text-white">Journeys by Type</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>Holiday</span>
                <span>1</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full w-full" />
              </div>
            </div>
          </div>

        </div>
      </main>
      <CommandPalette />
    </div>
  )
}
