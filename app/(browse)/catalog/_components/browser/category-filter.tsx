import { catalogCategories, catalogProducts } from '@/lib/data/catalog'
import { cn } from '@/lib/utils'

const countFor = (id: string) =>
	id === 'all'
		? catalogProducts.length
		: catalogProducts.filter(item => item.category === id).length

type Props = {
	value: string
	onChange: (id: string) => void
}

const CategoryFilter = ({ value, onChange }: Props) => {
	return (
		<div className='-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:pb-0'>
			{catalogCategories.map(({ id, label }) => {
				const isActive = id === value

				return (
					<button
						key={id}
						type='button'
						onClick={() => onChange(id)}
						aria-pressed={isActive}
						className={cn(
							'flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 text-sm transition-colors',
							isActive
								? 'border-foreground bg-foreground text-background'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{label}
						<span
							className={cn(
								'font-mono text-[11px] tabular-nums',
								isActive ? 'opacity-70' : 'opacity-50'
							)}
						>
							{countFor(id)}
						</span>
					</button>
				)
			})}
		</div>
	)
}

export default CategoryFilter
