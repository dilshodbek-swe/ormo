import ProductCard from '@/components/shared/product-card'
import ProductGrid from '@/components/shared/product-grid'
import { catalogProducts } from '@/lib/data/catalog'
import { deals } from '@/lib/data/deals'
import type { Product } from '@/lib/data/products'

/**
 * Savatdagi mahsulotlar kategoriyasidan, savatda yo'q mahsulotlar;
 * yetmasa — eng katta chegirmalar bilan to'ldiriladi.
 */
const pickRecommendations = (cartIds: string[], limit = 4): Product[] => {
	const inCart = new Set(cartIds)
	const categories = new Set(
		catalogProducts.filter(product => inCart.has(product.id)).map(product => product.category)
	)
	const sameCategory = catalogProducts.filter(
		product => categories.has(product.category) && !inCart.has(product.id)
	)
	const fromDeals = deals.filter(deal => !inCart.has(deal.id))

	return [...new Map([...sameCategory, ...fromDeals].map(product => [product.id, product])).values()].slice(
		0,
		limit
	)
}

const CartRecommendations = ({ cartIds }: { cartIds: string[] }) => {
	const products = pickRecommendations(cartIds)
	if (products.length === 0) return null

	return (
		<section className='space-y-6'>
			<div className='space-y-2'>
				<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
					{cartIds.length > 0 ? 'Savatingizga mos' : 'Bugungi takliflar'}
				</p>
				<h2 className='font-space-grotesk text-2xl font-bold tracking-tight sm:text-3xl'>
					{cartIds.length > 0 ? 'Bular ham kerak bo\'ladi.' : 'Shulardan boshlang.'}
				</h2>
			</div>

			<ProductGrid gridClassName='lg:grid-cols-4'>
				{products.map(product => (
					<ProductCard key={product.id} product={product} />
				))}
			</ProductGrid>
		</section>
	)
}

export default CartRecommendations
