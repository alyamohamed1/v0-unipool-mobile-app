'use client'

import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { MapPin, Clock, Users, Car, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InteractiveMap from '@/components/interactive-map'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { rideService } from '@/lib/services/ride.service'

export default function DriverHomePage() {
  const router = useRouter()
  const { user, userData, loading } = useAuth()
  const { toast } = useToast()
  const [posting, setPosting] = useState(false)
  const [departure, setDeparture] = useState('American University of Bahrain')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [time, setTime] = useState('09:00')
  const [availableSeats, setAvailableSeats] = useState(3)
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showDateTimeModal, setShowDateTimeModal] = useState(false)
  const [showSeatsModal, setShowSeatsModal] = useState(false)
  const [locationType, setLocationType] = useState<'departure' | 'destination'>('departure')

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  const handlePostRide = async () => {
    if (!destination.trim()) {
      toast({
        title: "Missing Destination",
        description: "Please set a destination",
        variant: "destructive"
      })
      return
    }

    if (!user || !userData) {
      toast({
        title: "Error",
        description: "User not authenticated",
        variant: "destructive"
      })
      return
    }

    setPosting(true)

    try {
      const result = await rideService.createRide({
        driverId: user.uid,
        driverName: userData.name || userData.displayName || 'Driver',
        driverPhone: userData.phone,
        driverRating: (userData as any).rating || 0,
        from: departure.trim(),
        to: destination.trim(),
        date: date,
        time: time,
        totalSeats: availableSeats,
        availableSeats: availableSeats,
        price: 0,
        status: 'active'
      })

      if (result.success) {
        toast({
          title: "Ride Posted!",
          description: "Your ride has been posted successfully"
        })
        router.push("/driver/requests")
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to post ride",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to post ride. Please try again.",
        variant: "destructive"
      })
    } finally {
      setPosting(false)
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

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':')
    const h = parseInt(hours)
    const ampm = h >= 12 ? 'PM' : 'AM'
    const displayHour = h % 12 || 12
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Map Section */}
      <div className="relative h-[50vh]">
        <InteractiveMap
          pickupLocation={{
            lat: 26.0667,
            lng: 50.5577,
            name: departure
          }}
          dropoffLocation={destination ? {
            lat: 26.0867,
            lng: 50.5777,
            name: destination
          } : undefined}
          showRoute={!!destination}
        />
        
        {/* Logo in top center */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
          <img 
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-rl5faAKInPGEF3xiVjQ8HuH8DrmWNT.png"
            alt="UNIPOOL Icon" 
            className="h-12 w-12 object-contain"
          />
        </div>

        {/* Settings Icon */}
        <button 
          onClick={() => router.push('/settings')}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#7F7CAF" strokeWidth="2" fill="none"/>
            <circle cx="10" cy="10" r="3" fill="#7F7CAF"/>
          </svg>
        </button>

        <button 
          onClick={() => router.push('/notifications')}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#7F7CAF" strokeWidth="2" fill="none"/>
            <path d="M10 6v8M6 10h8" stroke="#7F7CAF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 shadow-xl">
        <div className="px-6 pt-8 pb-6 space-y-4">
          {/* Set Departure */}
          <button 
            onClick={() => {
              setLocationType('departure')
              setShowLocationModal(true)
            }}
            className="w-full flex items-center gap-4 p-4 border-2 border-[#3A85BD] rounded-full hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-6 h-6 text-[#3A85BD]" />
            <span className="flex-1 text-left font-sans text-gray-700 font-bold truncate">{departure}</span>
          </button>

          {/* Destination */}
          <button 
            onClick={() => {
              setLocationType('destination')
              setShowLocationModal(true)
            }}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-6 h-6 text-gray-400" />
            <span className={`flex-1 text-left font-sans ${destination ? 'text-gray-700' : 'text-gray-400'} truncate`}>
              {destination || 'Set Destination'}
            </span>
          </button>

          {/* Date/Time Selection */}
          <button 
            onClick={() => setShowDateTimeModal(true)}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            <Clock className="w-6 h-6 text-gray-400" />
            <span className="flex-1 text-left font-sans text-gray-700">{formatDate(date)}</span>
            <span className="font-sans text-gray-700">{formatTime(time)}</span>
          </button>

          {/* Available Seats */}
          <button 
            onClick={() => setShowSeatsModal(true)}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            <Users className="w-6 h-6 text-gray-400" />
            <span className="flex-1 text-left font-sans text-gray-700">
              {availableSeats} Available {availableSeats === 1 ? 'Seat' : 'Seats'}
            </span>
          </button>

          {/* Post Ride Button */}
          <Button
            onClick={handlePostRide}
            disabled={posting}
            className="w-full h-14 rounded-full font-sans font-bold text-lg text-white mt-4 disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
          >
            <Plus className="w-6 h-6 mr-2" />
            {posting ? 'POSTING...' : 'POST RIDE'}
          </Button>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-bold text-gray-800">
                {locationType === 'departure' ? 'Set Departure' : 'Set Destination'}
              </h3>
              <button onClick={() => setShowLocationModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <Input
              type="text"
              value={locationType === 'departure' ? departure : destination}
              onChange={(e) => {
                if (locationType === 'departure') {
                  setDeparture(e.target.value)
                } else {
                  setDestination(e.target.value)
                }
              }}
              placeholder="Enter location"
              className="mb-4 h-12 rounded-full border-2"
            />

            <div className="space-y-2">
              {['American University of Bahrain', 'City Center Mall', 'Bahrain Mall', 'Seef Mall', 'Manama Souq', 'Bahrain International Airport'].map((loc) => (
                <button
                  key={loc}
                  onClick={() => {
                    if (locationType === 'departure') {
                      setDeparture(loc)
                    } else {
                      setDestination(loc)
                    }
                    setShowLocationModal(false)
                  }}
                  className="w-full text-left p-4 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <span className="font-sans text-gray-700">{loc}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Date/Time Modal */}
      {showDateTimeModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-bold text-gray-800">Select Date & Time</h3>
              <button onClick={() => setShowDateTimeModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-sans text-gray-600 mb-2 block">Date</Label>
                <Input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="h-12 rounded-full border-2"
                />
              </div>

              <div>
                <Label className="text-sm font-sans text-gray-600 mb-2 block">Time</Label>
                <Input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="h-12 rounded-full border-2"
                />
              </div>
            </div>

            <Button
              onClick={() => setShowDateTimeModal(false)}
              className="w-full h-12 mt-6 rounded-full font-sans font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}

      {/* Seats Modal */}
      {showSeatsModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-bold text-gray-800">Available Seats</h3>
              <button onClick={() => setShowSeatsModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="flex items-center justify-center gap-8 py-8">
              <button
                onClick={() => setAvailableSeats(Math.max(1, availableSeats - 1))}
                className="w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-2xl font-bold"
              >
                -
              </button>
              <span className="text-4xl font-sans font-bold text-gray-800">{availableSeats}</span>
              <button
                onClick={() => setAvailableSeats(Math.min(6, availableSeats + 1))}
                className="w-12 h-12 rounded-full bg-[#3A85BD] hover:bg-[#2a6590] flex items-center justify-center text-2xl font-bold text-white"
              >
                +
              </button>
            </div>

            <Button
              onClick={() => setShowSeatsModal(false)}
              className="w-full h-12 mt-4 rounded-full font-sans font-bold text-white"
              style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
            >
              Confirm
            </Button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
