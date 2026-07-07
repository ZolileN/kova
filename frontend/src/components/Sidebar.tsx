"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Compass, Calendar, CreditCard, ShieldCheck, Settings, Users, MessageSquare, Terminal } from "lucide-react"

export default function Sidebar() {
  const pathname = usePathname()

  const links = [
    { name: "Journey Canvas", href: "/", icon: Compass },
    { name: "Timelines", href: "/timeline", icon: Calendar },
    { name: "Ledgers", href: "/ledger", icon: CreditCard },
    { name: "Corporate Hub", href: "/corporate", icon: ShieldCheck },
    { name: "Collaboration", href: "/collaboration", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <aside className="w-64 h-screen flex flex-col border-r border-zinc-900 bg-zinc-950 p-4">
      {/* Brand Header */}
      <div className="flex items-center px-2 py-4 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-lg shadow-violet-500/20 mr-3">
          K
        </div>
        <div>
          <h1 className="text-md font-bold text-zinc-100 leading-tight">Kova</h1>
          <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Journey OS</span>
        </div>
      </div>

      {/* Nav Links */}
      <nav className="flex-1 space-y-1">
        {links.map((link) => {
          const Icon = link.icon
          const isActive = pathname === link.href
          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-300 ${
                isActive
                  ? "bg-zinc-900 text-zinc-100 font-medium border border-zinc-800"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/40"
              }`}
            >
              <Icon className={`w-4 h-4 mr-3 ${isActive ? "text-violet-500" : "text-zinc-500"}`} />
              <span>{link.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* Hotkey Info Footer */}
      <div className="mt-auto p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg flex items-center justify-between text-xs text-zinc-500">
        <div className="flex items-center">
          <Terminal className="w-3.5 h-3.5 mr-2 text-zinc-400" />
          <span>Quick actions</span>
        </div>
        <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px]">
          ⌘K
        </kbd>
      </div>
    </aside>
  )
}
