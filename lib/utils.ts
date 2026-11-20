export { cn } from "cn"

/** 12450000 → "12 450 000 so'm" */
export const formatPrice = (value: number) =>
	`${String(value).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} so'm`

/** Chegirma foizi: (12 000 000, 9 000 000) → 25 */
export const getDiscount = (oldPrice: number, price: number) =>
	Math.round(((oldPrice - price) / oldPrice) * 100)

const MONTHS = [
	'yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun',
	'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr',
]

/** 2026-11-20 → "20-noyabr, 2026"; `time` bilan → "20-noyabr, 2026 · 14:05" */
export const formatDate = (value: Date | string, { time = false, year = true } = {}) => {
	const date = typeof value === 'string' ? new Date(value) : value
	const day = `${date.getDate()}-${MONTHS[date.getMonth()]}`
	const base = year ? `${day}, ${date.getFullYear()}` : day
	if (!time) return base
	const hh = String(date.getHours()).padStart(2, '0')
	const mm = String(date.getMinutes()).padStart(2, '0')
	return `${base} · ${hh}:${mm}`
}

/** "3 daqiqa oldin", "2 kun oldin" — sessiyalar va faollik uchun */
export const formatRelative = (value: Date | string) => {
	const diff = Date.now() - new Date(value).getTime()
	const minutes = Math.round(diff / 60_000)
	if (minutes < 1) return 'hozirgina'
	if (minutes < 60) return `${minutes} daqiqa oldin`
	const hours = Math.round(minutes / 60)
	if (hours < 24) return `${hours} soat oldin`
	const days = Math.round(hours / 24)
	if (days < 30) return `${days} kun oldin`
	return formatDate(value)
}
