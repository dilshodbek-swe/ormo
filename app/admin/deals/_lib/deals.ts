import { catalogProducts } from '@/lib/data/catalog'
import { deals } from '@/lib/data/deals'
import type { Product } from '@/lib/data/products'

/*
 * Aksiyalar: do'kondagi /deals sahifasining ikki qismi —
 *  1) Hafta jadvali: har kunga bitta "kun taklifi" (maxsus narx, ixtiyoriy dona limiti)
 *  2) Hero karuseli: tepada aylanadigan 5 tagacha mahsulot (avtomatik yoki qo'lda)
 * Backend ulanganda `DealSchedule` hujjati; hozircha do'kondagi mantiqdan namunaviy.
 */

export const WEEKDAYS = ['Dushanba', 'Seshanba', 'Chorshanba', 'Payshanba', 'Juma', 'Shanba', 'Yakshanba'] as const
export const WEEKDAYS_SHORT = ['Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya'] as const
export const HERO_LIMIT = 5

export interface WeekSlot {
	/** 0 = dushanba … 6 = yakshanba */
	day: number
	productId: string | null
	/** Shu kungi narx (mahsulotning odatiy narxidan past yoki teng) */
	dealPrice: number
	/** Shu kunga ajratilgan dona (null — cheklovsiz) */
	limit: number | null
	sold: number
}

export interface HeroConfig {
	mode: 'auto' | 'manual'
	productIds: string[]
}

export const productById = new Map(catalogProducts.map(product => [product.id, product]))
export const getProduct = (id: string | null) => (id ? productById.get(id) : undefined)

/** Asl (eski) narxga nisbatan chegirma foizi */
export const discountOf = (product: Pick<Product, 'oldPrice'>, price: number) =>
	product.oldPrice > 0 ? Math.max(0, Math.round(((product.oldPrice - price) / product.oldPrice) * 100)) : 0

/** Foizdan narx — 10 000 so'mgacha yaxlitlanadi (narxlar "chiroyli" ko'rinsin) */
export const priceFromDiscount = (product: Pick<Product, 'oldPrice'>, percent: number) =>
	Math.round((product.oldPrice * (1 - percent / 100)) / 10_000) * 10_000

/** Do'kondagi kabi: har kunga bittadan, eng katta chegirmadan boshlab */
export const sampleWeek: WeekSlot[] = WEEKDAYS.map((_, day) => {
	const deal = deals[day % deals.length]
	return {
		day,
		productId: deal.id,
		dealPrice: deal.price,
		limit: [10, 15, null, 8, 20, null, 12][day],
		sold: [10, 9, 14, 3, 0, 0, 0][day],
	}
})

export const sampleHero: HeroConfig = { mode: 'auto', productIds: deals.slice(0, HERO_LIMIT).map(deal => deal.id) }

/** Avtomatik rejim: eng katta chegirmali 5 ta */
export const autoHeroIds = () => deals.slice(0, HERO_LIMIT).map(deal => deal.id)

/** Chegirmadagi barcha mahsulotlar — "chegirma xaritasi" uchun */
export const discountedProducts = () =>
	catalogProducts
		.filter(product => product.price < product.oldPrice)
		.map(product => ({ product, discount: discountOf(product, product.price) }))
		.sort((a, b) => b.discount - a.discount)

/** Dushanba = 0 … Yakshanba = 6 */
export const weekdayIndex = (date: Date) => (date.getDay() + 6) % 7

/** Shu haftaning sanalari (dushanbadan) */
export const weekDates = (today: Date) => {
	const monday = new Date(today)
	monday.setHours(0, 0, 0, 0)
	monday.setDate(today.getDate() - weekdayIndex(today))
	return WEEKDAYS.map((_, index) => {
		const date = new Date(monday)
		date.setDate(monday.getDate() + index)
		return date
	})
}
