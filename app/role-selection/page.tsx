"use client"

import { useRouter } from "next/navigation"
import { Car, Users } from "lucide-react"
import { useAuth } from "@/lib/context/AuthContext"
import { updateDocument } from "@/lib/firebase/firestore"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

export default function RoleSelectionPage() {
  const router = useRouter()
  const { user, userData, loading } = useAuth()
  const { toast } = useToast()
  const [selecting, setSelecting] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/sign-in")
    }
  }, [user, loading, router])

  const handleRoleSelection = async (role: "rider" | "driver") => {
    if (!user) return

    setSelecting(true)

    try {
      await updateDocument("users", user.uid, { role })

      toast({
        title: "Role Selected",
        description: `You are now a ${role}`,
      })

      router.push(role === "rider" ? "/rider" : "/driver")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSelecting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3A85BD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 pb-8 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16L6 10L12 4" stroke="#7F7CAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="10" cy="10" r="1.5" fill="#7F7CAF" />
            <circle cx="15" cy="10" r="1.5" fill="#7F7CAF" />
            <circle cx="5" cy="10" r="1.5" fill="#7F7CAF" />
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div className="flex justify-center mb-4">
        <img src="/images/image-208.png" alt="UNIPOOL Icon" className="h-20 w-20 object-contain" />
      </div>

      {/* Title */}
      <h1 className="text-[#3A85BD] font-serif text-3xl font-bold text-center mb-12">Choose your Path</h1>

      {/* Role Cards */}
      <div className="space-y-6 flex-1">
        {/* Rider Card */}
        <button
          onClick={() => handleRoleSelection("rider")}
          disabled={selecting}
          className="w-full rounded-3xl p-6 text-left transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #7F7CAF 0%, #9FB4C7 100%)",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-serif text-2xl font-bold mb-2">RIDER</h2>
              <p className="text-white/90 font-sans text-sm leading-relaxed">
                Request a ride from approved drivers following your route. Enjoy a convenient and reliable way to reach
                your destination.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="1.5" fill="white" />
                <circle cx="12" cy="8" r="1.5" fill="white" />
                <circle cx="4" cy="8" r="1.5" fill="white" />
              </svg>
            </div>
          </div>
        </button>

        {/* Driver Card */}
        <button
          onClick={() => handleRoleSelection("driver")}
          disabled={selecting}
          className="w-full rounded-3xl p-6 text-left transition-all hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            background: "linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)",
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-white/30 flex items-center justify-center flex-shrink-0">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-serif text-2xl font-bold mb-2">DRIVER</h2>
              <p className="text-white/90 font-sans text-sm leading-relaxed">
                Offer your ride to others heading the same way. Set your route, choose who joins, and make commuting
                easier for everyone.
              </p>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="8" cy="8" r="1.5" fill="white" />
                <circle cx="12" cy="8" r="1.5" fill="white" />
                <circle cx="4" cy="8" r="1.5" fill="white" />
              </svg>
            </div>
          </div>
        </button>
      </div>
    </div>
  )
}