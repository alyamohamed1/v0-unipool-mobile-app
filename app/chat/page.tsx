'use client'

import { useState } from 'react'
import { ArrowLeft, Send, Phone, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'

const mockMessages = [
  { id: 1, text: "Hi! I'm on my way to the pickup location.", sender: 'other', time: '9:30 AM' },
  { id: 2, text: "Great! I'll be waiting near the main entrance.", sender: 'me', time: '9:31 AM' },
  { id: 3, text: "I'm driving a white Toyota Camry, plate ABC-1234.", sender: 'other', time: '9:32 AM' },
  { id: 4, text: "Perfect, I see you!", sender: 'me', time: '9:35 AM' },
]

export default function ChatPage() {
  const router = useRouter()
  const [messages, setMessages] = useState(mockMessages)
  const [newMessage, setNewMessage] = useState('')

  const handleSend = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: newMessage,
        sender: 'me',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
      }])
      setNewMessage('')
    }
  }

  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Header */}
      <div 
        className="flex items-center gap-4 px-4 py-3 border-b border-gray-200"
        style={{
          background: 'linear-gradient(90deg, #7F7CAF 0%, #3A85BD 100%)'
        }}
      >
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center overflow-hidden flex-shrink-0">
          <img src="/chat-user-photo.png" alt="Driver" className="w-full h-full object-cover" />
        </div>
        
        <div className="flex-1">
          <h2 className="text-white font-sans font-bold">Ahmed Al-Khalifa</h2>
          <p className="text-white/80 font-sans text-xs">Active now</p>
        </div>

        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Phone className="w-5 h-5 text-white" />
        </button>

        <button 
          onClick={() => router.push('/safety')}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
        >
          <MoreVertical className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] ${message.sender === 'me' ? 'order-2' : 'order-1'}`}>
              <div
                className={`rounded-2xl px-4 py-3 shadow-sm ${
                  message.sender === 'me'
                    ? 'bg-gradient-to-r from-[#3A85BD] to-[#7F7CAF] text-white rounded-br-sm'
                    : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                }`}
              >
                <p className="font-sans text-sm leading-relaxed">{message.text}</p>
              </div>
              <p className={`text-xs font-sans text-gray-400 mt-1 px-1 ${message.sender === 'me' ? 'text-right' : 'text-left'}`}>
                {message.time}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 px-4 py-4 bg-white">
        <div className="flex items-center gap-3">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type a message..."
            className="flex-1 rounded-full border-2 border-gray-200 px-5 py-3 h-12 font-sans focus:border-[#3A85BD] focus-visible:ring-0"
          />
          <button
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className="w-12 h-12 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #3A85BD 0%, #7F7CAF 100%)'
            }}
          >
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}
