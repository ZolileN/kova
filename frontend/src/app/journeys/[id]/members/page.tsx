"use client"

import { Plus, User, Shield, Compass, Briefcase } from "lucide-react"

export default function Members() {
  const members = [
    { name: "Alex Morgan", email: "alex@example.com", role: "Admin", initials: "AM", color: "bg-orange-500", icon: Shield },
    { name: "Priya Shah", email: "priya@example.com", role: "Organizer", initials: "PS", color: "bg-blue-500", icon: Briefcase },
    { name: "Liam Chen", email: "liam@example.com", role: "Traveler", initials: "LC", color: "bg-emerald-500", icon: Compass },
    { name: "Sofia Rossi", email: "sofia@example.com", role: "Traveler", initials: "SR", color: "bg-purple-500", icon: Compass },
  ]

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-white">Members</h2>
          <span className="text-sm font-medium text-zinc-500">4 people</span>
        </div>
        <button className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-500/10 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </button>
      </div>

      <div className="rounded-2xl border border-zinc-900 bg-zinc-950/40 overflow-hidden divide-y divide-zinc-900">
        {members.map((member, i) => (
          <div key={i} className="p-5 flex items-center justify-between group hover:bg-zinc-900/40 transition-colors">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md ${member.color}`}>
                {member.initials}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{member.name}</h3>
                <p className="text-xs text-zinc-500">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center text-sm text-zinc-400">
                <member.icon className="w-4 h-4 mr-2 opacity-70" />
                {member.role}
              </div>
              <button className="text-xs font-semibold text-zinc-500 hover:text-zinc-300">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
