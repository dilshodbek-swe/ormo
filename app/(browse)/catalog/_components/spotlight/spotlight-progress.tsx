import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'
import { AUTOPLAY_MS, picks } from './picks'

type Props = {
	current: number
	paused: boolean
	timer: CSSProperties
	onSelect: (index: number) => void
	onComplete: () => void
}

/** Story uslubidagi indikator: faol segment vaqt o'tishi bilan to'ladi */
const SpotlightProgress = ({ current, paused, timer, onSelect, onComplete }: Props) => {
	return (
		<div className='flex items-center justify-between gap-4'>
			<div className='flex gap-1.5'>
				{picks.map(({ id, product }, index) => {
					const isActive = index === current

					return (
						<button
							key={id}
							type='button'
							onClick={() => onSelect(index)}
							aria-label={`${product.name} — ${index + 1}-slayd`}
							aria-current={isActive}
							className={cn(
								'relative h-1 overflow-hidden rounded-full bg-border transition-all duration-500 hover:bg-muted-foreground/40',
								isActive ? 'w-16' : 'w-6'
							)}
						>
							{/* O'tib ketgan slaydlar to'liq, faoli esa jonli to'ladi */}
							{index < current && (
								<span className='absolute inset-0 rounded-full bg-foreground/30' />
							)}
							{isActive && (
								<span
									key={current}
									onAnimationEnd={onComplete}
									className='absolute inset-y-0 left-0 w-full rounded-full bg-foreground motion-safe:w-0 motion-safe:animate-progress'
									style={timer}
								/>
							)}
						</button>
					)
				})}
			</div>

			<span className='flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground'>
				<span
					className={cn(
						'size-1.5 rounded-full',
						paused ? 'bg-amber-500' : 'bg-emerald-500 motion-safe:animate-pulse'
					)}
				/>
				{paused ? 'Pauza' : `Avto · ${AUTOPLAY_MS / 1000}s`}
			</span>
		</div>
	)
}

export default SpotlightProgress
