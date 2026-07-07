"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { CheckSquare, Vote, FileText, CheckCircle2, ShieldCheck, Plus } from "lucide-react"

export default function Collaboration() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Check visa requirements for Italy", done: true },
    { id: 2, title: "Book Colosseum tickets in advance", done: false },
    { id: 3, title: "Buy travel insurance policy", done: false },
  ])

  const [polls, setPolls] = useState([
    {
      id: 1,
      question: "Which accommodation in Florence should we book?",
      options: [
        { text: "Boutique Hotel Florence (4 stars)", votes: 3, active: true },
        { text: "Luxury Palazzo Suite (5 stars)", votes: 1, active: false }
      ],
      voted: true
    }
  ])

  const [documents, setDocuments] = useState([
    { id: 1, name: "Passport_John_Doe.pdf", type: "Passport", status: "Verified", expires: "2032-12-11" },
    { id: 2, name: "Schengen_Visa_Confirmation.pdf", type: "Visa", status: "Expires soon", expires: "2026-09-01" },
  ])

  const toggleTask = (id: number) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const handleVote = (pollId: number, optionIdx: number) => {
    setPolls(polls.map(p => {
      if (p.id === pollId) {
        const updatedOptions = p.options.map((opt, idx) => {
          if (idx === optionIdx) return { ...opt, votes: opt.votes + 1, active: true }
          return { ...opt, active: false }
        })
        return { ...p, options: updatedOptions, voted: true }
      }
      return p
    }))
  }

  return (
    <div className="flex w-full min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-zinc-100">Group Collaboration</h2>
            <p className="text-xs text-zinc-500">Coordinate tasks, vote on trip proposals, and track travel documents</p>
          </div>
        </div>

        {/* Dashboard grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Tasks & Voting (Left) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Travel Checklist */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-400 flex items-center">
                <CheckSquare className="w-4 h-4 mr-2 text-violet-500" />
                Travel Checklist
              </h4>
              <div className="space-y-2">
                {tasks.map((task) => (
                  <label key={task.id} className="flex items-center p-3 bg-zinc-900/30 border border-zinc-900 rounded-lg cursor-pointer hover:bg-zinc-900/60 transition-colors">
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTask(task.id)}
                      className="rounded border-zinc-800 bg-zinc-950 text-violet-600 focus:ring-0 mr-3 w-4 h-4"
                    />
                    <span className={`text-sm ${task.done ? "line-through text-zinc-500" : "text-zinc-200"}`}>
                      {task.title}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Voting & Polls */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-400 flex items-center">
                <Vote className="w-4 h-4 mr-2 text-violet-500" />
                Trip Proposals
              </h4>
              <div className="space-y-4">
                {polls.map((poll) => (
                  <div key={poll.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg space-y-3">
                    <h5 className="text-sm font-bold text-zinc-200">{poll.question}</h5>
                    <div className="space-y-2">
                      {poll.options.map((opt, idx) => (
                        <button
                          key={idx}
                          disabled={poll.voted}
                          onClick={() => handleVote(poll.id, idx)}
                          className={`w-full p-3 rounded-lg border text-left flex justify-between items-center text-xs transition-colors ${
                            opt.active
                              ? "bg-violet-600/10 border-violet-500/30 text-zinc-200"
                              : "bg-zinc-900/20 border-zinc-900 text-zinc-400 hover:border-zinc-800"
                          }`}
                        >
                          <span>{opt.text}</span>
                          <span className="font-semibold text-zinc-300">{opt.votes} votes</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Document storage (Right) */}
          <div className="space-y-6">
            
            {/* Travel Documents */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-zinc-400 flex items-center">
                  <FileText className="w-4 h-4 mr-2 text-violet-500" />
                  Documents & Visas
                </h4>
                <button className="p-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-xs font-bold text-zinc-200 truncate max-w-[150px]">{doc.name}</h5>
                        <p className="text-[10px] text-zinc-500 mt-0.5">{doc.type}</p>
                      </div>
                      <span className={`text-[10px] inline-flex items-center px-2 py-0.5 rounded font-semibold ${
                        doc.status === "Verified"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {doc.status}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-zinc-500 pt-1 border-t border-zinc-900">
                      <span>Expires: {doc.expires}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </main>

      <CommandPalette />
    </div>
  )
}
