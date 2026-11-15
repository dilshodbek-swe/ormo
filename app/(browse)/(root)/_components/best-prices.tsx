import { ArrowRight, Timer } from 'lucide-react'
import Link from 'next/link'

import ProductCard from '@/components/shared/product-card'
import { products } from '@/lib/data/products'
import { getDiscount } from '@/lib/utils'
import Countdown from './countdown'

const BestPrices = () => {
	// Eng katta chegirmali mahsulot alohida belgilanadi
	const topDealId = products.reduce((best, product) =>
		getDiscount(product.oldPrice, product.price) >
		getDiscount(best.oldPrice, best.price)
			? product
			: best
	).id

	return (
		<section className='border-b'>
			<div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24'>
				<div className='mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between'>
					<div className='max-w-xl space-y-3'>
						<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							Eng yaxshi narxlar
						</p>
						<h2 className='font-space-grotesk text-3xl font-bold tracking-tight text-balance sm:text-4xl'>
							Bugungi eng foydali takliflar
						</h2>
					</div>

					<div className='flex flex-wrap items-center gap-4'>
						<div className='flex items-center gap-3 rounded-xl border bg-muted/40 py-2 pr-2 pl-3'>
							<span className='flex items-center gap-1.5 text-xs text-muted-foreground'>
								<Timer className='size-3.5' />
								Taklif tugashiga
							</span>
							<Countdown />
						</div>

						<Link
							href='/deals'
							className='group flex items-center gap-1 text-sm font-medium'
						>
							Barchasi
							<ArrowRight className='size-4 transition-transform group-hover:translate-x-0.5' />
						</Link>
					</div>
				</div>

				<div className='grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4'>
					{products.map(product => (
						<ProductCard
							key={product.id}
							product={product}
							highlight={product.id === topDealId}
						/>
					))}
				</div>
			</div>
		</section>
	)
}

export default BestPrices
