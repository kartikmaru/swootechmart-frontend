import CategoryFilterSection from './CategoryFilterSection'
import PriceFilterSection from './PriceFilterSection'
import ColorFilterSection from './ColorFilterSection'
import BrandFilter from './BrandFilter'
import { getBrands, getCategories, getColors } from '@/API/helpAPI'

export default async function StoreSideSection() {

    const [catRes, colorRes, brandRes] = await Promise.all([
        getCategories({ status: true }),
        getColors({ status: true }),
        getBrands({ status: true })
    ])

    return (
        <aside className='space-y-2 w-[280px]'>
            <CategoryFilterSection catRes={catRes} />
            <PriceFilterSection />
            <ColorFilterSection colorRes={colorRes} />
            <BrandFilter brandRes={brandRes} />
        </aside>
    )
}
