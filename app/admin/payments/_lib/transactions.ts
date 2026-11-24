import { getOrderTotal } from '@/lib/data/orders'
import { adminOrders, type Customer, SAMPLE_NOW } from '../../orders/_lib/sample-orders'

/*
 * To'lovlar (tranzaksiyalar) — namunaviy buyurtmalardan hosil qilinadi. Backend ulanganda
 * Click/Payme/karta provayderlarining webhook'lari yozgan `Payment` hujjatlari keladi.
 * Komissiya stavkalari ham namunaviy.
 */

export type PaymentMethod = 'click' | 'payme' | 'uzcard' | 'humo' | 'cash'
export type TransactionStatus = 'succeeded' | 'pending' | 'refunded' | 'failed'

/**
 * Rang — identifikatsiya uchun (dataviz kategorial palitrasi, 1–5 slotlar, light/dark tekshirilgan).
 * Yorug' rejimda ba'zilari fonga nisbatan past kontrastli — shuning uchun har doim yonida nom yoziladi.
 */
export const METHODS: Record<PaymentMethod, { label: string; fee: number; tone: string; kind: string }> = {
	click: { label: 'Click', fee: 0.01, tone: 'bg-[#2a78d6] dark:bg-[#3987e5]', kind: 'Hamyon' },
	payme: { label: 'Payme', fee: 0.01, tone: 'bg-[#eb6834] dark:bg-[#d95926]', kind: 'Hamyon' },
	uzcard: { label: 'Uzcard', fee: 0.006, tone: 'bg-[#1baf7a] dark:bg-[#199e70]', kind: 'Karta' },
	humo: { label: 'Humo', fee: 0.006, tone: 'bg-[#eda100] dark:bg-[#c98500]', kind: 'Karta' },
	cash: { label: 'Naqd pul', fee: 0, tone: 'bg-[#e87ba4] dark:bg-[#d55181]', kind: 'Kuryerga' },
}
export const METHOD_ORDER: PaymentMethod[] = ['click', 'payme', 'uzcard', 'humo', 'cash']

export const STATUS: Record<TransactionStatus, { label: string; className: string; dot: string }> = {
	succeeded: {
		label: "To'langan",
		className: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
		dot: 'bg-emerald-500',
	},
	pending: {
		label: 'Kutilmoqda',
		className: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400',
		dot: 'bg-amber-500',
	},
	refunded: { label: 'Qaytarilgan', className: 'text-muted-foreground', dot: 'bg-muted-foreground' },
	failed: {
		label: 'Rad etilgan',
		className: 'border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-400',
		dot: 'bg-rose-500',
	},
}
export const STATUS_ORDER: TransactionStatus[] = ['succeeded', 'pending', 'refunded', 'failed']

export interface TransactionEvent {
	at: string
	label: string
	tone: 'neutral' | 'good' | 'bad'
}

export interface Transaction {
	id: string
	orderId: string
	customer: Customer
	method: PaymentMethod
	/** Provayderdagi to'lov ID'si (karta uchun — oxirgi 4 raqam bilan) */
	reference: string
	amount: number
	fee: number
	refunded: number
	status: TransactionStatus
	createdAt: string
	failureReason?: string
	refundReason?: string
	events: TransactionEvent[]
}

const methodFromLabel = (label: string): PaymentMethod =>
	(({ Click: 'click', Payme: 'payme', Uzcard: 'uzcard', Humo: 'humo' }) as Record<string, PaymentMethod>)[label] ?? 'cash'

const pad = (value: number) => String(value).padStart(2, '0')
const iso = (time: number) => {
	const date = new Date(time)
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
const shift = (at: string, minutes: number) => iso(new Date(at).getTime() + minutes * 60_000)

/** Barqaror "tasodifiy" hex — ID'lar har safar bir xil chiqsin */
const hash = (value: string, length = 6) => {
	let h = 2166136261
	for (const char of value) h = Math.imul(h ^ char.charCodeAt(0), 16777619)
	return (h >>> 0).toString(16).toUpperCase().padStart(8, '0').slice(0, length)
}

const FAILURES = ["Kartada mablag' yetarli emas", '3-D Secure tasdiqlanmadi', 'Karta muddati tugagan']

const reference = (method: PaymentMethod, seed: string) =>
	method === 'cash'
		? `COD-${hash(seed, 5)}`
		: method === 'uzcard' || method === 'humo'
			? `•••• ${String(parseInt(hash(seed, 4), 16) % 10000).padStart(4, '0')}`
			: `${method === 'click' ? 'CLK' : 'PME'}-${hash(seed, 8)}`

const feeOf = (method: PaymentMethod, amount: number) => Math.round(amount * METHODS[method].fee)

const build = (): Transaction[] => {
	const list: Transaction[] = []

	adminOrders.forEach((order, index) => {
		const method = methodFromLabel(order.payment)
		const amount = getOrderTotal(order)
		const base = { orderId: order.id, customer: order.customer, method, amount }

		// Har 6-buyurtmadan oldin bitta rad etilgan urinish (faqat kartalarda)
		if (index % 6 === 2 && method !== 'cash') {
			const at = shift(order.createdAt, -3)
			const reason = FAILURES[index % FAILURES.length]
			list.push({
				...base,
				id: `TXN-${hash(`${order.id}-fail`)}`,
				reference: reference(method, `${order.id}-fail`),
				fee: 0,
				refunded: 0,
				status: 'failed',
				createdAt: at,
				failureReason: reason,
				events: [
					{ at, label: "To'lov boshlandi", tone: 'neutral' },
					{ at: shift(at, 1), label: `Rad etildi: ${reason}`, tone: 'bad' },
				],
			})
		}

		// Naqd pul bekor qilingan buyurtmada pul aylanmagan — tranzaksiya yo'q
		if (method === 'cash' && order.status === 'cancelled') return

		const at = method === 'cash' ? order.createdAt : shift(order.createdAt, 1)
		const id = `TXN-${hash(order.id)}`
		const events: TransactionEvent[] = [{ at, label: method === 'cash' ? 'Kuryerga to‘lov kutilmoqda' : "To'lov boshlandi", tone: 'neutral' }]

		if (method === 'cash') {
			if (order.status === 'delivered' && order.events.delivered) {
				events.push({ at: order.events.delivered, label: 'Kuryer naqd pulni qabul qildi', tone: 'good' })
				list.push({ ...base, id, reference: reference(method, id), fee: 0, refunded: 0, status: 'succeeded', createdAt: at, events })
			} else list.push({ ...base, id, reference: reference(method, id), fee: 0, refunded: 0, status: 'pending', createdAt: at, events })
			return
		}

		events.push({ at: shift(at, 1), label: 'Provayder tasdiqladi', tone: 'good' })
		const fee = feeOf(method, amount)

		if (order.status === 'cancelled') {
			const refundAt = shift(at, 240)
			events.push({ at: refundAt, label: 'Mablag‘ mijozga qaytarildi', tone: 'neutral' })
			list.push({
				...base,
				id,
				reference: reference(method, id),
				fee,
				refunded: amount,
				status: 'refunded',
				createdAt: at,
				refundReason: order.cancelReason,
				events,
			})
			return
		}

		list.push({ ...base, id, reference: reference(method, id), fee, refunded: 0, status: 'succeeded', createdAt: at, events })
	})

	return list.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export const sampleTransactions = build()

/** Davr tanlovi — namunaviy ma'lumotlarning "bugun"idan orqaga */
export type RangeKey = '7d' | '14d' | '30d'
export const RANGES: { value: RangeKey; label: string; days: number }[] = [
	{ value: '7d', label: '7 kun', days: 7 },
	{ value: '14d', label: '14 kun', days: 14 },
	{ value: '30d', label: '30 kun', days: 30 },
]

const DAY = 86_400_000
const dayKey = (time: number) => iso(time).slice(0, 10)
export const TODAY = dayKey(SAMPLE_NOW)

/** [start, end) oraliqdagi tranzaksiyalar; `offset` — oldingi davr bilan solishtirish uchun */
export const inRange = (list: Transaction[], days: number, offset = 0) => {
	const end = new Date(`${TODAY}T00:00:00`).getTime() + DAY - offset * days * DAY
	const start = end - days * DAY
	return list.filter(item => {
		const time = new Date(item.createdAt).getTime()
		return time >= start && time < end
	})
}

/** Pul tushgani (to'langan + qisman qaytarilganlar sof qismi) */
export const netOf = (item: Transaction) => (item.status === 'succeeded' || item.status === 'refunded' ? item.amount - item.fee - item.refunded : 0)
export const grossOf = (item: Transaction) => (item.status === 'succeeded' || item.status === 'refunded' ? item.amount : 0)

export const summarize = (list: Transaction[]) => {
	const settled = list.filter(item => item.status === 'succeeded' || item.status === 'refunded')
	const attempts = list.filter(item => item.method !== 'cash' && item.status !== 'pending')
	return {
		gross: settled.reduce((sum, item) => sum + item.amount, 0),
		net: settled.reduce((sum, item) => sum + netOf(item), 0),
		fees: settled.reduce((sum, item) => sum + item.fee, 0),
		refunded: settled.reduce((sum, item) => sum + item.refunded, 0),
		pending: list.filter(item => item.status === 'pending').reduce((sum, item) => sum + item.amount, 0),
		successRate: attempts.length ? attempts.filter(item => item.status !== 'failed').length / attempts.length : 1,
		count: list.length,
	}
}

/** Kunlik sof tushum — grafik uchun (bo'sh kunlar 0 bilan) */
export const dailyNet = (list: Transaction[], days: number) =>
	Array.from({ length: days }, (_, index) => {
		const key = dayKey(new Date(`${TODAY}T12:00:00`).getTime() - (days - 1 - index) * DAY)
		const own = list.filter(item => item.createdAt.startsWith(key))
		return { key, value: own.reduce((sum, item) => sum + netOf(item), 0), count: own.filter(item => netOf(item) > 0).length }
	})

export const downloadTransactionsCsv = (list: Transaction[]) => {
	const escape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`
	const header = ['ID', 'Sana', 'Holat', 'Buyurtma', 'Mijoz', 'Usul', 'Havola', 'Summa', 'Komissiya', 'Qaytarilgan', 'Sof']
	const rows = list.map(item => [
		item.id,
		item.createdAt.replace('T', ' '),
		STATUS[item.status].label,
		item.orderId,
		item.customer.name,
		METHODS[item.method].label,
		item.reference,
		item.amount,
		item.fee,
		item.refunded,
		netOf(item),
	])
	const csv = '﻿' + [header, ...rows].map(row => row.map(escape).join(',')).join('\n')
	const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
	Object.assign(document.createElement('a'), { href: url, download: `ormo-tolovlar-${TODAY}.csv` }).click()
	URL.revokeObjectURL(url)
}
