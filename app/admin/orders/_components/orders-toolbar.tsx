'use client'

import { ArrowDownWideNarrow, Search, X } from 'lucide-react'
import { type RefObject } from 'react'

import { type OrderStatus, STATUS_LABELS } from '@/lib/data/orders'
import { cn } from '@/lib/utils'
import { STATUS_ORDER, type StatusFilter } from '../_lib/order-utils'

export type SortKey = 'newest' | 'oldest' | 'total'

export const SORTS: { value: SortKey; label: string }[] = [
	{ value: 'newest', label: 'Yangilari' },
	{ value: 'oldest', label: 'Eskilari' },
	{ value: 'total', label: 'Summa' },
]

interface OrdersToolbarProps {
	status: StatusFilter
	onStatusChange: (value: StatusFilter) => void
	counts: Record<OrderStatus, number>
	total: number
	query: string
	onQueryChange: (value: string) => void
	sort: SortKey
	onSortChange: (value: SortKey) => void
	searchRef: RefObject<HTMLInputElement | null>
}

/** Holat yorliqlari (sanoq bilan), qidiruv ("/" bilan fokus) va tartiblash */
const OrdersToolbar = ({
	status,
	onStatusChange,
	counts,
	total,
	query,
	onQueryChange,
	sort,
	onSortChange,
	searchRef,
}: OrdersToolbarProps) => {
	const tabs: { value: StatusFilter; label: string; count: number }[] = [
		{ value: 'all', label: 'Hammasi', count: total },
		...STATUS_ORDER.map(value => ({ value, label: STATUS_LABELS[value], count: counts[value] })),
	]
	const nextSort = SORTS[(SORTS.findIndex(item => item.value === sort) + 1) % SORTS.length]

	return (
		<div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
			<div className='-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0' role='tablist' aria-label="Holat bo'yicha">
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
							{tab.label}
							<span
								className={cn(
									'rounded-full px-1.5 font-mono text-[10px] tabular-nums',
									active ? 'bg-background/20' : 'bg-muted'
								)}
							>
								{tab.count}
							</span>
						</button>
					)
				})}
			</div>

			<div className='flex gap-2'>
				<label className='relative flex h-9 min-w-0 flex-1 items-center rounded-md border bg-background transition-shadow focus-within:ring-3 focus-within:ring-ring/30 lg:w-72 lg:flex-none'>
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
						placeholder='ID, mijoz, telefon, mahsulot...'
						aria-label='Buyurtmalarni qidirish'
						className='h-full min-w-0 flex-1 bg-transparent px-2.5 text-sm outline-none placeholder:text-muted-foreground'
					/>
					{query ? (
						<button
							type='button'
							aria-label='Tozalash'
							onClick={() => onQueryChange('')}
							className='mr-2 rounded p-0.5 text-muted-foreground hover:text-foreground'
						>
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
					{SORTS.find(item => item.value === sort)?.label}
				</button>
			</div>
		</div>
	)
}

export default OrdersToolbar
