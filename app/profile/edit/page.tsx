'use client'

import { useState, useEffect } from 'react'
import { ArrowLeft, Camera, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { useAuth } from '@/lib/context/AuthContext'
import { updateDocument } from '@/lib/firebase/firestore'
import { uploadFile } from '@/lib/firebase/storage'

export default function EditProfilePage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, userData, loading, refreshUserData } = useAuth()
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    university: '',
    studentId: '',
    gender: '',
    bio: '',
    carModel: '',
    plateNumber: '',
    carColor: ''
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user && userData) {
      setFormData({
        name: userData.name || userData.displayName || '',
        email: userData.email || '',
        phone: userData.phone || '',
        university: (userData as any).university || '',
        studentId: userData.universityId || '',
        gender: (userData as any).gender || '',
        bio: (userData as any).bio || '',
        carModel: (userData as any).carModel || '',
        plateNumber: (userData as any).plateNumber || '',
        carColor: (userData as any).carColor || ''
      })
    }
  }, [user, userData])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setSaving(true)

    try {
      await updateDocument('users', user.uid, {
        name: formData.name,
        phone: formData.phone,
        university: formData.university,
        universityId: formData.studentId,
        gender: formData.gender,
        bio: formData.bio,
        carModel: formData.carModel,
        plateNumber: formData.plateNumber,
        carColor: formData.carColor
      })

      await refreshUserData()

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
      router.push('/profile')
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div 
        className="relative pt-12 pb-6 px-6"
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
        <h1 className="text-white font-serif text-2xl font-bold text-center">Edit Profile</h1>
      </div>

      {/* Profile Photo Section */}
      <div className="flex justify-center -mt-12 mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Profile-PNG-File-uVy51WIiSA6CiTEscPJNbN9ilYFITu.png" 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#3A85BD] flex items-center justify-center shadow-lg">
            <Camera className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="px-6 space-y-6">
        {/* Personal Information */}
        <div>
          <h2 className="text-lg font-serif font-bold text-gray-800 mb-4">Personal Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans"
                placeholder="your.email@university.edu"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans"
                placeholder="+973 1234 5678"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">University</label>
              <input
                type="text"
                name="university"
                value={formData.university}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans"
                placeholder="Your university name"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">Student ID</label>
              <input
                type="text"
                name="studentId"
                value={formData.studentId}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans"
                placeholder="202012345"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans resize-none"
                placeholder="Tell us about yourself..."
              />
            </div>
          </div>
        </div>

        {/* Vehicle Information */}
        <div>
          <h2 className="text-lg font-serif font-bold text-gray-800 mb-4">Vehicle Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">Car Model</label>
              <input
                type="text"
                name="carModel"
                value={formData.carModel}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans"
                placeholder="e.g., Toyota Camry 2022"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">Plate Number</label>
              <input
                type="text"
                name="plateNumber"
                value={formData.plateNumber}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans"
                placeholder="ABC-1234"
              />
            </div>

            <div>
              <label className="block text-sm font-sans font-bold text-gray-700 mb-2">Car Color</label>
              <input
                type="text"
                name="carColor"
                value={formData.carColor}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3A85BD] focus:outline-none font-sans"
                placeholder="e.g., Silver, Black, White"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <Button
          type="submit"
          disabled={saving}
          className="w-full h-12 rounded-full font-sans font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
          style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #7F7CAF 100%)' }}
        >
          <Save className="w-5 h-5" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  )
}
