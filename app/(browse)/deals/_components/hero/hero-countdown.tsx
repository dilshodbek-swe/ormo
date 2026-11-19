'use client'

import useDayCountdown from '@/lib/hooks/use-day-countdown'

const pad = (n: number | null) => (n === null ? '--' : String(n).padStart(2, '0'))

/** Ixcham taymer: barcha chegirmalar bugun yarim tunda tugaydi */
const HeroCountdown = () => {
	const { hours, minutes, seconds } = useDayCountdown()

	return (
		<p className='flex items-center gap-2.5 rounded-full border border-background/15 px-3.5 py-1.5 text-xs'>
			<span className='relative flex size-2'>
				<span className='absolute inset-0 rounded-full bg-rose-500 motion-safe:animate-ping' />
				<span className='relative size-2 rounded-full bg-rose-500' />
			</span>
			<span className='text-background/60'>Tugashiga</span>
			<span className='font-mono font-semibold tabular-nums'>
				{pad(hours)}:{pad(minutes)}:{pad(seconds)}
			</span>
		</p>
	)
}

export default HeroCountdown
