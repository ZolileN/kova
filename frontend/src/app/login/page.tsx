"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)

      const response = await fetch("http://localhost:8000/api/v1/auth/token", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString()
      })

      if (!response.ok) {
        throw new Error("Invalid credentials")
      }

      const data = await response.json()
      localStorage.setItem("token", data.access_token)
      router.push("/")
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Image src="/logo.png" alt="Kova" width={48} height={48} className="mx-auto rounded-xl mb-4" />
          <h2 className="text-3xl font-bold tracking-tight text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-zinc-400">Sign in to orchestrate your next journey.</p>
        </div>

        <form className="mt-8 space-y-6 bg-zinc-900/40 p-8 rounded-2xl border border-zinc-800 shadow-xl" onSubmit={handleLogin}>
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm font-medium border border-red-500/20">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Email address</label>
              <input
                type="email"
                required
                className="w-full h-11 px-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-orange-500 text-sm text-zinc-100"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1.5">Password</label>
              <input
                type="password"
                required
                className="w-full h-11 px-4 rounded-xl bg-zinc-950 border border-zinc-800 focus:outline-none focus:border-orange-500 text-sm text-zinc-100"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 flex items-center justify-center rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-all shadow-md shadow-orange-500/20 disabled:opacity-50"
          >
            {loading ? "Signing in..." : (
              <>
                Sign in <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-zinc-500">
          Powered by <Sparkles className="w-3.5 h-3.5 inline-block text-orange-500 mx-1" /> Kova AI
        </p>
      </div>
    </div>
  )
}
