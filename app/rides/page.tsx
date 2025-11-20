"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { MapPin, Clock, Star, Users, CheckCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function RidesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState<"all" | "upcoming" | "completed">("all")
  const [rides, setRides] = useState<any[]>([])
  const [userRole, setUserRole] = useState<"rider" | "driver">("rider")

  useEffect(() => {
    loadRides()
    const role = localStorage.getItem("userRole") || "rider"
    setUserRole(role as "rider" | "driver")
  }, [])

  const loadRides = () => {
    const upcomingRides = JSON.parse(localStorage.getItem("upcomingRides") || "[]")
    const completedRides = JSON.parse(localStorage.getItem("completedRides") || "[]")

    const allRides = [
      ...upcomingRides.map((r: any) => ({ ...r, type: "upcoming" })),
      ...completedRides.map((r: any) => ({ ...r, type: "completed" })),
    ]

    setRides(allRides)
  }

  const markAsCompleted = (rideIndex: number) => {
    const upcomingRides = JSON.parse(localStorage.getItem("upcomingRides") || "[]")
    const completedRides = JSON.parse(localStorage.getItem("completedRides") || "[]")

    if (rideIndex < upcomingRides.length) {
      const rideToComplete = upcomingRides[rideIndex]
      upcomingRides.splice(rideIndex, 1)
      completedRides.push(rideToComplete)

      localStorage.setItem("upcomingRides", JSON.stringify(upcomingRides))
      localStorage.setItem("completedRides", JSON.stringify(completedRides))

      loadRides()

      toast({
        title: "Ride Completed",
        description: "The ride has been moved to completed trips.",
      })
    }
  }

  const filteredRides = rides.filter((ride) => {
    if (activeTab === "all") return true
    return ride.type === activeTab
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div
        className="px-6 pt-12 pb-8"
        style={{
          background: "linear-gradient(135deg, #7F7CAF 0%, #3A85BD 100%)",
        }}
      >
        <h1 className="text-white font-serif text-3xl font-bold">My Rides</h1>
        <p className="text-white/80 font-sans text-sm mt-2">View your trip history and upcoming rides</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("all")}
            className={`px-6 py-2 rounded-full font-sans font-bold text-sm transition-colors ${
              activeTab === "all" ? "bg-[#3A85BD] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Rides
          </button>
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-6 py-2 rounded-full font-sans font-bold text-sm transition-colors ${
              activeTab === "upcoming" ? "bg-[#3A85BD] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-6 py-2 rounded-full font-sans font-bold text-sm transition-colors ${
              activeTab === "completed" ? "bg-[#3A85BD] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Rides List */}
      <div className="px-6 py-6 space-y-4">
        {filteredRides.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-sans">No {activeTab === "all" ? "" : activeTab} rides found</p>
            <Button
              onClick={() => router.push("/rider")}
              className="mt-6 h-12 px-8 rounded-full font-sans font-bold text-white"
              style={{ background: "linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)" }}
            >
              Book a Ride
            </Button>
          </div>
        ) : (
          filteredRides.map((ride, index) => (
            <div
              key={index}
              className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sans font-bold text-gray-800">{ride.driverName || "Driver"}</h3>
                    {ride.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-sans text-gray-600">{ride.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-sans">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(ride.date).toLocaleDateString()}</span>
                  </div>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-sans font-bold ${
                    ride.type === "upcoming" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {ride.type === "upcoming" ? "Upcoming" : "Completed"}
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                  <div className="flex-1">
                    <p className="text-xs font-sans text-gray-500 mb-1">Pickup</p>
                    <p className="text-sm font-sans font-bold text-gray-800">{ride.from}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-xs font-sans text-gray-500 mb-1">Destination</p>
                    <p className="text-sm font-sans font-bold text-gray-800">{ride.to}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center gap-4">
                  <p className="text-lg font-sans font-bold text-[#3A85BD]">${ride.price.toFixed(2)}</p>
                  {ride.seats && (
                    <div className="flex items-center gap-1 text-sm font-sans text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>
                        {ride.seats} seat{ride.seats > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {ride.type === "upcoming" && (
                    <button
                      onClick={() => markAsCompleted(index)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-full font-sans font-bold text-sm hover:bg-green-200 transition-colors flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Complete
                    </button>
                  )}
                  {ride.type === "completed" && userRole === "rider" && (
                    <>
                      <button
                        onClick={() => router.push(`/rate-driver/${index}`)}
                        className="px-4 py-2 bg-gradient-to-r from-[#7F7CAF] to-[#9FB4C7] text-white rounded-full font-sans font-bold text-sm hover:opacity-90 transition-opacity"
                      >
                        {ride.hasRatedDriver ? "View Driver Rating" : "Rate Driver"}
                      </button>
                      <button
                        onClick={() => router.push(`/rate-passengers/${index}`)}
                        className="px-4 py-2 bg-gradient-to-r from-[#3A85BD] to-[#9FB798] text-white rounded-full font-sans font-bold text-sm hover:opacity-90 transition-opacity"
                      >
                        {ride.hasRatedPassengers ? "View Co-Passengers" : "Rate Co-Passengers"}
                      </button>
                    </>
                  )}
                  {ride.type === "completed" && userRole === "driver" && (
                    <button
                      onClick={() => router.push(`/rate-passengers/${index}`)}
                      className="px-4 py-2 bg-gradient-to-r from-[#3A85BD] to-[#9FB798] text-white rounded-full font-sans font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      {ride.hasRatedPassengers ? "View Passengers" : "Rate Passengers"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}
