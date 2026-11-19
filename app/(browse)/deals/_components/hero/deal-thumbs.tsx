import Image from 'next/image'
import type { CSSProperties } from 'react'

import { cn } from '@/lib/utils'
import FireRing from './fire-ring'
import { heroDeals } from './hero-deals'

type Props = {
	current: number
	timer: CSSProperties
	onSelect: (index: number) => void
	onComplete: () => void
}

/** Pastki tasma: har bir taklif tugmasi, faolining chegarasi bo'ylab olov taymeri aylanadi */
const DealThumbs = ({ current, timer, onSelect, onComplete }: Props) => {
	return (
		// py-2 — halqa nuri aylantiriladigan tasma chetida kesilib qolmasligi uchun
		<div className='-mx-4 flex gap-2 overflow-x-auto px-4 py-2 sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:px-0'>
			{heroDeals.map((deal, index) => {
				const isActive = index === current

				return (
					<button
						key={deal.id}
						type='button'
						onClick={() => onSelect(index)}
						aria-label={`${deal.name} — -${deal.discount}%`}
						aria-current={isActive}
						className={cn(
							'relative flex min-w-44 items-center gap-3 rounded-xl border p-2.5 text-left transition-colors sm:min-w-0',
							isActive
								? 'border-background/15 bg-background/10'
								: 'border-background/10 opacity-60 hover:opacity-100'
						)}
					>
						<span className='flex size-11 shrink-0 items-center justify-center rounded-lg bg-white p-1.5'>
							<Image
								src={deal.image}
								alt=''
								width={120}
								height={120}
								className='h-full w-auto mask-[radial-gradient(closest-side,black_70%,transparent)] object-contain'
							/>
						</span>
						<span className='min-w-0'>
							<span className='block truncate text-xs'>{deal.name}</span>
							<span className='font-mono text-sm font-semibold text-rose-400'>
								-{deal.discount}%
							</span>
						</span>

						{isActive && <FireRing key={current} style={timer} onComplete={onComplete} />}
					</button>
				)
			})}
		</div>
	)
}

export default DealThumbs
