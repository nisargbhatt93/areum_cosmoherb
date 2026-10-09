import type { Metadata } from 'next'
import HeroSection from '@/components/store/home/HeroSection'
import TrustStrip from '@/components/store/home/TrustStrip'
import BestSellers from '@/components/store/home/BestSellers'
import ShopByCategory from '@/components/store/home/ShopByCategory'
import ProblemSolution from '@/components/store/home/ProblemSolution'
import IngredientStory from '@/components/store/home/IngredientStory'
import SocialProof from '@/components/store/home/SocialProof'
import FreeShippingBanner from '@/components/store/home/FreeShippingBanner'

export const metadata: Metadata = {
  title: 'Areum Cosmoherb — Natural Herbal Personal Care',
  description:
    'Thoughtfully crafted personal care inspired by herbal traditions. Herbal shampoos, soaps, conditioners, hair care and skin care products formulated without harsh chemicals.',
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <TrustStrip />
      <BestSellers />
      <ShopByCategory />
      <FreeShippingBanner />
      <ProblemSolution />
      <IngredientStory />
      <SocialProof />
    </>
  )
}
