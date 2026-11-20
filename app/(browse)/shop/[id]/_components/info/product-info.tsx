import type { ProductWithDetails } from '@/lib/data/product-details'
import ProductHeading from './product-heading'
import ProductPerks from './product-perks'
import ProductPrice from './product-price'
import ProductPurchase from './product-purchase'
import ProductStock from './product-stock'

/** O'ng panel: nom, narx, xarid va xizmatlar */
const ProductInfo = ({ product }: { product: ProductWithDetails }) => {
	return (
		<div className='flex flex-col gap-8 p-6 sm:p-10'>
			<ProductHeading product={product} />

			<div className='space-y-6 border-t border-dashed pt-8'>
				<ProductPrice product={product} />
				<ProductStock stock={product.stock} />
				<ProductPurchase product={product} />
			</div>

			<ProductPerks />
		</div>
	)
}

export default ProductInfo
