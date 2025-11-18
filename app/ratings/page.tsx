'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Star, ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import Image from 'next/image'

export default function RatingsPage() {
  const router = useRouter()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = () => {
    if (rating === 0) return
    // Submit rating logic here
    console.log('[v0] Rating submitted:', { rating, feedback })
    setSubmitted(true)
    setTimeout(() => router.push('/rides'), 2000)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#EEEEFF] via-[#9FB4C7] to-[#9FB798] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl p-8 text-center max-w-sm w-full shadow-xl">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600">Your feedback helps us improve</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#EEEEFF] via-[#9FB4C7] to-[#9FB798]">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm p-4 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Rate Your Trip</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Driver Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-200">
              <Image
                src="/driver-profile.png"
                alt="Driver"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-lg">Ahmed Ali</h3>
              <p className="text-sm text-gray-600">Toyota Camry • 123456</p>
            </div>
          </div>

          {/* Star Rating */}
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-4 font-medium">How was your experience?</p>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="mt-3 text-sm font-medium text-gray-700">
                {rating === 5 && 'Excellent! ⭐'}
                {rating === 4 && 'Great! 👍'}
                {rating === 3 && 'Good'}
                {rating === 2 && 'Could be better'}
                {rating === 1 && 'Not satisfied'}
              </p>
            )}
          </div>

          {/* Feedback */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">
              Share your feedback (optional)
            </label>
            <Textarea
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-[120px] resize-none rounded-2xl border-2"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={rating === 0}
            className="w-full mt-6 bg-gradient-to-r from-[#3A85BD] to-[#7F7CAF] text-white py-6 rounded-full text-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Submit Rating
            <Send className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
