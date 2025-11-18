'use client'

import { useState } from 'react'
import { UnipoolLogo } from '@/components/unipool-logo'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function WelcomePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #EEEEFF 0%, #7F7CAF 25%, #9FB4C7 50%, #3A85BD 75%, #9FB798 100%)'
        }}
      />
      
      {/* Logo */}
      <div className="mb-12">
        <UnipoolLogo className="h-16" variant="white" />
      </div>

      {/* Welcome Text */}
      <h1 className="text-white font-serif text-3xl font-bold mb-12 text-center">
        Welcome Back
      </h1>

      {/* Buttons */}
      <div className="w-full max-w-xs space-y-4">
        <Button
          onClick={() => router.push('/sign-in')}
          className="w-full h-14 bg-transparent border-2 border-white text-white font-sans font-bold text-lg rounded-full hover:bg-white/20 transition-all"
        >
          SIGN IN
        </Button>
        
        <Button
          onClick={() => router.push('/sign-up')}
          className="w-full h-14 bg-white/30 backdrop-blur-sm text-white font-sans font-bold text-lg rounded-full hover:bg-white/40 transition-all border-0"
        >
          SIGN UP
        </Button>
      </div>
    </div>
  )
}
