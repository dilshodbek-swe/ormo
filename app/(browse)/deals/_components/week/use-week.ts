'use client'

import { useMemo, useSyncExternalStore } from 'react'

import { buildWeek } from './week-days'

const subscribe = () => () => {}
const getDayKey = () => new Date().toDateString()
const getServerDayKey = () => null

/**
 * Joriy hafta — foydalanuvchining o'z sanasi bo'yicha.
 * Serverda va hydration paytida `null` (vaqt zonasi farqi mos kelmaslikka olib kelmasligi uchun),
 * brauzerda darhol haqiqiy hafta qaytadi.
 */
const useWeek = () => {
	const dayKey = useSyncExternalStore(subscribe, getDayKey, getServerDayKey)

	return useMemo(() => (dayKey ? buildWeek(new Date(dayKey)) : null), [dayKey])
}

export default useWeek
