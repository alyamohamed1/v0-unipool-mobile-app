'use client'

import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { ArrowLeft, MapPin, Star, Car, X, Check, AlertCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import InteractiveMap from '@/components/interactive-map'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { rideService } from '@/lib/services/ride.service'
import { notificationService } from '@/lib/services/notification.service'

export default function DriverRequestsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [requests, setRequests] = useState<any[]>([])
  const [loadingRequests, setLoadingRequests] = useState(true)
  const [availableSeats, setAvailableSeats] = useState(0)
  const [processingId, setProcessingId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchBookingRequests()
    }
  }, [user])

  const fetchBookingRequests = async () => {
    if (!user) return

    setLoadingRequests(true)
    try {
      const result = await rideService.getDriverBookingRequests(user.uid)
      if (result.success && result.requests) {
        setRequests(result.requests)

        // Get available seats from the active ride
        const ridesResult = await rideService.getDriverRides(user.uid)
        if (ridesResult.success && ridesResult.rides) {
          const activeRide = ridesResult.rides.find(r => r.status === 'active')
          if (activeRide) {
            setAvailableSeats(activeRide.availableSeats)
          }
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to load booking requests",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load booking requests",
        variant: "destructive"
      })
    } finally {
      setLoadingRequests(false)
    }
  }

  const handleAccept = async (requestId: string, rideId: string, name: string, passengers: number) => {
    if (passengers > availableSeats) {
      toast({
        title: "Not Enough Seats",
        description: `Only ${availableSeats} seats available`,
        variant: "destructive"
      })
      return
    }

    setProcessingId(requestId)
    try {
      const result = await rideService.acceptBookingRequest(requestId, rideId)
      if (result.success) {
        // Find the request to get riderId
        const request = requests.find(r => r.id === requestId)
        if (request) {
          // Send notification to rider
          await notificationService.notifyRideAccepted(
            request.riderId,
            user?.displayName || 'Driver'
          )
        }

        toast({
          title: "Request Accepted",
          description: `Accepted ${name} (${passengers} seat${passengers > 1 ? 's' : ''})`
        })
        fetchBookingRequests()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to accept request",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to accept request",
        variant: "destructive"
      })
    } finally {
      setProcessingId(null)
    }
  }

  const handleDecline = async (requestId: string, name: string) => {
    setProcessingId(requestId)
    try {
      const result = await rideService.declineBookingRequest(requestId)
      if (result.success) {
        // Find the request to get riderId
        const request = requests.find(r => r.id === requestId)
        if (request) {
          // Send notification to rider
          await notificationService.notifyRideDeclined(
            request.riderId,
            user?.displayName || 'Driver'
          )
        }

        toast({
          title: "Request Declined",
          description: `Declined ride request from ${name}`
        })
        fetchBookingRequests()
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to decline request",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decline request",
        variant: "destructive"
      })
    } finally {
      setProcessingId(null)
    }
  }

  if (loading || loadingRequests) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3A85BD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading requests...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Map Section */}
      <div className="relative h-[35vh]">
        <InteractiveMap
          pickupLocation={{
            lat: 26.0667,
            lng: 50.5577,
            name: 'Your Location'
          }}
          showRoute={false}
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
          
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="1.5" fill="#333"/>
              <circle cx="15" cy="10" r="1.5" fill="#333"/>
              <circle cx="5" cy="10" r="1.5" fill="#333"/>
            </svg>
          </button>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-white px-4 py-3 rounded-2xl shadow-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-sans font-bold text-gray-700">Available Seats</span>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-[#3A85BD]" />
                <span className="text-lg font-sans font-bold text-[#3A85BD]">{availableSeats}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ride Requests */}
      <div className="px-6 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-serif font-bold text-gray-800">
            Ride Requests
          </h2>
          <span className="bg-[#3A85BD] text-white px-3 py-1 rounded-full text-sm font-sans font-bold">
            {requests.length}
          </span>
        </div>
        
        <div className="space-y-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-[#3A85BD] transition-all"
            >
              <div className="flex items-start gap-4 mb-4">
                {/* Rider Photo */}
                <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={request.photo || "/placeholder.svg"} alt={request.name} className="w-full h-full object-cover" />
                </div>

                {/* Rider Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sans font-bold text-gray-800">{request.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-sans text-gray-600">{request.rating}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <p className="text-xs font-sans text-gray-600">{request.pickup}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3 text-red-500" />
                      <p className="text-xs font-sans text-gray-600">{request.destination}</p>
                    </div>
                  </div>
                </div>

                {/* Distance & Seats */}
                <div className="text-right">
                  <p className="text-sm font-sans font-bold text-[#3A85BD]">{request.distance}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-3 h-3 text-gray-400" />
                    <p className="text-xs font-sans text-gray-600">{request.passengers} {request.passengers === 1 ? 'seat' : 'seats'}</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={() => handleDecline(request.id, request.name)}
                  disabled={processingId === request.id}
                  variant="outline"
                  className="flex-1 h-10 border-2 border-gray-300 text-gray-600 rounded-full font-sans font-bold hover:bg-gray-100 disabled:opacity-50"
                >
                  <X className="w-4 h-4 mr-2" />
                  {processingId === request.id ? 'Processing...' : 'Decline'}
                </Button>
                <Button
                  onClick={() => handleAccept(request.id, request.rideId, request.name, request.passengers)}
                  disabled={processingId === request.id}
                  className="flex-1 h-10 rounded-full font-sans font-bold text-white disabled:opacity-50"
                  style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  {processingId === request.id ? 'Processing...' : 'Accept'}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {requests.length === 0 && (
          <div className="text-center py-12">
            <Car className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sans font-bold text-gray-800 mb-2">No Ride Requests</h3>
            <p className="text-gray-500 font-sans text-sm">When riders request your ride, they will appear here</p>
            <Button
              onClick={() => router.push('/driver')}
              className="mt-6 h-12 px-8 rounded-full font-sans font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
            >
              Post a New Ride
            </Button>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
