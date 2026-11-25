import { PROMO_CODES } from '@/lib/store/cart/cart-pricing'
import type { Coupon } from './types'

/*
 * Namunaviy kuponlar. ORMO10 va KADR5 — savatda hozir haqiqatan ishlaydigan kodlar
 * (PROMO_CODES dan); qolganlari turli holatlarni ko'rsatish uchun.
 */

type Seed = Omit<Coupon, 'id' | 'createdAt' | 'onePerCustomer' | 'firstOrderOnly' | 'categories' | 'paused' | 'minOrder' | 'maxUses' | 'endsAt'> &
	Partial<Pick<Coupon, 'onePerCustomer' | 'firstOrderOnly' | 'categories' | 'paused' | 'minOrder' | 'maxUses' | 'endsAt'>>

const seeds: Seed[] = [
	{
		code: 'ORMO10',
		description: "Saytdagi doimiy taklif — har qanday buyurtmaga",
		type: 'percent',
		value: PROMO_CODES.ORMO10 ?? 10,
		startsAt: '2026-09-01',
		uses: 184,
		discountGiven: 21_480_000,
		revenue: 193_300_000,
	},
	{
		code: 'KADR5',
		description: 'Instagram obunachilari uchun',
		type: 'percent',
		value: PROMO_CODES.KADR5 ?? 5,
		startsAt: '2026-10-15',
		endsAt: '2026-12-31',
		maxUses: 500,
		uses: 312,
		discountGiven: 8_940_000,
		revenue: 169_800_000,
	},
	{
		code: 'QORAJUMA25',
		description: 'Qora juma: 4 kunlik katta chegirma',
		type: 'percent',
		value: 25,
		minOrder: 3_000_000,
		startsAt: '2026-11-27',
		endsAt: '2026-11-30',
		maxUses: 300,
		uses: 0,
		discountGiven: 0,
		revenue: 0,
	},
	{
		code: 'YANGI50K',
		description: "Birinchi xarid uchun sovg'a",
		type: 'fixed',
		value: 50_000,
		minOrder: 500_000,
		firstOrderOnly: true,
		startsAt: '2026-08-01',
		uses: 96,
		discountGiven: 4_800_000,
		revenue: 118_600_000,
	},
	{
		code: 'DRON15',
		description: 'Faqat dronlarga — mavsum oxiri',
		type: 'percent',
		value: 15,
		categories: ['drones'],
		startsAt: '2026-11-01',
		endsAt: '2026-12-15',
		paused: true,
		uses: 23,
		discountGiven: 31_200_000,
		revenue: 176_900_000,
	},
	{
		code: 'VIP500K',
		description: 'Doimiy mijozlarga yopiq taklif',
		type: 'fixed',
		value: 500_000,
		minOrder: 10_000_000,
		startsAt: '2026-10-01',
		maxUses: 20,
		uses: 20,
		discountGiven: 10_000_000,
		revenue: 268_400_000,
	},
	{
		code: 'YOZ2026',
		description: 'Yozgi sotuv',
		type: 'percent',
		value: 12,
		startsAt: '2026-06-01',
		endsAt: '2026-08-31',
		uses: 241,
		discountGiven: 38_700_000,
		revenue: 284_100_000,
	},
]

export const sampleCoupons: Coupon[] = seeds.map((seed, index) => ({
	onePerCustomer: true,
	firstOrderOnly: false,
	categories: [],
	paused: false,
	minOrder: 0,
	maxUses: null,
	endsAt: null,
	...seed,
	id: `cpn_${index + 1}`,
	createdAt: `${seed.startsAt}T09:00:00`,
}))
