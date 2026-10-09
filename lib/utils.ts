import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function generateOrderNumber(): string {
  const prefix = 'AC'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function calculateDiscount(mrp: number, price: number): number {
  if (mrp <= 0 || price >= mrp) return 0
  return Math.round(((mrp - price) / mrp) * 100)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

export function generateSKU(name: string): string {
  const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X')
  const suffix = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `${prefix}-${suffix}`
}

export function getEstimatedDelivery(days: number = 5): Date {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date
}

export function isValidPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode)
}

export function isValidPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone)
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function getDeviceType(userAgent: string): string {
  if (/mobile/i.test(userAgent)) return 'mobile'
  if (/tablet/i.test(userAgent)) return 'tablet'
  return 'desktop'
}

export function safeJsonParse<T>(str: string, fallback: T): T {
  try {
    return JSON.parse(str) as T
  } catch {
    return fallback
  }
}
