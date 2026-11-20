import GridFrame from '@/components/shared/grid-frame'
import type { ProductWithDetails } from '@/lib/data/product-details'
import ProductInBox from './product-in-box'
import ProductSpecs from './product-specs'

/** Chapda — tavsif va quti tarkibi, o'ngda — texnik xususiyatlar */
const ProductOverview = ({ product }: { product: ProductWithDetails }) => {
	return (
		<GridFrame className='grid divide-y lg:grid-cols-2 lg:divide-x lg:divide-y-0'>
			<div className='space-y-10 p-6 sm:p-10'>
				<div className='space-y-4'>
					<h2 className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
						Tavsif
					</h2>
					<p className='text-lg leading-relaxed text-pretty'>{product.description}</p>
				</div>
				<ProductInBox items={product.inBox} />
			</div>

			<div className='bg-muted/30 p-6 sm:p-10'>
				<ProductSpecs specs={product.specs} />
			</div>
		</GridFrame>
	)
}

export default ProductOverview
