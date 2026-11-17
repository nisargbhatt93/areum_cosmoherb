import { NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET() {
  const settings = await prisma.storeSettings.findMany()
  const map: Record<string, string> = {}
  settings.forEach((s) => {
    map[s.key] = s.value
  })
  return NextResponse.json({ settings: map })
}

export async function POST(request: Request) {
  try {
    const settings = await request.json()

    for (const [key, value] of Object.entries(settings)) {
      await prisma.storeSettings.upsert({
        where: { key },
        create: { key, value: String(value) },
        update: { value: String(value) },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 })
  }
}
