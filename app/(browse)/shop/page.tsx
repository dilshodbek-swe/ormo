import type { Metadata } from 'next'
import { Suspense } from 'react'

import ShopBrowser from './_components/shop-browser'
import ShopHero from './_components/shop-hero'
import ShopSkeleton from './_components/shop-skeleton'

export const metadata: Metadata = {
	title: "Do'kon — Ormo",
	description: "Narx, kategoriya va nom bo'yicha filtrlanadigan mahsulotlar do'koni.",
}

const ShopPage = () => {
	return (
		<>
			<ShopHero />

			<div className='mx-auto max-w-7xl px-4 py-10 sm:px-6 md:py-12'>
				{/* useSearchParams uchun Suspense chegarasi */}
				<Suspense fallback={<ShopSkeleton />}>
					<ShopBrowser />
				</Suspense>
			</div>
		</>
	)
}

export default ShopPage
