'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Lock, Mail, ArrowRight, Leaf } from 'lucide-react'
import { toast } from 'sonner'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/account'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      })

      if (res?.error) {
        toast.error('Invalid email or password.')
      } else {
        toast.success('Welcome back to Areum Cosmoherb!')
        router.push(callbackUrl)
        router.refresh()
      }
    } catch {
      toast.error('Sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-charcoal-100 shadow-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-brand-700 rounded-full flex items-center justify-center mx-auto text-white">
          <Leaf className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Welcome Back
        </h1>
        <p className="text-xs text-charcoal-500">Sign in to your Areum Cosmoherb personal care account</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-semibold text-charcoal-600 block mb-1">Email Address</label>
          <div className="relative">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aditi@example.com"
              className="input-field text-sm pl-10"
            />
            <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-xs font-semibold text-charcoal-600">Password</label>
            <a href="#" className="text-[11px] text-brand-700 hover:underline">Forgot password?</a>
          </div>
          <div className="relative">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="input-field text-sm pl-10"
            />
            <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-3.5" />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3.5 text-sm font-bold shadow-sm disabled:opacity-50"
        >
          {isLoading ? 'Signing In...' : 'Sign In'} <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Demo credentials hint */}
      <div className="p-3 bg-brand-50 rounded-xl text-xs text-brand-800 space-y-1">
        <p className="font-bold">Test Customer Credentials:</p>
        <p>Email: <code className="font-mono">aditi@example.com</code></p>
        <p>Password: <code className="font-mono">Customer@123</code></p>
      </div>

      <div className="text-center pt-2 text-xs text-charcoal-500">
        Don&apos;t have an account yet?{' '}
        <Link href="/register" className="font-bold text-brand-700 hover:underline">
          Create Account
        </Link>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-[80vh] bg-cream-50 flex items-center justify-center py-12 px-4">
      <Suspense fallback={<div className="p-8 text-center text-sm text-charcoal-400">Loading account portal...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
