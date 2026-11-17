'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Lock, Mail, User, Phone, ArrowRight, Leaf } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      toast.success('Account created! Signing you in...')

      // Automatic login after sign up
      await signIn('credentials', {
        redirect: false,
        email: formData.email,
        password: formData.password,
      })

      router.push('/account')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Registration failed.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[85vh] bg-cream-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-charcoal-100 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-700 rounded-full flex items-center justify-center mx-auto text-white">
            <Leaf className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
            Create Account
          </h1>
          <p className="text-xs text-charcoal-500">Join Areum Cosmoherb for pure herbal care & loyalty rewards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Full Name *</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aditi Sharma"
                className="input-field text-sm pl-10"
              />
              <User className="w-4 h-4 text-charcoal-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Email Address *</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="name@example.com"
                className="input-field text-sm pl-10"
              />
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Mobile Number (optional)</label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="input-field text-sm pl-10"
              />
              <Phone className="w-4 h-4 text-charcoal-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Password *</label>
            <div className="relative">
              <input
                type="password"
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                className="input-field text-sm pl-10"
              />
              <Lock className="w-4 h-4 text-charcoal-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Confirm Password *</label>
            <div className="relative">
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
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
            {isLoading ? 'Creating Account...' : 'Create Account'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-charcoal-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-brand-700 hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}
