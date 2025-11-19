'use client'

import { useState, useEffect } from 'react'
import { BottomNav } from '@/components/bottom-nav'
import { ArrowLeft, Edit, Car, Star, Award, Settings, Shield, Bell, HelpCircle, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@university.edu',
    carModel: 'Toyota Camry 2022',
    plateNumber: 'ABC-1234',
    rating: 4.8,
    trips: 127,
    points: 850
  })

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      const data = JSON.parse(savedProfile)
      setProfile(prev => ({
        ...prev,
        name: data.name || prev.name,
        email: data.email || prev.email,
        carModel: data.carModel || prev.carModel,
        plateNumber: data.plateNumber || prev.plateNumber
      }))
    }
  }, [])

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <div 
        className="relative pt-12 pb-24 px-6"
        style={{
          background: 'linear-gradient(135deg, #7F7CAF 0%, #3A85BD 100%)'
        }}
      >
        <button 
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>

        {/* Profile Photo */}
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/50">
              <img 
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile-PNG-File-uVy51WIiSA6CiTEscPJNbN9ilYFITu.png" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button 
              onClick={() => router.push('/profile/edit')}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-lg"
            >
              <Edit className="w-4 h-4 text-[#3A85BD]" />
            </button>
          </div>
          <h2 className="text-white font-serif text-2xl font-bold mt-4">{profile.name}</h2>
          <p className="text-white/80 font-sans text-sm">{profile.email}</p>
          
          {/* Stats */}
          <div className="flex gap-8 mt-6">
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <p className="text-white font-sans font-bold text-lg">{profile.rating}</p>
              </div>
              <p className="text-white/70 font-sans text-xs">Rating</p>
            </div>
            <div className="text-center">
              <p className="text-white font-sans font-bold text-lg mb-1">{profile.trips}</p>
              <p className="text-white/70 font-sans text-xs">Trips</p>
            </div>
            <div className="text-center">
              <div className="flex items-center gap-1 justify-center mb-1">
                <Award className="w-4 h-4 text-yellow-300" />
                <p className="text-white font-sans font-bold text-lg">{profile.points}</p>
              </div>
              <p className="text-white/70 font-sans text-xs">Points</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 -mt-12">
        {/* Car Info Card (for drivers) */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border-2 border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-800 font-serif text-lg font-bold">My Vehicle</h3>
            <button 
              onClick={() => router.push('/profile/edit')}
              className="text-[#3A85BD] font-sans text-sm font-bold"
            >
              Edit
            </button>
          </div>
          <div className="flex items-center gap-4">
            <Car className="w-10 h-10 text-[#3A85BD]" />
            <div>
              <p className="font-sans font-bold text-gray-800">{profile.carModel}</p>
              <p className="font-sans text-sm text-gray-500">Plate: {profile.plateNumber}</p>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="space-y-2">
          <button 
            onClick={() => router.push('/rides')}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#EEEEFF] flex items-center justify-center">
              <Car className="w-5 h-5 text-[#7F7CAF]" />
            </div>
            <span className="flex-1 text-left font-sans font-bold text-gray-800">Trip History</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L14 10L8 16" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button 
            onClick={() => router.push('/rewards')}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#EEEEFF] flex items-center justify-center">
              <Award className="w-5 h-5 text-[#7F7CAF]" />
            </div>
            <span className="flex-1 text-left font-sans font-bold text-gray-800">Rewards</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L14 10L8 16" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button 
            onClick={() => router.push('/safety')}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#EEEEFF] flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#7F7CAF]" />
            </div>
            <span className="flex-1 text-left font-sans font-bold text-gray-800">Safety Center</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L14 10L8 16" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button 
            onClick={() => router.push('/notifications')}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#EEEEFF] flex items-center justify-center">
              <Bell className="w-5 h-5 text-[#7F7CAF]" />
            </div>
            <span className="flex-1 text-left font-sans font-bold text-gray-800">Notifications</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L14 10L8 16" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button 
            onClick={() => router.push('/settings')}
            className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-[#EEEEFF] flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#7F7CAF]" />
            </div>
            <span className="flex-1 text-left font-sans font-bold text-gray-800">Settings</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L14 10L8 16" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className="w-full flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="w-10 h-10 rounded-full bg-[#EEEEFF] flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-[#7F7CAF]" />
            </div>
            <span className="flex-1 text-left font-sans font-bold text-gray-800">Help & Support</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M8 4L14 10L8 16" stroke="#999" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button 
            onClick={() => router.push('/')}
            className="w-full flex items-center gap-4 p-4 bg-red-50 rounded-xl hover:bg-red-100 transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <LogOut className="w-5 h-5 text-red-600" />
            </div>
            <span className="flex-1 text-left font-sans font-bold text-red-600">Log Out</span>
          </button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
