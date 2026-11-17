'use client'

import CatalogToolbar from './catalog-toolbar'
import EmptyState from './empty-state'
import ProductGrid from './product-grid'
import useCatalogFilters from './use-catalog-filters'

const CatalogBrowser = () => {
	const { category, sort, products, setCategory, setSort } = useCatalogFilters()

	return (
		<section className='space-y-6'>
			<CatalogToolbar
				category={category}
				sort={sort}
				onCategoryChange={setCategory}
				onSortChange={setSort}
			/>

			<p className='font-mono text-xs text-muted-foreground'>
				{products.length} ta mahsulot topildi
			</p>

			{products.length === 0 ? (
				<EmptyState />
			) : (
				<ProductGrid key={`${category}-${sort}`} products={products} />
			)}
		</section>
	)
}

export default CatalogBrowser
