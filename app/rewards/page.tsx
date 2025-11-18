'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Gift, Star, Trophy, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function RewardsPage() {
  const router = useRouter()

  const totalPoints = 850
  const nextTierPoints = 1000
  const progress = (totalPoints / nextTierPoints) * 100

  const tiers = [
    { name: 'Bronze', min: 0, max: 499, color: 'from-amber-600 to-amber-400', icon: '🥉' },
    { name: 'Silver', min: 500, max: 999, color: 'from-gray-400 to-gray-200', icon: '🥈' },
    { name: 'Gold', min: 1000, max: 2499, color: 'from-yellow-500 to-yellow-300', icon: '🥇' },
    { name: 'Platinum', min: 2500, max: Infinity, color: 'from-purple-500 to-pink-400', icon: '💎' }
  ]

  const currentTier = tiers.find(tier => totalPoints >= tier.min && totalPoints <= tier.max)

  const rewardItems = [
    { points: 100, title: 'Free Ride', description: '1 free ride up to 5 BD', available: true },
    { points: 250, title: '20% Discount', description: 'Valid for next 5 rides', available: true },
    { points: 500, title: 'Priority Booking', description: '1 month of priority access', available: true },
    { points: 1000, title: 'Gold Status', description: 'Unlock exclusive perks', available: false }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEEFF] via-[#9FB4C7] to-[#9FB798]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Rewards</h1>
      </div>

      <div className="p-6 space-y-4">
        {/* Points Card */}
        <div className="bg-gradient-to-br from-[#3A85BD] to-[#7F7CAF] rounded-3xl p-6 shadow-xl text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm opacity-90">Your Points</p>
              <h2 className="text-4xl font-bold">{totalPoints}</h2>
            </div>
            <div className="text-5xl">{currentTier?.icon}</div>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span>{currentTier?.name} Tier</span>
              <span>{nextTierPoints - totalPoints} to next tier</span>
            </div>
            <div className="w-full bg-white/30 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white h-full rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm">You're on track! Complete 3 more rides to level up.</p>
          </div>
        </div>

        {/* Tier Overview */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Trophy className="w-6 h-6 text-[#3A85BD]" />
            Tier System
          </h3>
          <div className="space-y-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex items-center gap-4 p-3 rounded-xl ${
                  tier.name === currentTier?.name
                    ? `bg-gradient-to-r ${tier.color} text-white`
                    : 'bg-gray-50'
                }`}
              >
                <span className="text-2xl">{tier.icon}</span>
                <div className="flex-1">
                  <h4 className="font-bold">{tier.name}</h4>
                  <p className="text-sm opacity-80">
                    {tier.min} - {tier.max === Infinity ? '∞' : tier.max} points
                  </p>
                </div>
                {tier.name === currentTier?.name && (
                  <Star className="w-5 h-5" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Redeem Rewards */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Gift className="w-6 h-6 text-[#7F7CAF]" />
            Redeem Rewards
          </h3>
          <div className="space-y-3">
            {rewardItems.map((reward, index) => (
              <div
                key={index}
                className="border-2 border-gray-100 rounded-2xl p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-bold">{reward.title}</h4>
                  <div className="flex items-center gap-1 text-[#3A85BD] font-bold">
                    <Star className="w-4 h-4 fill-current" />
                    {reward.points}
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-3">{reward.description}</p>
                <Button
                  disabled={!reward.available || totalPoints < reward.points}
                  className="w-full bg-gradient-to-r from-[#3A85BD] to-[#7F7CAF] text-white rounded-full font-bold disabled:opacity-50"
                >
                  {totalPoints >= reward.points ? 'Redeem' : `Need ${reward.points - totalPoints} more points`}
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* How to Earn */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <h3 className="font-bold text-lg mb-4">How to Earn Points</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                50
              </div>
              <span className="text-gray-700">Complete a ride</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                25
              </div>
              <span className="text-gray-700">Refer a friend</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                10
              </div>
              <span className="text-gray-700">Rate a driver</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
