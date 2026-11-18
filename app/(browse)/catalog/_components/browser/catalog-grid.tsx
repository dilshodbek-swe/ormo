import { Fragment } from 'react'

import ProductCard from '@/components/shared/product-card'
import ProductGrid from '@/components/shared/product-grid'
import type { Product } from '@/lib/data/products'
import HelpTile from './help-tile'

/** Necha mahsulotdan keyin "yordam" plitkasi qo'yiladi */
const HELP_AFTER = 5

const CatalogGrid = ({ products }: { products: Product[] }) => {
	return (
		<ProductGrid
			className='animate-in fade-in slide-in-from-bottom-2 duration-500'
			gridClassName='md:grid-cols-3 lg:grid-cols-4'
		>
			{products.map((product, index) => (
				<Fragment key={product.id}>
					<ProductCard product={product} />

					{/* Ritmni buzuvchi yordam plitkasi */}
					{index === HELP_AFTER - 1 && products.length > HELP_AFTER && <HelpTile />}
				</Fragment>
			))}
		</ProductGrid>
	)
}

export default CatalogGrid
