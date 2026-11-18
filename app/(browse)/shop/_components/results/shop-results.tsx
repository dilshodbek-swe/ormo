import ProductCard from '@/components/shared/product-card'
import ProductGrid from '@/components/shared/product-grid'
import type { Product } from '@/lib/data/products'
import ShopEmpty from './shop-empty'

type Props = {
	products: Product[]
	onReset: () => void
}

export const SHOP_GRID_COLUMNS = 'md:grid-cols-3'

const ShopResults = ({ products, onReset }: Props) => {
	if (products.length === 0) return <ShopEmpty onReset={onReset} />

	return (
		<ProductGrid gridClassName={SHOP_GRID_COLUMNS}>
			{products.map(product => (
				<ProductCard key={product.id} product={product} />
			))}
		</ProductGrid>
	)
}

export default ShopResults
