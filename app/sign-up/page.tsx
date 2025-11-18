'use client'

import { useState } from 'react'
import { UnipoolLogo } from '@/components/unipool-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    universityId: '',
    phone: ''
  })

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault()
    // Navigate to role selection after sign up
    router.push('/role-selection')
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-16 pb-8 relative overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #EEEEFF 0%, #7F7CAF 25%, #9FB4C7 50%, #3A85BD 75%, #9FB798 100%)'
        }}
      />
      
      {/* Welcome Text */}
      <div className="mb-8">
        <h1 className="text-white font-serif text-4xl font-bold mb-2">Create</h1>
        <h2 className="text-white font-serif text-4xl font-bold">Account</h2>
      </div>

      {/* Sign Up Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-[#7F7CAF] font-sans font-bold text-sm">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-[#7F7CAF] focus-visible:ring-0 placeholder:text-gray-400 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#7F7CAF] font-sans font-bold text-sm">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@university.edu"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-[#7F7CAF] focus-visible:ring-0 placeholder:text-gray-400 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#7F7CAF] font-sans font-bold text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={formData.password}
                onChange={(e) => handleChange('password', e.target.value)}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-[#7F7CAF] focus-visible:ring-0 placeholder:text-gray-400 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="universityId" className="text-[#7F7CAF] font-sans font-bold text-sm">
                University ID
              </Label>
              <Input
                id="universityId"
                type="text"
                placeholder="U12345678"
                value={formData.universityId}
                onChange={(e) => handleChange('universityId', e.target.value)}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-[#7F7CAF] focus-visible:ring-0 placeholder:text-gray-400 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#7F7CAF] font-sans font-bold text-sm">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 123-4567"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-[#7F7CAF] focus-visible:ring-0 placeholder:text-gray-400 text-sm"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full h-14 bg-[#7F7CAF] hover:bg-[#7F7CAF]/90 text-white font-sans font-bold text-lg rounded-full mt-6"
            >
              SIGN UP
            </Button>

            <div className="text-center pt-4">
              <span className="text-gray-500 text-sm font-sans">Already have an account? </span>
              <button
                type="button"
                onClick={() => router.push('/sign-in')}
                className="text-[#7F7CAF] text-sm font-sans font-bold hover:underline"
              >
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
