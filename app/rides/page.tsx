"use client"

import { useState, useEffect } from "react"
import { BottomNav } from "@/components/bottom-nav"
import { MapPin, Clock, Star, Users, CheckCircle, Trash2, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/lib/context/AuthContext"
import { rideService, Ride } from "@/lib/services/ride.service"
import { collection, query, where, getDocs, getDoc, doc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface BookingWithRide {
  bookingId: string
  rideId: string
  status: string
  passengers: number
  createdAt: Date
  acceptedAt?: Date
  ride: Ride
}

export default function RidesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, userData, loading } = useAuth()
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active")
  const [rides, setRides] = useState<Ride[]>([])
  const [bookings, setBookings] = useState<BookingWithRide[]>([])
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && userData) {
      loadData()
    }
  }, [user, userData])

  const loadData = async () => {
    if (!user || !userData) return

    setLoadingData(true)
    try {
      if (userData.role === 'driver') {
        // Load driver's posted rides
        const result = await rideService.getDriverRides(user.uid)
        if (result.success && result.rides) {
          setRides(result.rides)
        }
      } else {
        // Load rider's accepted bookings
        const bookingsQuery = query(
          collection(db, 'bookingRequests'),
          where('riderId', '==', user.uid),
          where('status', '==', 'accepted')
        )

        const bookingsSnapshot = await getDocs(bookingsQuery)

        const bookingsWithRides = await Promise.all(
          bookingsSnapshot.docs.map(async (bookingDoc) => {
            const bookingData = bookingDoc.data()
            const rideDoc = await getDoc(doc(db, 'rides', bookingData.rideId))

            if (rideDoc.exists()) {
              return {
                bookingId: bookingDoc.id,
                rideId: bookingData.rideId,
                status: bookingData.status,
                passengers: bookingData.passengers || 1,
                createdAt: bookingData.createdAt?.toDate() || new Date(),
                acceptedAt: bookingData.acceptedAt?.toDate(),
                ride: {
                  id: rideDoc.id,
                  ...rideDoc.data(),
                  createdAt: rideDoc.data().createdAt?.toDate() || new Date(),
                } as Ride
              }
            }
            return null
          })
        )

        setBookings(bookingsWithRides.filter(b => b !== null) as BookingWithRide[])
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error",
        description: "Failed to load rides",
        variant: "destructive"
      })
    } finally {
      setLoadingData(false)
    }
  }

  const handleCancelRide = async (rideId: string) => {
    if (!user) return

    try {
      const result = await rideService.cancelRide(rideId, user.uid)
      if (result.success) {
        toast({
          title: "Ride Cancelled",
          description: "Your ride has been cancelled"
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to cancel ride",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel ride",
        variant: "destructive"
      })
    }
  }

  const handleDeleteRide = async (rideId: string) => {
    if (!user) return

    try {
      const result = await rideService.deleteRide(rideId, user.uid)
      if (result.success) {
        toast({
          title: "Ride Deleted",
          description: "Your ride has been deleted"
        })
        loadData()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to delete ride",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ride",
        variant: "destructive"
      })
    }
  }

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3A85BD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading rides...</p>
        </div>
      </div>
    )
  }

  const isDriver = userData?.role === 'driver'

  // Filter rides/bookings by tab
  const filteredItems = isDriver
    ? rides.filter(ride =>
        activeTab === 'active' ? ride.status === 'active' : ride.status === 'completed'
      )
    : bookings.filter(booking =>
        activeTab === 'active' ? booking.ride.status === 'active' : booking.ride.status === 'completed'
      )

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
        <p className="text-white/80 font-sans text-sm mt-2">
          {isDriver ? 'Manage your posted rides' : 'View your booked rides'}
        </p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-2 rounded-full font-sans font-bold text-sm transition-colors ${
              activeTab === "active" ? "bg-[#3A85BD] text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Active
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
        {filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-500 font-sans">No {activeTab} rides found</p>
            <Button
              onClick={() => router.push(isDriver ? "/driver" : "/rider")}
              className="mt-6 h-12 px-8 rounded-full font-sans font-bold text-white"
              style={{ background: "linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)" }}
            >
              {isDriver ? 'Post a Ride' : 'Book a Ride'}
            </Button>
          </div>
        ) : isDriver ? (
          // Driver's rides
          rides
            .filter(ride =>
              activeTab === 'active' ? ride.status === 'active' : ride.status === 'completed'
            )
            .map((ride) => (
              <div
                key={ride.id}
                className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-sans font-bold text-gray-800 mb-1">{ride.from} → {ride.to}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-sans">
                      <Clock className="w-4 h-4" />
                      <span>{ride.date} at {ride.time}</span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-sans font-bold ${
                      ride.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {ride.status === "active" ? "Active" : "Completed"}
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
                    <p className="text-lg font-sans font-bold text-[#3A85BD]">BHD {ride.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1 text-sm font-sans text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{ride.availableSeats}/{ride.totalSeats} seats</span>
                    </div>
                  </div>
                  {ride.status === 'active' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCancelRide(ride.id!)}
                        className="px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-sans font-bold text-sm hover:bg-orange-200 transition-colors flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteRide(ride.id!)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-full font-sans font-bold text-sm hover:bg-red-200 transition-colors flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
        ) : (
          // Rider's bookings
          bookings
            .filter(booking =>
              activeTab === 'active' ? booking.ride.status === 'active' : booking.ride.status === 'completed'
            )
            .map((booking) => (
              <div
                key={booking.bookingId}
                className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-sans font-bold text-gray-800">{booking.ride.driverName}</h3>
                      {booking.ride.driverRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm font-sans text-gray-600">{booking.ride.driverRating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 font-sans">
                      <Clock className="w-4 h-4" />
                      <span>{booking.ride.date} at {booking.ride.time}</span>
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-xs font-sans font-bold ${
                      booking.ride.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {booking.ride.status === "active" ? "Upcoming" : "Completed"}
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2"></div>
                    <div className="flex-1">
                      <p className="text-xs font-sans text-gray-500 mb-1">Pickup</p>
                      <p className="text-sm font-sans font-bold text-gray-800">{booking.ride.from}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-4 h-4 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-xs font-sans text-gray-500 mb-1">Destination</p>
                      <p className="text-sm font-sans font-bold text-gray-800">{booking.ride.to}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4">
                    <p className="text-lg font-sans font-bold text-[#3A85BD]">BHD {booking.ride.price.toFixed(2)}</p>
                    <div className="flex items-center gap-1 text-sm font-sans text-gray-500">
                      <Users className="w-4 h-4" />
                      <span>{booking.passengers} seat{booking.passengers > 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  {booking.ride.status === 'completed' && (
                    <button
                      onClick={() => router.push(`/rate-driver/${booking.ride.driverId}`)}
                      className="px-4 py-2 bg-gradient-to-r from-[#7F7CAF] to-[#9FB4C7] text-white rounded-full font-sans font-bold text-sm hover:opacity-90 transition-opacity"
                    >
                      Rate Driver
                    </button>
                  )}
                </div>
              </div>
            ))
        )}
      </div>

      <BottomNav />
    </div>
  )
}