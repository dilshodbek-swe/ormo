'use client'

import { useState } from 'react'

import { cn } from '@/lib/utils'
import ResultsHeader from './results/results-header'
import ShopResults from './results/shop-results'
import FilterSidebar from './sidebar/filter-sidebar'
import useShopFilters from './use-shop-filters'

const ShopBrowser = () => {
	const { filters, update, reset, activeCount, products } = useShopFilters()
	const [filtersOpen, setFiltersOpen] = useState(false)

	return (
		<div className='flex flex-col gap-6 lg:flex-row lg:items-start lg:gap-8'>
			<FilterSidebar
				filters={filters}
				activeCount={activeCount}
				onChange={update}
				onReset={reset}
				className={cn(!filtersOpen && 'hidden lg:block')}
			/>

			<section className='min-w-0 flex-1 space-y-4'>
				<ResultsHeader
					total={products.length}
					sort={filters.sort}
					activeCount={activeCount}
					filtersOpen={filtersOpen}
					onToggleFilters={() => setFiltersOpen(open => !open)}
				/>
				<ShopResults products={products} onReset={reset} />
			</section>
		</div>
	)
}

export default ShopBrowser
