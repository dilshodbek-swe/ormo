import { catalogProducts } from './catalog'
import type { Product } from './products'

/*
 * Namunaviy buyurtmalar. Backend/API ulanganda shu modul o'rniga
 * foydalanuvchining haqiqiy buyurtmalari keladi — UI faqat `Order` turiga tayanadi.
 */

export type OrderStatus = 'processing' | 'shipped' | 'delivered' | 'cancelled'

/** Yetkazib berish bosqichlari (tartib muhim) */
export const ORDER_STEPS = ['placed', 'packed', 'shipped', 'delivered'] as const
export type OrderStep = (typeof ORDER_STEPS)[number]

export const STEP_LABELS: Record<OrderStep, string> = {
	placed: 'Qabul qilindi',
	packed: "Qadoqlandi",
	shipped: "Yo'lda",
	delivered: 'Yetkazildi',
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
	processing: 'Tayyorlanmoqda',
	shipped: "Yo'lda",
	delivered: 'Yetkazildi',
	cancelled: 'Bekor qilindi',
}

export interface OrderItem {
	product: Product
	quantity: number
	/** Sotib olingan paytdagi narx */
	price: number
}

export interface Order {
	id: string
	createdAt: string
	status: OrderStatus
	items: OrderItem[]
	shipping: number
	payment: string
	address: string
	/** Har bir bosqich qachon bajarilgani */
	events: Partial<Record<OrderStep, string>>
	/** Yo'ldagi buyurtma uchun taxminiy yetib kelish sanasi */
	eta?: string
	cancelReason?: string
}

const productById = new Map(catalogProducts.map(product => [product.id, product]))

const item = (id: string, quantity = 1): OrderItem[] => {
	const product = productById.get(id)
	return product ? [{ product, quantity, price: product.price }] : []
}

export const orders: Order[] = [
	{
		id: 'ORM-24817',
		createdAt: '2026-11-18T10:24:00',
		status: 'shipped',
		items: [...item('dji-mavic-air-2'), ...item('dji-osmo-pocket')],
		shipping: 0,
		payment: 'Click',
		address: "Toshkent, Yunusobod tumani, Amir Temur ko'chasi 108",
		events: {
			placed: '2026-11-18T10:24:00',
			packed: '2026-11-18T16:02:00',
			shipped: '2026-11-19T09:15:00',
		},
		eta: '2026-11-21T18:00:00',
	},
	{
		id: 'ORM-24790',
		createdAt: '2026-11-19T21:47:00',
		status: 'processing',
		items: item('dji-osmo-action', 2),
		shipping: 49_000,
		payment: 'Payme',
		address: "Toshkent, Chilonzor tumani, Bunyodkor shoh ko'chasi 12",
		events: { placed: '2026-11-19T21:47:00' },
		eta: '2026-11-23T18:00:00',
	},
	{
		id: 'ORM-24533',
		createdAt: '2026-10-30T13:10:00',
		status: 'delivered',
		items: [...item('sony-a6400'), ...item('dji-spark')],
		shipping: 0,
		payment: 'Uzcard',
		address: "Toshkent, Yunusobod tumani, Amir Temur ko'chasi 108",
		events: {
			placed: '2026-10-30T13:10:00',
			packed: '2026-10-30T18:40:00',
			shipped: '2026-10-31T08:05:00',
			delivered: '2026-11-01T15:32:00',
		},
	},
	{
		id: 'ORM-24102',
		createdAt: '2026-09-12T09:03:00',
		status: 'delivered',
		items: item('nikon-d500'),
		shipping: 0,
		payment: 'Naqd pul',
		address: "Samarqand, Registon ko'chasi 5",
		events: {
			placed: '2026-09-12T09:03:00',
			packed: '2026-09-12T14:20:00',
			shipped: '2026-09-13T07:45:00',
			delivered: '2026-09-15T12:10:00',
		},
	},
	{
		id: 'ORM-23988',
		createdAt: '2026-08-27T17:55:00',
		status: 'cancelled',
		items: item('dji-mavic-pro'),
		shipping: 49_000,
		payment: 'Click',
		address: "Toshkent, Chilonzor tumani, Bunyodkor shoh ko'chasi 12",
		events: { placed: '2026-08-27T17:55:00' },
		cancelReason: "Mijoz so'rovi bilan bekor qilindi, mablag' qaytarildi",
	},
	{
		id: 'ORM-23710',
		createdAt: '2026-07-03T11:28:00',
		status: 'delivered',
		items: [...item('nikon-f4'), ...item('dji-osmo-pocket')],
		shipping: 0,
		payment: 'Humo',
		address: "Toshkent, Yunusobod tumani, Amir Temur ko'chasi 108",
		events: {
			placed: '2026-07-03T11:28:00',
			packed: '2026-07-03T15:00:00',
			shipped: '2026-07-04T09:30:00',
			delivered: '2026-07-05T13:45:00',
		},
	},
]

export const getOrderSubtotal = (order: Order) =>
	order.items.reduce((sum, line) => sum + line.price * line.quantity, 0)

export const getOrderTotal = (order: Order) => getOrderSubtotal(order) + order.shipping

/** Mahsulotlarning o'z chegirmalari bo'yicha tejalgan summa */
export const getOrderSavings = (order: Order) =>
	order.items.reduce(
		(sum, line) => sum + (line.product.oldPrice - line.price) * line.quantity,
		0
	)

export const getOrderCount = (order: Order) =>
	order.items.reduce((sum, line) => sum + line.quantity, 0)

/** Profil sahifasidagi raqamlar: bekor qilinganlar hisobga olinmaydi */
export const getOrderStats = (list: Order[] = orders) => {
	const completed = list.filter(order => order.status !== 'cancelled')
	return {
		count: list.length,
		active: list.filter(order => order.status === 'processing' || order.status === 'shipped').length,
		spent: completed.reduce((sum, order) => sum + getOrderTotal(order), 0),
		saved: completed.reduce((sum, order) => sum + getOrderSavings(order), 0),
	}
}
