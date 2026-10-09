import prisma from '@/lib/db'
import { Leaf } from 'lucide-react'

const FALLBACK_INGREDIENTS = [
  {
    name: 'Aloe Vera',
    description:
      'Known for its soothing and moisturising properties. Used in our skincare and hair care products.',
    emoji: '🌿',
  },
  {
    name: 'Neem',
    description: 'A traditional herbal ingredient valued for its skin-cleansing properties.',
    emoji: '🍃',
  },
  {
    name: 'Amla',
    description: 'Rich in Vitamin C, amla is used in traditional hair care formulations.',
    emoji: '🫐',
  },
  {
    name: 'Shikakai',
    description: 'A natural cleansing herb traditionally used for hair care in India.',
    emoji: '🌱',
  },
  {
    name: 'Bhringraj',
    description: 'A traditional Ayurvedic herb used in herbal hair care formulations.',
    emoji: '🌾',
  },
  {
    name: 'Tulsi',
    description:
      'Holy Basil — a revered herbal ingredient used in skin and hair care products.',
    emoji: '🌿',
  },
]

export default async function IngredientStory() {
  const ingredients = await prisma.ingredient
    .findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    })
    .catch(() => [])

  const displayIngredients =
    ingredients.length > 0
      ? ingredients.map((ing, i) => ({
          name: ing.name,
          description:
            ing.description || FALLBACK_INGREDIENTS[i % FALLBACK_INGREDIENTS.length].description,
          emoji: FALLBACK_INGREDIENTS[i % FALLBACK_INGREDIENTS.length].emoji,
        }))
      : FALLBACK_INGREDIENTS

  return (
    <section className="section bg-brand-900 text-white">
      <div className="container-custom">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-brand-300 text-sm font-semibold tracking-wider uppercase mb-3">
            <Leaf className="w-4 h-4" /> Ingredient Transparency
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
            The Herbal Ingredients We Use
          </h2>
          <p className="text-brand-200 max-w-xl mx-auto">
            We believe in complete transparency. Here are some of the key herbal ingredients found
            in Areum Cosmoherb products.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {displayIngredients.map((ingredient) => (
            <div
              key={ingredient.name}
              className="p-6 bg-brand-800/50 border border-brand-700/30 rounded-2xl hover:bg-brand-800 transition-colors"
            >
              <span className="text-3xl mb-3 block">{ingredient.emoji}</span>
              <h3 className="text-white font-semibold text-lg mb-2">{ingredient.name}</h3>
              <p className="text-brand-300 text-sm leading-relaxed">{ingredient.description}</p>
            </div>
          ))}
        </div>

        <p className="text-center text-brand-400 text-sm mt-8">
          * Ingredient effectiveness varies by individual. These ingredients are used in our herbal
          formulations.
        </p>
      </div>
    </section>
  )
}
