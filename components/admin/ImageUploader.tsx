'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Upload, X, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  label?: string
}

export default function ImageUploader({ value, onChange, label = 'Product Image' }: ImageUploaderProps) {
  const [isCompressing, setIsCompressing] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Compress image to reasonable resolution and format using browser canvas
  const processImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file (JPG, PNG, WebP).')
      return
    }

    // If file is very large (>10MB), alert user
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image is too large. Please select an image under 10MB.')
      return
    }

    setIsCompressing(true)
    try {
      const compressedUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (e) => {
          const img = new window.Image()
          img.src = e.target?.result as string
          img.onload = () => {
            const canvas = document.createElement('canvas')
            const maxDimension = 1200
            let width = img.width
            let height = img.height

            if (width > height) {
              if (width > maxDimension) {
                height = Math.round((height * maxDimension) / width)
                width = maxDimension
              }
            } else {
              if (height > maxDimension) {
                width = Math.round((width * maxDimension) / height)
                height = maxDimension
              }
            }

            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')
            if (!ctx) {
              resolve(e.target?.result as string)
              return
            }

            ctx.drawImage(img, 0, 0, width, height)
            // Export as WebP or JPEG at 85% quality
            const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
            resolve(dataUrl)
          }
          img.onerror = () => resolve(e.target?.result as string)
        }
        reader.onerror = (err) => reject(err)
      })

      onChange(compressedUrl)
      toast.success('Image loaded and optimized successfully!')
    } catch (err) {
      console.error('[Image Upload Error]', err)
      toast.error('Failed to process image file.')
    } finally {
      setIsCompressing(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      processImageFile(file)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-charcoal-700 block">{label}</label>
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setInputMode('upload')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              inputMode === 'upload'
                ? 'bg-brand-100 text-brand-900 font-bold'
                : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Direct Upload
          </button>
          <button
            type="button"
            onClick={() => setInputMode('url')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
              inputMode === 'url'
                ? 'bg-brand-100 text-brand-900 font-bold'
                : 'text-charcoal-500 hover:text-charcoal-800'
            }`}
          >
            Image URL
          </button>
        </div>
      </div>

      {inputMode === 'upload' ? (
        <div>
          {value ? (
            <div className="relative border border-charcoal-200 rounded-2xl p-4 bg-cream-50/50 flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-28 h-28 rounded-xl overflow-hidden bg-white border border-charcoal-100 shadow-xs flex-shrink-0">
                <Image
                  src={value}
                  alt="Product preview"
                  fill
                  unoptimized={value.startsWith('data:')}
                  className="object-cover"
                />
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <p className="text-xs font-semibold text-charcoal-800">Image uploaded and ready</p>
                <p className="text-[11px] text-charcoal-500">
                  This image will be displayed on the storefront and product catalog.
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn-outline text-xs py-1.5 px-3"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange('')}
                    className="text-xs text-red-600 hover:text-red-700 py-1.5 px-2 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onDragOver={(e) => {
                e.preventDefault()
                setIsDragging(true)
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-brand-600 bg-brand-50/50 ring-4 ring-brand-100'
                  : 'border-charcoal-200 hover:border-brand-500 hover:bg-cream-50/60'
              }`}
            >
              {isCompressing ? (
                <div className="flex flex-col items-center justify-center py-4 space-y-2 text-brand-700">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-xs font-semibold">Optimizing and preparing image...</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="w-12 h-12 rounded-full bg-brand-50 text-brand-700 flex items-center justify-center mx-auto shadow-2xs">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-brand-800 hover:underline">
                      Click to choose an image from device
                    </span>
                    <span className="text-xs text-charcoal-500"> or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-charcoal-400">
                    PNG, JPG, WebP supported. Auto-optimized for instant storefront loading.
                  </p>
                </div>
              )}
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/jpg, image/webp"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/photo-..."
              className="input-field text-sm flex-1"
            />
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="btn-outline text-xs px-3"
              >
                Clear
              </button>
            )}
          </div>
          {value && (
            <div className="flex items-center gap-3 p-2 bg-cream-50 rounded-xl border border-charcoal-100">
              <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white flex-shrink-0">
                <Image
                  src={value}
                  alt="URL Preview"
                  fill
                  unoptimized={value.startsWith('data:')}
                  className="object-cover"
                />
              </div>
              <p className="text-xs text-charcoal-600 truncate flex-1 font-mono text-[11px]">
                {value}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
