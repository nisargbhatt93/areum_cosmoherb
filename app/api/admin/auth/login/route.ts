import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const cleanEmail = email.trim().toLowerCase()
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'admin@areumcosmoherb.com').trim().toLowerCase()
    const envAdminPassword = process.env.ADMIN_PASSWORD || 'Admin@123'

    let admin = null
    try {
      admin = await prisma.adminUser.findUnique({
        where: { email: cleanEmail },
      })
    } catch (dbErr) {
      console.error('[Admin Login Database Lookup Error]', dbErr)
    }

    let isAuthorized = false
    let adminData = {
      id: 'admin_default_session',
      name: 'Super Admin',
      email: envAdminEmail,
      role: 'super_admin',
    }

    if (admin && admin.isActive) {
      try {
        const isMatch = await bcrypt.compare(password, admin.password)
        if (isMatch) {
          isAuthorized = true
          adminData = {
            id: admin.id,
            name: admin.name || 'Super Admin',
            email: admin.email,
            role: admin.role,
          }
        }
      } catch (bcryptErr) {
        console.error('[Admin Login Bcrypt Error]', bcryptErr)
      }
    }

    // Fallback: If DB admin wasn't matched (or DB lookup failed), verify against configured admin credentials
    if (!isAuthorized && cleanEmail === envAdminEmail) {
      if (password === envAdminPassword) {
        isAuthorized = true
      }
    }

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Invalid admin credentials or account disabled' }, { status: 401 })
    }

    const response = NextResponse.json({
      success: true,
      admin: adminData,
    })

    // Set secure admin session cookie
    response.cookies.set('admin-session', adminData.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[Admin Login API Error]', error)
    return NextResponse.json({ error: 'Server authentication error' }, { status: 500 })
  }
}
