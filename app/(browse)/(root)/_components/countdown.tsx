'use client'

import { Timer } from 'lucide-react'
import { useEffect, useState } from 'react'

const DAY = 24 * 60 * 60

const pad = (n: number) => String(n).padStart(2, '0')

/** Kun oxirigacha qolgan soniyalar */
const getSecondsLeft = () => {
	const now = new Date()
	const end = new Date(now)
	end.setHours(24, 0, 0, 0)
	return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000))
}

const Unit = ({ value, label }: { value: number | null; label: string }) => (
	<div className='flex flex-col items-center gap-1'>
		<div className='flex h-11 min-w-12 items-center justify-center overflow-hidden rounded-lg bg-foreground px-2 font-mono text-2xl font-semibold text-background tabular-nums sm:h-12 sm:min-w-14 sm:text-3xl'>
			{/* key o'zgarganda raqam yuqoridan "tushib" keladi */}
			<span
				key={value ?? 'empty'}
				className='animate-in fade-in slide-in-from-top-2 duration-300'
			>
				{value === null ? '--' : pad(value)}
			</span>
		</div>
		<span className='text-[10px] tracking-wider text-muted-foreground uppercase'>
			{label}
		</span>
	</div>
)

const Separator = () => (
	<span className='flex h-11 items-center font-mono text-2xl font-semibold text-muted-foreground motion-safe:animate-pulse sm:h-12'>
		:
	</span>
)

const Countdown = () => {
	const [left, setLeft] = useState<number | null>(null)

	useEffect(() => {
		const tick = () => setLeft(getSecondsLeft())
		tick()
		const id = setInterval(tick, 1000)
		return () => clearInterval(id)
	}, [])

	const hours = left === null ? null : Math.floor(left / 3600)
	const minutes = left === null ? null : Math.floor((left % 3600) / 60)
	const seconds = left === null ? null : left % 60
	const progress = left === null ? 100 : (left / DAY) * 100

	return (
		<div className='rounded-xl border bg-muted/40 p-4'>
			<div className='flex flex-wrap items-center justify-between gap-4'>
				<div className='space-y-1'>
					<p className='flex items-center gap-1.5 text-sm font-medium'>
						<Timer className='size-4 text-orange-500' />
						Takliflar tugashiga
					</p>
					<p className='text-xs text-muted-foreground'>
						Barcha chegirmalar bugun 23:59 gacha
					</p>
				</div>

				<div className='flex items-start gap-1.5 sm:gap-2'>
					<Unit value={hours} label='soat' />
					<Separator />
					<Unit value={minutes} label='daqiqa' />
					<Separator />
					<Unit value={seconds} label='soniya' />
				</div>
			</div>

			{/* Kun davomida asta-sekin kamayib boradigan chiziq */}
			<div className='mt-4 h-1 overflow-hidden rounded-full bg-border'>
				<div
					className='h-full rounded-full bg-linear-to-r from-orange-500 to-rose-500 transition-[width] duration-1000 ease-linear'
					style={{ width: `${progress}%` }}
				/>
			</div>
		</div>
	)
}

export default Countdown
