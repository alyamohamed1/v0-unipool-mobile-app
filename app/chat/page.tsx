'use client'

import { useState, useEffect, useRef } from 'react'
import { ArrowLeft, Send, Phone, MoreVertical } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { chatService, Message } from '@/lib/services/chat.service'

export default function ChatPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, userData, loading } = useAuth()
  const { toast } = useToast()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatId = searchParams.get('chatId')
  const otherUserId = searchParams.get('userId')
  const otherUserName = searchParams.get('userName') || 'User'

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (!chatId || !user) return

    setLoadingMessages(true)

    // Subscribe to real-time messages
    const unsubscribe = chatService.subscribeToMessages(chatId, (msgs) => {
      setMessages(msgs)
      setLoadingMessages(false)
      // Mark messages as read
      chatService.markMessagesAsRead(chatId, user.uid)
    })

    return () => unsubscribe()
  }, [chatId, user])

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = async () => {
    if (!newMessage.trim() || !chatId || !user || !userData) return

    setSending(true)
    try {
      const result = await chatService.sendMessage(
        chatId,
        user.uid,
        userData.name || userData.displayName || 'User',
        newMessage.trim()
      )

      if (result.success) {
        setNewMessage('')
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to send message",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive"
      })
    } finally {
      setSending(false)
    }
  }

  const formatTime = (date: Date | any) => {
    if (!date) return ''
    const d = date instanceof Date ? date : date.toDate?.() || new Date()
    return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
  }

  if (loading || loadingMessages) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#3A85BD] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-sans">Loading chat...</p>
        </div>
      </div>
    )
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
          <h2 className="text-white font-sans font-bold">{otherUserName}</h2>
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
        {messages.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 font-sans">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isMe = message.senderId === user?.uid
            return (
              <div
                key={message.id}
                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[75%] ${isMe ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-3 shadow-sm ${
                      isMe
                        ? 'bg-gradient-to-r from-[#3A85BD] to-[#7F7CAF] text-white rounded-br-sm'
                        : 'bg-white text-gray-800 rounded-bl-sm border border-gray-100'
                    }`}
                  >
                    <p className="font-sans text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <p className={`text-xs font-sans text-gray-400 mt-1 px-1 ${isMe ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            )
          })
        )}
        <div ref={messagesEndRef} />
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
            disabled={!newMessage.trim() || sending}
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
