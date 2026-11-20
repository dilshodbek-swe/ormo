import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

import type { ProductWithDetails } from '@/lib/data/product-details'

const ProductBreadcrumbs = ({ product }: { product: ProductWithDetails }) => {
	const crumbs = [
		{ href: '/shop', label: "Do'kon" },
		{ href: `/shop?category=${product.category}`, label: product.categoryLabel },
	]

	return (
		<nav aria-label="Yo'l" className='font-mono text-xs text-muted-foreground'>
			<ol className='flex flex-wrap items-center gap-1.5'>
				{crumbs.map(crumb => (
					<li key={crumb.href} className='flex items-center gap-1.5'>
						<Link href={crumb.href} className='transition-colors hover:text-foreground'>
							{crumb.label}
						</Link>
						<ChevronRight className='size-3' />
					</li>
				))}
				<li aria-current='page' className='truncate text-foreground'>
					{product.name}
				</li>
			</ol>
		</nav>
	)
}

export default ProductBreadcrumbs
