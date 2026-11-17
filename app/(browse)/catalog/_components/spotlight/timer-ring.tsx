import type { CSSProperties } from 'react'

/** Tugma atrofidagi aylana: animatsiya davomida to'lib boradi */
const TimerRing = ({ style }: { style: CSSProperties }) => {
	return (
		<svg
			viewBox='0 0 40 40'
			aria-hidden
			className='pointer-events-none absolute -inset-1 size-[calc(100%+0.5rem)] -rotate-90'
		>
			<circle cx='20' cy='20' r='18' fill='none' strokeWidth='1.5' className='stroke-border' />
			<circle
				cx='20'
				cy='20'
				r='18'
				fill='none'
				strokeWidth='1.5'
				strokeLinecap='round'
				pathLength={100}
				strokeDasharray='100'
				strokeDashoffset='100'
				className='stroke-foreground motion-safe:animate-ring'
				style={style}
			/>
		</svg>
	)
}

export default TimerRing
