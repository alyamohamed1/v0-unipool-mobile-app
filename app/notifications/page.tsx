'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Car, MessageCircle, Star, Gift, Clock } from 'lucide-react'

export default function NotificationsPage() {
  const router = useRouter()

  const notifications = [
    {
      icon: Car,
      title: 'Ride Request Accepted',
      message: 'Ahmed Ali accepted your ride request. Pickup in 10 minutes.',
      time: '2 min ago',
      unread: true,
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: MessageCircle,
      title: 'New Message',
      message: 'You have a new message from Sarah',
      time: '15 min ago',
      unread: true,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: Star,
      title: 'New Rating',
      message: 'Ahmed Ali rated you 5 stars!',
      time: '1 hour ago',
      unread: false,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      icon: Gift,
      title: 'Reward Earned',
      message: 'You earned 50 points! Keep riding to unlock rewards.',
      time: '3 hours ago',
      unread: false,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: Clock,
      title: 'Ride Reminder',
      message: 'Your ride is scheduled for tomorrow at 9:00 AM',
      time: '1 day ago',
      unread: false,
      color: 'bg-orange-100 text-orange-600'
    },
    {
      icon: Car,
      title: 'Ride Completed',
      message: 'Your ride to American University has been completed',
      time: '2 days ago',
      unread: false,
      color: 'bg-gray-100 text-gray-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEEFF] via-[#9FB4C7] to-[#9FB798]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Notifications</h1>
        </div>
        <button className="text-sm text-[#3A85BD] font-medium">
          Mark all read
        </button>
      </div>

      <div className="p-6 space-y-3">
        {notifications.map((notification, index) => {
          const Icon = notification.icon
          return (
            <div
              key={index}
              className={`bg-white rounded-2xl p-4 shadow-md ${
                notification.unread ? 'border-l-4 border-[#3A85BD]' : ''
              }`}
            >
              <div className="flex gap-4">
                <div className={`w-12 h-12 ${notification.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-sm">{notification.title}</h3>
                    {notification.unread && (
                      <div className="w-2 h-2 bg-[#3A85BD] rounded-full"></div>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                  <p className="text-xs text-gray-400">{notification.time}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
