'use client'

import { ArrowDown, ArrowUp, GripVertical, MoreHorizontal, Pencil, Sparkles, Trash2 } from 'lucide-react'
import { useState } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Switch } from '@/components/ui/switch'
import { cn, formatPrice } from '@/lib/utils'
import { type AdminCategory, type CategoryStats, toneAt } from '../_lib/types'
import { CategoryImg } from './category-bits'

export interface CategoryActions {
	onEdit: (category: AdminCategory) => void
	onToggleVisible: (category: AdminCategory) => void
	onMove: (from: number, to: number) => void
	onDelete: (category: AdminCategory) => void
}

interface CategoryBoardProps {
	categories: AdminCategory[]
	stats: Record<string, CategoryStats>
	totalProducts: number
	actions: CategoryActions
}

const compact = (value: number) => (value >= 1_000_000 ? `${(value / 1_000_000).toFixed(1)} mln` : formatPrice(value))

/**
 * Tartiblanadigan ro'yxat: chapdagi dastakdan sudrang (yoki menyudan yuqoriga/pastga).
 * Tartib — do'kondagi tartib; birinchi ko'rinadigan kategoriya bosh sahifada katta karta bo'ladi.
 */
const CategoryBoard = ({ categories, stats, totalProducts, actions }: CategoryBoardProps) => {
	const [dragIndex, setDragIndex] = useState<number | null>(null)
	const [overIndex, setOverIndex] = useState<number | null>(null)
	const [armed, setArmed] = useState<number | null>(null)
	const featuredId = categories.find(category => category.visible)?.id

	return (
		<ol className='@container overflow-hidden rounded-xl border bg-background'>
			{categories.map((category, index) => {
				const stat = stats[category.id]
				const share = totalProducts ? (stat.total / totalProducts) * 100 : 0
				return (
					<li
						key={category.id}
						draggable={armed === index}
						onDragStart={event => {
							setDragIndex(index)
							event.dataTransfer.effectAllowed = 'move'
						}}
						onDragOver={event => {
							if (dragIndex === null) return
							event.preventDefault()
							setOverIndex(index)
						}}
						onDrop={event => {
							event.preventDefault()
							if (dragIndex !== null) actions.onMove(dragIndex, index)
						}}
						onDragEnd={() => {
							setDragIndex(null)
							setOverIndex(null)
							setArmed(null)
						}}
						className={cn(
							'group relative grid grid-cols-[1.25rem_3rem_minmax(0,1fr)_auto] items-center gap-x-3 @xl:gap-x-4 gap-y-3 border-b p-4 transition-colors last:border-b-0 hover:bg-muted/30 @xl:grid-cols-[2rem_4.5rem_minmax(0,1fr)_10rem_auto]',
							dragIndex === index && 'opacity-40',
							overIndex === index && dragIndex !== index && (dragIndex! > index ? 'shadow-[inset_0_2px_0_var(--color-foreground)]' : 'shadow-[inset_0_-2px_0_var(--color-foreground)]'),
							!category.visible && 'bg-muted/20'
						)}
					>
						<span
							onMouseDown={() => setArmed(index)}
							onMouseUp={() => setArmed(null)}
							title="Sudrab tartibni o'zgartiring"
							className='flex cursor-grab flex-col items-center gap-1 text-muted-foreground active:cursor-grabbing'
						>
							<span className='font-mono text-[10px] group-hover:hidden'>{String(index + 1).padStart(2, '0')}</span>
							<GripVertical className='hidden size-4 group-hover:block' />
							<span className={cn('h-4 w-0.5 rounded-full', toneAt(index), !category.visible && 'opacity-35')} />
						</span>

						<button
							type='button'
							onClick={() => actions.onEdit(category)}
							aria-label={`${category.title} ni tahrirlash`}
							className={cn(
								'relative size-12 overflow-hidden rounded-lg border bg-white transition-transform group-hover:-rotate-2 @xl:size-18 dark:bg-muted/40',
								!category.visible && 'grayscale'
							)}
						>
							<CategoryImg image={category.image} sizes='72px' className='p-1.5' />
						</button>

						<div className='min-w-0 space-y-1.5'>
							<div className='flex flex-wrap items-center gap-2'>
								<button
									type='button'
									onClick={() => actions.onEdit(category)}
									className='truncate text-left font-medium underline-offset-4 hover:underline'
								>
									{category.title}
								</button>
								{category.id === featuredId && (
									<span
										title='Bosh sahifada katta karta'
										className='inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] text-muted-foreground @xl:px-2'
									>
										<Sparkles className='size-3' />
										<span className='hidden @xl:inline'>Bosh sahifada katta</span>
									</span>
								)}
								{!category.visible && (
									<span className='rounded-full border border-dashed px-2 py-0.5 text-[10px] text-muted-foreground'>Yashirin</span>
								)}
							</div>
							<p className='truncate font-mono text-[11px] text-muted-foreground'>/catalog?category={category.id}</p>
							<p className='hidden truncate text-sm text-muted-foreground @xl:block'>{category.description || '—'}</p>
						</div>

						{/* Mahsulotlar soni va ulushi */}
						<div className='col-span-3 col-start-2 space-y-1.5 @xl:col-span-1 @xl:col-start-auto'>
							<div className='flex items-baseline justify-between gap-2 text-sm'>
								<span>
									<span className='font-mono font-medium tabular-nums'>{stat.total}</span>
									<span className='text-muted-foreground'> mahsulot</span>
								</span>
								<span className='font-mono text-[11px] text-muted-foreground'>{Math.round(share)}%</span>
							</div>
							<div className='h-1 overflow-hidden rounded-full bg-muted'>
								<div className={cn('h-full rounded-full transition-[width] duration-700', toneAt(index))} style={{ width: `${share}%` }} />
							</div>
							<p className='font-mono text-[10px] text-muted-foreground'>
								{stat.active} faol · {compact(stat.value)}
							</p>
						</div>

						<div className='col-start-4 row-start-1 flex items-center gap-2 @xl:col-start-5'>
							<Switch
								checked={category.visible}
								onCheckedChange={() => actions.onToggleVisible(category)}
								aria-label={category.visible ? "Do'kondan yashirish" : "Do'konda ko'rsatish"}
								title={category.visible ? "Do'konda ko'rinadi" : 'Yashirin'}
							/>
							<CategoryMenu index={index} count={categories.length} category={category} actions={actions} />
						</div>
					</li>
				)
			})}
		</ol>
	)
}

const itemClass =
	'flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors outline-none hover:bg-muted focus-visible:bg-muted disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:text-muted-foreground'

const CategoryMenu = ({ index, count, category, actions }: { index: number; count: number; category: AdminCategory; actions: CategoryActions }) => {
	const [open, setOpen] = useState(false)
	const run = (action: () => void) => () => {
		setOpen(false)
		action()
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				aria-label={`${category.title} amallari`}
				className='flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 data-popup-open:bg-muted'
			>
				<MoreHorizontal className='size-4' />
			</PopoverTrigger>
			<PopoverContent align='end' sideOffset={4} className='w-48 gap-0 p-1'>
				<button type='button' className={itemClass} onClick={run(() => actions.onEdit(category))}>
					<Pencil />
					Tahrirlash
				</button>
				<button type='button' className={itemClass} disabled={index === 0} onClick={run(() => actions.onMove(index, index - 1))}>
					<ArrowUp />
					Yuqoriga
				</button>
				<button type='button' className={itemClass} disabled={index === count - 1} onClick={run(() => actions.onMove(index, index + 1))}>
					<ArrowDown />
					Pastga
				</button>
				<div className='my-1 h-px bg-border' />
				<button
					type='button'
					className={cn(itemClass, 'text-destructive hover:bg-destructive/10 [&_svg]:text-destructive')}
					onClick={run(() => actions.onDelete(category))}
				>
					<Trash2 />
					O&apos;chirish
				</button>
			</PopoverContent>
		</Popover>
	)
}

export default CategoryBoard
