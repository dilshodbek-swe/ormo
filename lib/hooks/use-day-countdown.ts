'use client'

import { useEffect, useState } from 'react'

export const DAY_SECONDS = 24 * 60 * 60

/** Kun oxirigacha qolgan soniyalar */
const getSecondsLeft = () => {
	const now = new Date()
	const end = new Date(now)
	end.setHours(24, 0, 0, 0)
	return Math.max(0, Math.floor((end.getTime() - now.getTime()) / 1000))
}

/**
 * Bugun 23:59 gacha qolgan vaqt. Serverda va birinchi renderda `null`
 * (hydration mos kelishi uchun), keyin har soniyada yangilanadi.
 */
const useDayCountdown = () => {
	const [left, setLeft] = useState<number | null>(null)

	useEffect(() => {
		const tick = () => setLeft(getSecondsLeft())
		tick()
		const id = setInterval(tick, 1000)
		return () => clearInterval(id)
	}, [])

	return {
		left,
		hours: left === null ? null : Math.floor(left / 3600),
		minutes: left === null ? null : Math.floor((left % 3600) / 60),
		seconds: left === null ? null : left % 60,
	}
}

export default useDayCountdown
