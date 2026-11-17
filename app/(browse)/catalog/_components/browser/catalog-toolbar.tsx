import CategoryFilter from './category-filter'
import SortToggle from './sort-toggle'
import type { SortId } from './sorts'

type Props = {
	category: string
	sort: SortId
	onCategoryChange: (id: string) => void
	onSortChange: (id: SortId) => void
}

const CatalogToolbar = ({ category, sort, onCategoryChange, onSortChange }: Props) => {
	return (
		<div className='sticky top-26 z-20 -mx-4 flex flex-col gap-3 border-b bg-background/80 px-4 py-3 backdrop-blur-md sm:-mx-6 sm:px-6 md:top-16 lg:flex-row lg:items-center lg:justify-between'>
			<CategoryFilter value={category} onChange={onCategoryChange} />
			<SortToggle value={sort} onChange={onSortChange} />
		</div>
	)
}

export default CatalogToolbar
