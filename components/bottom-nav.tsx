'use client'

import { Home, Car, User } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { userData } = useAuth()

  const isActive = (path: string) => pathname.startsWith(path)

  // Determine home route based on user role
  const homeRoute = userData?.role === 'driver' ? '/driver' : '/rider'

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
      <div className="flex items-center justify-around h-16 max-w-md mx-auto">
        <button
          onClick={() => router.push(homeRoute)}
          className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
            isActive(homeRoute) ? 'text-[#3A85BD]' : 'text-gray-400'
          }`}
        >
          <Home className="w-6 h-6" />
          <span className="text-xs font-sans font-bold">Home</span>
        </button>

        <button
          onClick={() => router.push('/rides')}
          className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
            isActive('/rides') ? 'text-[#3A85BD]' : 'text-gray-400'
          }`}
        >
          <Car className="w-6 h-6" />
          <span className="text-xs font-sans font-bold">Rides</span>
        </button>

        <button
          onClick={() => router.push('/profile')}
          className={`flex flex-col items-center gap-1 px-6 py-2 transition-colors ${
            isActive('/profile') ? 'text-[#3A85BD]' : 'text-gray-400'
          }`}
        >
          <User className="w-6 h-6" />
          <span className="text-xs font-sans font-bold">Profile</span>
        </button>
      </div>
    </div>
  )
}
