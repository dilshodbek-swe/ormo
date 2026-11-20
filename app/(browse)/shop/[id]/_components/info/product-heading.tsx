import { Star } from 'lucide-react'

import type { ProductWithDetails } from '@/lib/data/product-details'

const ProductHeading = ({ product }: { product: ProductWithDetails }) => {
	return (
		<div className='space-y-4'>
			<div className='flex flex-wrap items-center gap-2 font-mono text-xs text-muted-foreground uppercase'>
				<span className='rounded-md border px-2 py-0.5 tracking-widest'>{product.brand}</span>
				<span className='rounded-md border px-2 py-0.5 tracking-widest'>
					{product.categoryLabel}
				</span>
			</div>

			<h1 className='font-space-grotesk text-4xl leading-[1.05] font-bold tracking-tighter text-balance sm:text-5xl'>
				{product.name}
			</h1>

			{product.tagline && (
				<p className='bg-linear-to-r from-foreground to-muted-foreground bg-clip-text text-lg text-transparent'>
					{product.tagline}
				</p>
			)}

			{product.reviews > 0 && (
				<p className='flex items-center gap-1.5 font-mono text-xs text-muted-foreground'>
					<Star className='size-3.5 fill-foreground text-foreground' />
					<span className='font-semibold text-foreground'>{product.rating.toFixed(1)}</span>
					<span>·</span>
					<span>{product.reviews} ta sharh</span>
				</p>
			)}
		</div>
	)
}

export default ProductHeading
