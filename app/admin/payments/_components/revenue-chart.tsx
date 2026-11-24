'use client'

import { useId, useState } from 'react'

import { formatDate, formatPrice } from '@/lib/utils'
import { compact } from './payments-kpis'

interface RevenueChartProps {
	data: { key: string; value: number; count: number }[]
}

const HEIGHT = 100

/** "Yaxlit" yuqori chegara: 23.4 mln → 25 mln — o'q yorliqlari toza ko'rinsin */
const niceMax = (value: number) => {
	if (value <= 0) return 1
	const power = 10 ** Math.floor(Math.log10(value))
	const step = [1, 2, 2.5, 5, 10].find(item => item * power >= value) ?? 10
	return step * power
}

/**
 * Kunlik sof tushum — bitta seriya (legend kerak emas, sarlavha nomlaydi): 2px chiziq, och maydon,
 * hover'da vertikal chiziq + nuqta + tooltip. Grid va o'qlar sokin.
 */
const RevenueChart = ({ data }: RevenueChartProps) => {
	const gradientId = useId()
	const [active, setActive] = useState<number | null>(null)
	const max = niceMax(Math.max(...data.map(point => point.value)))
	const last = data.length - 1
	const x = (index: number) => (last ? (index / last) * 100 : 50)
	const y = (value: number) => HEIGHT - (value / max) * HEIGHT

	const line = data.map((point, index) => `${index ? 'L' : 'M'}${x(index)},${y(point.value)}`).join(' ')
	const area = `${line} L100,${HEIGHT} L0,${HEIGHT} Z`
	const ticks = [max, max / 2, 0]
	const point = active !== null ? data[active] : null
	const labelIndexes = [...new Set([0, Math.round(last / 2), last])]

	return (
		<div className='grid grid-cols-[auto_minmax(0,1fr)] gap-x-3'>
			{/* Y o'qi */}
			<div className='flex h-48 flex-col justify-between py-px text-right font-mono text-[10px] text-muted-foreground tabular-nums'>
				{ticks.map(tick => (
					<span key={tick} className='-translate-y-1/2 first:translate-y-0 last:translate-y-0'>
						{tick ? compact(tick) : '0'}
					</span>
				))}
			</div>

			<div
				className='relative h-48 touch-none'
				onPointerMove={event => {
					const rect = event.currentTarget.getBoundingClientRect()
					setActive(Math.max(0, Math.min(last, Math.round(((event.clientX - rect.left) / rect.width) * last))))
				}}
				onPointerLeave={() => setActive(null)}
				role='img'
				aria-label={`Kunlik sof tushum, ${data.length} kun`}
			>
				{/* Gorizontal grid */}
				{ticks.map(tick => (
					<span key={tick} aria-hidden className='absolute inset-x-0 border-t border-dashed border-border' style={{ top: `${(y(tick) / HEIGHT) * 100}%` }} />
				))}

				<svg viewBox={`0 0 100 ${HEIGHT}`} preserveAspectRatio='none' className='absolute inset-0 size-full overflow-visible' aria-hidden>
					<defs>
						<linearGradient id={gradientId} x1='0' x2='0' y1='0' y2='1'>
							<stop offset='0%' stopColor='currentColor' stopOpacity='0.18' />
							<stop offset='100%' stopColor='currentColor' stopOpacity='0' />
						</linearGradient>
					</defs>
					<path d={area} fill={`url(#${gradientId})`} className='text-foreground' />
					<path
						d={line}
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinejoin='round'
						strokeLinecap='round'
						vectorEffect='non-scaling-stroke'
						className='text-foreground'
					/>
				</svg>

				{point && active !== null && (
					<>
						<span aria-hidden className='pointer-events-none absolute inset-y-0 w-px bg-foreground/25' style={{ left: `${x(active)}%` }} />
						<span
							aria-hidden
							className='pointer-events-none absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-background bg-foreground'
							style={{ left: `${x(active)}%`, top: `${(y(point.value) / HEIGHT) * 100}%` }}
						/>
						<div
							className='pointer-events-none absolute top-0 z-10 min-w-36 rounded-lg border bg-popover px-3 py-2 text-xs shadow-lg'
							style={{
								left: `${x(active)}%`,
								transform: `translateX(${x(active) > 70 ? 'calc(-100% - 10px)' : '10px'})`,
							}}
						>
							<p className='text-muted-foreground'>{formatDate(`${point.key}T12:00:00`, { year: false })}</p>
							<p className='mt-0.5 font-mono font-semibold tabular-nums'>{formatPrice(point.value)}</p>
							<p className='text-muted-foreground'>{point.count} ta to&apos;lov</p>
						</div>
					</>
				)}
			</div>

			{/* X o'qi */}
			<span />
			<div className='relative mt-2 h-4 font-mono text-[10px] text-muted-foreground'>
				{labelIndexes.map(index => (
					<span
						key={index}
						className='absolute -translate-x-1/2 whitespace-nowrap first:translate-x-0 last:-translate-x-full'
						style={{ left: `${x(index)}%` }}
					>
						{formatDate(`${data[index].key}T12:00:00`, { year: false })}
					</span>
				))}
			</div>
		</div>
	)
}

export default RevenueChart
