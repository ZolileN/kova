"use client"

import { Plus, Plane, Bed, MapPin, Activity } from "lucide-react"
import { useEffect, useState } from "react"
import { fetchAPI } from "@/lib/api"
import { useParams } from "next/navigation"

export default function Timeline() {
  const params = useParams()
  interface TimelineEvent {
    id: string;
    title: string;
    event_type: string;
    start_time: string;
    end_time: string;
  }

  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await fetchAPI(`/journeys/${params.id}/timeline/events`)
        setEvents(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (params.id) loadEvents()
  }, [params.id])

  const getIcon = (type: string) => {
    switch (type) {
      case "flight": return <Plane className="w-5 h-5 text-blue-500" />
      case "hotel": return <Bed className="w-5 h-5 text-emerald-500" />
      case "activity": return <Activity className="w-5 h-5 text-purple-500" />
      default: return <MapPin className="w-5 h-5 text-orange-500" />
    }
  }

  const getBg = (type: string) => {
    switch (type) {
      case "flight": return "bg-blue-500/10"
      case "hotel": return "bg-emerald-500/10"
      case "activity": return "bg-purple-500/10"
      default: return "bg-orange-500/10"
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-white">Journey Timeline</h2>
        <button className="flex items-center px-4 py-2 text-sm font-semibold text-white bg-orange-500 rounded-lg hover:bg-orange-600 shadow-md shadow-orange-500/10 transition-all">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </button>
      </div>

      {loading ? (
        <div className="text-zinc-500">Loading timeline...</div>
      ) : events.length === 0 ? (
        <div className="text-zinc-500">No events scheduled yet.</div>
      ) : (
        <div className="space-y-12">
          <div className="relative pl-12 space-y-4">
            <div className="absolute left-0 top-0 flex items-center justify-center w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 text-xs font-bold border border-orange-500/20">
              T
            </div>
            <div className="absolute left-4 top-10 bottom-[-48px] w-px bg-zinc-800" />
            
            <h3 className="text-sm font-medium text-zinc-400">Scheduled Events</h3>
            
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex p-4 rounded-xl border border-zinc-900 bg-zinc-900/40 hover:bg-zinc-900/60 transition-colors">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 shrink-0 ${getBg(event.event_type)}`}>
                    {getIcon(event.event_type)}
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-white mb-1">{event.title}</h4>
                    <div className="flex items-center text-xs text-zinc-500 gap-4">
                      <span className="flex items-center text-zinc-400">{new Date(event.start_time).toLocaleString()}</span>
                      <span className="uppercase">{event.event_type}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
