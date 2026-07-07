"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { ShieldCheck, Users, Briefcase, DollarSign, Check, X, AlertCircle } from "lucide-react"

export default function Corporate() {
  const [policies, setPolicies] = useState({
    maxFlightClass: "Economy",
    maxHotelRating: 3,
    maxDailyBudget: 150.00,
    requireApproval: true
  })

  const [approvals, setApprovals] = useState([
    { id: 1, employee: "John Doe", dept: "Engineering", destination: "Rome, Italy", dates: "Aug 01 - Aug 15", cost: 1250.00, status: "pending" },
    { id: 2, employee: "Sarah Connor", dept: "Operations", destination: "London, UK", dates: "Sep 10 - Sep 15", cost: 950.00, status: "approved" }
  ])

  const [departments, setDepartments] = useState([
    { id: 1, name: "Engineering", manager: "Jane Smith", costCentre: "CC-ENG-901", allocated: 50000.00, spent: 12500.00 },
    { id: 2, name: "Operations", manager: "Sarah Connor", costCentre: "CC-OPS-402", allocated: 30000.00, spent: 4800.00 }
  ])

  const handleApprove = (id: number) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: "approved" } : a))
  }

  const handleReject = (id: number) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: "rejected" } : a))
  }

  return (
    <div className="flex w-full min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-zinc-100">Corporate Travel Hub</h2>
            <p className="text-xs text-zinc-500">Configure cost centers, set travel policies, and audit employee approvals</p>
          </div>
        </div>

        {/* Corporate Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Middle: Departments & Approvals */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Approvals Board */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-400 flex items-center">
                <Briefcase className="w-4 h-4 mr-2 text-violet-500" />
                Pending Travel Requests
              </h4>
              <div className="space-y-3">
                {approvals.filter(a => a.status === "pending").map((app) => (
                  <div key={app.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-zinc-200">{app.employee}</h5>
                      <p className="text-xs text-zinc-500 mt-0.5">{app.dept} • {app.destination} • {app.dates}</p>
                      <p className="text-xs font-semibold text-zinc-400 mt-1">${app.cost.toFixed(2)} estimated cost</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(app.id)}
                        className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleReject(app.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white flex items-center justify-center transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                {approvals.filter(a => a.status === "pending").length === 0 && (
                  <p className="text-xs text-zinc-500 py-2">No pending approval requests.</p>
                )}
              </div>
            </div>

            {/* Cost Centers & Departments */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-400 flex items-center">
                <Users className="w-4 h-4 mr-2 text-violet-500" />
                Departments & Budgets
              </h4>
              <div className="space-y-3">
                {departments.map((dept) => (
                  <div key={dept.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                      <h5 className="text-sm font-bold text-zinc-200">{dept.name}</h5>
                      <span className="text-[10px] text-zinc-500 font-semibold">{dept.costCentre}</span>
                    </div>
                    <div className="text-xs text-zinc-400 flex justify-between">
                      <span>Manager: {dept.manager}</span>
                      <span>Allocated: ${dept.allocated.toFixed(2)}</span>
                    </div>
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-2">
                      <div
                        className="bg-violet-600 h-1.5 rounded-full"
                        style={{ width: `${(dept.spent / dept.allocated) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right sidebar: Policies Settings */}
          <div className="space-y-6">
            
            {/* Travel Policy Widget */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-400 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-2 text-violet-500" />
                Global Travel Policy
              </h4>
              <div className="space-y-3 pt-2 text-xs">
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">Max Flight Class:</span>
                  <span className="font-semibold text-zinc-200">{policies.maxFlightClass}</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">Max Hotel Star Rating:</span>
                  <span className="font-semibold text-zinc-200">{policies.maxHotelRating} Stars</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-2">
                  <span className="text-zinc-500">Max Daily Budget limit:</span>
                  <span className="font-semibold text-zinc-200">${policies.maxDailyBudget.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-2">
                  <span className="text-zinc-500">Manager Approval required:</span>
                  <span className="font-semibold text-emerald-400">Yes</span>
                </div>
              </div>

              <div className="p-3 bg-zinc-900/50 border border-zinc-900 rounded-lg flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-violet-400 shrink-0 mt-0.5" />
                <p className="text-[10px] text-zinc-500 leading-relaxed">System automatically flags and pauses bookings that exceed these parameters until manager override is provided.</p>
              </div>
            </div>

          </div>

        </div>
      </main>

      <CommandPalette />
    </div>
  )
}
