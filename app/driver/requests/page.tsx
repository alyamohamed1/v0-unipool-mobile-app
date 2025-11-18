'use client'

import { useState } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { ArrowLeft, MapPin, Star, Car, X, Check, AlertCircle, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import InteractiveMap from '@/components/interactive-map'

const mockRequests = [
  {
    id: 1,
    name: 'Sarah Ahmed',
    rating: 4.9,
    photo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile-PNG-File-uVy51WIiSA6CiTEscPJNbN9ilYFITu.png',
    pickup: 'Building A, Campus',
    destination: 'City Center Mall',
    distance: '3.2 km',
    passengers: 2
  },
  {
    id: 2,
    name: 'Mohammed Hassan',
    rating: 4.7,
    photo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile-PNG-File-uVy51WIiSA6CiTEscPJNbN9ilYFITu.png',
    pickup: 'Library Block',
    destination: 'Downtown',
    distance: '4.5 km',
    passengers: 1
  },
  {
    id: 3,
    name: 'Fatima Ali',
    rating: 4.8,
    photo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile-PNG-File-uVy51WIiSA6CiTEscPJNbN9ilYFITu.png',
    pickup: 'Sports Complex',
    destination: 'Metro Station',
    distance: '2.8 km',
    passengers: 3
  }
]

export default function DriverRequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState(mockRequests)
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [availableSeats, setAvailableSeats] = useState(4)

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  const handleAccept = (id: number, name: string, passengers: number) => {
    if (passengers > availableSeats) {
      showToast(`Not enough seats available. Only ${availableSeats} seats left.`, 'error')
      return
    }
    
    setRequests(requests.filter(r => r.id !== id))
    setAvailableSeats(prev => prev - passengers)
    showToast(`Accepted ${name} (${passengers} seat${passengers > 1 ? 's' : ''})`, 'success')
  }

  const handleDecline = (id: number, name: string) => {
    setRequests(requests.filter(r => r.id !== id))
    showToast(`Declined ride request from ${name}`, 'error')
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
                  variant="outline"
                  className="flex-1 h-10 border-2 border-gray-300 text-gray-600 rounded-full font-sans font-bold hover:bg-gray-100"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </Button>
                <Button
                  onClick={() => handleAccept(request.id, request.name, request.passengers)}
                  className="flex-1 h-10 rounded-full font-sans font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Accept
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

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-in slide-in-from-top">
          <div className={`rounded-2xl p-4 shadow-lg flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {toast.type === 'success' ? (
              <Check className="w-6 h-6 text-white" />
            ) : (
              <AlertCircle className="w-6 h-6 text-white" />
            )}
            <span className="font-sans font-bold text-white">{toast.message}</span>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
