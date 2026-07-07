"use client"

import { Plus, CheckCircle2, Circle } from "lucide-react"

export default function Tasks() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Tasks</h2>
          <span className="text-sm font-medium text-zinc-500">1/5 done</span>
        </div>
        <button className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-500/10 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="space-y-6">
          {/* Booking Group */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-900 bg-zinc-900/20 flex justify-between items-center text-xs font-semibold text-zinc-400">
              <span>Booking</span>
              <span>2</span>
            </div>
            
            <div className="divide-y divide-zinc-900">
              <div className="p-5 flex items-center justify-between group hover:bg-zinc-900/40 transition-colors">
                <div className="flex items-center gap-4">
                  <Circle className="w-5 h-5 text-zinc-600 cursor-pointer hover:text-orange-500" />
                  <span className="text-sm text-zinc-200">Book return flights</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-500 border border-red-500/20">urgent</span>
                  <span className="text-xs text-zinc-500">Alex</span>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between group hover:bg-zinc-900/40 transition-colors bg-zinc-900/20">
                <div className="flex items-center gap-4">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 cursor-pointer" />
                  <span className="text-sm text-zinc-500 line-through">Reserve Kaiseki dinner</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">medium</span>
                  <span className="text-xs text-zinc-500">Alex</span>
                </div>
              </div>
            </div>
          </div>

          {/* Packing Group */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-900 bg-zinc-900/20 flex justify-between items-center text-xs font-semibold text-zinc-400">
              <span>Packing</span>
              <span>1</span>
            </div>
            
            <div className="divide-y divide-zinc-900">
              <div className="p-5 flex items-center justify-between group hover:bg-zinc-900/40 transition-colors">
                <div className="flex items-center gap-4">
                  <Circle className="w-5 h-5 text-zinc-600 cursor-pointer hover:text-orange-500" />
                  <span className="text-sm text-zinc-200">Pack autumn layers</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-400 border border-zinc-700">low</span>
                  <span className="text-xs text-zinc-500">Sofia</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Documents Group */}
          <div className="rounded-xl border border-zinc-900 bg-zinc-950/40 overflow-hidden">
            <div className="px-5 py-3 border-b border-zinc-900 bg-zinc-900/20 flex justify-between items-center text-xs font-semibold text-zinc-400">
              <span>Documents</span>
              <span>2</span>
            </div>
            
            <div className="divide-y divide-zinc-900">
              <div className="p-5 flex items-center justify-between group hover:bg-zinc-900/40 transition-colors">
                <div className="flex items-center gap-4">
                  <Circle className="w-5 h-5 text-zinc-600 cursor-pointer hover:text-orange-500" />
                  <span className="text-sm text-zinc-200">Apply for Japan tourist visa</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">high</span>
                  <span className="text-xs text-zinc-500">Priya</span>
                </div>
              </div>

              <div className="p-5 flex items-center justify-between group hover:bg-zinc-900/40 transition-colors">
                <div className="flex items-center gap-4">
                  <Circle className="w-5 h-5 text-zinc-600 cursor-pointer hover:text-orange-500" />
                  <span className="text-sm text-zinc-200">Buy travel insurance</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">high</span>
                  <span className="text-xs text-zinc-500">Liam</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
