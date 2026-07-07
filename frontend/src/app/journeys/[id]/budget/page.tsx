"use client"

import { Wallet, TrendingDown, TrendingUp, ArrowLeftRight, Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchAPI } from "@/lib/api"
import { useParams } from "next/navigation"

interface LedgerData {
  currency: string;
  total_budget: number;
  total_spent: number;
}

export default function Budget() {
  const params = useParams()
  const [ledger, setLedger] = useState<LedgerData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLedger() {
      try {
        const data = await fetchAPI(`/journeys/${params.id}/ledger`)
        setLedger(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) loadLedger()
  }, [params.id])

  if (loading) return <div className="text-zinc-500">Loading ledger...</div>
  if (!ledger) return <div className="text-red-500">Could not load ledger.</div>

  const balance = ledger.total_budget - ledger.total_spent
  const util = ledger.total_budget > 0 ? (ledger.total_spent / ledger.total_budget) * 100 : 0

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Budget</span>
            <Wallet className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-2xl font-bold text-white">{ledger.currency} {ledger.total_budget.toLocaleString()}</p>
        </div>

        {/* Metric 2 */}
        <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Total Spent</span>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-white">{ledger.currency} {ledger.total_spent.toLocaleString()}</p>
        </div>

        {/* Metric 3 */}
        <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Contributed</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-bold text-white">{ledger.currency} 0</p>
        </div>

        {/* Metric 4 */}
        <div className="p-5 rounded-xl border border-zinc-900 bg-zinc-950/40">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase">Balance</span>
            <ArrowLeftRight className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-white">{ledger.currency} {balance.toLocaleString()}</p>
        </div>
      </div>

      {/* Budget Utilisation */}
      <div className="p-6 rounded-xl border border-zinc-900 bg-zinc-950/40 space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold">
          <span className="text-zinc-400">Budget utilisation</span>
          <span className="text-zinc-500">{util.toFixed(1)}%</span>
        </div>
        <div className="w-full bg-zinc-900 rounded-full h-2">
          <div className="bg-linear-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: `${Math.min(util, 100)}%` }} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Expenses List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold text-white flex items-center">
              <TrendingDown className="w-4 h-4 mr-2 text-zinc-500" />
              Expenses
            </h3>
            <button className="flex items-center px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mr-4 text-xs font-bold text-red-500 shrink-0">Fl</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Flight tickets (x4)</h4>
                  <p className="text-[10px] text-zinc-500">Paid by Alex Morgan • flights</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">USD 2,400</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mr-4 text-xs font-bold text-red-500 shrink-0">Ac</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Hotel Granvia - 7 nights</h4>
                  <p className="text-[10px] text-zinc-500">Paid by Priya Shah • accommodation</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">USD 1,400</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mr-4 text-xs font-bold text-red-500 shrink-0">Ac</div>
                <div>
                  <h4 className="text-sm font-bold text-white">Tea ceremony booking</h4>
                  <p className="text-[10px] text-zinc-500">Paid by Liam Chen • activities</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">USD 160</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center mr-4 text-xs font-bold text-red-500 shrink-0">Tr</div>
                <div>
                  <h4 className="text-sm font-bold text-white">JR Pass (x4)</h4>
                  <p className="text-[10px] text-zinc-500">Paid by Priya Shah • transport</p>
                </div>
              </div>
              <span className="text-sm font-bold text-white">USD 480</span>
            </div>
          </div>
        </div>

        {/* Contributions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2">
            <h3 className="text-sm font-bold text-white flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-zinc-500" />
              Contributions
            </h3>
            <button className="flex items-center px-3 py-1.5 text-xs font-semibold text-zinc-300 bg-zinc-900 hover:bg-zinc-800 rounded-lg transition-colors border border-zinc-800">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 shrink-0">
                  <ArrowLeftRight className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Alex Morgan</h4>
                  <p className="text-[10px] text-zinc-500">Stripe • Confirmed</p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-500">+USD 1,200</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 shrink-0">
                  <ArrowLeftRight className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Priya Shah</h4>
                  <p className="text-[10px] text-zinc-500">Manual • Confirmed</p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-500">+USD 1,200</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-900 bg-zinc-950/40 hover:bg-zinc-900/40 transition-colors">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center mr-4 shrink-0">
                  <ArrowLeftRight className="w-4 h-4 text-emerald-500" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Liam Chen</h4>
                  <p className="text-[10px] text-zinc-500">Ozow • Pending</p>
                </div>
              </div>
              <span className="text-sm font-bold text-emerald-500">+USD 600</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
