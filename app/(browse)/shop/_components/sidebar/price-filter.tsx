import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { pricePresets } from '../shop-filters'

type Range = { minPrice: number | null; maxPrice: number | null }

type Props = Range & {
	onChange: (range: Range) => void
}

const toNumber = (value: string) => (value === '' ? null : Math.max(0, Number(value)))

const PriceFilter = ({ minPrice, maxPrice, onChange }: Props) => {
	return (
		<div className='space-y-3'>
			<div className='flex items-center gap-2'>
				<Input
					type='number'
					inputMode='numeric'
					min={0}
					step={100_000}
					value={minPrice ?? ''}
					onChange={event => onChange({ minPrice: toNumber(event.target.value), maxPrice })}
					placeholder='dan'
					aria-label="Minimal narx (so'm)"
					className='h-9 font-mono tabular-nums'
				/>
				<span className='text-muted-foreground'>—</span>
				<Input
					type='number'
					inputMode='numeric'
					min={0}
					step={100_000}
					value={maxPrice ?? ''}
					onChange={event => onChange({ minPrice, maxPrice: toNumber(event.target.value) })}
					placeholder='gacha'
					aria-label="Maksimal narx (so'm)"
					className='h-9 font-mono tabular-nums'
				/>
			</div>

			<div className='flex flex-wrap gap-1.5'>
				{pricePresets.map(preset => {
					const isActive = preset.min === minPrice && preset.max === maxPrice

					return (
						<button
							key={preset.label}
							type='button'
							onClick={() =>
								onChange(
									isActive
										? { minPrice: null, maxPrice: null }
										: { minPrice: preset.min, maxPrice: preset.max }
								)
							}
							aria-pressed={isActive}
							className={cn(
								'rounded-full border px-2.5 py-1 text-xs transition-colors',
								isActive
									? 'border-foreground bg-foreground text-background'
									: 'text-muted-foreground hover:text-foreground'
							)}
						>
							{preset.label}
						</button>
					)
				})}
			</div>
		</div>
	)
}

export default PriceFilter
