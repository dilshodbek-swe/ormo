import type { Metadata } from 'next'
import { Suspense } from 'react'

import { catalogCategories, catalogProducts } from '@/lib/data/catalog'
import CatalogBrowser from './_components/catalog-browser'
import CatalogSpotlight from './_components/catalog-spotlight'

export const metadata: Metadata = {
	title: 'Katalog — Ormo',
	description: 'Kameralar, stabilizatorlar, dronlar va aksessuarlar katalogi.',
}

const CatalogPage = () => {
	return (
		<>
			{/* Sarlavha */}
			<section className='border-b'>
				<div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 md:py-20 lg:flex-row lg:items-end lg:justify-between'>
					<div className='max-w-2xl space-y-5'>
						<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							Katalog
						</p>
						<h1 className='font-space-grotesk text-4xl leading-[1.05] font-bold tracking-tighter text-balance sm:text-6xl'>
							Keyingi kadringiz{' '}
							<span className='text-muted-foreground'>shu yerda boshlanadi.</span>
						</h1>
					</div>

					<dl className='grid grid-cols-3 divide-x rounded-xl border'>
						{[
							{ label: 'Mahsulot', value: catalogProducts.length },
							{ label: 'Kategoriya', value: catalogCategories.length - 1 },
							{ label: 'Kafolat', value: '100%' },
						].map(({ label, value }) => (
							<div key={label} className='px-5 py-3'>
								<dt className='text-xs text-muted-foreground'>{label}</dt>
								<dd className='font-mono text-2xl font-semibold tabular-nums'>
									{value}
								</dd>
							</div>
						))}
					</dl>
				</div>
			</section>

			<div className='mx-auto max-w-7xl space-y-16 px-4 py-12 sm:px-6 md:py-16'>
				<CatalogSpotlight />

				{/* useSearchParams uchun Suspense chegarasi */}
				<Suspense
					fallback={
						<div className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border md:grid-cols-3 lg:grid-cols-4'>
							{Array.from({ length: 8 }, (_, index) => (
								<div key={index} className='aspect-3/4 animate-pulse bg-muted/50' />
							))}
						</div>
					}
				>
					<CatalogBrowser />
				</Suspense>
			</div>
		</>
	)
}

export default CatalogPage
