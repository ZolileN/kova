"use client"

import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { Search, UserPlus, CheckCircle2 } from "lucide-react"

export default function Team() {
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
              Team
            </h1>
            <p className="text-zinc-400 text-sm">
              Invite collaborators and travel coordinators to your Kova workspace.
            </p>
          </div>

          {/* Invite Card */}
          <div className="p-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 shadow-xl space-y-6">
            <div className="flex items-center text-orange-500 font-semibold text-sm">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite a member
            </div>

            <div className="flex gap-4">
              <div className="relative flex-1">
                <input 
                  type="email" 
                  placeholder="name@email.com" 
                  className="w-full h-10 pl-4 pr-10 rounded-lg bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-orange-500 text-sm text-zinc-100 placeholder-zinc-500"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                  <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                  <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                  <div className="w-1 h-1 rounded-full bg-zinc-600"></div>
                </div>
              </div>

              <select className="h-10 px-4 rounded-lg bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 focus:outline-none focus:border-orange-500 min-w-[120px] appearance-none cursor-pointer">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>

              <button className="h-10 px-6 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold rounded-lg flex items-center shadow-md shadow-orange-500/10 transition-all shrink-0">
                <UserPlus className="w-4 h-4 mr-2" />
                Invite
              </button>
            </div>

            <div className="flex items-center text-xs text-zinc-500">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
              Invitations are sent by email. Roles control workspace access.
            </div>
          </div>

        </div>
      </main>
      <CommandPalette />
    </div>
  )
}
