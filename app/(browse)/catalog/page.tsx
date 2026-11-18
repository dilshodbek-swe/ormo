import type { Metadata } from 'next'
import { Suspense } from 'react'

import ProductGridSkeleton from '@/components/shared/product-grid-skeleton'
import CatalogBrowser from './_components/browser/catalog-browser'
import CatalogHero from './_components/catalog-hero'
import Spotlight from './_components/spotlight/spotlight'

export const metadata: Metadata = {
	title: 'Katalog — Ormo',
	description: 'Kameralar, stabilizatorlar, dronlar va aksessuarlar katalogi.',
}

const CatalogPage = () => {
	return (
		<>
			<CatalogHero />

			<div className='mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 md:py-16'>
				<Spotlight />

				{/* useSearchParams uchun Suspense chegarasi */}
				<Suspense fallback={<ProductGridSkeleton gridClassName='md:grid-cols-3 lg:grid-cols-4' />}>
					<CatalogBrowser />
				</Suspense>
			</div>
		</>
	)
}

export default CatalogPage
