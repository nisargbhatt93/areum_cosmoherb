import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const addressSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid pincode'),
  country: z.string().default('India'),
  isDefault: z.boolean().default(false),
})

export const checkoutSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number'),
  line1: z.string().min(5, 'Address is required'),
  line2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, 'Invalid pincode'),
  paymentMethod: z.enum(['razorpay', 'cod']),
  couponCode: z.string().optional(),
  saveAddress: z.boolean().default(false),
})

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  slug: z.string().optional(),
  sku: z.string().optional(),
  description: z.string().min(10, 'Description is required'),
  shortDescription: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  mrp: z.number().positive('MRP must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
  stock: z.number().int().min(0),
  lowStockThreshold: z.number().int().min(0).default(10),
  weight: z.number().optional(),
  shelfLife: z.string().optional(),
  suitableFor: z.string().optional(),
  howToUse: z.string().optional(),
  precautions: z.string().optional(),
  benefits: z.string().optional(),
  taxRate: z.number().min(0).max(100).default(0),
  seoTitle: z.string().optional(),
  seoDesc: z.string().optional(),
  seoKeywords: z.string().optional(),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  badge: z.string().optional(),
  status: z.enum(['active', 'inactive', 'archived']).default('active'),
})

export const reviewSchema = z.object({
  productId: z.string(),
  rating: z.number().int().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10, 'Review must be at least 10 characters'),
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional(),
})

export const couponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase(),
  description: z.string().optional(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive('Value must be positive'),
  maxDiscount: z.number().optional(),
  minOrderAmount: z.number().min(0).default(0),
  startDate: z.string(),
  expiryDate: z.string(),
  usageLimit: z.number().int().optional(),
  perCustomerLimit: z.number().int().default(1),
  isFirstOrderOnly: z.boolean().default(false),
  isNewCustomerOnly: z.boolean().default(false),
  isCodAllowed: z.boolean().default(true),
  isActive: z.boolean().default(true),
})

export const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid phone number').optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type AddressFormData = z.infer<typeof addressSchema>
export type CheckoutFormData = z.infer<typeof checkoutSchema>
export type ProductFormData = z.infer<typeof productSchema>
export type ReviewFormData = z.infer<typeof reviewSchema>
export type CouponFormData = z.infer<typeof couponSchema>
export type ContactFormData = z.infer<typeof contactSchema>
