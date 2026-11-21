import { getOrderCount, getOrderTotal, orders } from './orders'

/*
 * Namunaviy to'lov ma'lumotlari. To'lov tizimi (Click/Payme/Uzcard) ulanganda
 * kartalar provayderdan (token ko'rinishida), tranzaksiyalar esa buyurtmalardan keladi.
 * Karta raqamlari hech qachon to'liq saqlanmaydi — faqat oxirgi 4 raqam.
 */

export type CardBrand = 'uzcard' | 'humo' | 'visa'

export interface SavedCard {
	id: string
	brand: CardBrand
	last4: string
	/** OO/YY */
	expires: string
	isDefault: boolean
}

export const savedCards: SavedCard[] = [
	{ id: 'card_1', brand: 'uzcard', last4: '4410', expires: '08/28', isDefault: true },
	{ id: 'card_2', brand: 'humo', last4: '9032', expires: '03/27', isDefault: false },
	{ id: 'card_3', brand: 'visa', last4: '1187', expires: '11/29', isDefault: false },
]

export const CARD_BRANDS: Record<CardBrand, { label: string; className: string }> = {
	uzcard: {
		label: 'UZCARD',
		className: 'bg-[radial-gradient(120%_120%_at_0%_0%,#2b2b2b_0%,#0a0a0a_60%)] text-white',
	},
	humo: {
		label: 'HUMO',
		className: 'bg-[radial-gradient(120%_120%_at_100%_0%,#1f3a5f_0%,#0b1220_65%)] text-white',
	},
	visa: {
		label: 'VISA',
		className: 'bg-[radial-gradient(120%_120%_at_0%_100%,#e7e5e4_0%,#fafaf9_60%)] text-neutral-900',
	},
}

export type TransactionStatus = 'paid' | 'refunded' | 'pending'

export const TRANSACTION_LABELS: Record<TransactionStatus, string> = {
	paid: "To'landi",
	refunded: 'Qaytarildi',
	pending: 'Kutilmoqda',
}

export interface Transaction {
	id: string
	orderId: string
	date: string
	method: string
	amount: number
	items: number
	status: TransactionStatus
}

/** Har bir buyurtmadan bitta tranzaksiya: bekor qilingani — qaytarilgan, naqd va hali yetmagan — kutilmoqda */
export const transactions: Transaction[] = orders
	.map(order => ({
		id: `TX-${order.id.slice(4)}`,
		orderId: order.id,
		date: order.createdAt,
		method: order.payment,
		amount: getOrderTotal(order),
		items: getOrderCount(order),
		status: (order.status === 'cancelled'
			? 'refunded'
			: order.payment === 'Naqd pul' && order.status !== 'delivered'
				? 'pending'
				: 'paid') as TransactionStatus,
	}))
	.sort((a, b) => b.date.localeCompare(a.date))

export const getPaymentStats = () => {
	const paid = transactions.filter(tx => tx.status === 'paid')
	const byMethod = new Map<string, number>()
	for (const tx of paid) byMethod.set(tx.method, (byMethod.get(tx.method) ?? 0) + 1)
	const [favorite] = [...byMethod.entries()].sort((a, b) => b[1] - a[1])

	const total = paid.reduce((sum, tx) => sum + tx.amount, 0)
	return {
		total,
		refunded: transactions.filter(tx => tx.status === 'refunded').reduce((sum, tx) => sum + tx.amount, 0),
		average: paid.length ? Math.round(total / paid.length) : 0,
		favorite: favorite?.[0] ?? '—',
	}
}
