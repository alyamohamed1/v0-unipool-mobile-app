'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Bell, Car, MessageCircle, Star, Gift, Clock, AlertCircle } from 'lucide-react'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { notificationService, Notification } from '@/lib/services/notification.service'

export default function NotificationsPage() {
  const router = useRouter()
  const { user, loading } = useAuth()
  const { toast } = useToast()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loadingNotifications, setLoadingNotifications] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return

    setLoadingNotifications(true)

    // Subscribe to real-time notifications
    const unsubscribe = notificationService.subscribeToNotifications(user.uid, (notifs) => {
      setNotifications(notifs)
      setLoadingNotifications(false)
    })

    return () => unsubscribe()
  }, [user])

  const handleMarkAllRead = async () => {
    if (!user) return

    try {
      const result = await notificationService.markAllAsRead(user.uid)
      if (result.success) {
        toast({
          title: "Success",
          description: "All notifications marked as read"
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to mark notifications as read",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      })
    }
  }

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'ride_request':
      case 'ride_accepted':
      case 'ride_declined':
      case 'ride_completed':
        return Car
      case 'message':
        return MessageCircle
      case 'rating':
        return Star
      case 'reward':
        return Gift
      case 'reminder':
        return Clock
      default:
        return Bell
    }
  }

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'ride_accepted':
        return 'bg-green-100 text-green-600'
      case 'ride_declined':
        return 'bg-red-100 text-red-600'
      case 'message':
        return 'bg-blue-100 text-blue-600'
      case 'rating':
        return 'bg-yellow-100 text-yellow-600'
      case 'reward':
        return 'bg-purple-100 text-purple-600'
      case 'reminder':
        return 'bg-orange-100 text-orange-600'
      case 'ride_request':
        return 'bg-indigo-100 text-indigo-600'
      default:
        return 'bg-gray-100 text-gray-600'
    }
  }

  const formatTime = (date: Date | any) => {
    if (!date) return ''
    const d = date instanceof Date ? date : date.toDate?.() || new Date()
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins} min ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
    return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  }

  if (loading || loadingNotifications) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3A85BD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading notifications...</p>
        </div>
      </div>
    )
  }

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
        <button
          onClick={handleMarkAllRead}
          className="text-sm text-[#3A85BD] font-medium"
        >
          Mark all read
        </button>
      </div>

      <div className="p-6 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow-md">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-sans font-bold text-gray-800 mb-2">No Notifications</h3>
            <p className="text-gray-500 font-sans text-sm">
              You're all caught up! No new notifications.
            </p>
          </div>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type)
            const color = getNotificationColor(notification.type)
            return (
              <div
                key={notification.id}
                className={`bg-white rounded-2xl p-4 shadow-md ${
                  !notification.read ? 'border-l-4 border-[#3A85BD]' : ''
                }`}
              >
                <div className="flex gap-4">
                  <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-bold text-sm">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-[#3A85BD] rounded-full"></div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                    <p className="text-xs text-gray-400">{formatTime(notification.createdAt)}</p>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
