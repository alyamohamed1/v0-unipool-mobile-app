"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Clock, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/context/AuthContext"
import { useToast } from "@/hooks/use-toast"

export default function RiderHomePage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState("09:00")

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  const handleSearch = () => {
    if (!from.trim() || !to.trim() || !date || !time) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields",
        variant: "destructive"
      })
      return
    }

    const params = new URLSearchParams({
      from: from.trim(),
      to: to.trim(),
      date,
      time
    })

    router.push(`/rider/search-drivers?${params.toString()}`)
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
    <div className="min-h-screen bg-white px-6 py-8 space-y-4">
      <h1 className="font-sans text-2xl font-bold">Find a Ride</h1>

      {/* FROM */}
      <div>
        <label className="text-sm font-sans text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-green-600" />
          Pickup
        </label>
        <Input
          placeholder="Enter pickup location"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          className="mt-1 h-12 rounded-2xl"
        />
      </div>

      {/* TO */}
      <div>
        <label className="text-sm font-sans text-gray-600 flex items-center gap-2">
          <MapPin className="w-4 h-4 text-red-500" />
          Destination
        </label>
        <Input
          placeholder="Enter destination"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          className="mt-1 h-12 rounded-2xl"
        />
      </div>

      {/* DATE */}
      <div>
        <label className="text-sm font-sans text-gray-600 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          Date
        </label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="mt-1 h-12 rounded-2xl"
        />
      </div>

      {/* TIME */}
      <div>
        <label className="text-sm font-sans text-gray-600 flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          Time
        </label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="mt-1 h-12 rounded-2xl"
        />
      </div>

      {/* SEARCH BUTTON */}
      <Button
        onClick={handleSearch}
        className="w-full h-12 rounded-full font-bold text-white"
        style={{
          background: "linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)"
        }}
      >
        <Search className="w-5 h-5 mr-2" />
        Search
      </Button>
    </div>
  )
}
