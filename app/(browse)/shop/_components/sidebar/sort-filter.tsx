import { cn } from '@/lib/utils'
import { type SortId, sorts } from '../shop-filters'

type Props = {
	value: SortId
	onChange: (id: SortId) => void
}

const SortFilter = ({ value, onChange }: Props) => {
	return (
		<div className='grid grid-cols-2 gap-1.5'>
			{sorts.map(({ id, label }) => {
				const isActive = id === value

				return (
					<button
						key={id}
						type='button'
						onClick={() => onChange(id)}
						aria-pressed={isActive}
						className={cn(
							'rounded-md border px-2.5 py-1.5 text-left text-xs transition-colors',
							isActive
								? 'border-foreground bg-foreground text-background'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{label}
					</button>
				)
			})}
		</div>
	)
}

export default SortFilter
