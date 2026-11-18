import { cn } from '@/lib/utils'
import type { ShopFilters } from '../shop-filters'
import CategoryFilter from './category-filter'
import FilterSection from './filter-section'
import PriceFilter from './price-filter'
import SearchFilter from './search-filter'
import SortFilter from './sort-filter'

type Props = {
	filters: ShopFilters
	activeCount: number
	onChange: (patch: Partial<ShopFilters>) => void
	onReset: () => void
	className?: string
}

const FilterSidebar = ({ filters, activeCount, onChange, onReset, className }: Props) => {
	return (
		<aside
			className={cn(
				'shrink-0 rounded-xl border px-5 lg:sticky lg:top-24 lg:max-h-[calc(100svh-7rem)] lg:w-72 lg:overflow-y-auto',
				className
			)}
		>
			<div className='flex items-center justify-between border-b py-4'>
				<h2 className='font-space-grotesk text-lg font-bold tracking-tight'>Filtrlar</h2>
				{activeCount > 0 && (
					<button
						type='button'
						onClick={onReset}
						className='text-xs text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline'
					>
						Tozalash ({activeCount})
					</button>
				)}
			</div>

			<FilterSection title='Qidiruv'>
				<SearchFilter value={filters.query} onChange={query => onChange({ query })} />
			</FilterSection>

			<FilterSection title='Kategoriya'>
				<CategoryFilter
					value={filters.category}
					onChange={category => onChange({ category })}
				/>
			</FilterSection>

			<FilterSection title="Narx (so'm)">
				<PriceFilter
					minPrice={filters.minPrice}
					maxPrice={filters.maxPrice}
					onChange={onChange}
				/>
			</FilterSection>

			<FilterSection title='Tartiblash'>
				<SortFilter value={filters.sort} onChange={sort => onChange({ sort })} />
			</FilterSection>
		</aside>
	)
}

export default FilterSidebar
