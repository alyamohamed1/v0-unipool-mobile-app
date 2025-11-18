'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

export default function ReportPage() {
  const router = useRouter()
  const [reportType, setReportType] = useState('')
  const [description, setDescription] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const reportTypes = [
    'Unsafe Driving',
    'Inappropriate Behavior',
    'Vehicle Condition',
    'Route Issues',
    'Payment Dispute',
    'Other'
  ]

  const handleSubmit = () => {
    if (!reportType || !description.trim()) {
      alert('Please select a report type and provide a description')
      return
    }
    
    console.log('[v0] Report submitted:', { reportType, description })
    setSubmitted(true)
    
    setTimeout(() => {
      router.push('/safety')
    }, 2000)
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Report Submitted</h2>
          <p className="text-gray-600">Our team will review your report and take appropriate action.</p>
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
        <h1 className="text-xl font-bold">Submit a Report</h1>
      </div>

      <div className="p-6 space-y-6">
        <div className="bg-white rounded-3xl p-6 shadow-lg">
          <p className="text-sm text-gray-600 mb-6">
            Your safety is our priority. Please provide details about the issue you experienced.
          </p>

          {/* Report Type Selection */}
          <div className="space-y-3 mb-6">
            <Label className="text-sm font-medium text-gray-700">Issue Type</Label>
            <div className="grid grid-cols-2 gap-3">
              {reportTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setReportType(type)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all ${
                    reportType === type
                      ? 'bg-[#3A85BD] text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 mb-6">
            <Label className="text-sm font-medium text-gray-700">
              Description
            </Label>
            <Textarea
              placeholder="Please describe what happened in detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[150px] resize-none rounded-2xl border-2"
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleSubmit}
            disabled={!reportType || !description.trim()}
            className="w-full bg-gradient-to-r from-[#3A85BD] to-[#7F7CAF] text-white py-6 rounded-full text-lg font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            Submit Report
            <Send className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4">
          <p className="text-xs text-gray-600 text-center">
            Your report will be kept confidential and reviewed by our safety team within 24 hours.
          </p>
        </div>
      </div>
    </div>
  )
}
