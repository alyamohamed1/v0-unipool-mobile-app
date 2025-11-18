'use client'

import { useState } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { MapPin, Clock, Star, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

const mockRides = [
  {
    id: 1,
    type: 'completed',
    driver: 'Sarah Johnson',
    date: 'Apr 15, 2025',
    time: '9:30 AM',
    from: 'Campus Main Gate',
    to: 'City Center Mall',
    price: 5.00,
    rating: 5,
    canRate: false
  },
  {
    id: 2,
    type: 'completed',
    driver: 'Mike Chen',
    date: 'Apr 14, 2025',
    time: '2:15 PM',
    from: 'Library Block',
    to: 'Downtown Station',
    price: 7.50,
    rating: null,
    canRate: true
  },
  {
    id: 3,
    type: 'upcoming',
    driver: 'Emma Davis',
    date: 'Apr 20, 2025',
    time: '8:00 AM',
    from: 'Campus Main Gate',
    to: 'Airport',
    price: 15.00,
    rating: null,
    canRate: false
  },
  {
    id: 4,
    type: 'completed',
    driver: 'Ahmed Ali',
    date: 'Apr 13, 2025',
    time: '3:45 PM',
    from: 'American University of Bahrain',
    to: 'City Center Mall',
    price: 5.50,
    rating: 4,
    canRate: false
  }
]

export default function RidesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'all' | 'upcoming' | 'completed'>('all')

  const filteredRides = mockRides.filter(ride => {
    if (activeTab === 'all') return true
    return ride.type === activeTab
  })

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div 
        className="px-6 pt-12 pb-8"
        style={{
          background: 'linear-gradient(135deg, #7F7CAF 0%, #3A85BD 100%)'
        }}
      >
        <h1 className="text-white font-serif text-3xl font-bold">My Rides</h1>
        <p className="text-white/80 font-sans text-sm mt-2">View your trip history and upcoming rides</p>
      </div>

      {/* Tabs */}
      <div className="px-6 py-4 bg-white border-b border-gray-200">
        <div className="flex gap-4">
          <button 
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-full font-sans font-bold text-sm transition-colors ${
              activeTab === 'all'
                ? 'bg-[#3A85BD] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            All Rides
          </button>
          <button 
            onClick={() => setActiveTab('upcoming')}
            className={`px-6 py-2 rounded-full font-sans font-bold text-sm transition-colors ${
              activeTab === 'upcoming'
                ? 'bg-[#3A85BD] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Upcoming
          </button>
          <button 
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-2 rounded-full font-sans font-bold text-sm transition-colors ${
              activeTab === 'completed'
                ? 'bg-[#3A85BD] text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
            <p className="text-gray-500 font-sans">No {activeTab === 'all' ? '' : activeTab} rides found</p>
          </div>
        ) : (
          filteredRides.map((ride) => (
            <div
              key={ride.id}
              className="w-full bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-sans font-bold text-gray-800">{ride.driver}</h3>
                    {ride.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-sm font-sans text-gray-600">{ride.rating}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 font-sans">
                    <Clock className="w-4 h-4" />
                    <span>{ride.date} at {ride.time}</span>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-sans font-bold ${
                  ride.type === 'upcoming' 
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {ride.type === 'upcoming' ? 'Upcoming' : 'Completed'}
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
                <p className="text-lg font-sans font-bold text-[#3A85BD]">${ride.price.toFixed(2)}</p>
                {ride.canRate && ride.type === 'completed' ? (
                  <button
                    onClick={() => router.push('/ratings')}
                    className="px-4 py-2 bg-gradient-to-r from-[#3A85BD] to-[#7F7CAF] text-white rounded-full font-sans font-bold text-sm hover:opacity-90 transition-opacity"
                  >
                    Rate Trip
                  </button>
                ) : (
                  <div className="flex items-center gap-2 text-gray-400 font-sans font-bold text-sm">
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
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
