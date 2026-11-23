'use client'

import { ArrowDownWideNarrow, LayoutGrid, List, Search, X } from 'lucide-react'
import type { RefObject } from 'react'

import type { ProductCategory } from '@/lib/data/products'
import { cn } from '@/lib/utils'
import { PRODUCT_CATEGORIES, PRODUCT_STATUS, type ProductStatus } from '../_lib/types'

export type StatusFilter = 'all' | ProductStatus
export type CategoryFilter = 'all' | ProductCategory
export type ViewMode = 'grid' | 'list'
export type SortKey = 'updated' | 'name' | 'price' | 'stock'

const SORTS: { value: SortKey; label: string }[] = [
	{ value: 'updated', label: 'Yangilangan' },
	{ value: 'name', label: 'Nomi' },
	{ value: 'price', label: 'Narx' },
	{ value: 'stock', label: 'Qoldiq' },
]

interface ProductsToolbarProps {
	status: StatusFilter
	onStatusChange: (value: StatusFilter) => void
	statusCounts: Record<StatusFilter, number>
	category: CategoryFilter
	onCategoryChange: (value: CategoryFilter) => void
	query: string
	onQueryChange: (value: string) => void
	sort: SortKey
	onSortChange: (value: SortKey) => void
	view: ViewMode
	onViewChange: (value: ViewMode) => void
	searchRef: RefObject<HTMLInputElement | null>
}

/** Ikki qator: holat yorliqlari + qidiruv/tartib/ko'rinish; ostida kategoriya "chip"lari */
const ProductsToolbar = (props: ProductsToolbarProps) => {
	const { status, onStatusChange, statusCounts, category, onCategoryChange, query, onQueryChange, sort, onSortChange, view, onViewChange, searchRef } = props
	const nextSort = SORTS[(SORTS.findIndex(item => item.value === sort) + 1) % SORTS.length]
	const tabs: { value: StatusFilter; label: string; dot?: string }[] = [
		{ value: 'all', label: 'Hammasi' },
		...(Object.keys(PRODUCT_STATUS) as ProductStatus[]).map(value => ({
			value,
			label: PRODUCT_STATUS[value].label,
			dot: PRODUCT_STATUS[value].dot,
		})),
	]

	return (
		<div className='space-y-3'>
			<div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
				<div className='-mx-1 flex gap-1 overflow-x-auto px-1' role='tablist' aria-label="Holat bo'yicha">
					{tabs.map(tab => {
						const active = status === tab.value
						return (
							<button
								key={tab.value}
								type='button'
								role='tab'
								aria-selected={active}
								onClick={() => onStatusChange(tab.value)}
								className={cn(
									'flex shrink-0 items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
									active ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
								)}
							>
								{tab.dot && <span className={cn('size-1.5 rounded-full', tab.dot)} />}
								{tab.label}
								<span className={cn('rounded-full px-1.5 font-mono text-[10px] tabular-nums', active ? 'bg-background/20' : 'bg-muted')}>
									{statusCounts[tab.value]}
								</span>
							</button>
						)
					})}
				</div>

				<div className='flex gap-2'>
					<label className='relative flex h-9 min-w-0 flex-1 items-center rounded-md border bg-background transition-shadow focus-within:ring-3 focus-within:ring-ring/30 lg:w-64 lg:flex-none'>
						<Search className='ml-3 size-4 shrink-0 text-muted-foreground' />
						<input
							ref={searchRef}
							value={query}
							onChange={event => onQueryChange(event.target.value)}
							onKeyDown={event => {
								if (event.key === 'Escape') {
									onQueryChange('')
									event.currentTarget.blur()
								}
							}}
							placeholder='Nomi, brend, SKU...'
							aria-label='Mahsulotlarni qidirish'
							className='h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground'
						/>
						{query ? (
							<button type='button' aria-label='Tozalash' onClick={() => onQueryChange('')} className='mr-2 rounded p-0.5 text-muted-foreground hover:text-foreground'>
								<X className='size-3.5' />
							</button>
						) : (
							<kbd className='mr-2.5 rounded border bg-muted px-1.5 font-mono text-[10px] text-muted-foreground'>/</kbd>
						)}
					</label>
					<button
						type='button'
						onClick={() => onSortChange(nextSort.value)}
						title={`Keyingisi: ${nextSort.label}`}
						className='flex h-9 shrink-0 items-center gap-2 rounded-md border bg-background px-3 text-sm transition-colors hover:bg-muted'
					>
						<ArrowDownWideNarrow className='size-4 text-muted-foreground' />
						<span className='hidden sm:inline'>{SORTS.find(item => item.value === sort)?.label}</span>
					</button>
					{/* Vercel'dagi grid/list almashtirgich */}
					<div className='flex h-9 shrink-0 rounded-md border bg-background p-0.5' role='radiogroup' aria-label="Ko'rinish">
						{(
							[
								['grid', LayoutGrid, 'Kartalar'],
								['list', List, "Ro'yxat"],
							] as const
						).map(([value, Icon, label]) => (
							<button
								key={value}
								type='button'
								role='radio'
								aria-checked={view === value}
								aria-label={label}
								title={label}
								onClick={() => onViewChange(value)}
								className={cn(
									'flex w-8 items-center justify-center rounded-[5px] transition-colors [&_svg]:size-4',
									view === value ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'
								)}
							>
								<Icon />
							</button>
						))}
					</div>
				</div>
			</div>

			<div className='-mx-1 flex gap-1.5 overflow-x-auto px-1'>
				{[{ id: 'all' as const, label: 'Barcha kategoriyalar' }, ...PRODUCT_CATEGORIES].map(item => (
					<button
						key={item.id}
						type='button'
						onClick={() => onCategoryChange(item.id)}
						className={cn(
							'shrink-0 rounded-full border px-3 py-1 text-xs transition-colors',
							category === item.id
								? 'border-foreground bg-foreground/5 font-medium text-foreground'
								: 'border-dashed text-muted-foreground hover:border-solid hover:text-foreground'
						)}
					>
						{item.label}
					</button>
				))}
			</div>
		</div>
	)
}

export default ProductsToolbar
