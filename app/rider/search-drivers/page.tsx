'use client'

import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { ArrowLeft, MapPin, Star, Car, Filter, Users, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import InteractiveMap from '@/components/interactive-map'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { rideService, Ride } from '@/lib/services/ride.service'
import { notificationService } from '@/lib/services/notification.service'

export default function SearchDriversPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const { toast } = useToast()

  const [rides, setRides] = useState<Ride[]>([])
  const [loadingRides, setLoadingRides] = useState(true)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'rating'>('distance')
  const [genderFilter, setGenderFilter] = useState<'All' | 'Male' | 'Female'>('All')
  const [showFilterModal, setShowFilterModal] = useState(false)

  const pickup = searchParams.get('from') || 'Unknown'
  const destination = searchParams.get('to') || 'Unknown'
  const date = searchParams.get('date')
  const time = searchParams.get('time')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  useEffect(() => {
    fetchAvailableRides()
  }, [sortBy, genderFilter])

  const fetchAvailableRides = async () => {
    setLoadingRides(true)
    try {
      const result = await rideService.getAvailableRides()
      if (result.success && result.rides) {
        let filteredRides = result.rides

        // Filter by search criteria
        if (pickup && pickup !== 'Unknown') {
          filteredRides = filteredRides.filter(ride =>
            ride.from.toLowerCase().includes(pickup.toLowerCase())
          )
        }
        if (destination && destination !== 'Unknown') {
          filteredRides = filteredRides.filter(ride =>
            ride.to.toLowerCase().includes(destination.toLowerCase())
          )
        }
        if (date) {
          filteredRides = filteredRides.filter(ride => ride.date === date)
        }

        // Sort rides
        filteredRides.sort((a, b) => {
          if (sortBy === 'price') return a.price - b.price
          if (sortBy === 'rating') return (b.driverRating || 0) - (a.driverRating || 0)
          return 0
        })

        setRides(filteredRides)
      } else {
        toast({
          title: "Error",
          description: "Failed to load rides",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load rides",
        variant: "destructive"
      })
    } finally {
      setLoadingRides(false)
    }
  }

  const handleBookRide = async (rideId: string) => {
    if (!user) return

    setBookingId(rideId)
    try {
      const result = await rideService.createBookingRequest(rideId, user.uid, 1)
      if (result.success) {
        // Find the ride to get driver info
        const ride = rides.find(r => r.id === rideId)
        if (ride) {
          // Send notification to driver
          await notificationService.notifyRideRequest(
            ride.driverId,
            user.displayName || 'Rider',
            `${ride.from} → ${ride.to}`
          )
        }

        toast({
          title: "Request Sent!",
          description: "Your booking request has been sent to the driver"
        })
        fetchAvailableRides()
      } else {
        toast({
          title: "Booking Failed",
          description: result.error || "Failed to send booking request",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send booking request",
        variant: "destructive"
      })
    } finally {
      setBookingId(null)
    }
  }

  if (loading || loadingRides) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3A85BD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Searching for rides...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Map Section */}
      <div className="relative h-[40vh]">
        <InteractiveMap
          pickupLocation={{
            lat: 26.0667,
            lng: 50.5577,
            name: pickup
          }}
          dropoffLocation={{
            lat: 26.0867,
            lng: 50.5777,
            name: destination
          }}
          showRoute={true}
        />
        
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10">
          <button 
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-rl5faAKInPGEF3xiVjQ8HuH8DrmWNT.png"
            alt="UNIPOOL Icon" 
            className="h-12 w-12 object-contain"
          />
          
          <button 
            onClick={() => setShowFilterModal(true)}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center relative"
          >
            <Filter className="w-5 h-5 text-gray-700" />
            {genderFilter !== 'All' && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#3A85BD] rounded-full border-2 border-white"></div>
            )}
          </button>
        </div>
      </div>

      {/* Sort Options */}
      <div className="px-6 pt-4 pb-2 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setSortBy('distance')}
          className={`px-4 py-2 rounded-full text-sm font-sans font-bold whitespace-nowrap transition-colors ${
            sortBy === 'distance' 
              ? 'bg-[#3A85BD] text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Nearest
        </button>
        <button
          onClick={() => setSortBy('price')}
          className={`px-4 py-2 rounded-full text-sm font-sans font-bold whitespace-nowrap transition-colors ${
            sortBy === 'price' 
              ? 'bg-[#3A85BD] text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Lowest Price
        </button>
        <button
          onClick={() => setSortBy('rating')}
          className={`px-4 py-2 rounded-full text-sm font-sans font-bold whitespace-nowrap transition-colors ${
            sortBy === 'rating' 
              ? 'bg-[#3A85BD] text-white' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Top Rated
        </button>
      </div>

      {/* Available Drivers */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-gray-800">
            {rides.length} Available Rides
          </h2>
        </div>
        
        <div className="space-y-4">
          {rides.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-sans font-bold text-gray-800 mb-2">No Rides Available</h3>
              <p className="text-gray-500 font-sans text-sm mb-6">
                No rides found for your search criteria. Try adjusting your search.
              </p>
              <Button
                onClick={() => router.back()}
                className="h-12 px-8 rounded-full font-sans font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
              >
                Search Again
              </Button>
            </div>
          ) : (
            rides.map((ride) => (
              <div
                key={ride.id}
                className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-[#3A85BD] transition-all"
              >
                <div className="flex items-center gap-4 mb-3">
                  {/* Driver Photo */}
                  <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <span className="text-white font-bold text-xl">{ride.driverName.charAt(0)}</span>
                  </div>

                  {/* Driver Info */}
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-sans font-bold text-gray-800">{ride.driverName}</h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-sans text-gray-600">{ride.driverRating?.toFixed(1) || 'New'}</span>
                      </div>
                    </div>
                    <p className="text-sm font-sans text-gray-500">{ride.from} → {ride.to}</p>
                    <p className="text-xs font-sans text-gray-400 mt-1">{ride.date} at {ride.time}</p>
                  </div>

                  {/* Seats */}
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-sm font-sans text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{ride.availableSeats}/{ride.totalSeats}</span>
                    </div>
                  </div>
                </div>

                {/* Book Button */}
                <Button
                  onClick={() => handleBookRide(ride.id!)}
                  disabled={bookingId === ride.id}
                  className="w-full h-10 rounded-full font-sans font-bold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
                >
                  {bookingId === ride.id ? 'Sending Request...' : 'Request Ride'}
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Filter Modal */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-serif font-bold text-gray-800">Filters</h3>
              <button 
                onClick={() => setShowFilterModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <h4 className="text-sm font-sans font-bold text-gray-700">Gender Preference</h4>
              
              <div className="space-y-2">
                <button
                  onClick={() => setGenderFilter('All')}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    genderFilter === 'All'
                      ? 'border-[#3A85BD] bg-[#3A85BD]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-gray-800">All Drivers</span>
                    {genderFilter === 'All' && (
                      <div className="w-5 h-5 rounded-full bg-[#3A85BD] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setGenderFilter('Male')}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    genderFilter === 'Male'
                      ? 'border-[#3A85BD] bg-[#3A85BD]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-gray-800">Male Drivers Only</span>
                    {genderFilter === 'Male' && (
                      <div className="w-5 h-5 rounded-full bg-[#3A85BD] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </button>

                <button
                  onClick={() => setGenderFilter('Female')}
                  className={`w-full p-4 rounded-xl border-2 transition-all ${
                    genderFilter === 'Female'
                      ? 'border-[#3A85BD] bg-[#3A85BD]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-sans font-bold text-gray-800">Female Drivers Only</span>
                    {genderFilter === 'Female' && (
                      <div className="w-5 h-5 rounded-full bg-[#3A85BD] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                </button>
              </div>
            </div>

            <Button
              onClick={() => setShowFilterModal(false)}
              className="w-full h-12 rounded-full font-sans font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #7F7CAF 100%)' }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
