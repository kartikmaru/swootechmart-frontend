import CategorySidebar from '@/components/user/Home/Category'
import { FeaturedBrands } from '@/components/user/Home/FeatureBrand'
import HeroNews from '@/components/user/Home/HeroNews'
import { TopCategories } from '@/components/user/Home/TopCategories'
import React from 'react'

export default function page() {
  return (
    <div className='w-full mx-auto px-8'>
      <div className='flex gap-7 mt-6'>
        <CategorySidebar />
        <HeroNews />
      </div>
      <div className='flex gap-7 mt-7'>
        <FeaturedBrands />
        <TopCategories />
      </div>
    </div>
  )
}
