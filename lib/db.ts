import { PrismaClient } from '@prisma/client'
import path from 'path'
import fs from 'fs'

// Robustly resolve DATABASE_URL for local dev and cloud serverless hosting
function getDatabaseUrl(): string {
  const envUrl = process.env.DATABASE_URL
  if (envUrl && !envUrl.startsWith('file:')) {
    return envUrl
  }

  // Look for dev.db in standard project locations
  const candidates = [
    path.join(process.cwd(), 'prisma', 'dev.db'),
    path.join(process.cwd(), 'dev.db'),
    path.join(__dirname, '..', 'prisma', 'dev.db'),
    path.join(__dirname, 'prisma', 'dev.db'),
  ]

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      return `file:${path.resolve(candidate)}`
    }
  }

  return envUrl || 'file:./dev.db'
}

process.env.DATABASE_URL = getDatabaseUrl()

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
