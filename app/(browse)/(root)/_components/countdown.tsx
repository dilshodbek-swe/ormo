'use client'

import { useEffect, useState } from 'react'

const pad = (n: number) => String(n).padStart(2, '0')

/** Kun oxirigacha qolgan vaqt (HH:MM:SS) */
const getTimeLeft = () => {
	const now = new Date()
	const end = new Date(now)
	end.setHours(24, 0, 0, 0)
	const diff = Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000))

	return [Math.floor(diff / 3600), Math.floor((diff % 3600) / 60), diff % 60]
}

const Countdown = () => {
	const [time, setTime] = useState<number[] | null>(null)

	useEffect(() => {
		const tick = () => setTime(getTimeLeft())
		tick()
		const id = setInterval(tick, 1000)
		return () => clearInterval(id)
	}, [])

	return (
		<div className='flex items-center gap-1 font-mono text-sm tabular-nums'>
			{(time ?? [null, null, null]).map((value, index) => (
				<span key={index} className='flex items-center gap-1'>
					{index > 0 && <span className='text-muted-foreground'>:</span>}
					<span className='rounded-md border bg-background px-1.5 py-0.5'>
						{value === null ? '--' : pad(value)}
					</span>
				</span>
			))}
		</div>
	)
}

export default Countdown
