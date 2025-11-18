'use client'

import { useState } from 'react'
import { ArrowLeft, Star, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Textarea } from '@/components/ui/textarea'

export default function RatePassengersPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [ratings, setRatings] = useState({
    punctuality: 0,
    behavior: 0,
    cleanliness: 0,
    overall: 0
  })
  const [comment, setComment] = useState('')

  const handleRatingChange = (category: string, value: number) => {
    setRatings(prev => ({ ...prev, [category]: value }))
  }

  const handleSubmit = () => {
    // Store rating
    const ratingData = {
      ...ratings,
      comment,
      date: new Date().toISOString()
    }
    
    // Update ride with rating
    const rides = JSON.parse(localStorage.getItem('completedRides') || '[]')
    rides[parseInt(params.id)] = { ...rides[parseInt(params.id)], hasRated: true, rating: ratings.overall }
    localStorage.setItem('completedRides', JSON.stringify(rides))
    
    router.push('/rides')
  }

  const RatingCategory = ({ title, category }: { title: string; category: string }) => (
    <div className="mb-6">
      <h3 className="font-sans font-bold text-gray-800 mb-3">{title}</h3>
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            onClick={() => handleRatingChange(category, value)}
            className="transition-transform hover:scale-110"
          >
            <Star
              className={`w-10 h-10 ${
                value <= ratings[category as keyof typeof ratings]
                  ? 'text-yellow-400 fill-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div 
        className="px-6 pt-12 pb-8"
        style={{
          background: 'linear-gradient(135deg, #7F7CAF 0%, #3A85BD 100%)'
        }}
      >
        <button 
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-serif text-3xl font-bold">Rate Passengers</h1>
        <p className="text-white/80 font-sans text-sm mt-2">Share your experience with co-passengers</p>
      </div>

      <div className="px-6 py-8">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <RatingCategory title="Punctuality" category="punctuality" />
          <RatingCategory title="Behavior" category="behavior" />
          <RatingCategory title="Cleanliness" category="cleanliness" />
          <RatingCategory title="Overall Experience" category="overall" />

          <div className="mt-6">
            <h3 className="font-sans font-bold text-gray-800 mb-3">Additional Comments (Optional)</h3>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share more about your experience..."
              className="min-h-[100px] rounded-2xl border-2"
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={ratings.overall === 0}
            className="w-full h-14 mt-6 rounded-full font-sans font-bold text-lg text-white disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)' }}
          >
            <Check className="w-6 h-6 mr-2" />
            Submit Rating
          </Button>
        </div>
      </div>
    </div>
  )
}
