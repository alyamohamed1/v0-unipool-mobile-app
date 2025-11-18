'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Moon, Sun, Bell, Lock, Globe, HelpCircle, LogOut, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'

export default function SettingsPage() {
  const router = useRouter()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)

  const settingsSections = [
    {
      title: 'Preferences',
      items: [
        {
          icon: darkMode ? Moon : Sun,
          label: 'Dark Mode',
          type: 'toggle',
          value: darkMode,
          onChange: setDarkMode
        },
        {
          icon: Bell,
          label: 'Push Notifications',
          type: 'toggle',
          value: notifications,
          onChange: setNotifications
        },
        {
          icon: Globe,
          label: 'Language',
          type: 'link',
          value: 'English',
          action: () => {}
        }
      ]
    },
    {
      title: 'Privacy & Security',
      items: [
        {
          icon: Lock,
          label: 'Change Password',
          type: 'link',
          action: () => router.push('/settings/password')
        },
        {
          icon: Lock,
          label: 'Privacy Settings',
          type: 'link',
          action: () => router.push('/settings/privacy')
        }
      ]
    },
    {
      title: 'Support',
      items: [
        {
          icon: HelpCircle,
          label: 'Help & Support',
          type: 'link',
          action: () => router.push('/settings/help')
        },
        {
          icon: HelpCircle,
          label: 'About',
          type: 'link',
          action: () => router.push('/settings/about')
        }
      ]
    }
  ]

  const handleLogout = () => {
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEEFF] via-[#9FB4C7] to-[#9FB798]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </div>

      <div className="p-6 space-y-4">
        {settingsSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="bg-white rounded-3xl p-6 shadow-lg">
            <h3 className="font-bold text-sm text-gray-500 uppercase mb-4">
              {section.title}
            </h3>
            <div className="space-y-1">
              {section.items.map((item, itemIndex) => {
                const Icon = item.icon
                return (
                  <div
                    key={itemIndex}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5 text-gray-600" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.type === 'toggle' && (
                      <Switch
                        checked={item.value}
                        onCheckedChange={item.onChange}
                      />
                    )}
                    {item.type === 'link' && (
                      <div className="flex items-center gap-2">
                        {item.value && (
                          <span className="text-sm text-gray-500">{item.value}</span>
                        )}
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="w-full bg-red-600 hover:bg-red-700 text-white py-6 rounded-full text-lg font-bold flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </Button>

        {/* App Version */}
        <p className="text-center text-sm text-gray-600">
          UNIPOOL v1.0.0
        </p>
      </div>
    </div>
  )
}
