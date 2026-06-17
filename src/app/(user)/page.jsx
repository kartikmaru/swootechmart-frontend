import React from 'react'

// Existing components
import CategorySidebar from '@/components/user/Home/Category'
import HeroNews from '@/components/user/Home/HeroNews'
import { FeaturedBrands } from '@/components/user/Home/FeatureBrand'
import { TopCategories } from '@/components/user/Home/TopCategories'

// New section components
import DealsOfDay from '@/components/user/Home/DealsOfDay'
import PreOrderBanner from '@/components/user/Home/PreOrderBanner'
import BestSeller from '@/components/user/Home/BestSeller'
import CategorySection from '@/components/user/Home/CategorySection'
import MiniCategorySections from '@/components/user/Home/MiniCategorySections'
import PromoBanners from '@/components/user/Home/PromoBanners'
import RecentlyViewed from '@/components/user/Home/RecentlyViewed'
import AboutSection from '@/components/user/Home/AboutSection'

export default function HomePage() {
  return (
    <div className="space-y-6">

        {/* ── Section 1: Hero ──────────────────────────────── */}
        <div className="flex gap-5">
          <div className="hidden lg:block">
            <CategorySidebar />
          </div>
          <div className="flex-1 min-w-0 space-y-4">
            <HeroNews />
            <div className="flex flex-col sm:flex-row gap-4">
              <FeaturedBrands />
              <TopCategories />
            </div>
          </div>
        </div>

        {/* ── Section 2: Deals of the Day ────────────────────── */}
        <DealsOfDay />

        {/* ── Section 3: Pre Order Banner ─────────────────────── */}
        <PreOrderBanner />

        {/* ── Section 4: Best Seller / New In / Popular ───────── */}
        <BestSeller />

        {/* ── Section 5: Top Cellphones & Tablets ─────────────── */}
        <CategorySection
          title="Top Cellphones & Tablets"
          categorySlug="smartphones"
          heroBg="bg-gradient-to-br from-blue-600 to-blue-400"
          heroTitle="REDMI NOTE 12 PRO+ 5G"
          heroSub="Rise to the challenge"
          heroImg="https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=200&h=160&fit=crop"
        />

        {/* ── Section 6: Best Laptops & Computers ─────────────── */}
        <CategorySection
          title="Best Laptops & Computers"
          categorySlug="laptops"
          heroBg="bg-gradient-to-br from-gray-900 to-gray-700"
          heroTitle="MacBook Pro M3"
          heroSub="Supercharged by M3 chip"
          heroImg="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200&h=160&fit=crop"
        />

        {/* ── Section 7: Audios / Gaming / Office (3 col) ─────── */}
        <MiniCategorySections />

        {/* ── Section 8: Promo Banners ─────────────────────────── */}
        <PromoBanners />

        {/* ── Section 9: Recently Viewed ───────────────────────── */}
        <RecentlyViewed />

        {/* ── Section 10: About / SEO Text ────────────────────── */}
        <AboutSection />

      </div>
  )
}
