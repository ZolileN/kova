"use client"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Compass, Calendar, CreditCard, ShieldCheck, HelpCircle } from "lucide-react"

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    };
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  const commands = [
    { name: "Search destinations...", icon: Compass, category: "Search" },
    { name: "Create new Journey", icon: Calendar, category: "Journeys" },
    { name: "View Expense Ledger", icon: CreditCard, category: "Finance" },
    { name: "Review Travel Approvals", icon: ShieldCheck, category: "Corporate" },
    { name: "Ask AI Concierge", icon: HelpCircle, category: "Support" },
  ]

  const filtered = commands.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ ease: [0.16, 1, 0.3, 1], duration: 0.3 }}
            className="relative w-full max-w-lg overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/90 p-4 shadow-2xl backdrop-blur-xl"
          >
            {/* Search Input */}
            <div className="relative flex items-center mb-4">
              <Search className="absolute left-3 w-4 h-4 text-zinc-500" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a command or search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 text-sm text-zinc-100 bg-zinc-900 border border-zinc-800 rounded-lg focus:outline-none focus:border-violet-500"
              />
            </div>

            {/* List */}
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {filtered.length > 0 ? (
                <div>
                  <div className="px-2 mb-2 text-xs font-semibold text-zinc-500">
                    Suggestions
                  </div>
                  <div className="space-y-1">
                    {filtered.map((cmd) => {
                      const Icon = cmd.icon
                      return (
                        <button
                          key={cmd.name}
                          onClick={() => {
                            setIsOpen(false)
                            setSearch("")
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-zinc-300 rounded-lg hover:bg-zinc-900 hover:text-zinc-100 transition-colors text-left"
                        >
                          <Icon className="w-4 h-4 mr-3 text-zinc-400" />
                          <span>{cmd.name}</span>
                          <span className="ml-auto text-xs text-zinc-600">
                            {cmd.category}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-sm text-zinc-500">
                  No commands found matching "{search}"
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-900 text-xs text-zinc-600">
              <span>Press <kbd className="px-1.5 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[10px]">Esc</kbd> to close</span>
              <span>Kova Navigation</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
