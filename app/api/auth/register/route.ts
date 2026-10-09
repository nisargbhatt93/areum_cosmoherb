import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import prisma from '@/lib/db'
import { registerSchema } from '@/lib/validators'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const data = registerSchema.parse(body)

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(data.password, 12)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone || null,
        password: hashedPassword,
        role: 'customer',
      },
    })

    return NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email },
    })
  } catch (error) {
    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({ error: 'Invalid data provided.' }, { status: 400 })
    }
    console.error('[Register API]', error)
    return NextResponse.json({ error: 'Registration failed. Please try again.' }, { status: 500 })
  }
}
