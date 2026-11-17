import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'

import { Button } from '@/components/ui/button'
import { cn, formatPrice } from '@/lib/utils'
import { pad, type SpotlightPick } from './picks'

type Props = {
	pick: SpotlightPick
	index: number
	isActive: boolean
}

const SpotlightSlide = ({ pick: { tagline, specs, product }, index, isActive }: Props) => {
	return (
		<article
			className={cn(
				'grid overflow-hidden rounded-2xl border transition-all duration-500 md:grid-cols-2',
				isActive ? 'opacity-100' : 'opacity-40 md:scale-[0.97]'
			)}
		>
			{/* Matn tomoni */}
			<div className='relative flex flex-col justify-between gap-10 bg-foreground p-6 text-background sm:p-10'>
				<span
					aria-hidden
					className='pointer-events-none absolute -right-4 -bottom-10 font-space-grotesk text-[10rem] leading-none font-bold text-background/5 select-none'
				>
					{pad(index + 1)}
				</span>

				<div className='space-y-4'>
					<p className='font-mono text-xs tracking-widest uppercase opacity-60'>
						{product.brand}
					</p>
					<h3 className='font-space-grotesk text-3xl leading-tight font-bold tracking-tight text-balance sm:text-4xl'>
						{tagline}
					</h3>
					<p className='text-background/70'>{product.name}</p>
				</div>

				<div className='relative space-y-6'>
					<ul className='flex flex-wrap gap-2'>
						{specs.map(spec => (
							<li
								key={spec}
								className='rounded-full border border-background/20 px-3 py-1 font-mono text-xs'
							>
								{spec}
							</li>
						))}
					</ul>
					<div className='flex flex-wrap items-center justify-between gap-4'>
						<p className='font-mono text-xl font-semibold tracking-tight'>
							{formatPrice(product.price)}
						</p>
						<Button
							size='lg'
							className='h-10 bg-background px-5 text-foreground hover:bg-background/90'
						>
							<ShoppingBag />
							Savatga
						</Button>
					</div>
				</div>
			</div>

			{/* Rasm tomoni */}
			<div className='relative flex min-h-64 items-center justify-center bg-white p-8 sm:min-h-96'>
				<Image
					src={product.image}
					alt={`${product.brand} ${product.name}`}
					width={1200}
					height={1200}
					sizes='(min-width: 768px) 45vw, 100vw'
					className={cn(
						'h-full max-h-80 w-auto max-w-full mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain transition-transform duration-700',
						isActive && 'scale-105'
					)}
				/>
			</div>
		</article>
	)
}

export default SpotlightSlide
