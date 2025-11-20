"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Star, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

const mockPassengers = [
  { id: 1, name: "Sarah Johnson", image: "/images/profile-default.png" },
  { id: 2, name: "Mike Chen", image: "/images/profile-default.png" },
  { id: 3, name: "Emily Davis", image: "/images/profile-default.png" },
]

export default function RatePassengersPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [userRole, setUserRole] = useState<"rider" | "driver">("rider")
  const [selectedPassenger, setSelectedPassenger] = useState(0)
  const [ratings, setRatings] = useState({
    punctuality: 0,
    behavior: 0,
    cleanliness: 0,
    overall: 0,
  })
  const [comment, setComment] = useState("")

  useEffect(() => {
    const role = localStorage.getItem("userRole") || "rider"
    setUserRole(role as "rider" | "driver")
  }, [])

  const handleRatingChange = (category: string, value: number) => {
    setRatings((prev) => ({ ...prev, [category]: value }))
  }

  const handleSubmit = () => {
    // Store rating
    const ratingData = {
      passengerId: mockPassengers[selectedPassenger].id,
      passengerName: mockPassengers[selectedPassenger].name,
      ...ratings,
      comment,
      date: new Date().toISOString(),
    }

    // Update ride with rating
    const rides = JSON.parse(localStorage.getItem("completedRides") || "[]")
    if (rides[Number.parseInt(params.id)]) {
      rides[Number.parseInt(params.id)] = {
        ...rides[Number.parseInt(params.id)],
        hasRatedPassengers: true,
      }
      localStorage.setItem("completedRides", JSON.stringify(rides))
    }

    toast({
      title: "Rating Submitted",
      description: `Thank you for rating ${mockPassengers[selectedPassenger].name}!`,
    })

    // Move to next passenger or go back to rides
    if (selectedPassenger < mockPassengers.length - 1) {
      setSelectedPassenger((prev) => prev + 1)
      setRatings({ punctuality: 0, behavior: 0, cleanliness: 0, overall: 0 })
      setComment("")
    } else {
      router.push("/rides")
    }
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
                value <= ratings[category as keyof typeof ratings] ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
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
          background: "linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)",
        }}
      >
        <button onClick={() => router.back()} className="mb-4">
          <ArrowLeft className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-white font-serif text-3xl font-bold">
          {userRole === "rider" ? "Rate Co-Passengers" : "Rate Passengers"}
        </h1>
        <p className="text-white/80 font-sans text-sm mt-2">
          Share your experience with {userRole === "rider" ? "your co-passengers" : "passengers"}
        </p>
      </div>

      <div className="px-6 py-8">
        <div className="mb-6">
          <h3 className="font-sans font-bold text-gray-800 mb-4">
            Select Passenger ({selectedPassenger + 1}/{mockPassengers.length})
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {mockPassengers.map((passenger, index) => (
              <button
                key={passenger.id}
                onClick={() => {
                  setSelectedPassenger(index)
                  setRatings({ punctuality: 0, behavior: 0, cleanliness: 0, overall: 0 })
                  setComment("")
                }}
                className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-2xl transition-all ${
                  selectedPassenger === index
                    ? "bg-gradient-to-b from-[#3A85BD] to-[#9FB798] text-white"
                    : "bg-white text-gray-700 border-2 border-gray-200"
                }`}
              >
                <img
                  src={passenger.image || "/placeholder.svg"}
                  alt={passenger.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <span className="font-sans font-bold text-sm">{passenger.name}</span>
              </button>
            ))}
          </div>
        </div>

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
            style={{ background: "linear-gradient(135deg, #3A85BD 0%, #9FB798 100%)" }}
          >
            <Check className="w-6 h-6 mr-2" />
            {selectedPassenger < mockPassengers.length - 1 ? "Next Passenger" : "Submit Rating"}
          </Button>
        </div>
      </div>
    </div>
  )
}
