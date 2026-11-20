import { SlidersHorizontal } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { type SortId, sorts } from '../shop-filters'

type Props = {
	total: number
	sort: SortId
	activeCount: number
	filtersOpen: boolean
	onToggleFilters: () => void
}

const ResultsHeader = ({ total, sort, activeCount, filtersOpen, onToggleFilters }: Props) => {
	const sortLabel = sorts.find(item => item.id === sort)?.label

	return (
		<div className='flex items-center justify-between gap-4'>
			<p className='font-mono text-xs text-muted-foreground'>
				{total} ta mahsulot
				<span className='hidden sm:inline'> · {sortLabel}</span>
			</p>

			{/* Kichik ekranlarda filtr paneli tugma orqali ochiladi */}
			<Button
				variant='outline'
				size='sm'
				onClick={onToggleFilters}
				aria-expanded={filtersOpen}
				className='lg:hidden'
			>
				<SlidersHorizontal />
				Filtrlar
				{activeCount > 0 && (
					<span className='font-mono text-[11px] tabular-nums opacity-60'>
						{activeCount}
					</span>
				)}
			</Button>
		</div>
	)
}

export default ResultsHeader
