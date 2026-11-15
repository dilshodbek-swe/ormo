'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'
import { openingHours } from './contact-info'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/** Toshkent vaqti bo'yicha hafta kuni va soat */
const getTashkentNow = () => {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Tashkent',
		weekday: 'short',
		hour: 'numeric',
		minute: 'numeric',
		hourCycle: 'h23',
	}).formatToParts(new Date())

	const get = (type: string) => parts.find(part => part.type === type)?.value
	return {
		day: WEEKDAYS.indexOf(get('weekday') ?? ''),
		hour: Number(get('hour')) + Number(get('minute')) / 60,
	}
}

const useTashkentNow = () => {
	const [now, setNow] = useState<{ day: number; hour: number } | null>(null)

	useEffect(() => {
		const tick = () => setNow(getTashkentNow())
		tick()
		const id = setInterval(tick, 60_000)
		return () => clearInterval(id)
	}, [])

	return now
}

const isOpenAt = (day: number, hour: number) => {
	const today = openingHours.find(item => item.days.includes(day))
	return Boolean(
		today?.open !== undefined &&
			today.close !== undefined &&
			hour >= today.open &&
			hour < today.close
	)
}

/** "Hozir ochiqmiz" / "Hozir yopiqmiz" jonli belgisi */
export const OpenStatus = () => {
	const now = useTashkentNow()
	const open = now ? isOpenAt(now.day, now.hour) : null

	return (
		<span className='inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1.5 text-xs'>
			<span className='relative flex size-2'>
				{open && (
					<span className='absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-75' />
				)}
				<span
					className={cn(
						'relative inline-flex size-2 rounded-full',
						open === null && 'bg-muted-foreground/40',
						open === true && 'bg-emerald-500',
						open === false && 'bg-amber-500'
					)}
				/>
			</span>
			{open === null && 'Holat tekshirilmoqda...'}
			{open === true && "Hozir ochiqmiz · o'rtacha javob ~15 daqiqa"}
			{open === false && "Hozir yopiqmiz · xabaringizga ertalab javob beramiz"}
		</span>
	)
}

const formatHour = (hour: number) => `${String(hour).padStart(2, '0')}:00`

/** Ish vaqti jadvali — bugungi kun ajratib ko'rsatiladi */
export const HoursTable = () => {
	const now = useTashkentNow()

	return (
		<ul className='divide-y rounded-lg border'>
			{openingHours.map(({ label, days, open, close }) => {
				const isToday = now !== null && days.includes(now.day)

				return (
					<li
						key={label}
						className={cn(
							'flex items-center justify-between px-4 py-2.5 text-sm',
							isToday ? 'text-foreground' : 'text-muted-foreground'
						)}
					>
						<span className='flex items-center gap-2'>
							{label}
							{isToday && (
								<span className='rounded-full bg-foreground px-1.5 py-0.5 font-mono text-[10px] text-background'>
									Bugun
								</span>
							)}
						</span>
						<span className='font-mono text-xs'>
							{open !== undefined && close !== undefined
								? `${formatHour(open)} — ${formatHour(close)}`
								: 'Dam olish'}
						</span>
					</li>
				)
			})}
		</ul>
	)
}
