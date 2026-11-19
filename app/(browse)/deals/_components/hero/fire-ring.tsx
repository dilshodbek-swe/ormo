import { type CSSProperties, useId } from 'react'

type Props = {
	style: CSSProperties
	onComplete: () => void
}

/**
 * Quti chegarasi bo'ylab aylanib to'ladigan "olov" taymeri.
 * Rang — sayt bo'ylab chegirmalarda ishlatiladigan orange → rose gradienti,
 * atrofida yengil cho'g' nuri. Chiziq to'lgach `onComplete` chaqiriladi.
 */
const FireRing = ({ style, onComplete }: Props) => {
	const gradientId = useId()

	return (
		<svg
			aria-hidden
			className='pointer-events-none absolute inset-0 size-full overflow-visible drop-shadow-[0_0_6px_rgb(249_115_22/0.7)]'
		>
			<defs>
				<linearGradient id={gradientId} x1='0' y1='0' x2='1' y2='1'>
					<stop offset='0%' stopColor='var(--color-amber-300)' />
					<stop offset='45%' stopColor='var(--color-orange-500)' />
					<stop offset='100%' stopColor='var(--color-rose-500)' />
				</linearGradient>
			</defs>
			{/* rx = rounded-xl (12px); pathLength=100 — dashoffset 100 → 0 bilan to'ladi */}
			<rect
				width='100%'
				height='100%'
				rx='12'
				fill='none'
				stroke={`url(#${gradientId})`}
				strokeWidth='2'
				strokeLinecap='round'
				pathLength={100}
				strokeDasharray='100'
				strokeDashoffset='100'
				onAnimationEnd={onComplete}
				className='motion-safe:animate-ring motion-reduce:[stroke-dashoffset:0]'
				style={style}
			/>
		</svg>
	)
}

export default FireRing
