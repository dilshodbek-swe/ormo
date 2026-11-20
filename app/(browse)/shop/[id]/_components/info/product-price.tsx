import type { ProductWithDetails } from '@/lib/data/product-details'
import { formatPrice } from '@/lib/utils'

const ProductPrice = ({ product }: { product: ProductWithDetails }) => {
	const hasDiscount = product.discount > 0

	return (
		<div className='space-y-2'>
			<div className='flex flex-wrap items-baseline gap-x-3 gap-y-1'>
				<p className='font-mono text-3xl font-bold tracking-tight sm:text-4xl'>
					{formatPrice(product.price)}
				</p>
				{hasDiscount && (
					<p className='font-mono text-sm text-muted-foreground line-through'>
						{formatPrice(product.oldPrice)}
					</p>
				)}
			</div>

			{hasDiscount && (
				<p className='inline-flex rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-700 dark:text-emerald-400'>
					{formatPrice(product.oldPrice - product.price)} tejaysiz
				</p>
			)}
		</div>
	)
}

export default ProductPrice
