import type { ProductCategory } from '@/lib/data/products'
import { formatPrice } from '@/lib/utils'

/*
 * Admin kupon modeli — backend (Mongoose `Coupon`) shu shaklga moslab yoziladi.
 * Hozir savat faqat PROMO_CODES (kod → foiz) ni biladi; backend ulanganda savat ham
 * shu modelni (turi, minimal summa, muddat, limit) tekshiradi.
 */

export type CouponType = 'percent' | 'fixed'
export type CouponStatus = 'active' | 'scheduled' | 'paused' | 'exhausted' | 'expired'

export interface Coupon {
	id: string
	/** Mijoz kiritadigan kod — katta harf, bo'shliqsiz */
	code: string
	description: string
	type: CouponType
	/** percent — foiz (1–90), fixed — so'm */
	value: number
	/** Minimal buyurtma summasi (0 — cheklovsiz) */
	minOrder: number
	/** Umumiy ishlatish limiti (null — cheklovsiz) */
	maxUses: number | null
	onePerCustomer: boolean
	firstOrderOnly: boolean
	/** Bo'sh — barcha kategoriyalarga */
	categories: ProductCategory[]
	/** YYYY-MM-DD */
	startsAt: string
	endsAt: string | null
	paused: boolean
	/** Statistika — buyurtmalardan hisoblanadi */
	uses: number
	discountGiven: number
	revenue: number
	createdAt: string
}

export const STATUS_META: Record<CouponStatus, { label: string; dot: string; pill: string }> = {
	active: { label: 'Faol', dot: 'bg-emerald-500', pill: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400' },
	scheduled: { label: 'Rejalashtirilgan', dot: 'bg-sky-500', pill: 'border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400' },
	paused: { label: "To'xtatilgan", dot: 'bg-amber-500', pill: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400' },
	exhausted: { label: 'Limit tugagan', dot: 'bg-muted-foreground', pill: 'text-muted-foreground' },
	expired: { label: "Muddati o'tgan", dot: 'bg-muted-foreground/50', pill: 'text-muted-foreground' },
}
export const STATUS_ORDER: CouponStatus[] = ['active', 'scheduled', 'paused', 'exhausted', 'expired']

const pad = (value: number) => String(value).padStart(2, '0')
export const todayKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

/** Holat — sanalar bugungi kunga nisbatan (muddatning oxirgi kuni ham hisobga kiradi) */
export const getStatus = (coupon: Coupon, today = todayKey()): CouponStatus => {
	if (coupon.endsAt && coupon.endsAt < today) return 'expired'
	if (coupon.maxUses !== null && coupon.uses >= coupon.maxUses) return 'exhausted'
	if (coupon.paused) return 'paused'
	if (coupon.startsAt > today) return 'scheduled'
	return 'active'
}

const DAY = 86_400_000
const daysBetween = (from: string, to: string) => Math.round((new Date(`${to}T00:00:00`).getTime() - new Date(`${from}T00:00:00`).getTime()) / DAY)

/** "3 kundan keyin", "bugun oxirgi kun", "5 kun qoldi" — kartadagi vaqt yorlig'i */
export const timeHint = (coupon: Coupon, today = todayKey()) => {
	const status = getStatus(coupon, today)
	if (status === 'scheduled') {
		const days = daysBetween(today, coupon.startsAt)
		return days === 1 ? 'ertaga boshlanadi' : `${days} kundan keyin boshlanadi`
	}
	if (status === 'expired' && coupon.endsAt) return `${daysBetween(coupon.endsAt, today)} kun oldin tugagan`
	if (!coupon.endsAt) return 'muddatsiz'
	const left = daysBetween(today, coupon.endsAt)
	return left === 0 ? 'bugun oxirgi kun' : `${left} kun qoldi`
}

/** Faol davrning qancha qismi o'tgan (0–1) — kartadagi vaqt chizig'i uchun */
export const timeProgress = (coupon: Coupon, today = todayKey()) => {
	if (!coupon.endsAt) return null
	const total = Math.max(daysBetween(coupon.startsAt, coupon.endsAt) + 1, 1)
	return Math.min(Math.max((daysBetween(coupon.startsAt, today) + 1) / total, 0), 1)
}

export const formatValue = (coupon: Pick<Coupon, 'type' | 'value'>) =>
	coupon.type === 'percent' ? `${coupon.value}%` : coupon.value >= 1_000_000 ? `${coupon.value / 1_000_000} mln` : `${Math.round(coupon.value / 1000)}K`

export const describeValue = (coupon: Pick<Coupon, 'type' | 'value'>) =>
	coupon.type === 'percent' ? `${coupon.value}% chegirma` : `${formatPrice(coupon.value)} chegirma`

/** Chalkash belgilarsiz (0/O, 1/I) tasodifiy kod */
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
export const generateCode = (prefix = 'ORMO') => {
	const random = Array.from(crypto.getRandomValues(new Uint8Array(5)), byte => ALPHABET[byte % ALPHABET.length]).join('')
	return `${prefix}-${random}`
}

export const normalizeCode = (value: string) => value.toUpperCase().replace(/[^A-Z0-9-]/g, '')

export interface CouponDraft {
	code: string
	description: string
	type: CouponType
	value: string
	minOrder: string
	maxUses: string
	onePerCustomer: boolean
	firstOrderOnly: boolean
	categories: ProductCategory[]
	startsAt: string
	endsAt: string
	paused: boolean
}

export type CouponErrors = Partial<Record<keyof CouponDraft, string>>

export const emptyCouponDraft = (): CouponDraft => ({
	code: '',
	description: '',
	type: 'percent',
	value: '10',
	minOrder: '',
	maxUses: '',
	onePerCustomer: true,
	firstOrderOnly: false,
	categories: [],
	startsAt: todayKey(),
	endsAt: '',
	paused: false,
})

export const draftFromCoupon = (coupon: Coupon): CouponDraft => ({
	code: coupon.code,
	description: coupon.description,
	type: coupon.type,
	value: String(coupon.value),
	minOrder: coupon.minOrder ? String(coupon.minOrder) : '',
	maxUses: coupon.maxUses === null ? '' : String(coupon.maxUses),
	onePerCustomer: coupon.onePerCustomer,
	firstOrderOnly: coupon.firstOrderOnly,
	categories: coupon.categories,
	startsAt: coupon.startsAt,
	endsAt: coupon.endsAt ?? '',
	paused: coupon.paused,
})

export const parseNumber = (value: string) => (value.trim() === '' ? NaN : Number(value.replace(/[\s_]/g, '')))

export const validateCoupon = (draft: CouponDraft, takenCodes: string[], uses = 0): CouponErrors => {
	const errors: CouponErrors = {}
	const value = parseNumber(draft.value)
	const minOrder = draft.minOrder.trim() ? parseNumber(draft.minOrder) : 0
	const maxUses = draft.maxUses.trim() ? parseNumber(draft.maxUses) : null

	if (draft.code.length < 3) errors.code = 'Kod kamida 3 belgi'
	else if (draft.code.length > 24) errors.code = "Ko'pi bilan 24 belgi"
	else if (takenCodes.includes(draft.code)) errors.code = `«${draft.code}» allaqachon bor`

	if (!Number.isInteger(value) || value <= 0) errors.value = 'Musbat butun son kiriting'
	else if (draft.type === 'percent' && value > 90) errors.value = "Foiz 90 dan oshmasin"
	else if (draft.type === 'fixed' && value < 1000) errors.value = "Kamida 1 000 so'm"

	if (!Number.isInteger(minOrder) || minOrder < 0) errors.minOrder = 'Manfiy bo‘lmagan butun son'
	else if (draft.type === 'fixed' && Number.isInteger(value) && minOrder > 0 && value >= minOrder)
		errors.minOrder = 'Chegirmadan katta bo‘lishi kerak'

	if (maxUses !== null && (!Number.isInteger(maxUses) || maxUses < 1)) errors.maxUses = 'Kamida 1'
	else if (maxUses !== null && maxUses < uses) errors.maxUses = `Allaqachon ${uses} marta ishlatilgan`

	if (!draft.startsAt) errors.startsAt = 'Boshlanish sanasi kerak'
	if (draft.endsAt && draft.startsAt && draft.endsAt < draft.startsAt) errors.endsAt = 'Boshlanishdan oldin bo‘lmasin'

	return errors
}
