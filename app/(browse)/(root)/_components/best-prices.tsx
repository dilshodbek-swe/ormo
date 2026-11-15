import { ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import ProductCard from '@/components/shared/product-card'
import { products } from '@/lib/data/products'
import Countdown from './countdown'
import FeaturedDeal from './featured-deal'

// "Kun taklifi" kartochkasida ko'rsatiladigan mahsulot
const FEATURED_ID = 'dji-mavic-pro'

const BestPrices = () => {
	const featured =
		products.find(product => product.id === FEATURED_ID) ?? products[0]
	const others = products.filter(product => product !== featured).slice(0, 7)

	return (
		<section className='border-b'>
			<div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24'>
				<div className='mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between'>
					<div className='max-w-xl space-y-3'>
						<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
							Eng yaxshi narxlar
						</p>
						<h2 className='font-space-grotesk text-3xl font-bold tracking-tight text-balance sm:text-4xl'>
							Bugungi eng foydali takliflar
						</h2>
					</div>

					{/* Taymer butun bo'limga tegishli, shuning uchun sarlavha yonida */}
					<div className='w-full lg:w-auto lg:min-w-md'>
						<Countdown />
					</div>
				</div>

				{/* gap-px + bg-border: kartochkalar orasida 1px chiziqlar */}
				<div className='grid grid-cols-2 gap-px overflow-hidden rounded-xl border bg-border lg:grid-cols-4'>
					<FeaturedDeal
						product={featured}
						className='col-span-2 lg:row-span-2'
					/>

					{others.map(product => (
						<ProductCard key={product.id} product={product} />
					))}

					<Link
						href='/deals'
						className='group flex flex-col justify-between gap-8 bg-foreground p-6 text-background'
					>
						<p className='font-mono text-xs tracking-widest uppercase opacity-60'>
							+{products.length} taklif
						</p>
						<div className='flex items-end justify-between gap-4'>
							<p className='font-space-grotesk text-2xl leading-tight font-bold tracking-tight'>
								Barcha
								<br />
								takliflar
							</p>
							<span className='flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform duration-300 group-hover:rotate-45'>
								<ArrowUpRight className='size-5' />
							</span>
						</div>
					</Link>
				</div>
			</div>
		</section>
	)
}

export default BestPrices
