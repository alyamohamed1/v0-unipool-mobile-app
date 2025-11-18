'use client'

import { useState } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { ArrowLeft, MapPin, Star, MessageCircle, Shield, Car, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import InteractiveMap from '@/components/interactive-map'

export default function DriverDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isBooking, setIsBooking] = useState(false)
  const [isBooked, setIsBooked] = useState(false)
  
  const pickup = searchParams.get('from') || 'American University of Bahrain'
  const destination = searchParams.get('to') || 'City Center Mall'
  const passengers = searchParams.get('passengers') || '1'

  const driverData = {
    name: 'Ahmed Al-Khalifa',
    rating: 4.8,
    reviews: 127,
    carModel: 'Toyota Camry',
    carYear: '2022',
    plateNumber: '123456',
    price: 5.00,
    seats: 3,
    photo: '/driver-profile.png',
    carPhoto: '/car-side-view.png'
  }

  const handleBooking = () => {
    setIsBooking(true)
    
    setTimeout(() => {
      setIsBooking(false)
      setIsBooked(true)
      
      // Show success message and redirect
      setTimeout(() => {
        router.push('/rides')
      }, 2000)
    }, 1500)
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
          driverLocation={{
            lat: 26.0700,
            lng: 50.5600,
            name: driverData.name
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
            onClick={() => router.push('/safety')}
            className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="1.5" fill="#333"/>
              <circle cx="15" cy="10" r="1.5" fill="#333"/>
              <circle cx="5" cy="10" r="1.5" fill="#333"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Driver Card */}
      <div className="px-6 py-6">
        <div className="bg-white border-2 border-gray-200 rounded-3xl p-6 shadow-lg">
          <div className="flex items-start gap-4 mb-6">
            {/* Driver Photo */}
            <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img 
                src={driverData.photo || "/placeholder.svg"} 
                alt={driverData.name}
                className="w-full h-full object-cover" 
              />
            </div>

            {/* Driver Info */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="font-sans font-bold text-lg text-gray-800">{driverData.name}</h2>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(driverData.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-sans text-gray-600">{driverData.rating} ({driverData.reviews} reviews)</span>
              </div>
            </div>
          </div>

          {/* Car Image */}
          <div className="mb-6 flex justify-center">
            <img 
              src={driverData.carPhoto || "/placeholder.svg"} 
              alt="Car" 
              className="h-24 object-contain"
            />
          </div>

          {/* Car Details */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm font-sans font-bold text-gray-800">{driverData.carModel}</p>
              <p className="text-xs font-sans text-gray-500">{driverData.carYear} • {driverData.seats} seats</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-sans font-bold text-[#3A85BD]">{driverData.plateNumber}</p>
              <p className="text-xs font-sans text-gray-500">Plate Number</p>
            </div>
          </div>

          {/* Ride Details */}
          <div className="bg-gray-50 rounded-2xl p-4 mb-6">
            <h3 className="font-sans font-bold text-gray-800 mb-3">Ride Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-sans text-gray-600">Passengers</span>
                <span className="text-sm font-sans font-bold text-gray-800">{passengers}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-sans text-gray-600">Fare</span>
                <span className="text-lg font-sans font-bold text-[#3A85BD]">${driverData.price.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              onClick={() => router.push('/chat')}
              className="flex-1 h-12 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full font-sans font-bold"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Chat
            </Button>
            <Button
              onClick={handleBooking}
              disabled={isBooking || isBooked}
              className="flex-1 h-12 rounded-full font-sans font-bold text-white disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
            >
              {isBooking ? (
                'BOOKING...'
              ) : isBooked ? (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  BOOKED
                </>
              ) : (
                'BOOK NOW'
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {isBooked && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
            <h3 className="text-2xl font-serif font-bold text-gray-800 mb-2">Ride Booked!</h3>
            <p className="text-gray-600 font-sans">Your ride has been confirmed. Redirecting to your rides...</p>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
