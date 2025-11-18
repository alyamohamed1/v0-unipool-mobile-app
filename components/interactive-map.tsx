'use client'

import { useState, useEffect } from 'react'
import { MapPin, Navigation } from 'lucide-react'

interface Location {
  lat: number
  lng: number
  name: string
}

interface InteractiveMapProps {
  pickupLocation?: Location
  dropoffLocation?: Location
  driverLocation?: Location
  onLocationSelect?: (location: Location) => void
  interactive?: boolean
  showRoute?: boolean
}

export default function InteractiveMap({
  pickupLocation,
  dropoffLocation,
  driverLocation,
  onLocationSelect,
  interactive = false,
  showRoute = false
}: InteractiveMapProps) {
  const [mapCenter, setMapCenter] = useState({ lat: 26.0667, lng: 50.5577 }) // Bahrain center
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)

  // Simulate map interaction
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 360 - 180
    const y = 90 - ((e.clientY - rect.top) / rect.height) * 180
    
    const location: Location = {
      lat: mapCenter.lat + (y * 0.01),
      lng: mapCenter.lng + (x * 0.01),
      name: 'Selected Location'
    }
    
    setSelectedLocation(location)
    onLocationSelect?.(location)
  }

  // Convert lat/lng to pixel position
  const locationToPixel = (location: Location) => {
    const x = ((location.lng - mapCenter.lng + 0.1) / 0.2) * 100
    const y = ((mapCenter.lat - location.lat + 0.1) / 0.2) * 100
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) }
  }

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden border border-gray-200">
      {/* Map Grid Background */}
      <div 
        className="absolute inset-0 cursor-pointer"
        onClick={handleMapClick}
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}
      >
        {/* Street patterns for realism */}
        <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <path d="M 0 100 L 100 0" stroke="#3A85BD" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <path d="M 0 200 L 200 0" stroke="#3A85BD" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <path d="M 100 300 L 300 100" stroke="#3A85BD" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
          <circle cx="50%" cy="50%" r="30" fill="none" stroke="#9FB798" strokeWidth="1" opacity="0.3" />
        </svg>
      </div>

      {/* Pickup Location Pin */}
      {pickupLocation && (
        <div 
          className="absolute z-20 transform -translate-x-1/2 -translate-y-full transition-all duration-300"
          style={{
            left: `${locationToPixel(pickupLocation).x}%`,
            top: `${locationToPixel(pickupLocation).y}%`
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <MapPin className="w-8 h-8 text-green-600 fill-green-200 drop-shadow-lg" />
            <span className="text-xs font-medium bg-white px-2 py-1 rounded shadow-md whitespace-nowrap">
              Pickup
            </span>
          </div>
        </div>
      )}

      {/* Dropoff Location Pin */}
      {dropoffLocation && (
        <div 
          className="absolute z-20 transform -translate-x-1/2 -translate-y-full transition-all duration-300"
          style={{
            left: `${locationToPixel(dropoffLocation).x}%`,
            top: `${locationToPixel(dropoffLocation).y}%`
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <MapPin className="w-8 h-8 text-red-600 fill-red-200 drop-shadow-lg" />
            <span className="text-xs font-medium bg-white px-2 py-1 rounded shadow-md whitespace-nowrap">
              Dropoff
            </span>
          </div>
        </div>
      )}

      {/* Driver Location (Animated) */}
      {driverLocation && (
        <div 
          className="absolute z-30 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-1000"
          style={{
            left: `${locationToPixel(driverLocation).x}%`,
            top: `${locationToPixel(driverLocation).y}%`
          }}
        >
          <div className="relative">
            {/* Pulse animation */}
            <div className="absolute inset-0 animate-ping">
              <div className="w-12 h-12 bg-blue-400 rounded-full opacity-75"></div>
            </div>
            {/* Car icon */}
            <div className="relative w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center shadow-xl">
              <Navigation className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      )}

      {/* Route Line */}
      {showRoute && pickupLocation && dropoffLocation && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
          <defs>
            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3A85BD" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#9FB798" stopOpacity="0.8" />
            </linearGradient>
          </defs>
          <path
            d={`M ${locationToPixel(pickupLocation).x}% ${locationToPixel(pickupLocation).y}% 
                Q ${(locationToPixel(pickupLocation).x + locationToPixel(dropoffLocation).x) / 2}% 
                  ${Math.min(locationToPixel(pickupLocation).y, locationToPixel(dropoffLocation).y) - 10}%
                  ${locationToPixel(dropoffLocation).x}% ${locationToPixel(dropoffLocation).y}%`}
            stroke="url(#routeGradient)"
            strokeWidth="3"
            fill="none"
            strokeDasharray="8 4"
            className="animate-pulse"
          />
        </svg>
      )}

      {/* Selected Location Indicator */}
      {selectedLocation && interactive && (
        <div 
          className="absolute z-20 transform -translate-x-1/2 -translate-y-full"
          style={{
            left: `${locationToPixel(selectedLocation).x}%`,
            top: `${locationToPixel(selectedLocation).y}%`
          }}
        >
          <MapPin className="w-6 h-6 text-purple-600 fill-purple-200 animate-bounce" />
        </div>
      )}

      {/* Map Controls */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-col gap-2">
        <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold">+</span>
        </button>
        <button className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
          <span className="text-lg font-bold">−</span>
        </button>
      </div>

      {/* Current Location Button */}
      <button className="absolute bottom-4 left-4 z-30 bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors">
        <Navigation className="w-5 h-5 text-blue-600" />
      </button>

      {/* Interactive hint */}
      {interactive && !selectedLocation && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 bg-white/90 px-4 py-2 rounded-full shadow-lg">
          <p className="text-sm text-gray-700">Tap map to select location</p>
        </div>
      )}
    </div>
  )
}
