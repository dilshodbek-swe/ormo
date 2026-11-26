'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'

const subscribe = () => () => {}
const getDayKey = () => new Date().toDateString()
const getServerDayKey = () => null

/**
 * Bugungi sana — faqat brauzerda (vaqt zonasi server bilan farq qilsa hydration buzilmasin).
 * Serverda va birinchi render'da `null`.
 */
export const useToday = () => {
	const key = useSyncExternalStore(subscribe, getDayKey, getServerDayKey)
	return key ? new Date(key) : null
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Yarim tungacha qolgan vaqt — "05:42:17"; har soniyada yangilanadi */
export const useMidnightCountdown = () => {
	const [left, setLeft] = useState<string | null>(null)

	useEffect(() => {
		const tick = () => {
			const now = new Date()
			const midnight = new Date(now)
			midnight.setHours(24, 0, 0, 0)
			const seconds = Math.max(0, Math.floor((midnight.getTime() - now.getTime()) / 1000))
			setLeft(`${pad(Math.floor(seconds / 3600))}:${pad(Math.floor((seconds % 3600) / 60))}:${pad(seconds % 60)}`)
		}
		const timer = setInterval(tick, 1000)
		const first = setTimeout(tick, 0)
		return () => {
			clearInterval(timer)
			clearTimeout(first)
		}
	}, [])

	return left
}
