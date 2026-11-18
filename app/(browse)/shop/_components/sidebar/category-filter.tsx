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
		<ul className='-mx-2 space-y-0.5'>
			{catalogCategories.map(({ id, label }) => {
				const isActive = id === value

				return (
					<li key={id}>
						<button
							type='button'
							onClick={() => onChange(id)}
							aria-pressed={isActive}
							className={cn(
								'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors',
								isActive
									? 'bg-muted font-medium text-foreground'
									: 'text-muted-foreground hover:text-foreground'
							)}
						>
							{label}
							<span className='font-mono text-[11px] tabular-nums opacity-60'>
								{countFor(id)}
							</span>
						</button>
					</li>
				)
			})}
		</ul>
	)
}

export default CategoryFilter
