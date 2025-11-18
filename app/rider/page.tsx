'use client'

import { useState } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { MapPin, Clock, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import InteractiveMap from '@/components/interactive-map'

export default function RiderHomePage() {
  const router = useRouter()
  const [pickupLocation, setPickupLocation] = useState('American University of Bahrain')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('2025-04-01')
  const [time, setTime] = useState('09:41')
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [showDateTimeModal, setShowDateTimeModal] = useState(false)
  const [locationType, setLocationType] = useState<'pickup' | 'destination'>('pickup')

  const handleSearch = () => {
    if (!destination) {
      alert('Please enter a destination')
      return
    }
    
    router.push(`/rider/search-drivers?from=${encodeURIComponent(pickupLocation)}&to=${encodeURIComponent(destination)}&date=${date}&time=${time}`)
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
            name: pickupLocation
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
      </div>

      {/* Bottom Sheet */}
      <div className="bg-white rounded-t-3xl -mt-6 relative z-10 shadow-xl">
        <div className="px-6 pt-8 pb-6 space-y-4">
          {/* Pickup Location */}
          <button 
            onClick={() => {
              setLocationType('pickup')
              setShowLocationModal(true)
            }}
            className="w-full flex items-center gap-4 p-4 border-2 border-[#3A85BD] rounded-full hover:bg-gray-50 transition-colors"
          >
            <MapPin className="w-6 h-6 text-[#3A85BD]" />
            <span className="flex-1 text-left font-sans text-gray-700 truncate">{pickupLocation}</span>
          </button>

          {/* Destination Input */}
          <button 
            onClick={() => {
              setLocationType('destination')
              setShowLocationModal(true)
            }}
            className="w-full flex items-center gap-4 p-4 border-2 border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            <Search className="w-6 h-6 text-gray-400" />
            <span className={`flex-1 text-left font-sans ${destination ? 'text-gray-700' : 'text-gray-400'} truncate`}>
              {destination || 'Where to?'}
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

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            className="w-full h-14 rounded-full font-sans font-bold text-lg text-white mt-4"
            style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
          >
            <Search className="w-6 h-6 mr-2" />
            SEARCH DRIVERS
          </Button>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-sans font-bold text-gray-800">
                {locationType === 'pickup' ? 'Set Pickup Location' : 'Set Destination'}
              </h3>
              <button onClick={() => setShowLocationModal(false)}>
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <Input
              type="text"
              value={locationType === 'pickup' ? pickupLocation : destination}
              onChange={(e) => {
                if (locationType === 'pickup') {
                  setPickupLocation(e.target.value)
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
                    if (locationType === 'pickup') {
                      setPickupLocation(loc)
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

      <BottomNav />
    </div>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(timeStr: string) {
  const [hours, minutes] = timeStr.split(':')
  const h = parseInt(hours)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const displayHour = h % 12 || 12
  return `${displayHour}:${minutes} ${ampm}`
}
