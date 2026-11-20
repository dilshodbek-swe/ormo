import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import ProductCard from '@/components/shared/product-card'
import ProductGrid from '@/components/shared/product-grid'
import { getRelatedProducts, type ProductWithDetails } from '@/lib/data/product-details'

const RelatedProducts = ({ product }: { product: ProductWithDetails }) => {
	const related = getRelatedProducts(product)
	if (related.length === 0) return null

	return (
		<section className='space-y-6'>
			<div className='flex items-end justify-between gap-4'>
				<h2 className='font-space-grotesk text-2xl font-bold tracking-tight sm:text-3xl'>
					{product.categoryLabel}dan yana
				</h2>
				<Link
					href={`/shop?category=${product.category}`}
					className='group flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground'
				>
					Barchasi
					<ArrowRight className='size-3.5 transition-transform group-hover:translate-x-0.5' />
				</Link>
			</div>

			<ProductGrid gridClassName='lg:grid-cols-4'>
				{related.map(item => (
					<ProductCard key={item.id} product={item} />
				))}
			</ProductGrid>
		</section>
	)
}

export default RelatedProducts
