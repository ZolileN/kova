"use client"

import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { Search, Settings as SettingsIcon } from "lucide-react"

export default function Settings() {
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

        <div className="p-8 max-w-4xl mx-auto w-full space-y-8 mt-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white font-display">
              Settings
            </h1>
            <p className="text-zinc-400 text-sm">
              Manage your workspace preferences.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-xl flex items-center justify-center h-48">
             <div className="text-center text-zinc-500 space-y-2">
               <SettingsIcon className="w-8 h-8 mx-auto opacity-50" />
               <p className="text-sm">Workspace settings coming soon.</p>
             </div>
          </div>
        </div>
      </main>
      <CommandPalette />
    </div>
  )
}
