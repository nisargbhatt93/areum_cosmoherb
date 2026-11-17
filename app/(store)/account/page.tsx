import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import prisma from '@/lib/db'
import AccountDashboardClient from '@/components/store/account/AccountDashboardClient'

export const metadata = {
  title: 'My Account | Areum Cosmoherb',
  description: 'Manage your Areum Cosmoherb profile, view past orders, track shipments, and review saved addresses.',
}

export default async function AccountPage() {
  const session = await auth()

  // If not logged in, fetch demo customer or redirect
  let userId = session?.user?.id

  if (!userId) {
    const demoUser = await prisma.user.findFirst({
      where: { email: 'aditi@example.com' },
    })
    if (demoUser) {
      userId = demoUser.id
    } else {
      redirect('/login?callbackUrl=/account')
    }
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      orders: {
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: { where: { isPrimary: true }, take: 1 },
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      },
      addresses: {
        orderBy: { isDefault: 'desc' },
      },
    },
  })

  if (!user) {
    redirect('/login')
  }

  return (
    <AccountDashboardClient
      user={{
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      }}
      orders={user.orders as any}
      addresses={user.addresses as any}
    />
  )
}
