'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Shield, Lock, Mail, ArrowRight } from 'lucide-react'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed')
      }

      toast.success('Admin authorized. Welcome to Cosmoherb Operations.')
      router.push('/admin')
      router.refresh()
    } catch (err: any) {
      toast.error(err.message || 'Invalid admin credentials.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold-400/80 shadow-lg mx-auto bg-brand-900 ring-4 ring-brand-100/30">
            <Image src="/logo.jpg" alt="Areum Logo" fill className="object-cover" />
          </div>
          <h1 className="text-2xl font-bold text-charcoal-900 tracking-wider pt-1" style={{ fontFamily: 'var(--font-display)' }}>
            AREUM
          </h1>
          <p className="text-[11px] text-brand-700 font-semibold uppercase tracking-wider">
            Where Nature Creates Beauty
          </p>
          <p className="text-xs text-charcoal-400">Operations Control Center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Admin Email</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@areumcosmoherb.com"
                className="input-field text-sm pl-10"
              />
              <Mail className="w-4 h-4 text-charcoal-400 absolute left-3 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal-600 block mb-1">Security Password</label>
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
            className="btn-primary w-full py-3.5 text-sm font-bold shadow-md disabled:opacity-50"
          >
            {isLoading ? 'Verifying...' : 'Access Dashboard'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Admin Credentials Note */}
        <div className="p-4 bg-cream-50 rounded-2xl border border-charcoal-100 text-xs text-charcoal-600 space-y-1">
          <p className="font-bold text-brand-800">Demo Admin Access:</p>
          <p>Email: <code className="font-mono text-charcoal-800 font-semibold">admin@areumcosmoherb.com</code></p>
          <p>Password: <code className="font-mono text-charcoal-800 font-semibold">Admin@123</code></p>
        </div>

        <div className="text-center">
          <button
            type="button"
            onClick={() => {
              setEmail('admin@areumcosmoherb.com')
              setPassword('Admin@123')
            }}
            className="text-xs font-semibold text-brand-700 hover:underline"
          >
            Auto-fill demo admin credentials
          </button>
        </div>
      </div>
    </div>
  )
}
