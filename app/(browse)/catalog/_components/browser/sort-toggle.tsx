import { cn } from '@/lib/utils'
import { type SortId, sorts } from './sorts'

type Props = {
	value: SortId
	onChange: (id: SortId) => void
}

const SortToggle = ({ value, onChange }: Props) => {
	return (
		<div className='flex items-center gap-3'>
			<span className='hidden font-mono text-xs text-muted-foreground sm:inline'>
				Saralash:
			</span>
			<div className='flex rounded-lg border p-0.5'>
				{sorts.map(({ id, label }) => (
					<button
						key={id}
						type='button'
						onClick={() => onChange(id)}
						aria-pressed={id === value}
						className={cn(
							'rounded-md px-2.5 py-1 text-xs transition-colors',
							id === value
								? 'bg-muted font-medium text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{label}
					</button>
				))}
			</div>
		</div>
	)
}

export default SortToggle
