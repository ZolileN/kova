import { usePathname, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { Compass, Settings, Users, Plus, Sun, BarChart2, PlaneTakeoff, X, Sparkles } from "lucide-react"
import { fetchAPI } from "@/lib/api"
export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  
  // Form state
  const [title, setTitle] = useState("")
  const [type, setType] = useState("holiday")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const handleCreateJourney = async () => {
    if (!title || !startDate || !endDate) return;
    
    setLoading(true);
    try {
      const response = await fetchAPI("/journeys", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          journey_type_code: type,
          start_date: startDate,
          end_date: endDate
        })
      });
      setIsCreateModalOpen(false);
      // Optional: emit event to refresh dashboard, or navigate to new journey
      router.push(`/journeys/${response.id}`);
    } catch (error) {
      console.error(error);
      alert("Failed to create journey");
    } finally {
      setLoading(false);
    }
  }

  const links = [
    { name: "Journeys", href: "/", icon: Compass },
    { name: "Discover", href: "/discover", icon: PlaneTakeoff },
    { name: "Team", href: "/team", icon: Users },
    { name: "Analytics", href: "/analytics", icon: BarChart2 },
    { name: "Settings", href: "/settings", icon: Settings },
  ]

  return (
    <>
      <aside className="w-64 h-screen flex flex-col border-r border-zinc-900 bg-zinc-950 shrink-0">
        <div className="p-4 flex-1 flex flex-col">
            {/* Brand Header */}
            <div className="flex items-center mb-6">
              <Image src="/logo.png" alt="Kova Logo" width={32} height={32} className="mr-3 rounded-lg" />
              <div>
                <h1 className="text-md font-bold text-zinc-100 leading-tight">Kova</h1>
                <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest">Journey OS</span>
              </div>
            </div>

            {/* New Journey Button */}
            <button 
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center justify-center w-full py-2 mb-6 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-500/10 active:scale-95 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Journey
            </button>

            {/* Nav Links */}
            <nav className="flex-1 space-y-1">
              {links.map((link) => {
                const Icon = link.icon
                const isActive = pathname === link.href || (pathname.startsWith(link.href + '/') && link.href !== '/')
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
                    <Icon className={`w-4 h-4 mr-3 ${isActive ? "text-orange-500" : "text-zinc-500"}`} />
                    <span>{link.name}</span>
                  </Link>
                )
              })}
            </nav>
        </div>

        {/* Light Mode toggle */}
        <div className="p-4 border-t border-zinc-900">
          <button className="flex items-center w-full px-3 py-2 text-sm text-zinc-400 hover:text-zinc-200 rounded-lg hover:bg-zinc-900/40 transition-all">
            <Sun className="w-4 h-4 mr-3 text-zinc-500" />
            Light mode
          </button>
        </div>
      </aside>

      {/* Create Journey Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="w-[500px] bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center text-white font-bold text-lg">
                  <Sparkles className="w-5 h-5 text-orange-500 mr-2" />
                  Create a Journey
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                
                {/* Title */}
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Journey title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Kyoto in Autumn" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-zinc-900 border border-orange-500/50 focus:border-orange-500 rounded-lg px-4 py-2 text-sm text-white focus:outline-none" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Type</label>
                    <select 
                      value={type}
                      onChange={(e) => setType(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-lg px-4 py-2 text-sm text-white focus:outline-none appearance-none"
                    >
                      <option value="holiday">Holiday</option>
                      <option value="business">Business</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Destination</label>
                    <input type="text" placeholder="Kyoto, Japan" className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-lg px-4 py-2 text-sm text-white focus:outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Start date</label>
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-lg px-4 py-2 text-sm text-zinc-400 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">End date</label>
                    <input 
                      type="date" 
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-lg px-4 py-2 text-sm text-zinc-400 focus:outline-none" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Budget</label>
                    <input type="number" defaultValue="0" className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-lg px-4 py-2 text-sm text-white focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-zinc-400 mb-1.5">Currency</label>
                    <select className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-lg px-4 py-2 text-sm text-white focus:outline-none appearance-none">
                      <option>USD</option>
                      <option>EUR</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1.5">Description</label>
                  <textarea rows={3} placeholder="A brief description of this journey..." className="w-full bg-zinc-900 border border-zinc-800 focus:border-orange-500 rounded-lg px-4 py-2 text-sm text-white focus:outline-none resize-none"></textarea>
                </div>

              </div>

            </div>
            
            <div className="p-4 border-t border-zinc-900 bg-zinc-900/30 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateJourney}
                disabled={loading}
                className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-500/10 transition-all disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Journey"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
