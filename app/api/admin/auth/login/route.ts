import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email: email.trim().toLowerCase() },
    })

    if (!admin || !admin.isActive) {
      return NextResponse.json({ error: 'Invalid admin credentials or account disabled' }, { status: 401 })
    }

    const isMatch = await bcrypt.compare(password, admin.password)
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 })
    }

    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
    })

    // Set secure admin session cookie
    response.cookies.set('admin-session', admin.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return response
  } catch (error) {
    console.error('[Admin Login API]', error)
    return NextResponse.json({ error: 'Server authentication error' }, { status: 500 })
  }
}
