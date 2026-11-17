import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/db'
import { ArrowLeft } from 'lucide-react'
import EditProductForm from './EditProductForm'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
      category: true,
    },
  })

  if (!product) {
    notFound()
  }

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
  })

  return (
    <div className="space-y-6 max-w-4xl">
      <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 hover:text-brand-800">
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Products List
      </Link>

      <div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Edit Formulation: {product.name}
        </h1>
        <p className="text-xs text-charcoal-500 font-mono">SKU: {product.sku}</p>
      </div>

      <EditProductForm product={product as any} categories={categories} />
    </div>
  )
}
