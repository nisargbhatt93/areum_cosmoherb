import { NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { slugify } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const { name, description } = await request.json()

    if (!name?.trim()) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 })
    }

    const slug = slugify(name)
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'A category with this name already exists' }, { status: 400 })
    }

    const category = await prisma.category.create({
      data: {
        name: name.trim(),
        slug,
        description: description || null,
        sortOrder: 10,
        isActive: true,
      },
    })

    return NextResponse.json({ success: true, category })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
  }
}
