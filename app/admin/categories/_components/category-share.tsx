import { cn } from '@/lib/utils'
import { type AdminCategory, type CategoryStats, toneAt } from '../_lib/types'

interface CategoryShareProps {
	categories: AdminCategory[]
	stats: Record<string, CategoryStats>
	totalProducts: number
}

/** Katalogdagi mahsulotlar kategoriyalar bo'yicha qanday taqsimlangani — bitta chiziqda */
const CategoryShare = ({ categories, stats, totalProducts }: CategoryShareProps) => {
	const total = Math.max(totalProducts, 1)

	return (
		<div className='rounded-xl border bg-background p-5'>
			<div className='flex items-baseline justify-between gap-4'>
				<p className='font-mono text-[10px] tracking-widest text-muted-foreground uppercase'>Katalog taqsimoti</p>
				<p className='font-mono text-xs text-muted-foreground tabular-nums'>{totalProducts} mahsulot</p>
			</div>

			<div className='mt-4 flex h-3 gap-0.5 overflow-hidden rounded-full bg-muted'>
				{categories.map((category, index) =>
					stats[category.id]?.total ? (
						<span
							key={category.id}
							title={`${category.title}: ${stats[category.id].total}`}
							className={cn(
								'h-full transition-[flex-grow] duration-700 first:rounded-l-full last:rounded-r-full',
								toneAt(index),
								!category.visible && 'opacity-35'
							)}
							style={{ flexGrow: stats[category.id].total / total }}
						/>
					) : null
				)}
			</div>

			<ul className='mt-4 grid gap-2'>
				{categories.map((category, index) => {
					const count = stats[category.id]?.total ?? 0
					return (
						<li key={category.id} className='flex items-center gap-2.5 text-sm'>
							<span className={cn('size-2.5 shrink-0 rounded-[3px]', toneAt(index), !category.visible && 'opacity-35')} />
							<span className={cn('min-w-0 flex-1 truncate', !category.visible && 'text-muted-foreground')}>{category.title}</span>
							<span className='font-mono text-xs text-muted-foreground tabular-nums'>
								{count} · {Math.round((count / total) * 100)}%
							</span>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default CategoryShare
