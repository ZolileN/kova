"use client"

import { useState } from "react"
import Sidebar from "@/components/Sidebar"
import CommandPalette from "@/components/CommandPalette"
import { DollarSign, Upload, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react"

export default function Ledger() {
  const [expenses, setExpenses] = useState([
    { id: 1, desc: "Team Dinner in Florence", amount: 250.00, currency: "EUR", category: "food", payer: "John Doe", splits: "Split equally (2)" },
    { id: 2, desc: "Boutique Hotel Florence Reservation", amount: 800.00, currency: "USD", category: "accommodation", payer: "Jane Smith", splits: "John Doe owes $400" },
  ])

  const [contributions, setContributions] = useState([
    { id: 1, user: "John Doe", amount: 500.00, currency: "USD", provider: "Stripe", status: "completed", date: "2026-07-06" },
    { id: 2, user: "Jane Smith", amount: 800.00, currency: "USD", provider: "Ozow", status: "completed", date: "2026-07-05" },
    { id: 3, user: "Bob Johnson", amount: 300.00, currency: "USD", provider: "Yoco", status: "pending", date: "2026-07-07" },
  ])

  const [uploading, setUploading] = useState(false)
  const [ocrResult, setOcrResult] = useState<any>(null)

  const handleUploadReceipt = () => {
    setUploading(true)
    setOcrResult(null)
    
    // Simulate high-fidelity OpenAI OCR API delay
    setTimeout(() => {
      setUploading(false)
      const mockResult = {
        merchant: "Ristorante Buca Lapi",
        amount: 142.00,
        currency: "EUR",
        tax: 12.91,
        category: "food",
        date: "2026-08-05",
        status: "Auto-reconciled into Ledger"
      }
      setOcrResult(mockResult)
      
      // Auto-add expense to ledger
      setExpenses((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          desc: `Auto-logged: ${mockResult.merchant}`,
          amount: mockResult.amount,
          currency: mockResult.currency,
          category: mockResult.category,
          payer: "John Doe (You)",
          splits: "Split equally (2)"
        }
      ])
    }, 2000)
  }

  return (
    <div className="flex w-full min-h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 flex flex-col p-6 overflow-y-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-900 pb-4">
          <div>
            <h2 className="text-xl font-bold font-display text-zinc-100">Journey Ledger</h2>
            <p className="text-xs text-zinc-500">Track contributions, balances, splits, and AI receipt scans</p>
          </div>
        </div>

        {/* Ledger Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Ledger & Expenses */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Expenses List */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-400">Log of Expenses</h4>
              <div className="space-y-3">
                {expenses.map((exp) => (
                  <div key={exp.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg flex items-center justify-between">
                    <div>
                      <h5 className="text-sm font-bold text-zinc-200">{exp.desc}</h5>
                      <p className="text-xs text-zinc-500 mt-0.5">Paid by {exp.payer} • {exp.splits}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-zinc-200">{exp.currency} {exp.amount.toFixed(2)}</span>
                      <p className="text-[10px] text-zinc-500 uppercase font-semibold mt-0.5">{exp.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contribution Tracking */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
              <h4 className="text-sm font-semibold text-zinc-400">Contribution Tracking</h4>
              <div className="space-y-3">
                {contributions.map((con) => (
                  <div key={con.id} className="p-4 bg-zinc-900/40 border border-zinc-900 rounded-lg flex items-center justify-between">
                    <div className="flex items-center">
                      {con.status === "completed" ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mr-3" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 mr-3" />
                      )}
                      <div>
                        <h5 className="text-sm font-bold text-zinc-200">{con.user}</h5>
                        <p className="text-xs text-zinc-500 mt-0.5">Via {con.provider} • {con.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-bold text-zinc-200">${con.amount.toFixed(2)}</span>
                      <p className={`text-[10px] font-semibold mt-0.5 ${con.status === "completed" ? "text-emerald-400" : "text-amber-400"}`}>
                        {con.status.toUpperCase()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right sidebar: Receipt AI scanner */}
          <div className="space-y-6">
            
            {/* Receipt scanner widget */}
            <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4 flex flex-col justify-between">
              <div>
                <h4 className="text-sm font-semibold text-zinc-400">Receipt AI Scanner</h4>
                <p className="text-xs text-zinc-500 mt-1">Upload receipt images or PDFs. OpenAI will extract merchant, total cost, tax, splits, and automatically update the ledger.</p>
              </div>

              {/* Upload area */}
              <div className="py-8 border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center text-center bg-zinc-900/20 mt-4">
                {uploading ? (
                  <div className="space-y-3 flex flex-col items-center">
                    <RefreshCw className="w-8 h-8 text-violet-500 animate-spin" />
                    <p className="text-xs text-zinc-400 font-medium">Scanning with OpenAI OCR...</p>
                  </div>
                ) : (
                  <button onClick={handleUploadReceipt} className="space-y-3 flex flex-col items-center hover:opacity-85 transition-opacity">
                    <Upload className="w-8 h-8 text-zinc-500" />
                    <p className="text-xs text-zinc-300 font-semibold">Click to upload receipt</p>
                    <p className="text-[10px] text-zinc-500">Supports JPG, PNG, PDF, screenshots</p>
                  </button>
                )}
              </div>

              {/* OCR Parsing details */}
              {ocrResult && (
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-2 mt-4">
                  <span className="text-[10px] inline-flex items-center px-2 py-0.5 rounded font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <ShieldCheck className="w-3 h-3 mr-1" />
                    {ocrResult.status}
                  </span>
                  <div className="text-xs space-y-1.5 pt-1 text-zinc-300">
                    <p className="flex justify-between"><span className="text-zinc-500">Merchant:</span> <strong className="text-zinc-100">{ocrResult.merchant}</strong></p>
                    <p className="flex justify-between"><span className="text-zinc-500">Amount:</span> <strong className="text-zinc-100">{ocrResult.currency} {ocrResult.amount.toFixed(2)}</strong></p>
                    <p className="flex justify-between"><span className="text-zinc-500">Tax:</span> <strong className="text-zinc-100">{ocrResult.currency} {ocrResult.tax.toFixed(2)}</strong></p>
                    <p className="flex justify-between"><span className="text-zinc-500">Category:</span> <strong className="text-zinc-100 uppercase">{ocrResult.category}</strong></p>
                    <p className="flex justify-between"><span className="text-zinc-500">Date:</span> <strong className="text-zinc-100">{ocrResult.date}</strong></p>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <CommandPalette />
    </div>
  )
}
