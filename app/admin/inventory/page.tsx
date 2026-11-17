import prisma from '@/lib/db'
import InventoryClient from './InventoryClient'

export const metadata = {
  title: 'Inventory Management | Areum Cosmoherb Admin',
}

export const dynamic = 'force-dynamic'

export default async function AdminInventoryPage() {
  let products: any[] = []
  try {
    products = await prisma.product.findMany({
      where: { status: 'active' },
      include: {
        category: { select: { name: true } },
        inventoryTxns: {
          take: 5,
          orderBy: { createdAt: 'desc' },
        },
      },
      orderBy: { stock: 'asc' }, // show lowest stock first!
    })
  } catch (err) {
    console.error('[AdminInventoryPage Error]', err)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-charcoal-900" style={{ fontFamily: 'var(--font-display)' }}>
          Inventory & Stock Management
        </h1>
        <p className="text-xs text-charcoal-500">Monitor warehouse reserves, adjust stock counts, and view audit trail</p>
      </div>

      <InventoryClient products={products as any} />
    </div>
  )
}
