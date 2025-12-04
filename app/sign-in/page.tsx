'use client'

import { useState } from 'react'
import { UnipoolLogo } from '@/components/unipool-logo'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { loginUser } from '@/lib/firebase/auth'
import { useToast } from '@/hooks/use-toast'

export default function SignInPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { user, error } = await loginUser(email, password)

      if (error) {
        toast({
          title: "Sign In Failed",
          description: error,
          variant: "destructive"
        })
        setLoading(false)
        return
      }

      if (user) {
        toast({
          title: "Welcome back!",
          description: "Signed in successfully"
        })

        // Navigate to role selection
        router.push('/role-selection')
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col px-6 pt-16 pb-8 relative overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 -z-10"
        style={{
          background: 'linear-gradient(180deg, #EEEEFF 0%, #7F7CAF 25%, #9FB4C7 50%, #3A85BD 75%, #9FB798 100%)'
        }}
      />
      
      {/* Welcome Text */}
      <div className="mb-8">
        <h1 className="text-white font-serif text-4xl font-bold mb-2">Hello</h1>
        <h2 className="text-white font-serif text-4xl font-bold">sign in!</h2>
      </div>

      {/* Sign In Form */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-xl">
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#7F7CAF] font-sans font-bold text-sm">
                Gmail
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="example@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-[#7F7CAF] focus-visible:ring-0 placeholder:text-gray-400 text-sm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#7F7CAF] font-sans font-bold text-sm">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-0 border-b-2 border-gray-200 rounded-none px-0 focus:border-[#7F7CAF] focus-visible:ring-0 placeholder:text-gray-400 text-sm"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="text-[#7F7CAF] text-sm font-sans hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-[#7F7CAF] hover:bg-[#7F7CAF]/90 text-white font-sans font-bold text-lg rounded-full mt-8 disabled:opacity-50"
            >
              {loading ? 'SIGNING IN...' : 'SIGN IN'}
            </Button>

            <div className="text-center pt-4">
              <span className="text-gray-500 text-sm font-sans">Don't have account? </span>
              <button
                type="button"
                onClick={() => router.push('/sign-up')}
                className="text-[#7F7CAF] text-sm font-sans font-bold hover:underline"
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
