import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import GridFrame from '@/components/shared/grid-frame'
import { catalogProducts } from '@/lib/data/catalog'
import { getProduct } from '@/lib/data/product-details'
import ProductHighlights from './_components/details/product-highlights'
import ProductOverview from './_components/details/product-overview'
import ProductGallery from './_components/gallery/product-gallery'
import ProductInfo from './_components/info/product-info'
import ProductBreadcrumbs from './_components/product-breadcrumbs'
import RelatedProducts from './_components/related-products'

/** Barcha mahsulot sahifalari build vaqtida tayyorlanadi */
export const generateStaticParams = () => catalogProducts.map(product => ({ id: product.id }))

export const generateMetadata = async ({ params }: PageProps<'/shop/[id]'>): Promise<Metadata> => {
	const { id } = await params
	const product = getProduct(id)
	if (!product) return { title: 'Mahsulot topilmadi — Ormo' }

	return {
		title: `${product.brand} ${product.name} — Ormo`,
		description: product.tagline || product.description,
	}
}

const ProductPage = async ({ params }: PageProps<'/shop/[id]'>) => {
	const { id } = await params
	const product = getProduct(id)
	if (!product) notFound()

	return (
		<div className='mx-auto max-w-7xl space-y-16 px-4 py-8 sm:px-6 md:py-12'>
			<div className='space-y-6'>
				<ProductBreadcrumbs product={product} />

				<GridFrame className='grid grid-cols-[minmax(0,1fr)] divide-y lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:divide-x lg:divide-y-0'>
					<ProductGallery product={product} />
					<ProductInfo product={product} />
				</GridFrame>
			</div>

			<ProductHighlights highlights={product.highlights} />
			<ProductOverview product={product} />
			<RelatedProducts product={product} />
		</div>
	)
}

export default ProductPage
