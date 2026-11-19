import { bundles } from '@/lib/data/bundles'
import { cn } from '@/lib/utils'

type Props = {
	value: string
	onChange: (id: string) => void
}

const BundleTabs = ({ value, onChange }: Props) => {
	return (
		<div role='tablist' aria-label="To'plamlar" className='-mx-4 flex gap-2 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:px-0'>
			{bundles.map(bundle => {
				const isActive = bundle.id === value

				return (
					<button
						key={bundle.id}
						type='button'
						role='tab'
						aria-selected={isActive}
						onClick={() => onChange(bundle.id)}
						className={cn(
							'flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors',
							isActive
								? 'border-foreground bg-foreground text-background'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						{bundle.name}
						<span
							className={cn(
								'font-mono text-[11px] font-semibold',
								isActive ? 'text-orange-300' : 'text-orange-600'
							)}
						>
							-{bundle.discount}%
						</span>
					</button>
				)
			})}
		</div>
	)
}

export default BundleTabs
