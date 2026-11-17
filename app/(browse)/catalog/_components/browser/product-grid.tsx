import { Fragment } from 'react'

import ProductCard from '@/components/shared/product-card'
import type { Product } from '@/lib/data/products'
import HelpTile from './help-tile'

/** Necha mahsulotdan keyin "yordam" plitkasi qo'yiladi */
const HELP_AFTER = 5

const ProductGrid = ({ products }: { products: Product[] }) => {
	return (
		<div className='animate-in fade-in slide-in-from-bottom-2 overflow-hidden rounded-xl border bg-background duration-500'>
			{/*
			 * Chiziqlar har bir katakning o'ng/pastki chegarasidan chiziladi,
			 * chetdagilari -mr-px/-mb-px bilan yashiriladi — oxirgi qatordagi bo'sh joy oq qoladi
			 */}
			<div className='-mr-px -mb-px grid grid-cols-2 *:border-r *:border-b md:grid-cols-3 lg:grid-cols-4'>
				{products.map((product, index) => (
					<Fragment key={product.id}>
						<ProductCard product={product} />

						{/* Ritmni buzuvchi yordam plitkasi */}
						{index === HELP_AFTER - 1 && products.length > HELP_AFTER && <HelpTile />}
					</Fragment>
				))}
			</div>
		</div>
	)
}

export default ProductGrid
