'use client'

import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { ArrowLeft, MapPin, Star, Car, Filter, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import InteractiveMap from '@/components/interactive-map'

const carImages = [
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/car%20a-Gsvh6dNlQ3U6Oear293OKgqNsCmJi1.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/car%20b-A58NbtcdkrKg6K2HbAgrdEPrApMKwx.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/car%20c-L1yUGQ7Q9yITD18KkLZOntCvCOGX15.png',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/car%20d-1yh99sPPt4QeqgAuvMkb3aZWXkuRyJ.jpeg',
  'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/car%20e-gZq18IupJqzelzYFUlXHw23pM8fNHX.png'
]

const mockDrivers = [
  {
    id: 1,
    name: 'Ahmed Al-Khalifa',
    rating: 4.8,
    carModel: 'Toyota Camry',
    plateNumber: '123456',
    photo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile-PNG-File-uVy51WIiSA6CiTEscPJNbN9ilYFITu.png',
    carPhoto: carImages[0],
    totalSeats: 4,
    availableSeats: 3,
    price: 5.00,
    distance: '2.3 km',
    estimatedTime: '8 min',
    lat: 26.0700,
    lng: 50.5600
  },
  {
    id: 2,
    name: 'Sara Mohammed',
    rating: 4.9,
    carModel: 'Honda Accord',
    plateNumber: '789012',
    photo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile-PNG-File-uVy51WIiSA6CiTEscPJNbN9ilYFITu.png',
    carPhoto: carImages[1],
    totalSeats: 4,
    availableSeats: 2,
    price: 4.50,
    distance: '3.1 km',
    estimatedTime: '12 min',
    lat: 26.0750,
    lng: 50.5650
  },
  {
    id: 3,
    name: 'Khalid Hassan',
    rating: 4.7,
    carModel: 'Nissan Altima',
    plateNumber: '345678',
    photo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile-PNG-File-uVy51WIiSA6CiTEscPJNbN9ilYFITu.png',
    carPhoto: carImages[2],
    totalSeats: 5,
    availableSeats: 4,
    price: 6.00,
    distance: '1.8 km',
    estimatedTime: '5 min',
    lat: 26.0620,
    lng: 50.5550
  },
  {
    id: 4,
    name: 'Fatima Ali',
    rating: 5.0,
    carModel: 'Hyundai Sonata',
    plateNumber: '901234',
    photo: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile-PNG-File-uVy51WIiSA6CiTEscPJNbN9ilYFITu.png',
    carPhoto: carImages[3],
    totalSeats: 4,
    availableSeats: 1,
    price: 5.50,
    distance: '2.7 km',
    estimatedTime: '10 min',
    lat: 26.0680,
    lng: 50.5620
  }
]

export default function SearchDriversPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [drivers, setDrivers] = useState(mockDrivers)
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'rating'>('distance')
  
  const pickup = searchParams.get('from') || 'Unknown'
  const destination = searchParams.get('to') || 'Unknown'

  useEffect(() => {
    const sorted = [...mockDrivers].sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'distance') return parseFloat(a.distance) - parseFloat(b.distance)
      return 0
    })
    setDrivers(sorted)
  }, [sortBy])

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
          driverLocation={drivers[0] ? {
            lat: drivers[0].lat,
            lng: drivers[0].lng,
            name: drivers[0].name
          } : undefined}
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
          
          <button className="w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
            <Filter className="w-5 h-5 text-gray-700" />
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
        <h2 className="text-xl font-serif font-bold text-gray-800 mb-4">
          {drivers.length} Available Drivers
        </h2>
        
        <div className="space-y-4">
          {drivers.map((driver) => (
            <button
              key={driver.id}
              onClick={() => router.push(`/rider/driver/${driver.id}?from=${encodeURIComponent(pickup)}&to=${encodeURIComponent(destination)}`)}
              className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 hover:border-[#3A85BD] transition-all"
            >
              <div className="flex items-center gap-4 mb-3">
                {/* Driver Photo */}
                <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 overflow-hidden">
                  <img src={driver.photo || "/placeholder.svg"} alt={driver.name} className="w-full h-full object-cover" />
                </div>

                {/* Driver Info */}
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sans font-bold text-gray-800">{driver.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-sm font-sans text-gray-600">{driver.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm font-sans text-gray-500">{driver.carModel}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-xs font-sans text-gray-400">{driver.distance}</p>
                    <p className="text-xs font-sans text-gray-400">{driver.estimatedTime}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-sans font-bold text-[#3A85BD]">${driver.price.toFixed(2)}</p>
                  <div className="flex items-center gap-1 text-xs font-sans text-gray-500 mt-1">
                    <Users className="w-3 h-3" />
                    <span>{driver.availableSeats}/{driver.totalSeats} seats</span>
                  </div>
                </div>
              </div>

              {/* Car Image */}
              <div className="flex justify-center py-2">
                <img 
                  src={driver.carPhoto || "/placeholder.svg"} 
                  alt={driver.carModel}
                  className="h-16 object-contain"
                />
              </div>
            </button>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
