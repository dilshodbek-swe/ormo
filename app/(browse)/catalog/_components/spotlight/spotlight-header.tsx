import type { CSSProperties } from 'react'

import { pad, picks } from './picks'
import SpotlightControls from './spotlight-controls'

type Props = {
	current: number
	paused: boolean
	timer: CSSProperties
	onPrev: () => void
	onNext: () => void
}

const SpotlightHeader = ({ current, paused, timer, onPrev, onNext }: Props) => {
	const upcoming = picks[(current + 1) % picks.length]

	return (
		<div className='flex items-end justify-between gap-4'>
			<div className='space-y-1'>
				<p className='font-mono text-xs tracking-widest text-muted-foreground uppercase'>
					Muharrir tanlovi
				</p>
				<p className='font-mono text-sm tabular-nums'>
					{pad(current + 1)}{' '}
					<span className='text-muted-foreground'>/ {pad(picks.length)}</span>
				</p>
			</div>

			{/* Keyingi slayd haqida ogohlantirish */}
			<p
				key={upcoming.id}
				className='animate-in fade-in slide-in-from-right-2 hidden min-w-0 flex-1 truncate text-right text-xs text-muted-foreground duration-500 sm:block'
			>
				{paused ? 'Pauza' : 'Keyingisi'} →{' '}
				<span className='text-foreground'>{upcoming.product.name}</span>
			</p>

			<SpotlightControls current={current} timer={timer} onPrev={onPrev} onNext={onNext} />
		</div>
	)
}

export default SpotlightHeader
