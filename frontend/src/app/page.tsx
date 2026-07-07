"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { Plus, Compass, Calendar, DollarSign, Send, Bot, ShieldCheck, MapPin } from "lucide-react"

export default function Home() {
  const [selectedJourney, setSelectedJourney] = useState({
    id: "7bf31758",
    title: "Summer Holiday in Italy",
    type: "Holiday",
    dates: "Aug 01 - Aug 15, 2026",
    budget: 3500.00,
    spent: 1250.00,
    currency: "USD",
    compliance: "Compliant"
  })

  const [chatMessage, setChatMessage] = useState("")
  const [chatHistory, setChatHistory] = useState([
    { role: "assistant", content: "Ciao! I am your Kova Concierge. I can help refine your timeline, check flight options, or file expenses. What are we planning today?" }
  ])

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatMessage.trim()) return

    const newHistory = [...chatHistory, { role: "user", content: chatMessage }]
    setChatHistory(newHistory)
    setChatMessage("")

    // Simulated high-fidelity AI delay
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: `I've analyzed your request: "${chatMessage}". I can suggest direct flights on ITA Airways starting at $450 or recommend boutique hotels in Florence. Would you like me to add these events to your timeline?` }
      ])
    }, 1000)
  }

  return (
    <div className="flex w-full min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Main Workspace Canvas */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-zinc-100">Journey Canvas</h2>
            <p className="text-xs text-zinc-500">Orchestrate and coordinate your active travels</p>
          </div>
          <button className="flex items-center px-4 h-9 text-xs font-semibold text-white bg-violet-600 rounded-lg hover:bg-violet-500 shadow-md shadow-violet-500/10 active:scale-98 transition-all">
            <Plus className="w-3.5 h-3.5 mr-2" />
            New Journey
          </button>
        </div>

        {/* Selected Journey Header Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-zinc-900 bg-zinc-950 shadow-xl relative overflow-hidden"
        >
          {/* Subtle colored background mesh */}
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-violet-600/10 blur-[80px]" />
          
          <div className="flex items-start justify-between relative z-10">
            <div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-3 uppercase tracking-wider">
                {selectedJourney.type}
              </span>
              <h3 className="text-2xl font-bold tracking-tight text-zinc-100">{selectedJourney.title}</h3>
              <p className="text-sm text-zinc-400 mt-1 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-2 text-zinc-500" />
                {selectedJourney.dates}
              </p>
            </div>
            <div className="text-right">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-3">
                <ShieldCheck className="w-3 h-3 mr-1" />
                {selectedJourney.compliance}
              </span>
              <p className="text-xs text-zinc-500">Ledger Currency</p>
              <p className="text-lg font-bold text-zinc-200 mt-0.5">{selectedJourney.currency}</p>
            </div>
          </div>
        </motion.div>

        {/* Dynamic Canvas Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Middle: Timeline & Maps */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Timeline Progress Tracker */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-400 flex items-center">
                <Compass className="w-4 h-4 mr-2 text-violet-500" />
                Journey Timeline
              </h4>
              <div className="border-l-2 border-zinc-900 ml-3 pl-6 space-y-6 py-2">
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-violet-600 border-2 border-zinc-950" />
                  <p className="text-xs text-zinc-500 font-semibold">Day 1 • Aug 1, 2026</p>
                  <h5 className="text-sm font-bold text-zinc-200 mt-0.5">Flight: London to Rome</h5>
                  <p className="text-xs text-zinc-500">ITA Airways AZ203 • Departs LHR 08:15</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-zinc-700 border-2 border-zinc-950" />
                  <p className="text-xs text-zinc-500 font-semibold">Day 1 • Aug 1, 2026</p>
                  <h5 className="text-sm font-bold text-zinc-200 mt-0.5">Check-in: Hotel de Russie</h5>
                  <p className="text-xs text-zinc-500">Via del Babuino, 9, Rome • Booking REF: HR-9923</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-zinc-700 border-2 border-zinc-950" />
                  <p className="text-xs text-zinc-500 font-semibold">Day 3 • Aug 3, 2026</p>
                  <h5 className="text-sm font-bold text-zinc-200 mt-0.5">Activity: Colosseum Night Tour</h5>
                  <p className="text-xs text-zinc-500">Piazza del Colosseo • Group Reservation</p>
                </div>
              </div>
            </div>

            {/* Interactive Location Discovery (Maps Placeholder) */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 h-[240px] flex flex-col justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#3f3f46_1px,transparent_1px)] [background-size:16px_16px]" />
              <div className="relative z-10 flex items-start justify-between">
                <h4 className="text-sm font-semibold text-zinc-400 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-violet-500" />
                  Google Maps Integration
                </h4>
                <span className="text-[10px] text-zinc-500 font-medium">Florence & Rome Active Pins</span>
              </div>
              <div className="relative z-10 flex items-center justify-center h-full">
                <p className="text-xs text-zinc-600 font-medium uppercase tracking-widest">[ Interactive Vector Map Block ]</p>
              </div>
            </div>

          </div>

          {/* Right: Ledger & AI Concierge Panel */}
          <div className="space-y-6">
            
            {/* Ledger status card */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-400 flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-violet-500" />
                Ledger Status
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-900">
                  <p className="text-xs text-zinc-500">Total Budget</p>
                  <p className="text-lg font-bold text-zinc-200 mt-0.5">${selectedJourney.budget.toFixed(2)}</p>
                </div>
                <div className="p-4 bg-zinc-900/50 rounded-lg border border-zinc-900">
                  <p className="text-xs text-zinc-500">Spent to Date</p>
                  <p className="text-lg font-bold text-zinc-200 mt-0.5">${selectedJourney.spent.toFixed(2)}</p>
                </div>
              </div>
              {/* Progress bar */}
              <div className="w-full bg-zinc-900 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-violet-600 to-indigo-500 h-2 rounded-full"
                  style={{ width: `${(selectedJourney.spent / selectedJourney.budget) * 100}%` }}
                />
              </div>
            </div>

            {/* AI Concierge Persistent Panel */}
            <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 flex flex-col h-[320px] overflow-hidden">
              <div className="px-4 py-3 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between">
                <div className="flex items-center">
                  <Bot className="w-4 h-4 text-violet-500 mr-2" />
                  <span className="text-xs font-semibold text-zinc-300">Kova Concierge</span>
                </div>
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>

              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                        msg.role === "user"
                          ? "bg-violet-600 text-white font-medium"
                          : "bg-zinc-900 text-zinc-300 border border-zinc-800"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input Form */}
              <form onSubmit={handleSendChat} className="p-3 border-t border-zinc-900 bg-zinc-950 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Ask Kova..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg h-9 px-3 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-violet-500"
                />
                <button
                  type="submit"
                  className="w-9 h-9 flex items-center justify-center rounded-lg bg-violet-600 hover:bg-violet-500 text-white shadow-md shadow-violet-500/10 active:scale-95 transition-all"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>

          </div>

        </div>
      </main>

      {/* Cmd+K Palette */}
      <CommandPalette />
    </div>
  )
}
