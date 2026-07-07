"use client"

import { Sparkles, Calendar, Wallet, MapPin, FileText, Send } from "lucide-react"

export default function AIConcierge() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">AI Concierge</h2>
          <p className="text-xs text-zinc-500">Your journey planning assistant</p>
        </div>
      </div>

      <div className="flex flex-col h-[500px] rounded-2xl border border-zinc-900 bg-zinc-950/40 overflow-hidden">
        
        {/* Chat Area (Empty State) */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500 mx-auto flex items-center justify-center shadow-lg shadow-orange-500/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white">How can I help with your journey?</h3>
            <p className="text-sm text-zinc-400">Ask me to plan, budget, or discover — I know the details of this journey.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
            <button className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 transition-colors text-left flex items-start gap-3 group">
              <Calendar className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Plan a day-by-day timeline for this journey</span>
            </button>
            
            <button className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 transition-colors text-left flex items-start gap-3 group">
              <Wallet className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Break down the budget across categories</span>
            </button>
            
            <button className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 transition-colors text-left flex items-start gap-3 group">
              <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">Suggest activities and restaurants at the destination</span>
            </button>
            
            <button className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-800/80 transition-colors text-left flex items-start gap-3 group">
              <FileText className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
              <span className="text-sm text-zinc-300 group-hover:text-white transition-colors">What documents and visas do we need?</span>
            </button>
          </div>

        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-900/20">
          <div className="relative">
            <input 
              type="text" 
              placeholder="Ask the concierge anything..." 
              className="w-full h-12 pl-4 pr-14 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-orange-500 text-sm text-zinc-100 placeholder-zinc-500 transition-colors"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-lg bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/10 active:scale-95 transition-all">
              <Send className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
