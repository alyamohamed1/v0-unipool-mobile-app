'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, Phone, AlertTriangle, FileText, Users, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function SafetyCenterPage() {
  const router = useRouter()

  const safetyTips = [
    {
      icon: CheckCircle,
      title: 'Verify Driver Details',
      description: 'Always check the driver\'s photo, name, and car details before getting in'
    },
    {
      icon: Users,
      title: 'Share Your Trip',
      description: 'Share your trip details with friends or family for added security'
    },
    {
      icon: Phone,
      title: 'Stay Connected',
      description: 'Keep your phone charged and maintain communication throughout the ride'
    },
    {
      icon: Shield,
      title: 'Trust Your Instincts',
      description: 'If something doesn\'t feel right, don\'t hesitate to cancel the ride'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEEFF] via-[#9FB4C7] to-[#9FB798]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Safety Center</h1>
      </div>

      <div className="p-6 space-y-4">
        {/* Emergency Contact */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <Phone className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Emergency Contact</h3>
              <p className="text-sm text-gray-600">Available 24/7</p>
            </div>
          </div>
          <Button className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-full text-lg font-bold">
            Call Emergency: 999
          </Button>
        </div>

        {/* Report User */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Report an Issue</h3>
              <p className="text-sm text-gray-600">Help us keep the community safe</p>
            </div>
          </div>
          <Button 
            onClick={() => router.push('/safety/report')}
            className="w-full bg-gradient-to-r from-[#7F7CAF] to-[#3A85BD] text-white py-4 rounded-full font-bold"
          >
            Submit a Report
          </Button>
        </div>

        {/* Safety Tips */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-8 h-8 text-[#3A85BD]" />
            <h3 className="font-bold text-lg">Safety Tips</h3>
          </div>
          
          <div className="space-y-4">
            {safetyTips.map((tip, index) => {
              const Icon = tip.icon
              return (
                <div key={index} className="flex gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#3A85BD]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Community Guidelines */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-[#7F7CAF]" />
            <h3 className="font-bold text-lg">Community Guidelines</h3>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            UNIPOOL is built on trust and respect. Please follow our guidelines to ensure a safe and pleasant experience for everyone.
          </p>
          <Button 
            variant="outline"
            className="w-full border-2 border-[#3A85BD] text-[#3A85BD] py-4 rounded-full font-bold"
          >
            Read Full Guidelines
          </Button>
        </div>
      </div>
    </div>
  )
}
